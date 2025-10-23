import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';
import { ROUTES } from '../constants';

interface LayoutProps {
  readonly children: ReactNode;
  readonly showNavigation?: boolean;
}

export const Layout = ({ children, showNavigation = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {showNavigation && <Navigation />}
      <main className={showNavigation ? 'pt-16' : ''}>
        {children}
      </main>
    </div>
  );
};

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href={ROUTES.HOME}
              className="flex items-center space-x-2"
            >
              <Image
                src="/images/logo_volley_app.png"
                alt="VolleyApp Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-orange-600 font-heading">
                VolleyApp
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavigationLink href={ROUTES.DASHBOARD}>
                Tableau de bord
              </NavigationLink>
              <NavigationLink href={ROUTES.TEAMS}>
                Équipes
              </NavigationLink>
              <NavigationLink href={ROUTES.MATCHES}>
                Matchs
              </NavigationLink>
              <NavigationLink href={ROUTES.TOURNAMENTS}>
                Tournois
              </NavigationLink>
              <NavigationLink href={ROUTES.PLAYERS}>
                Joueurs
              </NavigationLink>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <NavigationLink href={ROUTES.PROFILE}>
                Profil
              </NavigationLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="bg-neutral-100 inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavigationLinkProps {
  readonly href: string;
  readonly children: ReactNode;
}

const NavigationLink = ({ href, children }: NavigationLinkProps) => {
  return (
    <Link
      href={href}
      className="text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
    >
      {children}
    </Link>
  );
};



Layout.displayName = 'Layout'; 