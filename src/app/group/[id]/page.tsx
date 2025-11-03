"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import {
  Users, UserPlus, Trash2, CheckCircle, Clock, DollarSign,
  ClipboardList, CreditCard, Edit, Copy
} from "lucide-react"

import DefaultPage from "@/components/layout/default-layout"
import AddExpenseModal from "@/components/group/group-add-expense"
import EditPaymentModal from "@/components/group/group-edit-payment"
import UploadSlipModal from "@/components/group/group-uploadslip"
import InviteModal from "@/components/group/group-invite"
import EditContactsModal from "@/components/group/group-editcontact"
import Toast from "@/components/ui/toast"
import { endpoints } from "@/config/endpoints.config"

const genPlaceholder = (name?: string) => {
  const initials = (name || "U").charAt(0).toUpperCase()
  const colors = ["3B82F6", "8B5CF6", "F59E0B", "10B981", "EF4444", "EC4899"]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  return `https://placehold.co/128x128/${randomColor}/FFFFFF?text=${initials}`
}

const getUserFromToken = () => {
  try {
    const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
    if (!token) return null
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub // userId
  } catch (err) {
    console.error("[getUserFromToken] Failed to decode:", err)
    return null
  }
}

interface Contacts { discord?: string; line?: string; messenger?: string }
interface PaymentInfo { bank: string; account: string; promptPay: string }
interface Member { id: string; name: string; role: "head" | "member"; avatar?: string; paymentInfo?: PaymentInfo }
interface Expense { id: string; description: string; amount: number; paidBy: string; splitBetween: string[]; avatar?: string }
interface Transaction { from: Member; to: Member; amount: number; status: 'unpaid' | 'pending' | 'paid'; slipUrl?: string }
interface StoredGroup {
  id: string
  code: string
  name: string
  description: string
  imageUrl?: string
  hostName: string
  members: Member[]
  expenses: Expense[]
  contacts?: Contacts
  tripId?: string
}

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    const id = getUserFromToken()
    setCurrentUserId(id)
  }, [])

  const [group, setGroup] = useState<StoredGroup | null>(null)
  const [summary, setSummary] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"expense" | "summary" | "payment">("summary")

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isEditContactsOpen, setIsEditContactsOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false)
  const [isUploadSlipOpen, setIsUploadSlipOpen] = useState(false)

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const token = typeof document !== "undefined" ? document.cookie.split("token=")[1] : ""

  // --- Fetch data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("[FetchGroupDetails] Fetching data for group:", groupId)
        const headers = { Authorization: `Bearer ${token}` }

        const [groupRes, expenseRes, summaryRes, paymentRes] = await Promise.all([
          axios.get(`http://161.246.5.236:8800/group/${groupId}/details`, { headers }),
          axios.get(`http://161.246.5.236:8800/group/${groupId}/expense-groups`, { headers }),
          axios.get(`http://161.246.5.236:8800/group/${groupId}/expense-summary`, { headers }), // ✅ fixed summary
          axios.get(`http://161.246.5.236:8800/group/${groupId}/payments`, { headers }),
        ])

        const g = groupRes.data
        const payments = paymentRes.data
        console.log("[FetchGroupDetails] Raw group:", g)

        if (groupRes && g && currentUserId) {
          const ownerCheck = g.ownerId === currentUserId
          const memberCheck = g.members?.some((m: any) => m.userId === currentUserId)
          setIsOwner(ownerCheck)
          setIsMember(memberCheck)
          console.log("[UserRoleCheck]", { ownerCheck, memberCheck })
        }

        const mappedMembers: Member[] = (g.members || []).map((m: any, i: number) => {
          const payment = payments.find((p: any) => p.userId === m.userId)
          const name = m.user?.username || `User ${i + 1}`
          const avatar = m.user?.profileImg || genPlaceholder(name)

          console.group(`[PaymentMap] Member: ${name}`)
          console.log("UserID:", m.userId)
          console.log("Matched Payment:", payment)
          console.groupEnd()

          return {
            id: m.userId,
            name,
            role: m.status === "owner" ? "head" : "member",
            avatar,
            paymentInfo: payment
              ? {
                  bank: payment.bank || "",
                  account: payment.accountNo || "",
                  promptPay: payment.promtpayId || "",
                }
              : { bank: "", account: "", promptPay: "" },
          }
        })

        const mappedGroup: StoredGroup = {
          id: g.id,
          code: g.id,
          name: g.groupName,
          description: g.description || "No description",
          imageUrl: g.groupImg,
          hostName: g.ownerId,
          members: mappedMembers,
          expenses: [],
          contacts: {},
          tripId: g.tripPlansId || null,
        }

        // 🧾 Fetch Expenses
        console.group("[ExpenseFetch]")
        console.log("Fetching all expenses for groupId:", groupId)
        const expenseFetchRes = await axios.get(`http://161.246.5.236:8800/group/${groupId}/expense-groups`, { headers })
        console.log("Raw expense data from API:", expenseFetchRes.data)

        const mappedExpenses: Expense[] = (expenseFetchRes.data || []).map((e: any, i: number) => {
          console.log(`Processing expense #${i + 1}:`, e)
          return {
            id: e.id,
            description: e.note || "Untitled expense",
            amount: parseFloat(e.amount),
            paidBy: mappedMembers.find(m => m.id === e.userId)?.name || "Unknown",
            splitBetween: (e.spliters || []).map((s: any) => s.userId),
            avatar: mappedMembers.find(m => m.id === e.userId)?.avatar,
          }
        })

        console.table(mappedExpenses.map(e => ({
          id: e.id,
          desc: e.description,
          amount: e.amount,
          paidBy: e.paidBy,
          spliters: e.splitBetween.length
        })))
        console.groupEnd()

        // ✅ Map summary
        const mappedTransactions: Transaction[] = (summaryRes.data.transactions || []).map((t: any) => ({
          from: {
            id: t.from.id,
            name: t.from.username,
            avatar: t.from.profileImg || genPlaceholder(t.from.username),
            role: "member",
          },
          to: {
            id: t.to.id,
            name: t.to.username,
            avatar: t.to.profileImg || genPlaceholder(t.to.username),
            role: "member",
          },
          amount: parseFloat(t.amount),
          status: "unpaid",
        }))

        mappedGroup.expenses = mappedExpenses
        setGroup(mappedGroup)
        setSummary(mappedTransactions)
        console.group("[SummaryFetch]")
        console.log("Summary fetched successfully. Total transactions:", mappedTransactions.length)
        console.table(mappedTransactions.map((t, i) => ({
          "#": i + 1,
          from: t.from.name,
          to: t.to.name,
          amount: t.amount,
          status: t.status
        })))
        console.groupEnd()

        console.log("[FetchGroupDetails]  Final mapped group:", mappedGroup)
      } catch (err) {
        console.error("[FetchGroupDetails] Error fetching data:", err)
        router.push("/group")
      } finally {
        setIsLoading(false)
      }
    }

    if (groupId) fetchData()
  }, [groupId])

  // ✅ เพิ่มไว้หลัง useEffect
  const handleMarkAsPaid = (index: number) => {
    setSummary(prev =>
      prev.map((t, i) =>
        i === index ? { ...t, status: "paid" } : t
      )
    )
    console.log(`[Summary] Transaction #${index + 1} marked as paid ✅`)
    setToastMessage("Payment marked as Paid!")
    setShowToast(true)
  }

  // --- Add Expense ---
  const handleAddExpense = async (expenseData: { description: string; amount: number; paidBy: string; splitBetween: string[] }) => {
    try {
      if (!group) return
      const headers = { Authorization: `Bearer ${token}` }

      const payload = {
        groupId: group.id,
        userId: group.members.find(m => m.name === expenseData.paidBy)?.id,
        amount: expenseData.amount,
        note: expenseData.description,
        spliters: expenseData.splitBetween.map(id => ({ userId: id, status: "PENDING" })),
      }

      console.group("[AddExpense]")
      console.log("📤 Sending new expense payload to API:", payload)

      const response = await axios.post(`http://161.246.5.236:8800/group/expense-group/create`, payload, { headers })
      console.log("✅ Expense created successfully:", response.data)

      console.log("🔁 Refetching all expenses for group:", group.id)
      const res = await axios.get(`http://161.246.5.236:8800/group/${group.id}/expense-groups`, { headers })
      console.log("📥 Updated expense list:", res.data)

      const newExpenses = res.data.map((e: any) => ({
        id: e.id,
        description: e.note,
        amount: parseFloat(e.amount),
        paidBy: group.members.find(m => m.id === e.userId)?.name || "Unknown",
        splitBetween: e.spliters.map((s: any) => s.userId),
        avatar: group.members.find(m => m.id === e.userId)?.avatar,
      }))

      console.table(newExpenses.map(e => ({
        id: e.id,
        amount: e.amount,
        paidBy: e.paidBy,
        spliters: e.splitBetween.length
      })))

      setGroup(prev => prev ? { ...prev, expenses: newExpenses } : prev)
      setToastMessage("Expense added successfully!")
      setShowToast(true)
      console.groupEnd()
      console.log("[AddExpense] 🔁 Re-fetch done. Current summary state:")
      console.table(summary.map((t, i) => ({
        "#": i + 1,
        from: t.from.name,
        to: t.to.name,
        amount: t.amount,
        status: t.status
      })))
    } catch (err: any) {
      console.error("[AddExpense] ❌ Error:", err.response?.data || err)
      setToastMessage("Failed to add expense")
      setShowToast(true)
      console.groupEnd()
    }
  }


  // --- Delete Expense ---
  const handleDeleteExpense = async (expenseId: string) => {
    try {
      if (!group) return
      const confirmDelete = window.confirm("Are you sure you want to delete this expense?")
      if (!confirmDelete) return

      console.group("[DeleteExpense]")
      console.log("🗑 Attempting to delete expenseId:", expenseId)

      const headers = { Authorization: `Bearer ${token}` }
      await axios.delete(`http://161.246.5.236:8800/group/${group.id}/expense-groups/${expenseId}`, { headers })
      console.log("✅ Expense deleted successfully")

      setGroup(prev =>
        prev ? { ...prev, expenses: prev.expenses.filter(e => e.id !== expenseId) } : prev
      )

      console.log("📉 Updated local expense list (after deletion):")
      console.table(group.expenses.filter(e => e.id !== expenseId).map(e => ({
        id: e.id,
        desc: e.description,
        amount: e.amount
      })))

      setToastMessage("Expense deleted successfully!")
      setShowToast(true)
      console.groupEnd()
    } catch (err: any) {
      console.error("[DeleteExpense] ❌ Error:", err.response?.data || err)
      setToastMessage("Failed to delete expense")
      setShowToast(true)
      console.groupEnd()
    }
  }


  // --- Remove Member ---
  const handleRemoveMember = async (memberId: string) => {
    try {
      console.log("[RemoveMember] Attempting to remove member:", memberId)
      const confirmRemove = window.confirm("Are you sure you want to remove this member?")
      if (!confirmRemove) return

      const headers = { Authorization: `Bearer ${token}` }
      await axios.delete(`http://161.246.5.236:8800/group/${groupId}/leave/${memberId}`, { headers })

      setGroup(prev =>
        prev ? { ...prev, members: prev.members.filter(m => m.id !== memberId) } : prev
      )

      console.log("[RemoveMember] Member removed successfully.")
      setToastMessage("Member removed successfully!")
      setShowToast(true)
    } catch (err: any) {
      console.error("[RemoveMember] Error removing member:", err.response?.data || err)
      setToastMessage("Failed to remove member.")
      setShowToast(true)
    }
  }

  // --- Delete Group ---
  const handleDeleteGroup = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this group?")
      if (!confirmDelete) return

      const headers = { Authorization: `Bearer ${token}` }
      console.log("[DeleteGroup] Deleting group:", groupId)
      await axios.delete(`http://161.246.5.236:8800/group/${groupId}`, { headers })

      setToastMessage("Group deleted successfully!")
      setShowToast(true)
      router.push("/group")
    } catch (err: any) {
      console.error("[DeleteGroup] Error:", err.response?.data || err)
      setToastMessage("Failed to delete group.")
      setShowToast(true)
    }
  }

  // --- Leave Group (for members) ---
  const handleLeaveGroup = async () => {
    try {
      if (!currentUserId) return
      const confirmLeave = window.confirm("Are you sure you want to leave this group?")
      if (!confirmLeave) return

      const headers = { Authorization: `Bearer ${token}` }
      console.log("[LeaveGroup] Leaving group:", groupId, "userId:", currentUserId)
      await axios.delete(`http://161.246.5.236:8800/group/${groupId}/leave/${currentUserId}`, { headers })

      setToastMessage("You have left the group.")
      setShowToast(true)
      router.push("/group")
    } catch (err: any) {
      console.error("[LeaveGroup] Error:", err.response?.data || err)
      setToastMessage("Failed to leave group.")
      setShowToast(true)
    }
  }

  const handleUpdatePayment = async (paymentData: PaymentInfo, memberId: string) => {
    try {
      console.group("[UpdatePayment]")
      console.log("🟡 Input Payment Data:", paymentData)
      console.log("🔍 Member ID:", memberId)

      const headers = { Authorization: `Bearer ${token}` }

      // ดึง paymentId ของ user นี้จาก group
      const paymentsRes = await axios.get(`http://161.246.5.236:8800/group/${groupId}/payments`, { headers })
      const paymentRecord = paymentsRes.data.find((p: any) => p.userId === memberId)

      if (!paymentRecord) {
        console.error("❌ Payment record not found for userId:", memberId)
        setToastMessage("Payment record not found.")
        setShowToast(true)
        console.groupEnd()
        return
      }

      const paymentId = paymentRecord.id
      console.log("✅ Found Payment ID:", paymentId)

      // PATCH ไปยัง backend
      const payload = {
        bank: paymentData.bank,
        accountNo: paymentData.account,
        promtpayId: paymentData.promptPay,
      }
      console.log("📤 Sending PATCH request:", payload)

      const response = await axios.patch(
        `http://161.246.5.236:8800/group/${paymentId}/payments`,
        payload,
        { headers }
      )

      console.log("✅ Payment updated:", response.data)

      // อัปเดตข้อมูลใน state
      setGroup((prev) =>
        prev
          ? {
              ...prev,
              members: prev.members.map((m) =>
                m.id === memberId
                  ? { ...m, paymentInfo: { ...paymentData } }
                  : m
              ),
            }
          : prev
      )

      setToastMessage("Payment info updated successfully!")
      setShowToast(true)
      console.groupEnd()
    } catch (err: any) {
      console.error("[UpdatePayment] ❌ Error:", err.response?.data || err)
      setToastMessage("Failed to update payment info.")
      setShowToast(true)
      console.groupEnd()
    }
  }
  if (isLoading)
    return (
      <DefaultPage>
        <main className="flex-1 p-6 text-center text-gray-500 text-lg">Loading group data...</main>
      </DefaultPage>
    )

  if (!group)
    return (
      <DefaultPage>
        <main className="flex-1 p-6 text-center text-gray-500 text-lg">Group not found.</main>
      </DefaultPage>
    )

  return (
    <DefaultPage>
      <main className="flex-1 px-4 sm:px-6 py-6 bg-gray-50">

        {/* --- Header --- */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-baseline gap-4">
              <h1 className="text-3xl font-bold text-black">{group.name}</h1>
              <div className="flex items-center gap-3 text-gray-600 font-semibold">
                <span>#{group.code}</span>
                <div className="flex items-center gap-1 text-black">
                  <Users className="w-5 h-5" />
                  <span>{group.members.length}</span>
                </div>
                <button
                  onClick={() => setIsInviteOpen(true)}
                  className="p-1 text-black hover:scale-110 transition-transform"
                  title="Invite members"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              {isOwner ? (
                <>
                  {group.tripId ? (
                    <button
                      onClick={() => router.push(`/trip/${group.tripId}`)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-base transition"
                    >
                      View Trip
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/trip/create?groupId=${groupId}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-base transition"
                    >
                      Create Trip
                    </button>
                  )}
                  <button
                    onClick={handleDeleteGroup}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-base transition"
                  >
                    Delete Group
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLeaveGroup}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-base transition"
                >
                  Leave Group
                </button>
              )}
            </div>
          </div>

          {/* --- Members List --- */}
          <div className="space-y-3">
            {group.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="object-cover w-full h-full"
                      onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder.svg")}
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-black">{member.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                  </div>
                </div>
                <div className="w-24 text-right">
                  {member.role === "head" ? (
                    <span className="text-gray-600 font-semibold">(Owner)</span>
                  ) : isOwner ? ( // ✅ แสดงเฉพาะถ้าเป็นเจ้าของกลุ่ม
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded-lg text-sm"
                    >
                      Remove
                    </button>
                  ) : (
                    // ถ้าไม่ใช่เจ้าของ (member ทั่วไป) จะไม่เห็นปุ่ม
                    null
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Split Bills Section --- */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-center mb-4 text-black">Split The Bills</h2>

          {/* --- Tabs --- */}
          <div className="flex items-center p-1 mb-6 bg-blue-100/60 rounded-xl">
            {["expense", "summary", "payment"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`w-1/3 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg transition-colors ${
                  activeTab === tab
                    ? "bg-blue-500 text-white shadow"
                    : "text-blue-900/60 hover:bg-blue-200/70"
                }`}
              >
                {tab === "expense" && <DollarSign className="w-5 h-5" />}
                {tab === "summary" && <ClipboardList className="w-5 h-5" />}
                {tab === "payment" && <CreditCard className="w-5 h-5" />}
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </div>

          {/* --- Expense Tab --- */}
          {activeTab === "expense" && (
            <>
              {group.expenses.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No expenses added yet.</div>
              ) : (
                group.expenses.map((expense) => {
                  const splitMemberNames = group.members
                    .filter((m) => expense.splitBetween.includes(m.id))
                    .map((m) => m.name)
                    .join(", ")

                  return (
                    <div
                      key={expense.id}
                      className="bg-blue-100 rounded-xl p-4 flex justify-between items-start mb-3"
                    >
                      <div>
                        <h3 className="font-bold text-xl text-black">{expense.description}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-black">Paid by:</span>
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img
                              src={expense.avatar || "/placeholder.svg"}
                              alt={expense.paidBy}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <span>{expense.paidBy}</span>
                        </div>
                        <p className="text-black mt-1">
                          <span className="font-semibold">Split with:</span> {splitMemberNames} (
                          ฿{(expense.amount / expense.splitBetween.length).toFixed(2)}/person)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl text-black font-bold">
                          ฿{expense.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="w-full mt-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-base transition-colors"
              >
                + Add Expense
              </button>
            </>
          )}

          {/* --- Summary Tab --- */}
          {activeTab === "summary" && (
            <>
              {summary.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No summary available.</div>
              ) : (
                summary.map((t, i) => (
                  <div
                    key={i}
                    className="bg-blue-100 rounded-xl p-4 flex items-center justify-between mb-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={t.from.avatar || "/placeholder.svg"}
                          alt={t.from.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-lg font-semibold text-black">{t.from.name}</p>
                      <span className="text-black text-xl">→</span>
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={t.to.avatar || "/placeholder.svg"}
                          alt={t.to.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-lg font-semibold text-black">{t.to.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-black">
                        ฿{t.amount.toFixed(2)}
                      </span>
                      {t.status === "unpaid" && (
                        <button
                          onClick={() => handleMarkAsPaid(i)} // ✅ เรียกฟังก์ชันจริง
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                        >
                          Mark as Paid
                        </button>
                      )}

                      {t.status === "paid" && (
                        <span className="text-green-600 font-semibold flex items-center gap-1 transition-all duration-300">
                          <CheckCircle className="w-4 h-4" /> Paid
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* --- Payment Tab --- */}
          {activeTab === "payment" && (
            <>
              {group.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-blue-100 rounded-xl p-4 flex justify-between items-center mb-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      <img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-black">{member.name}</p>
                      {member.paymentInfo && (member.paymentInfo.bank || member.paymentInfo.promptPay) ? (
                        <div className="text-gray-700 text-sm mt-1">
                          {member.paymentInfo.bank && (
                            <p>
                              <strong>Bank:</strong> {member.paymentInfo.bank} |{" "}
                              <strong>Account:</strong> {member.paymentInfo.account}{" "}
                              <button
                                onClick={() => navigator.clipboard.writeText(member.paymentInfo.account)}
                                className="text-gray-400 hover:text-gray-700 ml-1"
                              >
                                <Copy className="w-4 h-4 inline" />
                              </button>
                            </p>
                          )}
                          {member.paymentInfo.promptPay && (
                            <p>
                              <strong>PromptPay:</strong> {member.paymentInfo.promptPay}{" "}
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(member.paymentInfo.promptPay)
                                }
                                className="text-gray-400 hover:text-gray-700 ml-1"
                              >
                                <Copy className="w-4 h-4 inline" />
                              </button>
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm mt-1">No payment info added.</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMember(member)
                      setIsEditPaymentOpen(true)
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-2 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      {/* --- Toast & Modals --- */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} groupCode={group.code} />
      <EditContactsModal
        isOpen={isEditContactsOpen}
        onClose={() => setIsEditContactsOpen(false)}
        onSubmit={() => {}}
        initialData={group.contacts}
      />
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSubmit={handleAddExpense}
        members={group.members}
      />
      <EditPaymentModal
        isOpen={isEditPaymentOpen}
        onClose={() => setIsEditPaymentOpen(false)}
        onSubmit={(data) => {
          if (selectedMember) handleUpdatePayment(data, selectedMember.id)
          setIsEditPaymentOpen(false)
        }}
        initialData={selectedMember?.paymentInfo}
      />
      {selectedTransaction && (
        <UploadSlipModal
          isOpen={isUploadSlipOpen}
          onClose={() => setIsUploadSlipOpen(false)}
          onSubmit={() => {}}
          transactionInfo={{
            from: selectedTransaction.from.name,
            to: selectedTransaction.to.name,
            amount: selectedTransaction.amount,
          }}
        />
      )}
    </DefaultPage>
  )
}
