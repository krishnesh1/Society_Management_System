import User from "../models/User.js";

export async function seedDefaultAdmin() {
  const email = process.env.DEFAULT_ADMIN_EMAIL || "karnkrishnesh970@gmail.com";
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "543216";
  const existing = await User.findOne({ email }).select("+password");

  if (existing) {
    existing.name = existing.name || "Default Admin";
    existing.password = password;
    existing.role = "admin";
    existing.flatNumber = existing.flatNumber || "ADMIN";
    existing.phone = existing.phone || "0000000000";
    existing.isApproved = true;
    existing.adminRequest = {
      ...existing.adminRequest,
      status: "approved"
    };
    await existing.save();
    console.log(`Default admin ready: ${email}`);
    return;
  }

  await User.create({
    name: "Default Admin",
    email,
    password,
    role: "admin",
    flatNumber: "ADMIN",
    phone: "0000000000",
    isApproved: true
  });

  console.log(`Default admin created: ${email}`);
}
