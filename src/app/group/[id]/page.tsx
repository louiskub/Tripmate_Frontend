"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import {
  Users, UserPlus, Trash2, CheckCircle, Clock, DollarSign,
  ClipboardList, CreditCard, Edit, Copy, Landmark, Smartphone
} from "lucide-react"

import DefaultPage from "@/components/layout/default-layout"
import AddExpenseModal from "@/components/group/group-add-expense"
import EditPaymentModal from "@/components/group/group-edit-payment"
import UploadSlipModal from "@/components/group/group-uploadslip"
import InviteModal from "@/components/group/group-invite"
import EditContactsModal from "@/components/group/group-editcontact"
import Toast from "@/components/ui/toast"
import { endpoints } from "@/config/endpoints.config"

// --- Interfaces ---
interface Contacts { discord?: string; line?: string; messenger?: string }
interface PaymentInfo { bank: string; account: string; promptPay: string }
interface Member {
  id: string
  name: string
  role: "head" | "member"
  avatar?: string
  paymentInfo?: PaymentInfo
}
interface Expense {
  id: string
  description: string
  amount: number
  paidBy: string
  splitBetween: string[]
  avatar?: string
}
interface Transaction {
  from: Member
  to: Member
  amount: number
  status: 'unpaid' | 'pending' | 'paid'
  slipUrl?: string
}
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

