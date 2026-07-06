const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
  listEvents: () => request("/events"),
  createEvent: (payload) => request("/events", { method: "POST", body: payload }),
  joinEvent: (id) => request(`/events/${id}/join`, { method: "POST" }),
  listPolls: () => request("/polls"),
  createPoll: (payload) => request("/polls", { method: "POST", body: payload }),
  votePoll: (id, payload) => request(`/polls/${id}/vote`, { method: "POST", body: payload }),
  listNotifications: () => request("/notifications"),
  createNotification: (payload) => request("/notifications", { method: "POST", body: payload }),
  listResidents: () => request("/residents")
};
