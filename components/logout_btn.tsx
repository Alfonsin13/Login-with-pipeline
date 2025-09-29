"use client"
import { useState } from "react";
export default function LogoutBtn() {
    const [message, setMessage] = useState<String>("");

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await res.json();

            if (res.status == 400) {
                setMessage(data.error || "No hay una sesión activa");
                setTimeout(() => {
                    setMessage("");
                }, 2000)
            } else if (!res.ok) {
                setMessage(data.error || "Error al cerrar sesión");
                setTimeout(() => {
                    setMessage("");
                }, 2000)
            } else {
                setMessage(data.message);
                setTimeout(() => {
                    setMessage("");
                }, 2000)
            }

        } catch (error) {
            console.error("Error al llamar API:", error);
        }
    };

    return (
        <div>
            <button
                onClick={handleLogout}
                className="bg-blue-500 text-white p-2  mt-3 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                Cerrar Sesión
            </button>
            {message && (
                <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
            )}
        </div>
    );
}