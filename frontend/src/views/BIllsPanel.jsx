import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, CircleDollarSign, Search, Trash2, UserPlus, WalletCards, X, Check } from "lucide-react";
import StatusBadge from "../components/StatusBadge.jsx";
import { Empty, FormSection, IconButton, Input, Panel } from "../components/ui.jsx";

export function BillsPanel({ user, bills, residents, onCreate, onPay, onDelete, loading }) {
  const firstResident = residents.find((item) => item.role === "resident");
  const [form, setForm] = useState({ resident: firstResident?._id || "", flatNumber: firstResident?.flatNumber || "", month: "", unitsUsed: "", ratePerUnit: "8", dueDate: "" });

  // States for the inline searchable dropdown
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // States for the Bills list search and deletion
  const [searchTerm, setSearchTerm] = useState("");
  const [billToDelete, setBillToDelete] = useState(null);

  // Initialize the search query display text if a resident is selected
  useEffect(() => {
    const selected = residents.find(r => r._id === form.resident);
    if (selected) {
      setSearchQuery(`${selected.flatNumber} — ${selected.name}`);
    } else {
      setSearchQuery("");
    }
  }, [form.resident, residents]);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        // If they clicked away without selecting, revert the text to the currently selected resident
        const selected = residents.find(r => r._id === form.resident);
        if (selected) {
          setSearchQuery(`${selected.flatNumber} — ${selected.name}`);
        } else {
          setSearchQuery("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [form.resident, residents]);

  async function submit(event) {
    event.preventDefault();
    if (!form.resident) {
      alert("Please search and select a resident from the dropdown first.");
      return;
    }
    const ok = await onCreate("bill", { ...form, unitsUsed: Number(form.unitsUsed), ratePerUnit: Number(form.ratePerUnit) });
    if (ok !== false) setForm((current) => ({ ...current, month: "", unitsUsed: "", dueDate: "" }));
  }

  // Filter residents for the inline dropdown
  const filteredDropdownResidents = residents.filter(r => 
    r.role === "resident" && 
    (r.flatNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || r.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter bills dynamically based on the global search term
  const filteredBills = bills.filter((bill) => {
    const term = searchTerm.toLowerCase();
    return (
      bill.flatNumber?.toLowerCase().includes(term) ||
      bill.month?.toLowerCase().includes(term) ||
      bill.status?.toLowerCase().includes(term)
    );
  });

  return (
    <Panel title="Electricity Bills" subtitle="Monthly utility billing" loading={loading} action={user.role === "admin" && <IconButton icon={CircleDollarSign} label="Generate" type="submit" form="bill-form" variant="secondary" />}>
      {user.role === "admin" && (
        <form id="bill-form" className="mb-8 border-b border-slate-100 pb-8" onSubmit={submit}>
          <FormSection>
            <div className="grid gap-3 sm:grid-cols-2">
              
              {/* Custom Searchable Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div className="group relative flex h-10 items-center overflow-hidden rounded-lg border border-slate-200 bg-white transition-all focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/20 hover:border-slate-300">
                  <div className="pl-3 text-slate-400 transition-colors group-focus-within:text-brand-500">
                    <Search size={16} />
                  </div>
                  <input 
                    required 
                    type="text"
                    placeholder="Search flat (e.g. A-101)..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                      // Clear actual form selection if they start typing a new query
                      if (form.resident) setForm({ ...form, resident: "", flatNumber: "" });
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="h-full w-full bg-transparent px-2.5 text-sm text-ink outline-none placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setForm({ ...form, resident: "", flatNumber: "" });
                      }}
                      className="mr-1.5 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-elevated animate-fade-in">
                    {filteredDropdownResidents.length === 0 ? (
                      <div className="px-3 py-6 text-center text-sm text-slate-500">
                        <UserPlus size={24} className="mx-auto mb-2 opacity-20" />
                        No residents found
                      </div>
                    ) : (
                      filteredDropdownResidents.map(r => {
                        const isSelected = form.resident === r._id;
                        return (
                          <button
                            key={r._id}
                            type="button"
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
                              isSelected ? "bg-brand-50 text-brand-900" : "text-slate-700 hover:bg-slate-50"
                            }`}
                            onClick={() => {
                              setForm({ ...form, resident: r._id, flatNumber: r.flatNumber });
                              setSearchQuery(`${r.flatNumber} — ${r.name}`);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                                isSelected ? "bg-brand-200 text-brand-800" : "bg-slate-100 text-slate-500"
                              }`}>
                                {r.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <div>
                                <span className="font-semibold">{r.flatNumber}</span>
                                <span className={`ml-1 text-xs ${isSelected ? "text-brand-600/80" : "text-slate-400"}`}>— {r.name}</span>
                              </div>
                            </div>
                            {isSelected && <Check size={16} className="text-brand-600" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              <Input required placeholder="Month (e.g. May 2026)" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
              <Input required type="number" placeholder="Units consumed" value={form.unitsUsed} onChange={(e) => setForm({ ...form, unitsUsed: e.target.value })} />
              <Input required type="number" placeholder="Rate per unit (Rs.)" value={form.ratePerUnit} onChange={(e) => setForm({ ...form, ratePerUnit: e.target.value })} />
              <Input required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </FormSection>
        </form>
      )}

      <div className="space-y-2">
        {filteredBills.length === 0 ? (
          <Empty text={searchTerm ? "No bills match your search." : "No bills found."} icon={WalletCards} />
        ) : (
          filteredBills.map((bill) => (
            <div key={bill._id} className="flex flex-col gap-3 rounded-lg border border-slate-100 px-4 py-3.5 transition hover:border-slate-200 hover:shadow-card sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{bill.flatNumber} — {bill.month}</p>
                <p className="mt-0.5 text-xs text-slate-500">{bill.unitsUsed} units × Rs. {bill.ratePerUnit}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-semibold tabular-nums text-ink">Rs. {bill.amount?.toLocaleString?.() ?? bill.amount}</p>
                  <div className="mt-1"><StatusBadge>{bill.status}</StatusBadge></div>
                </div>
                <div className="flex items-center gap-2">
                  {bill.status !== "Paid" && (user.role === "admin" || bill.resident === user._id || bill.resident?._id === user._id) && (
                    <button
                      type="button"
                      className="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-800"
                      onClick={() => onPay(bill._id)}
                    >
                      Pay now
                    </button>
                  )}
                  {user.role === "admin" && (
                    <button
                      type="button"
                      onClick={() => setBillToDelete(bill)}
                      className="shrink-0 rounded p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-accent-coral"
                      title="Delete Bill"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom Confirmation Modal for Deletion */}
      {billToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-elevated">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-accent-coral">
              <AlertTriangle size={24} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-ink">Delete Bill</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Are you sure you want to permanently delete the bill for <strong>{billToDelete.flatNumber} ({billToDelete.month})</strong>? This action cannot be undone.
            </p>
            <div className="mt-8 flex gap-3 sm:justify-end">
              <button
                onClick={() => setBillToDelete(null)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(billToDelete._id);
                  setBillToDelete(null);
                }}
                className="flex-1 rounded-lg bg-accent-coral px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 sm:flex-none"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}