import bcrypt from "bcryptjs";

export async function encriptarPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verificarPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}