// 🧠 Helper สร้าง placeholder สีสุ่มพร้อมชื่อย่อ
const genPlaceholder = (name?: string) => {
  const bg = Math.floor(Math.random() * 16777215).toString(16)
  const initials = (name || "U").slice(0, 2).toUpperCase()
  return `https://placehold.co/128x128/${bg}/FFFFFF?text=${initials}`
}

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  const [group, setGroup] = useState<StoredGroup | null>(null)
  const [summary, setSummary] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // modal states
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false)
  const [isUploadSlipOpen, setIsUploadSlipOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isEditContactsOpen, setIsEditContactsOpen] = useState(false)

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"expense" | "summary" | "payment">("summary")

  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const token = typeof document !== "undefined" ? document.cookie.split("token=")[1] : ""

  // 🧠 ดึงข้อมูลทั้งหมดจาก backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("[GroupDetail] Fetching all data for group:", groupId)

        const headers = { Authorization: `Bearer ${token}` }

        const [groupRes, expenseRes, summaryRes, paymentRes] = await Promise.all([
          axios.get(`${endpoints.group.all}/${groupId}`, { headers }),
          axios.get(endpoints.group.expense(groupId), { headers }),
          axios.get(endpoints.group.summary(groupId), { headers }),
          axios.get(endpoints.group.payment(groupId), { headers }),
        ])

        const g = groupRes.data
        const expenses = expenseRes.data
        const summaryData = summaryRes.data
        const payments = paymentRes.data

        console.log("[GroupDetail] group:", g)
        console.log("[GroupDetail] expenses:", expenses)
        console.log("[GroupDetail] summary:", summaryData)
        console.log("[GroupDetail] payments:", payments)

        // 🧩 Map กลุ่มหลัก
        const mappedMembers: Member[] = (g.members || []).map((m: any, i: number) => {
          // หาคนใน payment ที่ตรง userId กัน
          const payment = payments.find((p: any) => p.userId === m.userId)

          // ✅ รวม avatar จากหลายแหล่ง: group.user > payment.user > placeholder
          const avatar =
            m.user?.profileImg ||
            payment?.user?.profileImg ||
            genPlaceholder(m.user?.username)

          return {
            id: m.userId,
            name: m.user?.username || payment?.user?.username || `User ${i + 1}`,
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
          hostName: g.ownerId || "Unknown",
          members: mappedMembers,
          expenses: [],
          contacts: {},
          tripId: null,
        }

        // 🧾 Map expenses
        const mappedExpenses: Expense[] = (expenses || []).map((e: any) => ({
          id: e.id,
          description: e.note || "Untitled expense",
          amount: parseFloat(e.amount),
          paidBy: mappedMembers.find(m => m.id === e.userId)?.name || "Unknown",
          splitBetween: (e.spliters || []).map((s: any) => s.userId),
          avatar: mappedMembers.find(m => m.id === e.userId)?.avatar,
        }))

        // 💰 Map summary (transactions)
        const mappedTransactions: Transaction[] = (summaryData.transactions || []).map((t: any) => ({
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

        console.table(mappedMembers.map(m => ({ name: m.name, avatar: m.avatar })))
      } catch (err) {
        console.error("[GroupDetail] Error fetching group data:", err)
        router.push("/group")
      } finally {
        setIsLoading(false)
      }
    }

    if (groupId) fetchData()
  }, [groupId])

    // --- เพิ่ม/จัดการรายจ่าย ---
  const handleAddExpense = async (expenseData: { description: string; amount: number; paidBy: string; splitBetween: string[] }) => {
    try {
      if (!group) return
      const token = document.cookie.split("token=")[1]

      const payload = {
        note: expenseData.description,
        amount: expenseData.amount,
        userId: group.members.find(m => m.name === expenseData.paidBy)?.id, // คนจ่าย
        spliters: expenseData.splitBetween.map(id => ({ userId: id })),
      }

      console.log("[AddExpense] Sending payload:", payload)

      const res = await axios.post(endpoints.group.expense(group.id), payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("[AddExpense] Expense created:", res.data)

      const expenseRes = await axios.get(endpoints.group.expense(group.id), {
        headers: { Authorization: `Bearer ${token}` },
      })

      const mappedExpenses = expenseRes.data.map((e: any) => ({
        id: e.id,
        description: e.note || "Untitled expense",
        amount: parseFloat(e.amount),
        paidBy: group.members.find(m => m.id === e.userId)?.name || "Unknown",
        splitBetween: (e.spliters || []).map((s: any) => s.userId),
        avatar: group.members.find(m => m.id === e.userId)?.avatar,
      }))

      setGroup(prev => prev ? { ...prev, expenses: mappedExpenses } : prev)
      setIsAddExpenseOpen(false)
      setToastMessage("Expense added successfully!")
      setShowToast(true)
    } catch (err) {
      console.error("[AddExpense] Error creating expense:", err)
      setToastMessage("Failed to add expense")
      setShowToast(true)
    }
  }

  // --- แก้ข้อมูลบัญชี/พร้อมเพย์ ---
  const handleSavePayment = async (paymentInfo: PaymentInfo) => {
    try {
      if (!group || !selectedMember) return
      const token = document.cookie.split("token=")[1]

      const payload = {
        bank: paymentInfo.bank,
        accountNo: paymentInfo.account,
        promtpayId: paymentInfo.promptPay,
      }

      console.log("[SavePayment] Sending payload:", payload)

      const res = await axios.put(`${endpoints.group.payment(group.id)}/${selectedMember.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log("[SavePayment] Response:", res.data)

      const updatedMembers = group.members.map(m =>
        m.id === selectedMember.id ? { ...m, paymentInfo } : m
      )

      setGroup({ ...group, members: updatedMembers })
      setIsEditPaymentOpen(false)
      setToastMessage("Payment info updated successfully!")
      setShowToast(true)
    } catch (err) {
      console.error("[SavePayment] Error updating payment info:", err)
      setToastMessage("Failed to update payment info")
      setShowToast(true)
    }
  }

  // --- ฟังก์ชันอื่น ---
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setToastMessage(`${type} copied to clipboard!`)
    setShowToast(true)
  }

  const handleSaveContacts = (contacts: Contacts) => {
    if (!group) return
    const updatedGroup = { ...group, contacts }
    setGroup(updatedGroup)
    setIsEditContactsOpen(false)
  }

  // mock
  const handleRemoveMember = (id: string) => {
    setGroup(prev =>
      prev ? { ...prev, members: prev.members.filter(m => m.id !== id) } : prev
    )
  }

  const handleEditPayment = (id: string) => {
    const member = group?.members.find(m => m.id === id)
    if (member) {
      setSelectedMember(member)
      setIsEditPaymentOpen(true)
    }
  }

  const handleUploadSlip = (data: any) => {
    console.log("[UploadSlip] Data received:", data)
    setShowToast(true)
    setToastMessage("Slip uploaded successfully!")
    setIsUploadSlipOpen(false)
  }

  const handleMarkAsPaid = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsUploadSlipOpen(true)
  }

  if (isLoading) return <DefaultPage><main className="flex-1 p-6 text-center">Loading...</main></DefaultPage>
  if (!group) return <DefaultPage><main className="flex-1 p-6 text-center">Group not found.</main></DefaultPage>

  // 🎨 --- UI หลัก ---
  return (
    <DefaultPage>
      <main className="flex-1 px-4 sm:px-6 py-6 bg-gray-50">
        {/* --- Header Section --- */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-4">
              <h1 className="text-3xl font-bold text-black flex-shrink-0">{group.name}</h1>
              <div className="flex items-center gap-4 text-lg text-gray-500 font-semibold">
                <span>#{group.code}</span>
                <div className="flex items-center gap-1.5 text-lg text-black font-semibold">
                  <Users className="w-5 h-5" />
                  <span>{group.members.length}</span>
                </div>
                <button onClick={() => setIsInviteOpen(true)} className="p-1 text-black hover:scale-110">
                  <UserPlus className="w-5 h-5" />
                </button>
              </div>
            </div>
            {group.tripId ? (
              <button
                onClick={() => router.push(`/trip/${group.tripId}`)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold text-base transition-all hover:scale-105"
                title="View Trip"
              >
                <span>View Trip</span>
              </button>
            ) : (
              <button
                onClick={() => router.push(`/trip/create?groupId=${groupId}`)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-base transition-all hover:scale-105"
                title="Create Trip"
              >
                <span>Create Trip</span>
              </button>
            )}
          </div>

          {/* --- Members Section --- */}
          <div className="space-y-3">
            {group.members.map(member => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = genPlaceholder(member.name)
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-black">{member.name}</p>
                    <p className="text-base text-gray-500 capitalize">{member.role}</p>
                  </div>
                </div>
                <div className="w-24 text-right">
                  {member.role === 'head' ? (
                    <span className="text-xl text-gray-700 font-semibold">(You)</span>
                  ) : (
                    <button 
                      onClick={() => handleRemoveMember(member.id)} 
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-xl text-base"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* --- Group Contacts --- */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-lg font-semibold text-black uppercase mb-2">Group Contacts</p>
            <div className="flex items-center gap-3">
              {group.contacts?.discord && (
                <a href={group.contacts.discord} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 block relative rounded-full overflow-hidden hover:scale-110">
                    <img src="/images/discord.png" alt="Discord" className="object-cover w-full h-full" />
                </a>
              )}
              {group.contacts?.messenger && (
                <a href={group.contacts.messenger} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 block relative rounded-full overflow-hidden hover:scale-110">
                    <img src="/images/messenger.png" alt="Messenger" className="object-cover w-full h-full" />
                </a>
              )}
              {group.contacts?.line && (
                <a href={group.contacts.line} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 block relative rounded-full overflow-hidden hover:scale-110">
                    <img src="/images/line.png" alt="Line" className="object-cover w-full h-full" />
                </a>
              )}
              <button onClick={() => setIsEditContactsOpen(true)} className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center hover:scale-110">
                <Edit className="w-5 h-5 text-gray-600"/>
              </button>
            </div>
          </div>
        </div>


                {/* --- Split The Bills Section --- */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-center mb-4 text-black">Split The Bills</h2>

          {/* --- Tab Buttons --- */}
          <div className="flex items-center p-1 mb-6 bg-blue-100/60 rounded-xl">
            {["expense", "summary", "payment"].map((tab) => {
              const tabLabels = {
                expense: { icon: <DollarSign className="w-5 h-5" />, label: "Expense" },
                summary: { icon: <ClipboardList className="w-5 h-5" />, label: "Summary" },
                payment: { icon: <CreditCard className="w-5 h-5" />, label: "Payment" },
              }
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`w-1/3 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg transition-colors ${
                    activeTab === tab
                      ? "bg-blue-500 text-white shadow"
                      : "text-blue-900/60 hover:bg-blue-200/70"
                  }`}
                >
                  {tabLabels[tab as keyof typeof tabLabels].icon}
                  <span>{tabLabels[tab as keyof typeof tabLabels].label}</span>
                </button>
              )
            })}
          </div>

          {/* --- Expense Tab --- */}
          {activeTab === "expense" && (
            <>
              {group.expenses.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-400">No expenses added yet.</p>
                </div>
              ) : (
                group.expenses.map((expense) => {
                  const splitMemberNames = group.members
                    .filter((m) => expense.splitBetween.includes(m.id))
                    .map((m) => m.name)
                    .join(", ")

                  return (
                    <div key={expense.id} className="bg-blue-100 rounded-xl p-4 mb-3 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl text-black">{expense.description}</h3>

                        <div className="text-base font-semibold text-black mt-2 flex items-center gap-2">
                          <span>Paid by:</span>
                          <div className="w-8 h-8 relative rounded-full overflow-hidden">
                            <img
                              src={expense.avatar || genPlaceholder(expense.paidBy)}
                              alt={expense.paidBy}
                              className="object-cover w-full h-full"
                              onError={(e) => ((e.target as HTMLImageElement).src = genPlaceholder(expense.paidBy))}
                            />
                          </div>
                          <span>{expense.paidBy}</span>
                        </div>

                        <div className="text-base text-black mt-1">
                          <span className="font-semibold">Split with:</span> {splitMemberNames}{" "}
                          <span className="">(฿{(expense.amount / expense.splitBetween.length).toFixed(2)}/person)</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-2xl text-black">
                          <span className="font-normal text-black mr-1">฿</span>
                          <span className="font-bold">{expense.amount.toFixed(2)}</span>
                        </span>
                        <button onClick={() => console.log("TODO: delete", expense.id)} className="text-red-400 hover:text-red-500 p-2">
                          <Trash2 className="w-6 h-6" />
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
                <div className="text-center py-10">
                  <p className="text-gray-400">No summary to show.</p>
                </div>
              ) : (
                summary.map((t, index) => (
                  <div key={index} className="bg-blue-100 rounded-xl p-4 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* From user */}
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full overflow-hidden relative">
                          <img
                            src={t.from.avatar || genPlaceholder(t.from.name)}
                            alt={t.from.name}
                            className="object-cover w-full h-full"
                            onError={(e) => ((e.target as HTMLImageElement).src = genPlaceholder(t.from.name))}
                          />
                        </div>
                        <p className="text-xl font-semibold text-black">{t.from.name}</p>
                      </div>

                      <span className="text-black text-2xl">→</span>

                      {/* To user */}
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full overflow-hidden relative">
                          <img
                            src={t.to.avatar || genPlaceholder(t.to.name)}
                            alt={t.to.name}
                            className="object-cover w-full h-full"
                            onError={(e) => ((e.target as HTMLImageElement).src = genPlaceholder(t.to.name))}
                          />
                        </div>
                        <p className="text-xl font-semibold text-black">{t.to.name}</p>
                      </div>
                    </div>

                    {/* Amount + status */}
                    <div className="flex items-center gap-1">
                      <span className="text-2xl text-black">
                        <span className="font-normal text-black mr-1">฿</span>
                        <span className="font-bold">{t.amount.toFixed(2)}</span>
                      </span>

                      <div className="w-36 text-right">
                        {t.status === "unpaid" && (
                          <button
                            onClick={() => handleMarkAsPaid(t)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-xs hover:scale-105"
                          >
                            Mark as Paid
                          </button>
                        )}
                        {t.status === "pending" && (
                          <div className="flex items-center justify-end gap-2 text-yellow-600 font-semibold text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Pending</span>
                          </div>
                        )}
                        {t.status === "paid" && (
                          <div className="flex items-center justify-end gap-2 text-green-600 font-semibold text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Paid</span>
                          </div>
                        )}
                      </div>
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
                <div key={member.id} className="bg-blue-100 rounded-xl p-4 mb-3 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="object-cover w-full h-full"
                        onError={(e) => ((e.target as HTMLImageElement).src = genPlaceholder(member.name))}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-black">{member.name}</p>

                      {member.paymentInfo && (member.paymentInfo.bank || member.paymentInfo.promptPay) ? (
                        <div className="text-base space-y-2 mt-2 text-gray-700">
                          {member.paymentInfo.bank && (
                            <div className="flex items-start gap-2">
                              <Landmark className="w-4 h-4 text-gray-700 flex-shrink-0 mt-1" />
                              <div className="flex gap-10">
                                <div className="flex items-center gap-2">
                                  <strong>Bank:</strong>
                                  <span>{member.paymentInfo.bank}</span>
                                </div>
                                <div className="flex items-center gap-2 text-base text-gray-700">
                                  <strong>Account:</strong>
                                  <span>{member.paymentInfo.account}</span>
                                  <button
                                    onClick={() => copyToClipboard(member.paymentInfo.account, "Account No.")}
                                    className="text-gray-400 hover:text-gray-700"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {member.paymentInfo.promptPay && (
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-gray-700 flex-shrink-0" />
                              <strong>PromptPay:</strong>
                              <span>{member.paymentInfo.promptPay}</span>
                              <button
                                onClick={() => copyToClipboard(member.paymentInfo.promptPay, "PromptPay")}
                                className="ml-1 text-gray-400 hover:text-gray-700"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 mt-1">No payment info added.</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleEditPayment(member.id)}
                    className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-4 py-2 rounded-lg text-sm hover:scale-105"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      {/* --- Modals --- */}
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} type="success" />
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} groupCode={group.code} />
      <EditContactsModal
        isOpen={isEditContactsOpen}
        onClose={() => setIsEditContactsOpen(false)}
        onSubmit={handleSaveContacts}
        initialData={group.contacts}
      />
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSubmit={handleAddExpense as any}
        members={group.members}
      />
      <EditPaymentModal
        isOpen={isEditPaymentOpen}
        onClose={() => setIsEditPaymentOpen(false)}
        onSubmit={handleSavePayment}
        initialData={selectedMember?.paymentInfo}
      />
      {selectedTransaction && (
        <UploadSlipModal
          isOpen={isUploadSlipOpen}
          onClose={() => setIsUploadSlipOpen(false)}
          onSubmit={handleUploadSlip}
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
