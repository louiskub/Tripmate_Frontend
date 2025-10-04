"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Users, UserPlus, Copy, Trash2 } from "lucide-react"
import DefaultPage from "@/components/layout/default-layout"
import AddExpenseModal from "@/components/group-add-expense"
import EditPaymentModal from "@/components/group-edit-payment"
import Image from "next/image"

// --- Interfaces for data structure ---
interface Group {
  id: string
  code: string
  name: string
  description: string
  imageUrl?: string
  hostName: string
}
interface Member {
  id: string
  name: string
  role: "head" | "member"
  avatar?: string
  paymentInfo?: {
    bank: string
    account: string
    promptPay: string
  }
}
interface Expense {
  id: string
  description: string
  amount: number
  paidBy: string
  splitBetween: string[]
  perPerson: number
}

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  // --- SECTION: Real Data Handling (for future use) ---
  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (groupId) {
      // --- FUTURE-PROOF CODE ---
      /*
      const savedGroups = localStorage.getItem("tripmate-groups")
      if (savedGroups) {
        const allGroups: Group[] = JSON.parse(savedGroups)
        const foundGroup = allGroups.find((g) => g.id === groupId)
        if (foundGroup) {
          setGroup(foundGroup)
        } else {
          router.push("/group")
        }
      }
      */
      // --- CURRENT: For Mock Data ---
      setIsLoading(false)
    }
  }, [groupId, router])
  // --------------------------------------------------------

  // --- SECTION: Mock Data (for current display) ---
  const [mockGroupName] = useState("เที่ยวทั่วไทย ไปกับเพื่อน")
  const [mockGroupCode] = useState("123456")
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Alice", role: "head", avatar: "/avatars/01.png", paymentInfo: { bank: "K-Bank", account: "123-456-7890", promptPay: "081-234-5678" } },
    { id: "2", name: "Bob", role: "member", avatar: "/avatars/02.png" },
    { id: "3", name: "Charlie", role: "member", avatar: "/avatars/03.png" },
  ])
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "exp1",
      description: "ค่าอาหารกลางวัน",
      amount: 1200,
      paidBy: "Alice",
      splitBetween: ["Alice", "Bob", "Charlie"],
      perPerson: 400,
    },
  ])
  // ----------------------------------------------------

  // --- Other States and Handlers ---
  const [activeTab, setActiveTab] = useState<"expense" | "summary" | "payment">("expense")
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  // CHANGE 2: เพิ่มฟังก์ชันที่ขาดไป (แบบจำลอง)
  const handleRemoveMember = (memberId: string) => {
    console.log("Removing member:", memberId)
    // ในแอปจริง: ควรมี popup ยืนยันก่อนลบ
    setMembers((prev) => prev.filter((member) => member.id !== memberId))
  }
  
  const handleDeleteExpense = (expenseId: string) => {
    console.log("Deleting expense:", expenseId);
    setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
  }
  
  const calculateSummary = () => {
    // นี่คือ Logic จำลองแบบง่ายๆ
    // ในแอปจริงควรคำนวณว่าใครต้องจ่ายใครเท่าไหร่
    const payer = members.find(m => m.id === '2');
    const payee = members.find(m => m.id === '1');
    if (payer && payee) {
        return [{ from: payer, to: payee, amount: 400 }];
    }
    return [];
  }


  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)
  const handleAddExpense = (expense: Omit<Expense, "id">) => { /* ... */ }
  const handleEditPayment = (memberId: string) => { /* ... */ }
  const handleSavePayment = (paymentInfo: { bank: string; account: string; promptPay: string }) => { /* ... */ }

  if (isLoading) {
    return (
      <DefaultPage>
        <main className="flex-1 px-6 py-6 text-center">Loading...</main>
      </DefaultPage>
    )
  }

  return (
    <DefaultPage>
      <main className="flex-1 px-6 py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* CHANGE 1: แก้ไขการเรียกใช้ตัวแปรให้ถูกต้อง */}
              <h1 className="text-2xl font-bold text-gray-900">{group?.name || mockGroupName}</h1>
              <span className="text-gray-500 text-lg">#{group?.code || mockGroupCode}</span>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5" />
                <span>{members.length}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <UserPlus className="w-5 h-5" />
            </button>
          </div>

          {/* ... โค้ดส่วนที่เหลือเหมือนเดิมทั้งหมด ... */}
          {/* Members List */}
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                    {member.avatar ? (
                      <Image src={member.avatar || "/placeholder.svg"} alt={member.name} width={40} height={40} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.role === "head" && <span className="text-sm text-gray-500">(You)</span>}
                  {member.role === "member" && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Group Contacts */}
          <div className="mt-6">
            <p className="text-gray-700 font-medium mb-3">group contacts</p>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Split The Bills Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-6">Split The Bills</h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("expense")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "expense" ? "bg-blue-200 text-blue-900" : "bg-gray-100 text-gray-600"
              }`}
            >
              💵 Expense
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "summary" ? "bg-blue-200 text-blue-900" : "bg-gray-100 text-gray-600"
              }`}
            >
              📋 Summary
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "payment" ? "bg-blue-200 text-blue-900" : "bg-gray-100 text-gray-600"
              }`}
            >
              💳 Payment
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === "expense" && (
              <>
                {expenses.map((expense) => (
                  <div key={expense.id} className="bg-blue-100 rounded-xl p-4 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{expense.description}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Paid by : <span className="font-medium">{expense.paidBy}</span> • Split{" "}
                          {expense.splitBetween.length} people ($
                          {expense.perPerson.toFixed(2)}/person)
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold">${expense.amount.toFixed(2)}</span>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="w-full py-3 bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-xl font-medium transition-colors"
                >
                  + Add Expense
                </button>
              </>
            )}

            {activeTab === "summary" && (
              <>
                {calculateSummary().map((transaction, index) => (
                  <div key={index} className="bg-blue-100 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                      </div>
                      <span className="font-medium">{transaction.from.name}</span>
                      <span className="text-2xl">→</span>
                      <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                      </div>
                      <span className="font-medium">{transaction.to.name}</span>
                    </div>
                    <span className="text-xl font-bold">${transaction.amount.toFixed(2)}</span>
                  </div>
                ))}
              </>
            )}

            {activeTab === "payment" && (
              <>
                {members
                  .filter((m) => m.paymentInfo)
                  .map((member) => (
                    <div key={member.id} className="bg-blue-100 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                          </div>
                          <div>
                            <p className="font-bold text-lg mb-2">{member.name}</p>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <span>🏦 Bank: {member.paymentInfo?.bank}</span>
                                <span>Account: {member.paymentInfo?.account}</span>
                                <button
                                  onClick={() => copyToClipboard(member.paymentInfo?.account || "")}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>📱 PromptPay: {member.paymentInfo?.promptPay}</span>
                                <button
                                  onClick={() => copyToClipboard(member.paymentInfo?.promptPay || "")}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEditPayment(member.id)}
                          className="bg-blue-200 hover:bg-blue-300 text-blue-900 px-6 py-2 rounded-lg font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      </main>

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSubmit={handleAddExpense}
        members={members}
      />

      <EditPaymentModal
        isOpen={isEditPaymentOpen}
        onClose={() => setIsEditPaymentOpen(false)}
        onSubmit={handleSavePayment}
        initialData={selectedMember?.paymentInfo}
      />
    </DefaultPage>
  )
}