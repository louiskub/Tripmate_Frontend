"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import Image from "next/image"
import Toast from "@/components/ui/toast"

// --- Interfaces (เหมือนเดิม) ---
interface Contacts { discord?: string; line?: string; messenger?: string }
interface PaymentInfo { bank: string; account: string; promptPay: string }
interface Member { id: string; name: string; role: "head" | "member"; avatar?: string; paymentInfo?: PaymentInfo }
interface Expense { id: string; description: string; amount: number; paidBy: string; splitBetween: string[]; avatar?: string }
interface Transaction { from: Member; to: Member; amount: number; status: 'unpaid' | 'pending' | 'paid'; slipUrl?: string }
interface StoredGroup { id: string; code: string; name: string; description: string; imageUrl?: string; hostName: string; members: Member[]; expenses: Expense[]; contacts?: Contacts; tripId?: string; }

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  // --- States ---
  const [group, setGroup] = useState<StoredGroup | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"expense" | "summary" | "payment">("summary") // Set default to summary for easy checking
  const [summary, setSummary] = useState<Transaction[]>([])
  
  // Modals States
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false)
  const [isUploadSlipOpen, setIsUploadSlipOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isEditContactsOpen, setIsEditContactsOpen] = useState(false)

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage(`${type} copied to clipboard!`);
    setShowToast(true);
  };
  
  // --- All Logic Functions (ไม่มีการเปลี่ยนแปลง) ---
  useEffect(() => {
    if (groupId) {
      const savedGroups = localStorage.getItem("tripmate-groups");
      if (savedGroups) {
        const allGroups: StoredGroup[] = JSON.parse(savedGroups);
        const foundGroup = allGroups.find((g) => g.id === groupId);
        if (foundGroup) {
          foundGroup.expenses = foundGroup.expenses?.map(exp => {
              const payer = foundGroup.members.find(m => m.name === exp.paidBy);
              return { ...exp, avatar: payer?.avatar };
          }) || [];
          foundGroup.contacts = foundGroup.contacts || {};
          setGroup(foundGroup);
        } else { router.push("/group"); }
      }
      setIsLoading(false);
    }
  }, [groupId, router]);

  const updateGroupInStorage = (updatedGroup: StoredGroup | null) => {
    if (!updatedGroup) return;
    const allGroups: StoredGroup[] = JSON.parse(localStorage.getItem("tripmate-groups") || "[]");
    const groupIndex = allGroups.findIndex(g => g.id === updatedGroup.id);
    if (groupIndex !== -1) {
      allGroups[groupIndex] = updatedGroup;
      localStorage.setItem("tripmate-groups", JSON.stringify(allGroups));
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (!group) return;
    const memberToRemove = group.members.find(m => m.id === memberId);
    if (memberToRemove?.role === 'head') {
      alert("You cannot remove the group host."); return;
    }
    const updatedMembers = group.members.filter(m => m.id !== memberId);
    const updatedGroup = { ...group, members: updatedMembers };
    setGroup(updatedGroup);
    updateGroupInStorage(updatedGroup);
  };

  const handleSaveContacts = (contacts: Contacts) => {
    if (!group) return;
    const updatedGroup = { ...group, contacts };
    setGroup(updatedGroup);
    updateGroupInStorage(updatedGroup);
    setIsEditContactsOpen(false);
  };

  const handleAddExpense = (expenseData: Omit<Expense, "id" | "perPerson" | "avatar">) => {
    if (!group) return;
    const payer = group.members.find(m => m.name === expenseData.paidBy);
    const newExpense: Expense = { 
        id: `exp_${Date.now()}`, 
        ...expenseData,
        avatar: payer?.avatar
    };
    const updatedGroup = { ...group, expenses: [...group.expenses, newExpense] };
    setGroup(updatedGroup);
    updateGroupInStorage(updatedGroup);
    setIsAddExpenseOpen(false);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (!group) return;
    const updatedExpenses = group.expenses.filter(exp => exp.id !== expenseId);
    const updatedGroup = { ...group, expenses: updatedExpenses };
    setGroup(updatedGroup);
    updateGroupInStorage(updatedGroup);
  };

  const handleEditPayment = (memberId: string) => {
    const memberToEdit = group?.members.find(m => m.id === memberId);
    if (memberToEdit) {
      setSelectedMember(memberToEdit);
      setIsEditPaymentOpen(true);
    }
  };

  const handleSavePayment = (paymentInfo: PaymentInfo) => {
    if (!group || !selectedMember) return;
    const updatedMembers = group.members.map(m =>
      m.id === selectedMember.id ? { ...m, paymentInfo } : m
    );
    const updatedGroup = { ...group, members: updatedMembers };
    setGroup(updatedGroup);
    updateGroupInStorage(updatedGroup);
    setIsEditPaymentOpen(false);
  };

  const handleMarkAsPaid = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsUploadSlipOpen(true);
  };

  const handleUploadSlip = (slipFile: File) => {
    if (!selectedTransaction) return;
    const slipUrl = URL.createObjectURL(slipFile);
    const updatedSummary = summary.map(t => 
        t.from.id === selectedTransaction.from.id && t.to.id === selectedTransaction.to.id
        ? { ...t, status: 'pending' as 'pending', slipUrl } 
        : t
    );
    setSummary(updatedSummary);
  };

  useEffect(() => {
    if (!group || group.expenses.length === 0) {
      setSummary([]); return;
    }
    const balances: { [memberId: string]: number } = {};
    group.members.forEach(m => { balances[m.id] = 0 });
    group.expenses.forEach(expense => {
      const payer = group.members.find(m => m.name === expense.paidBy);
      if (!payer) return;
      const share = expense.amount / expense.splitBetween.length;
      balances[payer.id] += expense.amount;
      expense.splitBetween.forEach(memberId => { balances[memberId] -= share });
    });
    const debtors = Object.entries(balances).filter(([, amount]) => amount < 0).map(([id, amount]) => ({ id, amount: -amount }));
    const creditors = Object.entries(balances).filter(([, amount]) => amount > 0).map(([id, amount]) => ({ id, amount }));
    const transactions: Transaction[] = [];
    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      const amount = Math.min(debtor.amount, creditor.amount);
      const fromMember = group.members.find(m => m.id === debtor.id)!;
      const toMember = group.members.find(m => m.id === creditor.id)!;
      transactions.push({ from: fromMember, to: toMember, amount, status: 'unpaid' });
      debtor.amount -= amount;
      creditor.amount -= amount;
      if (debtor.amount < 0.01) debtors.shift();
      if (creditor.amount < 0.01) creditors.shift();
    }
    setSummary(transactions)
  }, [group]);

  if (isLoading) return <DefaultPage><main className="flex-1 p-6 text-center">Loading...</main></DefaultPage>
  if (!group) return <DefaultPage><main className="flex-1 p-6 text-center">Group not found.</main></DefaultPage>

  return (
    <DefaultPage>
      <main className="flex-1 px-4 sm:px-6 py-6 bg-gray-50">
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
          <div className="space-y-3">
            {group.members.map(member => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative flex-shrink-0">
                    <Image src={member.avatar || "/placeholder.svg"} alt={member.name} layout="fill" className="object-cover" />
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
          <div className="mt-5 pt-5 border-t border-gray-100">
             <p className="text-lg font-semibold text-black uppercase mb-2">Group Contacts</p>
             <div className="flex items-center gap-3">
                {group.contacts?.discord && (
                    <a href={group.contacts.discord} target="_blank" rel="noopener noreferrer" 
                       className="w-10 h-10 block relative rounded-full overflow-hidden transition-transform duration-200 hover:scale-110">
                        <Image src="/images/discord.png" alt="Discord" layout="fill" className="object-cover" />
                    </a>
                )}
                {group.contacts?.messenger && (
                    <a href={group.contacts.messenger} target="_blank" rel="noopener noreferrer" 
                       className="w-10 h-10 block relative rounded-full overflow-hidden transition-transform duration-200 hover:scale-110">
                        <Image src="/images/messenger.png" alt="Messenger" layout="fill" className="object-cover" />
                    </a>
                )}
                {group.contacts?.line && (
                    <a href={group.contacts.line} target="_blank" rel="noopener noreferrer" 
                       className="w-10 h-10 block relative rounded-full overflow-hidden transition-transform duration-200 hover:scale-110">
                        <Image src="/images/line.png" alt="Line" layout="fill" className="object-cover" />
                    </a>
                )}
                <button onClick={() => setIsEditContactsOpen(true)} className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-transform duration-200 hover:scale-110 flex-shrink-0">
                    <Edit className="w-5 h-5 text-gray-600"/>
                </button>
             </div>
          </div>
        </div>

        {/* --- Split The Bills Section --- */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-center mb-4 text-black">Split The Bills</h2>
          {/* --- ✅ [ปรับปรุง] Tab Buttons --- */}
          <div className="flex items-center p-1 mb-6 bg-blue-100/60 rounded-xl">
              <button 
                onClick={() => setActiveTab('expense')} 
                className={`w-1/3 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg transition-colors ${
                  activeTab === 'expense' ? 'bg-blue-500 text-white shadow' : 'text-blue-900/60 hover:bg-blue-200/70'
                }`}
              >
                <DollarSign className="w-5 h-5"/>
                <span>Expense</span>
              </button>
              <button 
                onClick={() => setActiveTab('summary')} 
                className={`w-1/3 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg transition-colors ${
                  activeTab === 'summary' ? 'bg-blue-500 text-white shadow' : 'text-blue-900/60 hover:bg-blue-200/70'
                }`}
              >
                <ClipboardList className="w-5 h-5"/>
                <span>Summary</span>
              </button>
              <button 
                onClick={() => setActiveTab('payment')} 
                className={`w-1/3 py-2 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg transition-colors ${
                  activeTab === 'payment' ? 'bg-blue-500 text-white shadow' : 'text-blue-900/60 hover:bg-blue-200/70'
                }`}
              >
                <CreditCard className="w-5 h-5"/>
                <span>Payment</span>
              </button>
          </div>
          
          <div className="space-y-3">
            {activeTab === 'expense' && (
              <>
                {group.expenses.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-400">No expenses added yet.</p>
                  </div>
                ) : (
                  group.expenses.map(expense => {
                    const splitMemberNames = group.members
                      .filter(member => expense.splitBetween.includes(member.id))
                      .map(member => member.name)
                      .join(', ');

                    return (
                      <div key={expense.id} className="bg-blue-100 rounded-xl p-4 flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-2xl text-black">{expense.description}</h3>
                          
                          <div className="text-base font-semibold text-black mt-2 flex items-center gap-2">
                            <span>Paid by:</span>
                            <div className="w-8 h-8 relative rounded-full overflow-hidden">
                              <Image src={expense.avatar || '/placeholder.svg'} layout="fill" className='object-cover' alt={expense.paidBy} />
                            </div>
                            <span>{expense.paidBy}</span>
                          </div>
                          <div className="text-base text-black mt-1">
                            <span className="font-semibold">Split with:</span> {splitMemberNames} 
                            <span className=""> (฿{(expense.amount / expense.splitBetween.length).toFixed(2)}/person)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl text-black">
                            <span className="font-normal text-black mr-1">฿</span>
                            <span className="font-bold">{expense.amount.toFixed(2)}</span>
                          </span>
                          <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-400 hover:text-red-500 p-2">
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
                <button onClick={() => setIsAddExpenseOpen(true)} className="w-full mt-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-base transition-colors">
                  + Add Expense
                </button>
              </>
            )}

            {activeTab === 'summary' && (
              <>
                {summary.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-400">No summary to show.</p>
                  </div>
                ) : (
                  summary.map((t, index) => (
                    <div key={index} className="bg-blue-100 rounded-xl p-4 flex items-center justify-between">
                      {/* Section 1: Transaction Info */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-13 h-13 rounded-full overflow-hidden relative flex-shrink-0">
                            <Image src={t.from.avatar || "/placeholder.svg"} alt={t.from.name} layout="fill" className="object-cover" />
                          </div>
                          <p className="text-xl font-semibold text-black">{t.from.name}</p>
                        </div>
                        
                        <span className="text-black text-2xl">→</span>

                        <div className="flex items-center gap-2">
                          <div className="w-13 h-13 rounded-full overflow-hidden relative flex-shrink-0">
                            <Image src={t.to.avatar || "/placeholder.svg"} alt={t.to.name} layout="fill" className="object-cover" />
                          </div>
                          <p className="text-xl font-semibold text-black">{t.to.name}</p>
                        </div>
                      </div>
                      
                      {/* Section 2: Amount & Status/Button */}
                      <div className="flex items-center gap-6">
                        <span className="text-2xl text-black">
                          <span className="font-normal text-black mr-1">฿</span>
                          <span className="font-bold">{t.amount.toFixed(2)}</span>
                        </span>
                        
                        <div className="w-36 text-right">
                          {t.status === 'unpaid' && ( 
                            <button 
                              onClick={() => handleMarkAsPaid(t)} 
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-xs transition-transform transform hover:scale-105"
                            >
                              Mark as Paid
                            </button> 
                          )}
                          {t.status === 'pending' && ( 
                            <div className="flex items-center justify-end gap-2 text-yellow-600 font-semibold text-sm">
                              <Clock className="w-4 h-4" />
                              <span>Pending</span>
                            </div> 
                          )}
                          {t.status === 'paid' && ( 
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

            {activeTab === 'payment' && (
              <>
                {group.members.map(member => (
                  <div key={member.id} className="bg-blue-100 rounded-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden relative flex-shrink-0">
                        <Image src={member.avatar || "/placeholder.svg"} alt={member.name} layout="fill" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-xl text-black">{member.name}</p>
                        
                        {member.paymentInfo && (member.paymentInfo.bank || member.paymentInfo.promptPay) ? (
                          <div className="text-base space-y-2 mt-2 text-gray-700">
                            {/* Bank & Account */}
                            {member.paymentInfo.bank && (
                              <div className="flex items-start gap-2">
                                <Landmark className="w-4 h-4 text-gray-700 flex-shrink-0 mt-1" />
                                <div className="flex gap-10">
                                  <div className="flex items-center gap-2">
                                    <strong className="flex-shrink-0">Bank:</strong>
                                    <span>{member.paymentInfo.bank}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-base text-gray-700">
                                    <strong className="flex-shrink-0">Account:</strong>
                                    <span>{member.paymentInfo.account}</span>
                                    <button onClick={() => copyToClipboard(member.paymentInfo.account, 'Account No.')} className="text-gray-400 hover:text-gray-700">
                                      <Copy className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* PromptPay */}
                            {member.paymentInfo.promptPay && (
                              <div className="flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-gray-700 flex-shrink-0" />
                                <strong className="flex-shrink-0">PromptPay:</strong>
                                <span className="truncate">{member.paymentInfo.promptPay}</span>
                                <button onClick={() => copyToClipboard(member.paymentInfo.promptPay, 'PromptPay')} className="ml-1 text-gray-400 hover:text-gray-700">
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
                        className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-4 py-2 rounded-lg text-sm transition-colors transform hover:scale-105"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>

      {/* --- Modals --- */}
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} type="success" />
      <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} groupCode={group.code} />
      <EditContactsModal isOpen={isEditContactsOpen} onClose={() => setIsEditContactsOpen(false)} onSubmit={handleSaveContacts} initialData={group.contacts} />
      <AddExpenseModal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} onSubmit={handleAddExpense as any} members={group.members}/>
      <EditPaymentModal isOpen={isEditPaymentOpen} onClose={() => setIsEditPaymentOpen(false)} onSubmit={handleSavePayment} initialData={selectedMember?.paymentInfo}/>
      {selectedTransaction && (<UploadSlipModal isOpen={isUploadSlipOpen} onClose={() => setIsUploadSlipOpen(false)} onSubmit={handleUploadSlip} transactionInfo={{from: selectedTransaction.from.name, to: selectedTransaction.to.name, amount: selectedTransaction.amount,}}/>)}
    </DefaultPage>
  )
}