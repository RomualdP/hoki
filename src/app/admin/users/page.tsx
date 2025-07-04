'use client';

import { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../../components/ui';
import { Input } from '../../../components/forms';
import { useUsersApi } from '../../../features/users/hooks/useUsersApi';
import { formatDate } from '../../../utils';
import Link from 'next/link';
import type { User } from '../../../types';

export default function AdminUsersPage() {
  const { users, fetchUsers, updateUser, isLoading } = useUsersApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Filter users based on search term
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const email = user.email.toLowerCase();
        const search = searchTerm.toLowerCase();
        
        return fullName.includes(search) || email.includes(search);
      });
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      await updateUser(userId, { isActive: !user.isActive });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-heading">
                    Gestion des utilisateurs
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Recherchez et gérez les comptes utilisateurs
                  </p>
                </div>
                <Link href="/admin">
                  <Button variant="outline">
                    Retour à l&apos;admin
                  </Button>
                </Link>
              </div>
            </div>

            {/* Search Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Rechercher des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      id="search-users"
                      name="search"
                      type="text"
                      label="Recherche"
                      placeholder="Rechercher par nom ou email..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Effacer
                  </Button>
                </div>
                {searchTerm && (
                  <p className="text-sm text-gray-600 mt-2">
                    {filteredUsers.length} résultat(s) trouvé(s) pour &quot;{searchTerm}&quot;
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Utilisateurs ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Chargement des utilisateurs...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilisateur
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rôle
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dernière connexion
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <UserRow 
                            key={user.id} 
                            user={user} 
                            onToggleStatus={() => toggleUserStatus(user.id)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </Layout>
  );
}

interface UserRowProps {
  readonly user: User;
  readonly onToggleStatus: () => void;
}

function UserRow({ user, onToggleStatus }: UserRowProps) {
  const getRoleBadge = (role: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (role) {
      case 'ADMIN':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'USER':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    return isActive
      ? `${baseClasses} bg-green-100 text-green-800`
      : `${baseClasses} bg-gray-100 text-gray-800`;
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-sm font-medium text-orange-800">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">
              Inscrit le {formatDate(user.createdAt)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={getRoleBadge(user.role)}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={getStatusBadge(user.isActive)}>
          {user.isActive ? 'Actif' : 'Inactif'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Jamais'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleStatus}
        >
          {user.isActive ? 'Désactiver' : 'Activer'}
        </Button>
        <Link href={`/admin/users/${user.id}`}>
          <Button
            variant="ghost"
            size="sm"
          >
            Voir détail
          </Button>
        </Link>
      </td>
    </tr>
  );
} 