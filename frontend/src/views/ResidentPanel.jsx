import React, { useState, useEffect } from "react";
import { AlertTriangle, Search, Trash2, UserCheck, X, UserPlus, Loader2 } from "lucide-react";
import { Empty, Panel, FormSection, Field, Input, IconButton } from "../components/ui.jsx";
import { api } from "../services/api.js";

export function ResidentPanel({ user, residents, onRemove,patchResource, loading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [toast, setToast] = useState(null);
  
  // State for Admin Resident Creation
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newResident, setNewResident] = useState({
    name: "", email: "", password: "", flatNumber: "", phone: "", emergencyContact: ""
  });
  
  // State for our custom confirmation modal
  const [residentToDelete, setResidentToDelete] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      setFilteredResidents(residents.filter(r => r.flatNumber?.toLowerCase().includes(searchTerm.trim().toLowerCase())));
    } else {
      setFilteredResidents(residents);
    }
  }, [residents, searchTerm]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateNewResident = (field) => (event) => {
    setNewResident((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleCreateResident = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await api.signup(newResident);
      showToast(`${newResident.name} added successfully!`, "success");
      
      
      if (onRefresh) {
        await onRefresh(); 
      }
      
      
      setNewResident({ name: "", email: "", password: "", flatNumber: "", phone: "", emergencyContact: "" });
      setShowSignupForm(false);
    } catch (err) {
      showToast(err.message || "Failed to create resident.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setFilteredResidents(residents);
      return;
    }

    const results = residents.filter((resident) =>
      resident.flatNumber?.toLowerCase().includes(term)
    );

    setFilteredResidents(results);

    if (results.length > 0) {
      showToast(`Found ${results.length} resident(s) in flat ${searchTerm.toUpperCase()}`, "success");
    } else {
      showToast(`No resident found for flat ${searchTerm.toUpperCase()}`, "error");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredResidents(residents);
    setToast(null);
  };

  const confirmRemoval = async () => {
    if (residentToDelete) {
      await onRemove(residentToDelete._id);
      showToast(`${residentToDelete.name} has been removed successfully.`, "success");
      setResidentToDelete(null); // Close the modal
    }
  };

  return (
    <Panel 
      title="Resident Directory" 
      subtitle="All registered society members" 
      loading={loading}
      action={
        user?.role === "admin" && (
          <IconButton 
            icon={UserPlus} 
            label={showSignupForm ? "Close Form" : "Create Resident"} 
            variant="secondary"
            onClick={() => setShowSignupForm(!showSignupForm)} 
          />
        )
      }
    >
      
      {/* Refined Toaster Notification */}
      {toast && (
        <div className={`mb-6 flex items-center justify-between rounded-xl border px-4 py-3 shadow-sm ${
          toast.type === "success" ? "border-brand-200 bg-brand-50 text-brand-800" : "border-red-200 bg-red-50 text-red-800"
        }`}>
          <div className="flex items-center gap-2.5">
            {toast.type === "success" ? <UserCheck size={18} /> : <AlertTriangle size={18} />}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="opacity-60 transition hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Admin Create Resident Form (The "Signup" Page) */}
      {user?.role === "admin" && showSignupForm && (
        <form className="mb-8 animate-fade-in border-b border-slate-100 pb-8" onSubmit={handleCreateResident}>
          <FormSection title="Register New Resident">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <Input required value={newResident.name} onChange={updateNewResident("name")} placeholder="Resident's full name" />
              </Field>
              <Field label="Flat number">
                <Input required value={newResident.flatNumber} onChange={updateNewResident("flatNumber")} placeholder="e.g. A-1204" />
              </Field>
              <Field label="Phone">
                <Input required value={newResident.phone} onChange={updateNewResident("phone")} placeholder="10-digit number" />
              </Field>
              <Field label="Emergency contact">
                <Input value={newResident.emergencyContact} onChange={updateNewResident("emergencyContact")} placeholder="Optional" />
              </Field>
              <Field label="Email Address">
                <Input required type="email" value={newResident.email} onChange={updateNewResident("email")} placeholder="Email for login" />
              </Field>
              <Field label="Temporary Password">
                <Input required type="password" value={newResident.password} onChange={updateNewResident("password")} placeholder="••••••••" />
              </Field>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                disabled={isCreating}
                className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
              >
                {isCreating ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
                {isCreating ? "Registering..." : "Register Resident"}
              </button>
            </div>
          </FormSection>
        </form>
      )}

      {/* Custom Confirmation Modal */}
      {residentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md animate-fade-in rounded-2xl border border-slate-200 bg-white p-6 shadow-elevated">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-accent-coral">
              <AlertTriangle size={24} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-ink">Remove Resident</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Are you sure you want to permanently remove <strong>{residentToDelete.name}</strong> from Flat <strong>{residentToDelete.flatNumber}</strong>? This action cannot be undone.
            </p>
            <div className="mt-8 flex gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setResidentToDelete(null)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemoval}
                className="flex-1 rounded-lg bg-accent-coral px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 sm:flex-none"
              >
                Yes, remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Integrated Search Bar */}
      <form 
        onSubmit={handleSearch} 
        className="mb-8 flex w-full max-w-lg items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10"
      >
        <div className="flex pl-4 text-slate-400"><Search size={18} /></div>
        <input
          type="text"
          placeholder="Search by flat number (e.g. A-101)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent px-3 py-3.5 text-sm text-ink outline-none placeholder:text-slate-400"
        />
        {searchTerm && (
          <button type="button" onClick={handleClear} className="mr-1 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <X size={15} />
          </button>
        )}
        <button type="submit" className="m-1.5 ml-0 flex h-[38px] items-center rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-95">
          Search
        </button>
      </form>

      {filteredResidents.length === 0 ? (
        <Empty text={searchTerm ? "No residents match your search." : "No residents found. Admin access may be required."} icon={UserCheck} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResidents.map((resident) => (
            <div key={resident._id} className="relative rounded-lg border border-slate-100 p-4 transition hover:border-slate-200 hover:shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                    {resident.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{resident.name}</p>
                    <p className="text-xs text-slate-500">{resident.flatNumber}</p>
                  </div>
                </div>
                
                {/* Admin Remove Button */}
                {user?.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => setResidentToDelete(resident)}
                    className="shrink-0 rounded p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-accent-coral"
                    title="Remove Resident"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
                <span className="text-xs capitalize text-slate-500">{resident.role}</span>
                <span className="text-xs text-slate-400">{resident.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}