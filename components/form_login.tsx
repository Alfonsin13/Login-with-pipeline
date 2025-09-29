"use client";

import { useState, useEffect } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("Data del form: ", res.ok, data.message)
      if (!res.ok) {
        setMessage(data.error || "Error al ingresar");
        setTimeout(() => {
          setMessage("");
        }, 2000)
      } else {
        setMessage(data.message);
        setTimeout(() => {
          setMessage("");
          setEmail("");
          setPassword("");
        }, 2000)
      }
    } catch (error) {
      console.error("Error al llamar API:", error);
      setMessage("Error de conexión");
      setTimeout(() => {
        setMessage("");
      }, 2000)
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-80"
    >
      <h1 className="text-xl font-bold mb-4 text-center text-black">Login</h1>

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-3 text-black"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-3 text-black"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Cargando..." : "Ingresar"}
      </button>

      {(message) && (
        <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
      )}
    </form>
  );
}