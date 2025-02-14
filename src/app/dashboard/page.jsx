"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    notes: "",
    skillId: "",
  });
  const [newSkill, setNewSkill] = useState({
    name: "",
    description: "",
    difficulty: "",
  });
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Charger les compétences au montage du composant
  useEffect(() => {
    fetchSkills();
  }, []);

  // Récupérer toutes les compétences
  const fetchSkills = async () => {
    const res = await fetch("/api/skills");
    const data = await res.json();
    setSkills(data);
  };

  // Récupérer les tâches pour une compétence spécifique
  const fetchTasksForSkill = async (skillId) => {
    const res = await fetch(`/api/tasks?skillId=${skillId}`);
    const data = await res.json();
    setTasks(data);
  };

  // Ajouter une nouvelle tâche
  const handleAddTask = async () => {
    if (!newTask.name || !newTask.description || !newTask.skillId) {
      alert("Tous les champs sont requis !");
      return;
    }

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      alert("Tâche ajoutée !");
      setShowTaskForm(false);
      setNewTask({ name: "", description: "", notes: "", skillId: "" });
      fetchTasksForSkill(newTask.skillId); // Rafraîchir les tâches
    } else {
      alert("Erreur lors de l'ajout de la tâche");
    }
  };

  // Modifier une tâche existante
