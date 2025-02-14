"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import du router pour redirection

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Initialisation du router

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Réinitialiser les erreurs

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Stocker le token
        router.push("/dashboard"); // Rediriger vers le dashboard
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Échec de la connexion");
      }
    } catch (error) {
      setError("Erreur serveur. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Connexion</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Adresse e-mail</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black" // Ajout de text-black
              placeholder="Entrez votre e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black" // Ajout de text-black
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
