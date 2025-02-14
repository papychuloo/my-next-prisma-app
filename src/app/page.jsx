import { Button } from "../components/ui/button";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-blue-500">Skill</span>
          <span className="text-blue-800">Lab</span>
        </h1>
        <h2 className="text-2xl text-gray-600 font-light">
          Développez vos compétences, suivez votre progression
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-medium mb-4">Déjà membre ?</h3>
            <Link href="/login">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300">
                Connexion
              </Button>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-medium mb-4">Nouveau sur SkillLab ?</h3>
            <Link href="/signup">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300">
                Inscription
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
