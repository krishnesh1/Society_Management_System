import React, { useState, useEffect } from "react";
import { AlertTriangle, Trash2, UserPlus, X } from "lucide-react";
import { Empty, Input, Panel } from "../components/ui.jsx";

export function PollsPanel({ user, polls, residents, onCreate, onVote, onDelete, onAddResident, loading }) {
  const [form, setForm] = useState({ question: "", startsAt: "", closesAt: "" });
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  
  // NEW: States for the Add Resident search toaster
  const [addResidentPollId, setAddResidentPollId] = useState(null);
  const [flatSearch, setFlatSearch] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function submit(event) {
    event.preventDefault();
    const ok = await onCreate("poll", { 
      question: form.question, 
      options: ["Yes", "No"], 
      startsAt: form.startsAt || undefined,
      closesAt: form.closesAt || undefined 
    });
    if (ok !== false) setForm({ question: "", startsAt: "", closesAt: "" });
  }

  const visiblePolls = polls.filter(poll => {
    const closed = poll.closesAt && new Date(poll.closesAt) < currentTime;
    const isPermitted = poll.permittedResidents?.includes(user._id);
    return !closed || isPermitted || (user.createdAt && new Date(poll.createdAt) >= new Date(user.createdAt));
  });

  const formatTimeLeft = (closesAt) => {
    if (!closesAt) return null;
    const diff = new Date(closesAt) - currentTime;
    if (diff <= 0) return "Time Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Panel title="Community Polls" subtitle="Vote on society decisions" loading={loading} action={user.role === "admin" && <button type="submit" form="poll-form" className="flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700">Create Poll</button>}>
      {user.role === "admin" && (
        <form id="poll-form" className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4" onSubmit={submit}>
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Create a Yes/No Poll</h3>
          <div className="space-y-4">
            <Input required placeholder="Question (e.g., Should we repaint the lobby?)" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Starts At (Optional)</label>
                <Input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Closes At (Required for timer)</label>
                <Input required type="datetime-local" value={form.closesAt} onChange={(e) => setForm({ ...form, closesAt: e.target.value })} />
              </div>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {visiblePolls.length === 0 && <Empty text="No active polls." />}
        {visiblePolls.map((poll) => {
          const total = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
          const hasStarted = !poll.startsAt || new Date(poll.startsAt) <= currentTime;
          const closed = poll.closesAt && new Date(poll.closesAt) < currentTime;
          const active = hasStarted && !closed;

          const votedOption = poll.options.find((option) =>
            option.votes.some((voterId) => voterId === user._id || voterId?._id === user._id)
          );

          const maxVotes = Math.max(...poll.options.map(o => o.votes.length));
          const winners = poll.options.filter(o => o.votes.length === maxVotes && maxVotes > 0);
          const hasVotes = maxVotes > 0;

          return (
            <div key={poll._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="border-b border-slate-100 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-base font-semibold text-slate-800">{poll.question}</p>
                  
                  <div className="flex shrink-0 items-center gap-2">
                    {!closed && poll.closesAt && (
                       <div className="rounded-md bg-slate-200/50 px-2.5 py-1 text-xs font-bold tabular-nums tracking-wide text-slate-700">
                         ⏳ {formatTimeLeft(poll.closesAt)}
                       </div>
                    )}
                    {closed ? (
                      <span className="rounded-md bg-slate-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">Ended</span>
                    ) : votedOption ? (
                      <span className="rounded-md bg-brand-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700">Voted</span>
                    ) : null}

                    {/* NEW: Open Search Toaster instead of browser prompt */}
                    {user.role === "admin" && (
                      <button
                        type="button"
                        className="ml-2 rounded-md p-1.5 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                        onClick={() => {
                          setAddResidentPollId(poll._id);
                          setFlatSearch(""); // Clear previous search
                        }}
                        title="Add Resident to Poll"
                      >
                        <UserPlus size={16} />
                      </button>
                    )}

                    {user.role === "admin" && (
                      <button
                        type="button"
                        className="ml-2 rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        onClick={() => setConfirmDeleteId(poll._id)}
                        title="Delete Poll"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4">
                {closed ? (
                  <div className="rounded-lg bg-slate-50 border border-slate-100 p-6 text-center">
                    {hasVotes ? (
                      <>
                        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Final Decision</p>
                        <div className="flex flex-wrap justify-center gap-6">
                          {winners.map((winner, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                              <span className="text-3xl font-extrabold text-brand-700">{winner.label}</span>
                              <span className="mt-1 rounded-full border border-slate-200 bg-white px-3 py-0.5 text-xs font-medium text-slate-500 shadow-sm">
                                {winner.votes.length} Votes
                              </span>
                            </div>
                          ))}
                        </div>
                        {winners.length > 1 && <p className="mt-3 text-sm font-medium text-amber-600">Result is a Tie!</p>}
                      </>
                    ) : (
                      <p className="text-sm font-medium text-slate-500">Poll ended with zero votes.</p>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {poll.options.map((option) => {
                      const percent = total ? Math.round((option.votes.length / total) * 100) : 0;
                      const isSelected = votedOption?._id === option._id;

                      return (
                        <button
                          key={option._id}
                          type="button"
                          className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                            !active ? "cursor-not-allowed opacity-50 bg-slate-50 border-slate-200" :
                            isSelected ? "border-brand-500 bg-brand-50 ring-4 ring-brand-500/10" : "border-slate-100 bg-white hover:border-brand-300 hover:shadow-sm"
                          }`}
                          onClick={() => active && !votedOption && onVote(poll._id, option._id)}
                          disabled={!active || votedOption}
                        >
                          <div className="relative z-10 flex items-center justify-between">
                            <span className={`text-lg font-bold ${isSelected ? "text-brand-800" : "text-slate-700 group-hover:text-slate-900"}`}>
                              {option.label}
                              {isSelected && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-brand-600 opacity-80">(Your Vote)</span>}
                            </span>
                            <span className={`font-semibold tabular-nums ${isSelected ? "text-brand-600" : "text-slate-400"}`}>
                              {percent}%
                            </span>
                          </div>
                          <div 
                            className={`absolute inset-y-0 left-0 z-0 opacity-[0.08] transition-all duration-700 ease-out bg-brand-600`}
                            style={{ width: `${percent}%` }}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SEARCH AND ADD RESIDENT TOASTER */}
      {addResidentPollId && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl sm:w-80">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <UserPlus size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Add Resident</h3>
                <p className="mt-0.5 text-xs text-slate-500">Search by Flat Number</p>
              </div>
            </div>
            <button onClick={() => setAddResidentPollId(null)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
          
          <div className="mt-1">
            <Input 
              autoFocus
              placeholder="e.g., E-1626" 
              value={flatSearch} 
              onChange={(e) => setFlatSearch(e.target.value)} 
            />
          </div>

          <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50 p-1">
            {flatSearch.trim() === "" ? (
               <p className="p-3 text-center text-xs text-slate-500">Type a flat number to search</p>
            ) : (
              (() => {
                const filtered = residents.filter(r => r.role === "resident" && r.flatNumber?.toLowerCase().includes(flatSearch.toLowerCase()));
                if (filtered.length === 0) {
                  return <p className="p-3 text-center text-xs text-slate-500">No user found</p>;
                }
                return filtered.map(r => (
                  <button
                    key={r._id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-md p-2 text-left transition hover:bg-white hover:shadow-sm"
                    onClick={() => {
                      onAddResident(addResidentPollId, r._id);
                      setAddResidentPollId(null);
                      setFlatSearch("");
                    }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{r.flatNumber}</p>
                      <p className="text-xs text-slate-500">{r.name}</p>
                    </div>
                    <span className="rounded bg-brand-50 px-2 py-1 text-[10px] font-bold uppercase text-brand-700">Add</span>
                  </button>
                ));
              })()
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION TOASTER */}
      {confirmDeleteId && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl sm:w-80">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Delete this poll?</h3>
              <p className="mt-1 text-xs text-slate-500">This action cannot be undone. All votes will be permanently removed.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
              onClick={() => {
                onDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
            >
              Yes, delete
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}