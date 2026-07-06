import User from "../models/User.js";

export async function seedDefaultAdmin() {
  const email = "krishnesh@gmail.com";
  const existing = await User.findOne({ email });

  if (existing) return;

  await User.create({
    name: "Default Admin",
    email,
    password: "nepal@321",
    role: "admin",
    flatNumber: "ADMIN",
    phone: "0000000000",
    isApproved: true
  });

  console.log("Default admin created");
}
