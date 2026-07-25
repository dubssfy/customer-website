import bcrypt from "bcryptjs";

const password = "Meresaikaka@123"; // Change this to your desired admin password

const hash = await bcrypt.hash(password, 12);

console.log(hash);