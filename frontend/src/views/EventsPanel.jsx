import React, { useState } from "react";
import { CalendarPlus, MapPin, Tag } from "lucide-react"; // Added MapPin and Tag for better icons
import { Empty, Field, FormSection, IconButton, Input, Panel, Textarea } from "../components/ui.jsx";

export function EventsPanel({ user, events, onCreate, onJoin, loading }) {
  const [form, setForm] = useState({ title: "", description: "", eventAt: "", venue: "", organizer: "" });

  async function submit(event) {
    event.preventDefault();
    const ok = await onCreate("event", form);
    if (ok !== false) setForm({ title: "", description: "", eventAt: "", venue: "", organizer: "" });
  }

  return (
    <Panel 
      title="Events" 
      subtitle="Community gatherings and activities" 
      loading={loading} 
      action={user.role === "admin" && <IconButton icon={CalendarPlus} label="Create Event" type="submit" form="event-form" variant="secondary" />}
    >
      {user.role === "admin" && (
        <form id="event-form" className="mb-8" onSubmit={submit}>
          <FormSection>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input required placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input required type="datetime-local" value={form.eventAt} onChange={(e) => setForm({ ...form, eventAt: e.target.value })} />
              <Input required placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
              <Input required placeholder="Organizer" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
            </div>
            
            {/* BEAUTIFIED TEXTAREA */}
            <div className="mt-3">
              <Field label="Description">
                <div className="relative mt-1.5">
                  <Textarea 
                    placeholder="Tell residents about this event..." 
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm text-ink shadow-sm transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" 
                    rows={4}
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  />
                  <div className="absolute bottom-3 right-3 pointer-events-none text-slate-300">
                    <Tag size={16} />
                  </div>
                </div>
              </Field>
            </div>
          </FormSection>
        </form>
      )}

      <div className="space-y-2">
        {events.length === 0 && <Empty text="No upcoming events." icon={CalendarPlus} />}
        {events.map((event) => {
          const joined = event.participants?.some?.((p) => p === user._id || p._id === user._id);
          return (
            <div key={event._id} className="flex flex-col gap-3 rounded-lg border border-slate-100 px-4 py-3.5 transition hover:border-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="break-words text-sm font-medium text-ink">{event.title}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><CalendarPlus size={12}/> {new Date(event.eventAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
                  <span className="flex items-center gap-1"><MapPin size={12}/> {event.venue}</span>
                </div>
              </div>
              <button
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${joined ? "bg-brand-50 text-brand-700" : "bg-brand-600 text-white hover:bg-brand-700"}`}
                onClick={() => onJoin(event._id)}
              >
                {event.participants?.length || 0} joined{joined ? " ✓" : ""}
              </button>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}