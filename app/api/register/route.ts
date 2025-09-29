import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validar datos
    if (!email || !password) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const [existing] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ error: "Usuario ya registrado" }, { status: 400 });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar usuario en la base de datos
    const [result] = await db.query(
      "INSERT INTO usuarios (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    return NextResponse.json({ message: "Usuario registrado con éxito", id: (result as any).insertId });
    
  } catch (error) {
    console.error("Error en register:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}