const handleUpdateTask = async () => {
  if (!editingTask || !editingTask.name || !editingTask.description) {
    alert("Tous les champs sont requis !");
    return;
  }

  const response = await fetch(`/api/tasks?id=${editingTask.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editingTask),
  });

  if (response.ok) {
    alert("Tâche mise à jour !");
    setEditingTask(null);
    fetchTasksForSkill(selectedSkillId); // Rafraîchir les tâches
    setShowTaskForm(false);
  } else {
    const errorData = await response.json();
    alert(`Erreur lors de la mise à jour de la tâche : ${errorData.error}`);
  }
};

// Supprimer une tâche
const handleDeleteTask = async (taskId) => {
  const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
  if (!confirmDelete) return;

  const response = await fetch(`/api/tasks?id=${taskId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Tâche supprimée !");
    fetchTasksForSkill(selectedSkillId); // Rafraîchir les tâches
  } else {
    const errorData = await response.json();
    alert(`Erreur lors de la suppression de la tâche : ${errorData.error}`);
  }
};

// Modifier une compétence existante
const handleUpdateSkill = async () => {
  if (!editingSkill || !editingSkill.name || !editingSkill.description || !editingSkill.difficulty) {
    alert("Tous les champs sont requis !");
    return;
  }

  const response = await fetch(`/api/skills?id=${editingSkill.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editingSkill),
  });

  if (response.ok) {
    alert("Compétence mise à jour !");
    setEditingSkill(null);
    fetchSkills(); // Rafraîchir la liste des compétences
    setShowSkillForm(false);
  } else {
    const errorData = await response.json();
    alert(`Erreur lors de la mise à jour de la compétence : ${errorData.error}`);
  }
};

  // Supprimer une compétence
const handleDeleteSkill = async (skillId) => {
  const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?");
  if (!confirmDelete) return;

  const response = await fetch(`/api/skills?id=${skillId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Compétence supprimée !");
    fetchSkills(); // Rafraîchir la liste des compétences
    setSelectedSkillId(null);
    setTasks([]); // Vider la liste des tâches
  } else {
    const errorData = await response.json();
    alert(`Erreur lors de la suppression de la compétence : ${errorData.error}`);
  }
};
  // Sélectionner une tâche pour modification
  const handleSelectTask = (task) => {
    setEditingTask({ ...task });
    setShowTaskForm(true);
  };

  // Annuler la modification d'une tâche
  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowTaskForm(false);
  };

  // Revenir à la liste des compétences
  const handleBackToSkills = () => {
    setSelectedSkillId(null);
    setTasks([]);
  };

  // Ajouter une nouvelle compétence
  const handleAddSkill = async () => {
    if (!newSkill.name || !newSkill.description || !newSkill.difficulty) {
      alert("Tous les champs sont requis !");
      return;
    }

    const response = await fetch("/api/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSkill),
    });

    if (response.ok) {
      alert("Compétence ajoutée !");
      setShowSkillForm(false);
      setNewSkill({ name: "", description: "", difficulty: "" });
      fetchSkills(); // Rafraîchir la liste des compétences
    } else {
      alert("Erreur lors de l'ajout de la compétence");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-100 to-blue-300 text-black h-screen p-4 shadow-lg">
        <h2 className="text-xl font-bold text-center mb-6 text-black">Dashboard</h2>
        <button className="w-full p-2 bg-light-blue-500 text-black mb-4 rounded">
          Compétences
        </button>
        <button className="w-full p-2 bg-light-blue-500 text-black rounded">
          Tâches
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="flex justify-between items-center bg-white p-4 shadow mb-6 rounded">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Compétences</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-400 text-black px-4 py-2 rounded"
            >
              + Ajouter Tâche
            </button>
            <button
              onClick={() => setShowSkillForm(true)}
              className="bg-blue-400 text-black px-4 py-2 rounded"
            >
              + Ajouter Compétence
            </button>
          </div>
        </div>

        {/* Affichage des compétences */}
        <div className="grid grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="p-4 border rounded shadow bg-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-black">{skill.name}</h3>
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
              <p className="text-black">{skill.description}</p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setSelectedSkillId(skill.id);
                    fetchTasksForSkill(skill.id);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Voir les tâches
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Affichage des tâches pour la compétence sélectionnée */}
        {selectedSkillId && (
          <div className="mt-6 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold text-black">Tâches pour la compétence</h2>
            <button
              onClick={handleBackToSkills}
              className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
            >
              Retour
            </button>
            <table className="min-w-full mt-4 border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 p-2 text-left text-black">Nom de la tâche</th>
                  <th className="border-b-2 p-2 text-left text-black">Description</th>
                  <th className="border-b-2 p-2 text-left text-black">Notes</th>
                  <th className="border-b-2 p-2 text-left text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b hover:bg-gray-100">
                    <td className="p-2 text-black">{task.name}</td>
                    <td className="p-2 text-black">{task.description}</td>
                    <td className="p-2 text-black">{task.notes}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleSelectTask(task)}
                        className="bg-yellow-500 text-black px-4 py-2 rounded mr-2"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-500 text-black px-4 py-2 rounded"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Formulaire d'ajout ou modification de tâche */}
        {showTaskForm && (
          <div className="bg-white p-6 rounded shadow mt-6">
            <h2 className="text-xl font-bold text-black mb-4">
              {editingTask ? "Modifier la tâche" : "Ajouter une tâche"}
            </h2>
            <input
              type="text"
              placeholder="Nom de la tâche"
              value={editingTask ? editingTask.name : newTask.name}
              onChange={(e) => {
                if (editingTask) {
                  setEditingTask({ ...editingTask, name: e.target.value });
                } else {
                  setNewTask({ ...newTask, name: e.target.value });
                }
              }}
              className="border p-2 w-full mb-4 text-black"
            />
            <input
              type="text"
              placeholder="Description"
              value={editingTask ? editingTask.description : newTask.description}
              onChange={(e) => {
                if (editingTask) {
                  setEditingTask({ ...editingTask, description: e.target.value });
                } else {
                  setNewTask({ ...newTask, description: e.target.value });
                }
              }}
              className="border p-2 w-full mb-4 text-black"
            />
            <input
              type="text"
              placeholder="Notes"
              value={editingTask ? editingTask.notes : newTask.notes}
              onChange={(e) => {
                if (editingTask) {
                  setEditingTask({ ...editingTask, notes: e.target.value });
                } else {
                  setNewTask({ ...newTask, notes: e.target.value });
                }
              }}
              className="border p-2 w-full mb-4 text-black"
            />
            <select
              value={editingTask ? editingTask.skillId : newTask.skillId}
              onChange={(e) => {
                if (editingTask) {
                  setEditingTask({ ...editingTask, skillId: e.target.value });
                } else {
                  setNewTask({ ...newTask, skillId: e.target.value });
                }
              }}
              className="border p-2 w-full mb-4 text-black"
            >
              <option value="">Sélectionner une compétence</option>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>

            <div className="flex justify-between">
              <button
                onClick={editingTask ? handleUpdateTask : handleAddTask}
                className="bg-green-500 text-black px-4 py-2 rounded"
              >
                {editingTask ? "Mettre à jour la tâche" : "Ajouter la tâche"}
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Formulaire d'ajout de compétence */}
        {showSkillForm && (
          <div className="bg-white p-6 rounded shadow mt-6">
            <h2 className="text-xl font-bold text-black mb-4">Ajouter une compétence</h2>
            <input
              type="text"
              placeholder="Nom de la compétence"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="border p-2 w-full mb-4 text-black"
            />
            <input
              type="text"
              placeholder="Description"
              value={newSkill.description}
              onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              className="border p-2 w-full mb-4 text-black"
            />
            <input
              type="text"
              placeholder="Difficulté"
              value={newSkill.difficulty}
              onChange={(e) => setNewSkill({ ...newSkill, difficulty: e.target.value })}
              className="border p-2 w-full mb-4 text-black"
            />
            <div className="flex justify-between">
              <button
                onClick={handleAddSkill}
                className="bg-green-500 text-black px-4 py-2 rounded"
              >
                Ajouter la compétence
              </button>
              <button
                onClick={() => setShowSkillForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}