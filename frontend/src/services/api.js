const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
  forgotPassword: (payload) => request("/auth/forgot-password", { method: "POST", body: payload }),
  verifyOtp: (payload) => request("/auth/verify-otp", { method: "POST", body: payload }),
  resetPassword: (payload) => request("/auth/reset-password", { method: "POST", body: payload }),
  requestAdmin: (payload) => request("/admin/request", { method: "POST", body: payload }),
  getAdminRequests: () => request("/admin/requests"),
  reviewAdmin: (userId, payload) => request(`/admin/requests/${userId}`, { method: "PATCH", body: payload }),
  dashboardStats: () => request("/admin/stats"),
  listAnnouncements: () => request("/announcements"),
  createAnnouncement: (payload) => request("/announcements", { method: "POST", body: payload }),
  listComplaints: () => request("/complaints"),
  createComplaint: (payload) => request("/complaints", { method: "POST", body: payload }),
  updateComplaintStatus: (id, payload) => request(`/complaints/${id}/status`, { method: "PATCH", body: payload }),
  listVisitors: () => request("/visitors"),
  createVisitor: (payload) => request("/visitors", { method: "POST", body: payload }),
  updateVisitorStatus: (id, payload) => request(`/visitors/${id}/status`, { method: "PATCH", body: payload }),
  listBills: () => request("/bills"),
  createBill: (payload) => request("/bills", { method: "POST", body: payload }),
  markBillPaid: (id) => request(`/bills/${id}/pay`, { method: "PATCH" }),
  deleteBill: (id) => request(`/bills/${id}`, { method: "DELETE" }),
  listEvents: () => request("/events"),
  createEvent: (payload) => request("/events", { method: "POST", body: payload }),
  joinEvent: (id) => request(`/events/${id}/join`, { method: "POST" }),
  listPolls: () => request("/polls"),
  createPoll: (payload) => request("/polls", { method: "POST", body: payload }),
  votePoll: (id, payload) => request(`/polls/${id}/vote`, { method: "POST", body: payload }),
  listNotifications: () => request("/notifications"),
  createNotification: (payload) => request("/notifications", { method: "POST", body: payload }),
  deletePoll: (id) => request(`/polls/${id}`, { method: "DELETE" }),
  addResidentToPoll: (id, payload) => request(`/polls/${id}/add-resident`, { method: "PATCH", body: payload }),
  listResidents: () => request("/residents"),
  removeResident: (id) => request(`/residents/${id}`, { method: "DELETE" })
};

export const RESOURCE_KEYS = [
  "announcements",
  "complaints",
  "visitors",
  "bills",
  "events",
  "polls",
  "notifications"
];

export const ADMIN_KEYS = ["residents", "adminRequests", "stats"];

export const VIEW_RESOURCES = {
  Dashboard: [...RESOURCE_KEYS, "residents", "adminRequests", "stats"],
  Residents: ["residents"],
  Complaints: ["complaints"],
  Visitors: ["visitors"],
  Bills: ["bills", "residents"],
  Events: ["events"],
  Polls: ["polls"],
  Notices: ["announcements"],
  Notifications: ["notifications"]
};

/** Dashboard loads in two tiers so the UI appears quickly. */
export const VIEW_LOAD_TIERS = {
  Dashboard: {
    priority: ["notifications", "announcements", "complaints"],
    deferred: ["visitors", "bills", "events", "polls", "residents", "adminRequests", "stats"]
  }
};

export const GLOBAL_PRELOAD = ["notifications"];

const fetchers = {
  announcements: api.listAnnouncements,
  complaints: api.listComplaints,
  visitors: api.listVisitors,
  bills: api.listBills,
  events: api.listEvents,
  polls: api.listPolls,
  notifications: api.listNotifications,
  residents: api.listResidents,
  adminRequests: api.getAdminRequests,
  stats: api.dashboardStats
};

export async function fetchResources(keys, user) {
  const allowed = keys.filter((key) => {
    if (ADMIN_KEYS.includes(key)) return user?.role === "admin";
    return Boolean(fetchers[key]);
  });

  const entries = await Promise.all(
    allowed.map(async (key) => {
      try {
        const value = await fetchers[key]();
        return [key, value];
      } catch {
        return [key, key === "stats" ? {} : []];
      }
    })
  );

  return Object.fromEntries(entries);
}
