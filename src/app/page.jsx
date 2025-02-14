import { Button } from "../components/ui/button";
import Link from 'next/link';


export default function Home() {
  return (
    <>
      <div className="container">
        <h1 className="title">
          <span className="lightBlue">Skill</span>
          <span className="darkBlue">Lab</span>
        </h1>
      </div>

      <div className="container">
        <h2 className="greetings">
          Bienvenue
        </h2>
      </div>

      <div className="container">
        <div>
          <p className="phrases">Content de te revoir !!!</p>
          <Link href="/login">
            <Button className="button">Connexion</Button>
          </Link>
        </div>

        <hr className="ligne" />

        <div>
          <p className="phrases">C'est ta première fois ? <br /> Inscris-toi !</p>
          <Link href="/signup">
            <Button className="button">Inscription</Button>
          </Link>
        </div>
      </div>


    </>
  );
}
