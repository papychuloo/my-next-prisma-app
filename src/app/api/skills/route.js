import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Récupérer toutes les compétences
export async function GET(req) {
  try {
    const skills = await prisma.skill.findMany();
    return new Response(JSON.stringify(skills), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Erreur lors de la récupération des compétences:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des compétences", details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Ajouter une nouvelle compétence
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, description, difficulty } = body;

    // Vérifier que les champs nécessaires sont présents
    if (!name || !description || !difficulty) {
      return new Response(
        JSON.stringify({ error: "Tous les champs sont requis" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Créer la nouvelle compétence dans la base de données
    const newSkill = await prisma.skill.create({
      data: { name, description, difficulty },
    });

    return new Response(JSON.stringify(newSkill), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la compétence:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de l'ajout de la compétence", details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Modifier une compétence
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID de la compétence requis" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const skillId = parseInt(id, 10);
    const existingSkill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!existingSkill) {
      return new Response(
        JSON.stringify({ error: "Compétence non trouvée" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const updatedSkill = await prisma.skill.update({
      where: { id: skillId },
      data: body,
    });

    return new Response(JSON.stringify(updatedSkill), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la mise à jour de la compétence", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Supprimer une compétence
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "ID de la compétence requis" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const skillId = parseInt(id, 10);
    const existingSkill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!existingSkill) {
      return new Response(
        JSON.stringify({ error: "Compétence non trouvée" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    await prisma.skill.delete({
      where: { id: skillId },
    });

    return new Response(
      JSON.stringify({ message: "Compétence supprimée avec succès" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la suppression de la compétence", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
