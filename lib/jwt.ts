import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "supersecreto";

export function generarToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function verificarToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}
