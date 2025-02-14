import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Récupérer les tâches
export async function GET(req) {
  const url = new URL(req.url, `http://${req.headers.get("host")}`);
  const skillId = url.searchParams.get("skillId");

  try {
    if (skillId) {
      const tasks = await prisma.task.findMany({
        where: { skillId: parseInt(skillId) },
      });
      return new Response(JSON.stringify(tasks), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    const tasks = await prisma.task.findMany();
    return new Response(JSON.stringify(tasks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des tâches" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Ajouter une tâche
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Corps de la requête reçu:", body);

    const { name, description, notes, skillId } = body;

    // Validation des champs requis
    if (!name || !description || !skillId) {
      return new Response(
        JSON.stringify({
          error: "Les champs nom, description et skillId sont requis",
          received: { name, description, skillId },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Conversion et validation du skillId
    const skillIdNumber = parseInt(skillId);
    if (isNaN(skillIdNumber)) {
      return new Response(
        JSON.stringify({
          error: "skillId doit être un nombre",
          received: skillId,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Vérification de l'existence de la compétence
    const skill = await prisma.skill.findUnique({
      where: { id: skillIdNumber },
    });

    if (!skill) {
      return new Response(
        JSON.stringify({
          error: "La compétence spécifiée n'existe pas",
          skillId: skillIdNumber,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Création de la tâche
    const taskData = {
      name: name.trim(),
      description: description.trim(),
      note: notes ? notes.trim() : "", // Changé de 'notes' à 'note' pour correspondre au schéma
      skillId: skillIdNumber,
    };

    console.log("Données de la tâche à créer:", taskData);

    const newTask = await prisma.task.create({
      data: taskData,
    });

    console.log("Tâche créée avec succès:", newTask);

    return new Response(JSON.stringify(newTask), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
    return new Response(
      JSON.stringify({
        error: "Erreur lors de l'ajout de la tâche",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Modifier une tâche
export async function PUT(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.get("host")}`);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID de la tâche requis" }),
        { status: 400 }
      );
    }

    const taskId = parseInt(id);
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return new Response(
        JSON.stringify({ error: "Tâche non trouvée" }),
        { status: 404 }
      );
    }

    const body = await req.json();
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: body,
    });

    return new Response(JSON.stringify(updatedTask), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la mise à jour de la tâche" }),
      { status: 500 }
    );
  }
}

// Supprimer une tâche
export async function DELETE(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.get("host")}`);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID de la tâche requis" }),
        { status: 400 }
      );
    }

    const taskId = parseInt(id);
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return new Response(
        JSON.stringify({ error: "Tâche non trouvée" }),
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return new Response(JSON.stringify({ message: "Tâche supprimée" }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la suppression de la tâche" }),
      { status: 500 }
    );
  }
}
