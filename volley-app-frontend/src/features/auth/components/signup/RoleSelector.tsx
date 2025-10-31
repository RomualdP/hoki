/**
 * RoleSelector Component (Dumb)
 *
 * Affiche les 3 choix de rôle pour l'inscription
 * Design mobile-first avec cartes touch-friendly
 */

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
} from "../../../../components/ui";
import { ROUTES } from "../../../../constants";

interface RoleOption {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly href: string;
  readonly highlight?: boolean;
}

const roleOptions: RoleOption[] = [
  {
    title: "Propriétaire",
    description: "Créez votre club et gérez vos équipes",
    icon: "👨‍🏫",
    href: ROUTES.SIGNUP.COACH,
    highlight: true,
  },
  {
    title: "Joueur",
    description: "Rejoignez un club via une invitation",
    icon: "🏐",
    href: ROUTES.SIGNUP.PLAYER,
  },
  {
    title: "Coach",
    description: "Aidez à gérer un club via une invitation",
    icon: "🤝",
    href: ROUTES.SIGNUP.ASSISTANT,
  },
];

export function RoleSelector() {
  return (
    <div className="flex flex-col space-y-4">
      {roleOptions.map((option) => (
        <Link key={option.title} href={option.href}>
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
              option.highlight
                ? "border-2 border-orange-500 bg-orange-50/50"
                : "hover:border-gray-300"
            }`}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{option.icon}</div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
