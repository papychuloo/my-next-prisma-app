"use client"; // Active le mode client

import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Ajout du champ mot de passe
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }), // Envoi du mot de passe
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`User ${data.name} created successfully!`);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error.message);  
      res.status(500).json({ error: 'Error saving user to database' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Inscription</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Nom complet</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black" // Ajout de text-black
              placeholder="Entrez votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            <label className="block mb-2 text-sm font-medium text-gray-600">Mot de Passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black" // Ajout de text-black
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Mise à jour du mot de passe
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
            >
              S'inscrire
            </button>
          </div>
        </form>
        {message && <p className="text-center mt-4">{message}</p>}
      </div>
    </div>
  );
}
