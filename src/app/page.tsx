import { redirect } from "next/navigation";
import { ROUTES } from "../constants";

/**
 * Page d'accueil
 *
 * Redirige automatiquement vers /login
 * La protection est assurée par le middleware qui vérifie l'authentification
 */
export default function HomePage() {
  redirect(ROUTES.LOGIN);
}
