import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "No hay sesión activa" },
                { status: 400 }
            );
        }

        const response = NextResponse.json({ message: "Logout exitoso" });

        // Borrar la cookie del token
        response.cookies.set({
            name: "token",
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 0,
            sameSite: "strict",
        });
        return response;
    } catch (error) {
        console.error("Error en logout:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}
