"use client";
import { useState, useEffect } from "react";

export default function SkillTasks({ params }) {
  const id = params.id;
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    notes: "", // On garde 'notes' ici car c'est juste pour l'interface utilisateur
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTasks(id);
    }
  }, [id]);

  const fetchTasks = async (skillId) => {
    try {
      console.log("Récupération des tâches pour la compétence:", skillId);
      const res = await fetch(`/api/tasks?skillId=${skillId}`);
      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des tâches");
      }
      const data = await res.json();
      console.log("Tâches récupérées:", data);
      setTasks(data);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Impossible de charger les tâches");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newTask.name.trim() || !newTask.description.trim()) {
      setError("Le nom et la description sont requis");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Envoi de la tâche avec les données:", {
        ...newTask,
        skillId: id,
      });

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTask.name.trim(),
          description: newTask.description.trim(),
          notes: newTask.notes.trim(), // Sera converti en 'note' côté API
          skillId: id,
        }),
      });

      const data = await response.json();
      console.log("Réponse de l'API:", data);

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'ajout de la tâche");
      }

      setTasks([...tasks, data]);
      setNewTask({ name: "", description: "", notes: "" });
      setError("");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      setError(error.message || "Erreur lors de l'ajout de la tâche");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-white to-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tâches pour la compétence {id}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Ajouter une Tâche</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              required
              placeholder="Nom de la tâche"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              placeholder="Description de la tâche"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="border p-2 w-full rounded-md"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <input
              type="text"
              placeholder="Notes additionnelles"
              value={newTask.notes}
              onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-2 text-white rounded-md ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isLoading ? "Ajout en cours..." : "Ajouter la tâche"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Liste des Tâches</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">Aucune tâche pour le moment</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg">{task.name}</h3>
              <p className="text-gray-600 mt-2">{task.description}</p>
              {task.note && (
                <p className="text-gray-500 mt-2 text-sm">{task.note}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
