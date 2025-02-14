==================| WELCOME TO SKILL LAB  |=====================
                                                                     
OBJECTIF:
# React + Vite

  L'objectif global de la plateforme est de créer un environnement structuré et motivant pour que les étudiants
  puissent améliorer leurs compétences en développement web tout en suivant leurs progrès de manière efficace et interactive.
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

FONCTIONALITE PRINCIPAL :
Currently, two official plugins are available:

  AUTHENTIFICATION: 
           

  SUIVI DE COMPETENCE:
  
          Les étudiants peuvent ajouter des compétences spécifiques à un tableau de suivi.
          Chaque compétence a un niveau d'avancement : -> Facile
                                                       -> Moyen
                                                       -> Difficile 
           que les étudiants peuvent mettre à jour au fur et à mesure qu'ils progressent.
          
  PLANNIFICATION DES OBJECTIFS D'APPRENTISAGES :

        Les étudiants peuvent définir des objectifs hebdomadaires ou mensuels pour chaque compétence.
        L’application enverra des rappels (simulés par un setTimeout pour le moment) 
        pour encourager les étudiants à suivre leur plan.

  Visualisation des progrès :

        Un tableau de bord front-end où chaque étudiant peut visualiser ses progrès sous forme de graphiques .
        Classement des compétences selon le niveau d’avancement ou les objectifs atteints.

        

Les routes:

POST /skills, GET /skills, PUT /skills/:id, DELETE /skills/:id
Objectifs :

POST /goals, GET /goals, PUT /goals/:id, DELETE /goals/:id

Utilisateurs:
POST /users, POST /users/login, GET /users/ID
![Screenshot 2024-10-09 124210](https://github.com/user-attachments/assets/8552efcb-01df-46b5-8d20-19056f1baf40)


  ==========VOIR WIKI POUR PLUS D'INFORMATION!!!!!!!!!!!!!===========
  lien : ici





This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
