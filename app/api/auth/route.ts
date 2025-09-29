import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // ✅ Verificar si ya hay una sesión activa
    const cookieStore = await cookies();
    const existingToken = cookieStore.get("token")?.value;
    if (existingToken) {
      return NextResponse.json(
        { error: "Ya hay una sesión activa" },
        { status: 400 }
      );
    }


    let email, password;
    try {
      const body = await req.text();
      if (!body) {
        return NextResponse.json({ error: "Cuerpo vacío" }, { status: 400 });
      }
      const json = JSON.parse(body);
      email = json.email;
      password = json.password;
    } catch (err) {
      return NextResponse.json({ error: "Cuerpo inválido o no es JSON" }, { status: 400 });
    }
    if (!email || !password) {
      return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
    }

    // Buscar el usuario en la base de datos
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    interface Usuario {
      id_user: number;
      email: string;
      password: string;
    }

    const user = Array.isArray(rows) ? (rows[0] as Usuario) : null;

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
    }

    //Comparar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    //Si coinciden las contraseñas entonces Generar token JWT
    const token = jwt.sign(
      { id_user: user.id_user, email: user.email },
      process.env.JWT_SECRET!, // asegúrate de tener esta variable en .env
      { expiresIn: "1h" }
    );

    // Devolver cookie
    const response = NextResponse.json({ message: "Login exitoso" });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: Number(process.env.JWT_EXPIRES_IN),
      path: "/",
      sameSite: "strict",
    });
    return response;

  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
