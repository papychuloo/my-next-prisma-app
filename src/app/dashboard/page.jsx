"use client";
import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
    status: "NOT_STARTED",
    progress: 0
  });
  const [editingTask, setEditingTask] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // Récupérer toutes les tâches
  const fetchAllTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
      setShowAllTasks(true);
      setSelectedSkillId(null);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
    }
  };

  // Obtenir les tâches pour une date spécifique
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  // Mettre à jour le statut et la progression d'une tâche
  const updateTaskProgress = async (taskId, newStatus, newProgress) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          progress: newProgress
        }),
      });

      if (response.ok) {
        setTasks(tasks.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus, progress: newProgress }
            : task
        ));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
    }
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
      setNewTask({ name: "", description: "", notes: "", skillId: "", status: "NOT_STARTED", progress: 0 });
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
        <button
          onClick={() => {
            setShowAllTasks(false);
            setSelectedSkillId(null);
          }}
          className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white mb-4 rounded transition duration-200"
        >
          Compétences
        </button>
        <button
          onClick={fetchAllTasks}
          className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded transition duration-200"
        >
          Toutes les Tâches
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="flex justify-between items-center bg-white p-4 shadow mb-6 rounded">
          <h1 className="text-3xl font-bold text-gray-800">
            {showAllTasks ? "Toutes les Tâches" : "Gestion des Compétences"}
          </h1>
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

        {/* Calendrier et Tâches du jour */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-black">Calendrier</h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="w-full"
              tileContent={({ date }) => {
                const tasksForDate = getTasksForDate(date);
                return tasksForDate.length > 0 ? (
                  <div className="dot bg-blue-500 w-2 h-2 rounded-full mx-auto mt-1"></div>
                ) : null;
              }}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-black">
              Tâches du {selectedDate.toLocaleDateString()}
            </h2>
            <div className="space-y-4">
              {getTasksForDate(selectedDate).map((task) => (
                <div key={task.id} className="border p-4 rounded">
                  <h3 className="font-bold text-black">{task.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Progression: {task.progress}%
                      </label>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Statut:
                      </label>
                      <select
                        value={task.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const newProgress = newStatus === 'COMPLETED' ? 100 : 
                                           newStatus === 'IN_PROGRESS' ? 50 : 0;
                          updateTaskProgress(task.id, newStatus, newProgress);
                        }}
                        className="ml-2 border rounded p-1 text-sm text-black"
                      >
                        <option value="NOT_STARTED">Non commencé</option>
                        <option value="IN_PROGRESS">En cours</option>
                        <option value="COMPLETED">Terminé</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {getTasksForDate(selectedDate).length === 0 && (
                <p className="text-gray-500">Aucune tâche pour cette date</p>
              )}
            </div>
          </div>
        </div>

        {/* Affichage des compétences */}
        {!showAllTasks && (
          <div className="grid grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 border rounded shadow bg-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-black">{skill.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingSkill(skill);
                        setShowSkillForm(true);
                      }}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-black mt-2">{skill.description}</p>
                <p className="text-gray-600 mt-1">Difficulté: {skill.difficulty.toLowerCase()}</p>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setSelectedSkillId(skill.id);
                      fetchTasksForSkill(skill.id);
                      setShowAllTasks(false);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Voir les tâches
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Affichage des tâches */}
        {(selectedSkillId || showAllTasks) && (
          <div className="mt-6 bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">
                {showAllTasks ? "Toutes les tâches" : "Tâches de la compétence"}
              </h2>
              {!showAllTasks && (
                <button
                  onClick={() => {
                    setSelectedSkillId(null);
                    setShowAllTasks(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Retour
                </button>
              )}
            </div>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">
                {editingTask ? "Modifier la tâche" : "Ajouter une tâche"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={editingTask ? editingTask.name : newTask.name}
                    onChange={(e) =>
                      editingTask
                        ? setEditingTask({ ...editingTask, name: e.target.value })
                        : setNewTask({ ...newTask, name: e.target.value })
                    }
                    className="w-full p-2 border rounded text-black"
                    placeholder="Nom de la tâche"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingTask ? editingTask.description : newTask.description}
                    onChange={(e) =>
                      editingTask
                        ? setEditingTask({ ...editingTask, description: e.target.value })
                        : setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="w-full p-2 border rounded text-black"
                    placeholder="Description de la tâche"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={editingTask ? (editingTask.note || "") : (newTask.notes || "")}
                    onChange={(e) =>
                      editingTask
                        ? setEditingTask({ ...editingTask, note: e.target.value })
                        : setNewTask({ ...newTask, notes: e.target.value })
                    }
                    className="w-full p-2 border rounded text-black"
                    placeholder="Notes additionnelles"
                    rows="2"
                  />
                </div>
                {!editingTask && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compétence
                    </label>
                    <select
                      value={newTask.skillId}
                      onChange={(e) =>
                        setNewTask({ ...newTask, skillId: e.target.value })
                      }
                      className="w-full p-2 border rounded text-black"
                    >
                      <option value="">Sélectionnez une compétence</option>
                      {skills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingTask ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire d'ajout/modification de compétence */}
        {showSkillForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">
                {editingSkill ? "Modifier la compétence" : "Ajouter une compétence"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={editingSkill ? editingSkill.name : newSkill.name}
                    onChange={(e) =>
                      editingSkill
                        ? setEditingSkill({ ...editingSkill, name: e.target.value })
                        : setNewSkill({ ...newSkill, name: e.target.value })
                    }
                    className="w-full p-2 border rounded text-black"
                    placeholder="Nom de la compétence"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingSkill ? editingSkill.description : newSkill.description}
                    onChange={(e) =>
                      editingSkill
                        ? setEditingSkill({ ...editingSkill, description: e.target.value })
                        : setNewSkill({ ...newSkill, description: e.target.value })
                    }
                    className="w-full p-2 border rounded text-black"
                    placeholder="Description de la compétence"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulté
                  </label>
                  <select
                    value={editingSkill ? editingSkill.difficulty : newSkill.difficulty}
                    onChange={(e) =>
                      editingSkill
                        ? setEditingSkill({ ...editingSkill, difficulty: e.target.value })
                        : setNewSkill({ ...newSkill, difficulty: e.target.value })
                    }
                    className="w-full p-2 border rounded text-black"
                  >
                    <option value="">Sélectionnez une difficulté</option>
                    <option value="FACILE">Facile</option>
                    <option value="MOYEN">Moyen</option>
                    <option value="DIFFICILE">Difficile</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowSkillForm(false);
                    setEditingSkill(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={editingSkill ? handleUpdateSkill : handleAddSkill}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingSkill ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}