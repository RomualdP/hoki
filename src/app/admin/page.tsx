'use client';

import { Layout } from '../../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui';
import { ROUTES } from '../../constants';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 font-heading">
                Administration
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez les utilisateurs, les actualités et les paramètres de l&apos;application
              </p>
            </div>

            {/* Admin Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Users Management */}
              <AdminCard
                title="Gestion des utilisateurs"
                description="Rechercher, modifier et gérer les comptes utilisateurs"
                icon="👥"
                href={ROUTES.ADMIN.USERS}
                actions={[
                  { label: 'Rechercher des utilisateurs', primary: true },
                  { label: 'Voir tous les utilisateurs', primary: false },
                ]}
              />

              {/* News Management */}
              <AdminCard
                title="Gestion des actualités"
                description="Créer, modifier et publier des actualités"
                icon="📰"
                href={ROUTES.ADMIN.NEWS}
                actions={[
                  { label: 'Ajouter une actualité', primary: true },
                  { label: 'Modifier les actualités', primary: false },
                ]}
              />

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📊</div>
                    <CardTitle>Statistiques rapides</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StatsItem label="Utilisateurs actifs" value="42" />
                  <StatsItem label="Actualités publiées" value="15" />
                  <StatsItem label="Matchs programmés" value="8" />
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Recent Activity */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Activité récente
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <ActivityItem
                      type="user"
                      description="Nouvel utilisateur inscrit: Jean Dupont"
                      time="Il y a 2 heures"
                    />
                    <ActivityItem
                      type="news"
                      description="Actualité publiée: Nouveau tournoi d'été 2024"
                      time="Il y a 5 heures"
                    />
                    <ActivityItem
                      type="match"
                      description="Match créé: Les Smashs vs Les Aces"
                      time="Il y a 1 jour"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

interface AdminCardProps {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly href: string;
  readonly actions: readonly AdminAction[];
}

interface AdminAction {
  readonly label: string;
  readonly primary: boolean;
}

function AdminCard({ title, description, icon, href, actions }: AdminCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{icon}</div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">
          {description}
        </p>
        <div className="flex flex-col space-y-2">
          {actions.map((action, index) => (
            <Link key={index} href={href}>
              <Button 
                variant={action.primary ? 'primary' : 'outline'} 
                size="sm" 
                className="w-full"
              >
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsItemProps {
  readonly label: string;
  readonly value: string;
}

function StatsItem({ label, value }: StatsItemProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

interface ActivityItemProps {
  readonly type: 'user' | 'news' | 'match';
  readonly description: string;
  readonly time: string;
}

function ActivityItem({ type, description, time }: ActivityItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'user': return '👤';
      case 'news': return '📰';
      case 'match': return '🏐';
      default: return '📋';
    }
  };

  return (
    <div className="flex items-start space-x-3 pb-2 border-b border-gray-100 last:border-b-0 last:pb-0">
      <div className="text-lg">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
} 