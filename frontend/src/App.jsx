import React, { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import { PageLoader } from "./components/ui.jsx";
import { useAppData } from "./hooks/useAppData.js";
import { api, VIEW_RESOURCES } from "./services/api.js";

// --- NEW INDIVIDUAL IMPORTS ---
import { AuthPage } from "./views/AuthPage.jsx";
import { BillsPanel } from "./views/BillsPanel.jsx";
import { ComplaintTable } from "./views/ComplaintTable.jsx";
import { DashboardOverview } from "./views/DashboardOverview.jsx";
import { EventsPanel } from "./views/EventsPanel.jsx";
import { NoticeStream } from "./views/NoticeStream.jsx";
import { NotificationsPanel } from "./views/NotificationsPanel.jsx";
import { PollsPanel } from "./views/PollsPanel.jsx";
import { ResidentPanel } from "./views/ResidentPanel.jsx";
import { VisitorTable } from "./views/VisitorTable.jsx";
// ------------------------------

const CREATE_MAP = {
  announcement: { fn: api.createAnnouncement, key: "announcements", alsoRefresh: ["notifications"] },
  complaint: { fn: api.createComplaint, key: "complaints" },
  visitor: { fn: api.createVisitor, key: "visitors" },
  bill: { fn: api.createBill, key: "bills" },
  event: { fn: api.createEvent, key: "events", alsoRefresh: ["notifications"] },
  poll: { fn: api.createPoll, key: "polls", alsoRefresh: ["notifications"] }
};

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { data, dataLoading, viewReady, loadForView, preloadGlobal, refreshKeys, patchResource, resetData } = useAppData();

  useEffect(() => {
    async function boot() {
      try {
        const response = await api.me();
        setUser(response.user);
      } catch {
        setUser(null);
      } finally {
        setBootLoading(false);
      }
    }
    boot();
  }, []);

  useEffect(() => {
    if (!user) return;
    preloadGlobal(user);
    loadForView(active, user);
  }, [user, active, loadForView, preloadGlobal]);

  useEffect(() => {
    if (!user) return undefined;
    const intervalId = window.setInterval(() => {
      refreshKeys(["notifications"], user);
    }, 10000);
    return () => window.clearInterval(intervalId);
  }, [user, refreshKeys]);

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
        resetData();
        setError("Your session expired. Please sign in again.");
      } else {
        setError(err.message);
      }
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [actionLoading, resetData]);

  const actions = useMemo(() => ({
    create: async (kind, payload) => {
      const config = CREATE_MAP[kind];
      if (!config) return false;
      return runAction(async () => {
        const created = await config.fn(payload);
        patchResource(config.key, (items) => [created, ...items]);
        if (config.alsoRefresh) {
          await refreshKeys(config.alsoRefresh, user);
        }
        if (kind === "announcement" && user?.role === "admin") {
          await refreshKeys(["stats"], user);
        }
      });
    },
    complaintStatus: async (id, status) => {
      return runAction(async () => {
        const updated = await api.updateComplaintStatus(id, { status });
        patchResource("complaints", (items) => items.map((item) => (item._id === id ? updated : item)));
      });
    },
    visitorStatus: async (id, status) => {
      return runAction(async () => {
        const updated = await api.updateVisitorStatus(id, { status });
        patchResource("visitors", (items) => items.map((item) => (item._id === id ? updated : item)));
      });
    },
    payBill: async (id) => {
      return runAction(async () => {
        const updated = await api.markBillPaid(id);
        patchResource("bills", (items) => items.map((item) => (item._id === id ? updated : item)));
      });
    },
    deleteBill: async (id) => {
      return runAction(async () => {
        await api.deleteBill(id);
        patchResource("bills", (items) => items.filter((item) => item._id !== id));
        await refreshKeys(["stats"], user);
      });
    },
    votePoll: async (id, optionId) => {
      return runAction(async () => {
        const updated = await api.votePoll(id, { optionId });
        patchResource("polls", (items) => items.map((item) => (item._id === id ? updated : item)));
      });
    },
    deletePoll: async (id) => {
      return runAction(async () => {
        await api.deletePoll(id);
        patchResource("polls", (items) => items.filter((item) => item._id !== id));
      });
    },
    addResidentToPoll: async (pollId, userId) => {
      return runAction(async () => {
        const updated = await api.addResidentToPoll(pollId, { pollId, userId });
        patchResource("polls", (items) => items.map((item) => (item._id === pollId ? updated : item)));
      });
    },
    joinEvent: async (id) => {
      return runAction(async () => {
        const updated = await api.joinEvent(id);
        patchResource("events", (items) => items.map((item) => (item._id === id ? updated : item)));
      });
    },
    requestAdmin: async (reason) => {
      return runAction(async () => {
        await api.requestAdmin({ reason });
        const response = await api.me();
        setUser(response.user);
      });
    },
    reviewAdmin: async (userId, status) => {
      return runAction(async () => {
        await api.reviewAdmin(userId, { status });
        await refreshKeys(["adminRequests", "residents", "stats"], user);
      });
    },
    removeResident: async (id) => {
      return runAction(async () => {
        await api.removeResident(id);
        patchResource("residents", (items) => items.filter((item) => item._id !== id));
        await refreshKeys(["stats"], user); 
      });
    }
  }), [runAction, patchResource, refreshKeys, user]);

  async function logout() {
    await runAction(async () => {
      await api.logout();
    });
    setUser(null);
    resetData();
  }

  async function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    setActive("Dashboard");
  }

  function handleRefresh() {
    if (!user) return;
    refreshKeys(VIEW_RESOURCES[active] || [], user);
  }

  const viewLoading = dataLoading && !viewReady[active];
  const panelProps = { user, actions, loading: viewLoading };

  function renderView() {
    switch (active) {
      case "Dashboard":
        return (
          <DashboardOverview
            user={user}
            data={data}
            actions={actions}
            onNavigate={setActive}
            loading={viewLoading}
          />
        );
      case "Residents":
        return <ResidentPanel
          user={user} 
          residents={data.residents}
          onRemove={actions.removeResident} 
          loading={viewLoading} />;
      case "Complaints":
        return (
          <ComplaintTable
            {...panelProps}
            items={data.complaints}
            onCreate={actions.create}
            onStatus={actions.complaintStatus}
          />
        );
      case "Visitors":
        return (
          <VisitorTable
            {...panelProps}
            items={data.visitors}
            onCreate={actions.create}
            onStatus={actions.visitorStatus}
          />
        );
      case "Bills":
        return (
          <BillsPanel
            {...panelProps}
            bills={data.bills}
            residents={data.residents}
            onCreate={actions.create}
            onPay={actions.payBill}
            onDelete={actions.deleteBill}
          />
        );
      case "Events":
        return (
          <EventsPanel
            {...panelProps}
            events={data.events}
            onCreate={actions.create}
            onJoin={actions.joinEvent}
          />
        );
      case "Polls":
        return (
          <PollsPanel
            {...panelProps}
            polls={data.polls}
            residents={data.residents}
            onCreate={actions.create}
            onVote={actions.votePoll}
            onDelete={actions.deletePoll}
            onAddResident={actions.addResidentToPoll}
          />
        );
      case "Notices":
        return (
          <NoticeStream
            {...panelProps}
            items={data.announcements}
            onCreate={actions.create}
          />
        );
      case "Notifications":
        return <NotificationsPanel items={data.notifications} loading={viewLoading} />;
      default:
        return (
          <DashboardOverview
            user={user}
            data={data}
            actions={actions}
            onNavigate={setActive}
            loading={viewLoading}
          />
        );
    }
  }

  if (bootLoading) return <PageLoader />;

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar
        active={active}
        setActive={setActive}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
      />
      <main className="lg:pl-[252px]">
        <Topbar
          user={user}
          active={active}
          data={data}
          onNavigate={setActive}
          onOpenSidebar={() => setSidebarOpen(true)}
          onRefresh={handleRefresh}
          onLogout={logout}
          refreshing={dataLoading}
          saving={actionLoading}
        />
        <div className="px-4 py-5 sm:px-5 sm:py-6 lg:px-8">
          {error && (
            <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200/80 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                className="text-xs font-medium text-red-600 hover:text-red-800"
                onClick={() => setError("")}
              >
                Dismiss
              </button>
            </div>
          )}
          {renderView()}
        </div>
      </main>
    </div>
  );
}