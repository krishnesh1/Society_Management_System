import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CalendarPlus,
  Check,
  CircleDollarSign,
  Loader2,
  LogOut,
  MessageSquarePlus,
  Plus,
  RefreshCw,
  Send,
  UserCheck,
  UserPlus,
  Users,
  WalletCards,
} from "lucide-react";
import MetricCard from "./components/MetricCard.jsx";
import Sidebar from "./components/Sidebar.jsx";
import StatusBadge from "./components/StatusBadge.jsx";
import Topbar from "./components/Topbar.jsx";
import { api } from "./services/api.js";

const emptyData = {
  announcements: [],
  complaints: [],
  visitors: [],
  bills: [],
  events: [],
  polls: [],
  notifications: [],
  residents: [],
  adminRequests: [],
  stats: {}
};

function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-md border border-white/80 bg-white/92 p-4 shadow-crisp backdrop-blur sm:p-5 ${className}`}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-extrabold sm:text-lg">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function IconButton({ icon: Icon, label, tone = "bg-ink text-white", ...props }) {
  return (
    <button className={`flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50 ${tone}`} {...props}>
      <Icon size={16} />
      {label}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1 text-sm font-bold text-ink/70">
      {label}
      {children}
    </label>
  );
}

function Input(props) {
  return <input className="h-10 min-w-0 rounded-md border border-ink/10 bg-white px-3 text-sm outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10" {...props} />;
}

function Select(props) {
  return <select className="h-10 min-w-0 rounded-md border border-ink/10 bg-white px-3 text-sm outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10" {...props} />;
}

function Textarea(props) {
  return <textarea className="min-h-20 min-w-0 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10" {...props} />;
}

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "krishnesh@gmail.com",
    password: "nepal@321",
    flatNumber: "ADMIN",
    phone: "0000000000",
    emergencyContact: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              flatNumber: form.flatNumber,
              phone: form.phone,
              emergencyContact: form.emergencyContact
      };
      const response = mode === "login" ? await api.login(payload) : await api.signup(payload);
      onLogin(response.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-md border border-ink/10 bg-white shadow-soft lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-ink p-8 text-white">
          <p className="text-sm font-bold text-white/55">Society Management</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-normal">Manage residents, security, bills, events, and notices from one place.</h1>
          <div className="mt-8 grid gap-3 text-sm font-semibold text-white/75">
            <p className="flex items-center gap-2"><Check size={16} /> Separate resident and admin access</p>
            <p className="flex items-center gap-2"><Check size={16} /> Default admin seeded from backend</p>
            <p className="flex items-center gap-2"><Check size={16} /> All dashboard actions use real API routes</p>
          </div>
        </div>

        <form className="p-6 sm:p-8" onSubmit={submit}>
          <div className="mb-6 flex rounded-md bg-pearl p-1">
            {["login", "signup"].map((item) => (
              <button
                key={item}
                type="button"
                className={`h-10 flex-1 rounded-md text-sm font-extrabold capitalize ${mode === item ? "bg-white text-ink shadow-sm" : "text-ink/55"}`}
                onClick={() => setMode(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {mode === "signup" && (
              <>
                <Field label="Full name"><Input required value={form.name} onChange={update("name")} /></Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Flat number"><Input required value={form.flatNumber} onChange={update("flatNumber")} /></Field>
                  <Field label="Phone"><Input required value={form.phone} onChange={update("phone")} /></Field>
                </div>
                <Field label="Emergency contact"><Input value={form.emergencyContact} onChange={update("emergencyContact")} /></Field>
              </>
            )}
            <Field label="Email"><Input required type="email" value={form.email} onChange={update("email")} /></Field>
            <Field label="Password"><Input required type="password" value={form.password} onChange={update("password")} /></Field>
          </div>

          {error && <p className="mt-4 rounded-md bg-coral/10 px-3 py-2 text-sm font-bold text-coral">{error}</p>}

          <button className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-forest text-sm font-extrabold text-white disabled:opacity-60" disabled={loading}>
            {loading && <Loader2 className="animate-spin" size={16} />}
            {mode === "login" ? "Login" : "Create account"}
          </button>

          <p className="mt-4 text-sm font-semibold text-ink/55">Admin: krishnesh@gmail.com / nepal@321</p>
        </form>
      </section>
    </main>
  );
}

function Empty({ text }) {
  return <p className="rounded-md bg-pearl p-4 text-sm font-semibold text-ink/55">{text}</p>;
}

function NoticeStream({ user, items, onCreate }) {
  const [form, setForm] = useState({ title: "", message: "", type: "notice", meetingAt: "", purpose: "" });
  const isAdmin = user.role === "admin";

  async function submit(event) {
    event.preventDefault();
    const ok = await onCreate("announcement", { ...form, meetingAt: form.meetingAt || undefined });
    if (ok !== false) setForm({ title: "", message: "", type: "notice", meetingAt: "", purpose: "" });
  }

  return (
    <Panel title="Announcements" action={isAdmin && <IconButton icon={Send} label="Publish" tone="bg-forest text-white" type="submit" form="notice-form" />}>
      {isAdmin && (
        <form id="notice-form" className="mb-5 grid gap-3 rounded-md bg-pearl p-4" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="notice">Notice</option>
              <option value="emergency">Emergency</option>
              <option value="maintenance">Maintenance</option>
              <option value="meeting">Meeting</option>
            </Select>
          </div>
          <Textarea required placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input type="datetime-local" value={form.meetingAt} onChange={(e) => setForm({ ...form, meetingAt: e.target.value })} />
            <Input placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.length === 0 && <Empty text="No announcements yet." />}
        {items.map((notice) => (
          <article key={notice._id} className="rounded-md border border-ink/10 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-coral/10 px-2 py-1 text-xs font-extrabold text-coral">{notice.type}</span>
              <span className="text-xs font-bold text-ink/45">{notice.meetingAt ? new Date(notice.meetingAt).toLocaleString() : new Date(notice.createdAt).toLocaleDateString()}</span>
            </div>
            <h3 className="mt-3 font-extrabold">{notice.title}</h3>
            <p className="mt-1 text-sm leading-6 text-ink/60">{notice.message}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function ComplaintTable({ user, items, onCreate, onStatus }) {
  const [form, setForm] = useState({ title: "", description: "", category: "Water issue", isAnonymous: false });

  async function submit(event) {
    event.preventDefault();
    const ok = await onCreate("complaint", form);
    if (ok !== false) setForm({ title: "", description: "", category: "Water issue", isAnonymous: false });
  }

  return (
    <Panel title="Private Complaints" action={<IconButton icon={MessageSquarePlus} label="Submit" type="submit" form="complaint-form" />}>
      <form id="complaint-form" className="mb-5 grid gap-3 rounded-md bg-pearl p-4" onSubmit={submit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input required placeholder="Complaint title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {["Water issue", "Electricity issue", "Security issue", "Noise complaint", "Cleaning issue", "Other"].map((item) => <option key={item}>{item}</option>)}
          </Select>
        </div>
        <Textarea required placeholder="Details" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label className="flex items-center gap-2 text-sm font-bold text-ink/60">
          <input type="checkbox" checked={form.isAnonymous} onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} />
          Anonymous complaint
        </label>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="text-xs uppercase text-ink/45">
            <tr><th className="pb-3">Issue</th><th className="pb-3">Flat</th><th className="pb-3">Category</th><th className="pb-3">Status</th><th className="pb-3">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {items.map((complaint) => (
              <tr key={complaint._id}>
                <td className="py-3 font-bold">{complaint.title}</td>
                <td className="py-3 text-ink/60">{complaint.flatNumber || complaint.createdBy?.flatNumber || "Private"}</td>
                <td className="py-3 text-ink/60">{complaint.category}</td>
                <td className="py-3"><StatusBadge>{complaint.status}</StatusBadge></td>
                <td className="py-3">
                  {user.role === "admin" ? (
                    <Select value={complaint.status} onChange={(e) => onStatus(complaint._id, e.target.value)}>
                      <option>Pending</option><option>In Progress</option><option>Resolved</option>
                    </Select>
                  ) : (
                    <span className="text-xs font-bold text-ink/45">Tracked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <Empty text="No complaints found." />}
      </div>
    </Panel>
  );
}

function VisitorTable({ user, items, onCreate, onStatus }) {
  const [form, setForm] = useState({ name: "", phone: "", flatNumber: user.flatNumber || "", purpose: "" });

  async function submit(event) {
    event.preventDefault();
    const ok = await onCreate("visitor", form);
    if (ok !== false) setForm({ name: "", phone: "", flatNumber: user.flatNumber || "", purpose: "" });
  }

  return (
    <Panel title="Visitor Gate Desk" action={<IconButton icon={UserPlus} label="Register" type="submit" form="visitor-form" tone="bg-violet text-white" />}>
      <form id="visitor-form" className="mb-5 grid gap-3 rounded-md bg-pearl p-4" onSubmit={submit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input required placeholder="Visitor name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input required placeholder="Flat number" value={form.flatNumber} onChange={(e) => setForm({ ...form, flatNumber: e.target.value })} />
          <Input required placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
        </div>
      </form>

      <div className="space-y-3">
        {items.length === 0 && <Empty text="No visitors registered yet." />}
        {items.map((visitor) => (
          <div key={visitor._id} className="grid gap-3 rounded-md border border-ink/10 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-extrabold">{visitor.name}</p>
              <p className="mt-1 text-sm text-ink/55">{visitor.flatNumber} - {visitor.purpose} - {visitor.phone}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge>{visitor.status}</StatusBadge>
              {user.role === "admin" && (
                <>
                  <button className="grid h-9 w-9 place-items-center rounded-md bg-forest text-white" onClick={() => onStatus(visitor._id, "Approved")} aria-label="Approve visitor"><Check size={16} /></button>
                  <button className="rounded-md bg-violet px-3 py-2 text-xs font-bold text-white" onClick={() => onStatus(visitor._id, "Checked In")}>In</button>
                  <button className="rounded-md bg-ink px-3 py-2 text-xs font-bold text-white" onClick={() => onStatus(visitor._id, "Checked Out")}>Out</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function BillsPanel({ user, bills, residents, onCreate, onPay }) {
  const firstResident = residents.find((item) => item.role === "resident");
  const [form, setForm] = useState({ resident: firstResident?._id || "", flatNumber: firstResident?.flatNumber || "", month: "", unitsUsed: "", ratePerUnit: "8", dueDate: "" });

  useEffect(() => {
    if (!form.resident && firstResident?._id) setForm((current) => ({ ...current, resident: firstResident._id, flatNumber: firstResident.flatNumber }));
  }, [firstResident, form.resident]);

  async function submit(event) {
    event.preventDefault();
    const ok = await onCreate("bill", { ...form, unitsUsed: Number(form.unitsUsed), ratePerUnit: Number(form.ratePerUnit) });
    if (ok !== false) setForm((current) => ({ ...current, month: "", unitsUsed: "", dueDate: "" }));
  }

  return (
    <Panel title="Electricity Bills" action={user.role === "admin" && <IconButton icon={CircleDollarSign} label="Generate" type="submit" form="bill-form" tone="bg-amber text-ink" />}>
      {user.role === "admin" && (
        <form id="bill-form" className="mb-5 grid gap-3 rounded-md bg-pearl p-4" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select required value={form.resident} onChange={(e) => {
              const resident = residents.find((item) => item._id === e.target.value);
              setForm({ ...form, resident: e.target.value, flatNumber: resident?.flatNumber || "" });
            }}>
              <option value="">Select resident</option>
              {residents.filter((resident) => resident.role === "resident").map((resident) => <option key={resident._id} value={resident._id}>{resident.flatNumber} - {resident.name}</option>)}
            </Select>
            <Input required placeholder="Month e.g. May 2026" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
            <Input required type="number" placeholder="Units used" value={form.unitsUsed} onChange={(e) => setForm({ ...form, unitsUsed: e.target.value })} />
            <Input required type="number" placeholder="Rate/unit" value={form.ratePerUnit} onChange={(e) => setForm({ ...form, ratePerUnit: e.target.value })} />
            <Input required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
        </form>
      )}

      <div className="space-y-3">
        {bills.length === 0 && <Empty text="No bills found." />}
        {bills.map((bill) => (
          <div key={bill._id} className="flex items-center justify-between gap-3 rounded-md border border-ink/10 p-4">
            <div>
              <p className="font-extrabold">{bill.flatNumber} - {bill.month}</p>
              <p className="text-sm text-ink/55">{bill.unitsUsed} units at Rs. {bill.ratePerUnit}/unit</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold">Rs. {bill.amount}</p>
              <div className="mt-2 flex items-center gap-2">
                <StatusBadge>{bill.status}</StatusBadge>
                {bill.status !== "Paid" && <button className="rounded-md bg-forest px-3 py-1 text-xs font-bold text-white" onClick={() => onPay(bill._id)}>Pay</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PollsPanel({ user, polls, onCreate, onVote }) {
  const [form, setForm] = useState({ question: "", options: "", closesAt: "" });

  async function submit(event) {
    event.preventDefault();
    const ok = await onCreate("poll", { question: form.question, options: form.options.split(",").map((item) => item.trim()).filter(Boolean), closesAt: form.closesAt || undefined });
    if (ok !== false) setForm({ question: "", options: "", closesAt: "" });
  }

  return (
    <Panel title="Live Polls" action={user.role === "admin" && <IconButton icon={Plus} label="Poll" type="submit" form="poll-form" />}>
      {user.role === "admin" && (
        <form id="poll-form" className="mb-5 grid gap-3 rounded-md bg-pearl p-4" onSubmit={submit}>
          <Input required placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          <Input required placeholder="Options separated by comma" value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} />
          <Input type="datetime-local" value={form.closesAt} onChange={(e) => setForm({ ...form, closesAt: e.target.value })} />
        </form>
      )}

      <div className="space-y-5">
        {polls.length === 0 && <Empty text="No polls yet." />}
        {polls.map((poll) => {
          const total = poll.options.reduce((sum, option) => sum + option.votes.length, 0);
          return (
            <div key={poll._id}>
              <p className="mb-3 font-extrabold">{poll.question}</p>
              <div className="space-y-2">
                {poll.options.map((option) => {
                  const percent = total ? Math.round((option.votes.length / total) * 100) : 0;
                  return (
                    <button key={option._id} className="w-full text-left" onClick={() => onVote(poll._id, option._id)}>
                      <div className="mb-1 flex justify-between text-sm font-bold"><span>{option.label}</span><span>{percent}%</span></div>
                      <div className="h-2 rounded-full bg-ink/10"><div className="h-2 rounded-full bg-forest" style={{ width: `${percent}%` }} /></div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function EventsPanel({ user, events, onCreate, onJoin }) {
  const [form, setForm] = useState({ title: "", description: "", eventAt: "", venue: "", organizer: "" });

  async function submit(event) {
    event.preventDefault();
    const ok = await onCreate("event", form);
    if (ok !== false) setForm({ title: "", description: "", eventAt: "", venue: "", organizer: "" });
  }

  return (
    <Panel title="Event Planning" action={user.role === "admin" && <IconButton icon={CalendarPlus} label="Event" type="submit" form="event-form" tone="bg-coral text-white" />}>
      {user.role === "admin" && (
        <form id="event-form" className="mb-5 grid gap-3 rounded-md bg-pearl p-4" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input required type="datetime-local" value={form.eventAt} onChange={(e) => setForm({ ...form, eventAt: e.target.value })} />
            <Input required placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
            <Input required placeholder="Organizer" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
          </div>
          <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </form>
      )}

      <div className="space-y-3">
        {events.length === 0 && <Empty text="No upcoming events." />}
        {events.map((event) => (
          <div key={event._id} className="flex items-center justify-between gap-3 rounded-md bg-pearl p-4">
            <div>
              <p className="font-extrabold">{event.title}</p>
              <p className="text-sm text-ink/55">{new Date(event.eventAt).toLocaleString()} - {event.venue}</p>
            </div>
            <button className="rounded-md bg-forest px-3 py-2 text-xs font-bold text-white" onClick={() => onJoin(event._id)}>{event.participants?.length || 0} joined</button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ResidentPanel({ residents }) {
  return (
    <Panel title="Resident Directory" action={<IconButton icon={UserCheck} label="Signup Adds Residents" tone="bg-forest text-white" disabled />}>
      <div className="grid gap-3 md:grid-cols-2">
        {residents.length === 0 && <Empty text="No residents found or admin access required." />}
        {residents.map((resident) => (
          <div key={resident._id} className="rounded-md border border-ink/10 p-4">
            <p className="text-xs font-extrabold uppercase text-ink/45">{resident.flatNumber}</p>
            <p className="mt-1 font-extrabold">{resident.name}</p>
            <p className="mt-1 text-sm text-ink/55">{resident.role} - {resident.phone}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function AdminApprovalPanel({ user, requests, onRequestAdmin, onReview }) {
  const [reason, setReason] = useState("");

  if (user.role !== "admin") {
    return (
      <Panel title="Request Admin Access">
        <form className="grid gap-3" onSubmit={async (event) => {
          event.preventDefault();
          const ok = await onRequestAdmin(reason);
          if (ok !== false) setReason("");
        }}>
          <Textarea required placeholder="Why should you become an admin?" value={reason} onChange={(e) => setReason(e.target.value)} />
          <IconButton icon={Send} label="Send Request" tone="bg-forest text-white" />
        </form>
      </Panel>
    );
  }

  return (
    <Panel title="Admin Approval Queue">
      <div className="space-y-3">
        {requests.length === 0 && <Empty text="No pending admin requests." />}
        {requests.map((request) => (
          <div key={request._id} className="rounded-md border border-amber/30 bg-amber/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 text-amber" size={20} />
              <div>
                <p className="font-extrabold">{request.name} - {request.flatNumber}</p>
                <p className="mt-1 text-sm leading-6 text-ink/60">{request.adminRequest?.reason}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-md bg-forest px-3 py-2 text-sm font-bold text-white" onClick={() => onReview(request._id, "approved")}>Approve</button>
              <button className="rounded-md bg-white px-3 py-2 text-sm font-bold text-ink shadow-sm" onClick={() => onReview(request._id, "rejected")}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function NotificationsPanel({ items }) {
  return (
    <Panel title="Notification Center">
      <div className="space-y-3">
        {items.length === 0 && <Empty text="No notifications yet." />}
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-3 rounded-md border border-ink/10 p-3">
            <Bell className="text-forest" size={18} />
            <div>
              <p className="text-sm font-extrabold">{item.title}</p>
              <p className="text-sm font-semibold text-ink/60">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Dashboard({ user, data, actions }) {
  const metricCards = [
    { label: "Residents", value: data.stats.totalResidents ?? data.residents.length, change: `${data.stats.admins ?? 0} admins`, icon: Users, tone: "bg-forest text-white" },
    { label: "Pending Complaints", value: data.stats.pendingComplaints ?? data.complaints.filter((item) => item.status !== "Resolved").length, change: "Open work", icon: MessageSquarePlus, tone: "bg-coral text-white" },
    { label: "Visitors Today", value: data.stats.visitorsToday ?? data.visitors.length, change: "Gate entries", icon: UserPlus, tone: "bg-amber text-ink" },
    { label: "Unpaid Bills", value: data.stats.unpaidBills ?? data.bills.filter((item) => item.status !== "Paid").length, change: `${data.stats.upcomingEvents ?? data.events.length} events`, icon: WalletCards, tone: "bg-violet text-white" }
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-5">
          <NoticeStream user={user} items={data.announcements} onCreate={actions.create} />
          <ComplaintTable user={user} items={data.complaints} onCreate={actions.create} onStatus={actions.complaintStatus} />
          <ResidentPanel residents={data.residents} />
        </div>
        <div className="space-y-5">
          <AdminApprovalPanel user={user} requests={data.adminRequests} onRequestAdmin={actions.requestAdmin} onReview={actions.reviewAdmin} />
          <VisitorTable user={user} items={data.visitors} onCreate={actions.create} onStatus={actions.visitorStatus} />
          <BillsPanel user={user} bills={data.bills} residents={data.residents} onCreate={actions.create} onPay={actions.payBill} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <PollsPanel user={user} polls={data.polls} onCreate={actions.create} onVote={actions.votePoll} />
        <div className="space-y-5">
          <EventsPanel user={user} events={data.events} onCreate={actions.create} onJoin={actions.joinEvent} />
          <NotificationsPanel items={data.notifications} />
        </div>
      </div>
    </>
  );
}

function FocusView({ active, user, data, actions }) {
  const views = {
    Dashboard: <Dashboard user={user} data={data} actions={actions} />,
    Residents: <ResidentPanel residents={data.residents} />,
    Complaints: <ComplaintTable user={user} items={data.complaints} onCreate={actions.create} onStatus={actions.complaintStatus} />,
    Visitors: <VisitorTable user={user} items={data.visitors} onCreate={actions.create} onStatus={actions.visitorStatus} />,
    Bills: <BillsPanel user={user} bills={data.bills} residents={data.residents} onCreate={actions.create} onPay={actions.payBill} />,
    Events: <EventsPanel user={user} events={data.events} onCreate={actions.create} onJoin={actions.joinEvent} />,
    Polls: <PollsPanel user={user} polls={data.polls} onCreate={actions.create} onVote={actions.votePoll} />,
    Notices: <NoticeStream user={user} items={data.announcements} onCreate={actions.create} />
  };

  return views[active] || views.Dashboard;
}

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async (currentUser = user) => {
    if (!currentUser) return;
    setError("");
    try {
      const base = await Promise.all([
        api.listAnnouncements(),
        api.listComplaints(),
        api.listVisitors(),
        api.listBills(),
        api.listEvents(),
        api.listPolls(),
        api.listNotifications()
      ]);

      const next = {
        announcements: base[0],
        complaints: base[1],
        visitors: base[2],
        bills: base[3],
        events: base[4],
        polls: base[5],
        notifications: base[6],
        residents: [],
        adminRequests: [],
        stats: {}
      };

      if (currentUser.role === "admin") {
        const [residents, adminRequests, stats] = await Promise.all([api.listResidents(), api.getAdminRequests(), api.dashboardStats()]);
        next.residents = residents;
        next.adminRequests = adminRequests;
        next.stats = stats;
      }

      setData(next);
    } catch (err) {
      if (err.status === 401) {
        setUser(null);
        setData(emptyData);
        setError("Your session expired. Please login again.");
      } else {
        setError(err.message);
      }
    }
  }, [user]);

  useEffect(() => {
    async function boot() {
      try {
        const response = await api.me();
        setUser(response.user);
        await loadData(response.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []);

  const runAction = useCallback(async (task) => {
    if (actionLoading) return false;

    setActionLoading(true);
    setError("");

    try {
      await task();
      return true;
    } catch (err) {
      if (err.status === 401) {
        setUser(null);
        setData(emptyData);
        setError("Your session expired. Please login again.");
      } else {
        setError(err.message);
      }
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading]);

  const actions = useMemo(() => ({
    busy: actionLoading,
    create: async (kind, payload) => {
      return runAction(async () => {
        const map = {
          announcement: api.createAnnouncement,
          complaint: api.createComplaint,
          visitor: api.createVisitor,
          bill: api.createBill,
          event: api.createEvent,
          poll: api.createPoll
        };
        await map[kind](payload);
        await loadData();
      });
    },
    complaintStatus: async (id, status) => {
      return runAction(async () => {
        await api.updateComplaintStatus(id, { status });
        await loadData();
      });
    },
    visitorStatus: async (id, status) => {
      return runAction(async () => {
        await api.updateVisitorStatus(id, { status });
        await loadData();
      });
    },
    payBill: async (id) => {
      return runAction(async () => {
        await api.markBillPaid(id);
        await loadData();
      });
    },
    votePoll: async (id, optionId) => {
      return runAction(async () => {
        await api.votePoll(id, { optionId });
        await loadData();
      });
    },
    joinEvent: async (id) => {
      return runAction(async () => {
        await api.joinEvent(id);
        await loadData();
      });
    },
    requestAdmin: async (reason) => {
      return runAction(async () => {
        await api.requestAdmin({ reason });
        const response = await api.me();
        setUser(response.user);
        await loadData(response.user);
      });
    },
    reviewAdmin: async (userId, status) => {
      return runAction(async () => {
        await api.reviewAdmin(userId, { status });
        await loadData();
      });
    }
  }), [actionLoading, loadData, runAction]);

  async function logout() {
    await runAction(async () => {
      await api.logout();
    });
    setUser(null);
    setData(emptyData);
  }

  if (loading) {
    return <main className="grid min-h-screen place-items-center"><Loader2 className="animate-spin text-forest" size={42} /></main>;
  }

  if (!user) {
    return <AuthPage onLogin={async (loggedInUser) => {
      setUser(loggedInUser);
      await loadData(loggedInUser);
    }} />;
  }

  return (
    <div className="min-h-screen">
      <Sidebar active={active} setActive={setActive} isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="lg:pl-72">
        <Topbar user={user} />
        <div className="px-5 py-6 lg:px-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-ink/10 bg-white p-4 shadow-soft">
            <div>
              <p className="text-sm font-bold text-ink/55">Logged in as</p>
              <p className="font-extrabold">{user.name} - {user.role}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {actionLoading && <span className="flex h-10 items-center gap-2 rounded-md bg-forest/10 px-3 text-sm font-bold text-forest"><Loader2 className="animate-spin" size={16} /> Working</span>}
              <IconButton icon={RefreshCw} label="Refresh" tone="bg-pearl text-ink" onClick={() => loadData()} disabled={actionLoading} />
              <IconButton icon={LogOut} label="Logout" tone="bg-ink text-white" onClick={logout} />
            </div>
          </div>
          {error && <p className="mb-5 rounded-md bg-coral/10 px-4 py-3 text-sm font-bold text-coral">{error}</p>}
          <FocusView active={active} user={user} data={data} actions={actions} />
        </div>
      </main>
    </div>
  );
}
