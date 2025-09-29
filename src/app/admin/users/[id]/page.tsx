'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Layout } from '../../../../components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../../../components/ui';
import { Input } from '../../../../components/forms';
import { Select } from '../../../../components/forms/Select';
import { SkillLevelCard } from '../../../../components/skills';
import { useUsersStore } from '../../../../store';
import { useUserSkillsApi } from '../../../../features/users/hooks/useUserSkillsApi';
import { useUsersApi } from '../../../../features/users/hooks/useUsersApi';
import { useUserProfileApi } from '../../../../features/users/hooks/useUserProfileApi';
import Link from 'next/link';
import type { Gender, User, UserProfile, UserSkillCreateData, UserSkillUpdateData, VolleyballSkill } from '../../../../types';
import { SKILL_RATING_OPTIONS } from '../../../../constants/skills';
import { getAllSkillDefinitions } from '../../../../constants/volleyball-skills';


export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const { users } = useUsersStore();
  const skillDefinitions = getAllSkillDefinitions();
  const { fetchUserById } = useUsersApi();
  const { fetchUserProfile, updateUserProfile } = useUserProfileApi();
  const {
    getUserSkills,
    fetchUserSkills,
    addUserSkill,
    updateUserSkill,
    deleteUserSkill,
    isLoading: isLoadingSkills,
    error: skillsError,
    clearError,
  } = useUserSkillsApi();
  
  const [user, setUser] = useState<User & { profile: UserProfile } | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<VolleyballSkill | null>(null);
  
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '' as '' | Gender,
  });

  const userSkills = getUserSkills(userId);


  // Load user data when userId changes
   
  useEffect(() => {
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser as User & { profile: UserProfile });
      setProfileForm({
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        gender: '' as '' | Gender,
      });
      fetchUserProfile(foundUser.id).then((profile) => {
        if (profile) setProfileForm(prev => ({ ...prev, gender: (profile.gender ?? '') as '' | Gender }));
      }).catch(() => undefined);
    } else if (userId) {
      // If user not found in store, fetch from API
      fetchUserById(userId).then((fetchedUser) => {
        if (fetchedUser) {
          setUser(fetchedUser as User & { profile: UserProfile });
          setProfileForm({
            firstName: fetchedUser.firstName,
            lastName: fetchedUser.lastName,
            email: fetchedUser.email,
            gender: '' as '' | Gender,
          });
          fetchUserProfile(fetchedUser.id).then((profile) => {
            if (profile) setProfileForm(prev => ({ ...prev, gender: (profile.gender ?? '') as '' | Gender }));
          }).catch(() => undefined);
        }
      }).catch(error => {
        console.error('Failed to fetch user:', error);
      });
    }
  }, [userId]);

  // Load user skills when userId changes
  useEffect(() => {
    fetchUserSkills(userId).catch(error => {
      console.error('Failed to fetch user skills:', error);
    });
  }, [userId, fetchUserSkills]);  

  const handleProfileSubmit = async () => {
    if (!user) return;
    await updateUserProfile(user.id, {
      gender: profileForm.gender || undefined,
    });
    setIsEditingProfile(false);
  };

  const handleSkillLevelChange = async (skill: VolleyballSkill, newLevel: number) => {
    const existingUserSkill = userSkills.find(us => us.skill === skill);

    try {
      if (existingUserSkill) {
        // Update existing skill
        if (newLevel === 0) {
          // Remove skill if level is set to 0
          await deleteUserSkill(userId, existingUserSkill.id);
        } else {
          // Update skill level
          const updateData: UserSkillUpdateData = {
            level: newLevel,
          };
          await updateUserSkill(userId, existingUserSkill.id, updateData);
        }
      } else if (newLevel > 0) {
        // Add new skill
        const createData: UserSkillCreateData = {
          skill: skill,
          level: newLevel,
        };
        await addUserSkill(userId, createData);
      }

      // Refresh user skills to ensure UI is in sync - force refresh to bypass cache
      await fetchUserSkills(userId);
    } catch (error) {
      console.error('Error updating skill:', error);
    }

    setEditingSkillId(null);
  };

  const getUserSkillLevel = (skill: VolleyballSkill): number => {
    const userSkill = userSkills.find(us => us.skill === skill);
    return userSkill ? userSkill.level : 0;
  };

  const getRatingLabel = (rating: number): string => {
    const option = SKILL_RATING_OPTIONS.find(opt => opt.value === rating.toString());
    return option?.label || `${rating}/10`;
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 9) return 'bg-green-100 text-green-800';
    if (rating >= 7) return 'bg-orange-100 text-orange-800';
    if (rating >= 5) return 'bg-blue-100 text-blue-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  
  // Show loading state
  if (isLoadingSkills) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">Chargement des compétences...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Show error state only for critical errors, but continue with empty skills for non-critical ones
  if (skillsError && skillsError.includes('UNAUTHORIZED')) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-xl font-bold text-red-600 mb-4">Accès non autorisé</h2>
              <p className="text-red-500 mb-4">
                Vous devez être connecté pour accéder à cette page.
              </p>
              <Button 
                onClick={() => window.location.href = '/auth/login'}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">Utilisateur non trouvé</p>
              <Link href="/admin/users">
                <Button variant="outline" className="mt-4">
                  Retour à la liste
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-heading">
                    Détail utilisateur
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Gestion du profil et des compétences
                  </p>
                </div>
                <Link href="/admin/users">
                  <Button variant="outline">
                    Retour à la liste
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Profile Section */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Profil utilisateur</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                      >
                        {isEditingProfile ? 'Annuler' : 'Modifier'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* User Avatar */}
                    <div className="text-center mb-6">
                      <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-orange-800">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.profile?.gender}</p>
                    </div>

                    {isEditingProfile ? (
                      <ProfileEditForm
                        form={profileForm}
                        onChange={setProfileForm}
                        onSubmit={handleProfileSubmit}
                        onCancel={() => setIsEditingProfile(false)}
                      />
                    ) : (
                      <UserInfoDisplay user={user as User} />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Skills Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Évaluation des compétences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Error message */}
                    {skillsError && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{skillsError}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearError}
                          className="mt-2 text-red-600 hover:text-red-700"
                        >
                          Fermer
                        </Button>
                      </div>
                    )}

                    {/* Skills by Category */}
                    {isLoadingSkills ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Chargement des compétences...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {skillDefinitions.map((skillDef) => (
                          <SkillLevelCard
                            key={skillDef.skill}
                            skill={skillDef.skill}
                            currentLevel={getUserSkillLevel(skillDef.skill)}
                            isEditing={editingSkillId === skillDef.skill}
                            onEdit={() => setEditingSkillId(skillDef.skill)}
                            onCancel={() => setEditingSkillId(null)}
                            onLevelChange={(level) => handleSkillLevelChange(skillDef.skill, level)}
                            getRatingLabel={getRatingLabel}
                            getRatingColor={getRatingColor}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}

// Smart component for profile editing
interface ProfileFormData {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly gender: '' | Gender;
}

interface ProfileEditFormProps {
  readonly form: ProfileFormData;
  readonly onChange: (form: ProfileFormData) => void;
  readonly onSubmit: () => void;
  readonly onCancel: () => void;
}

function ProfileEditForm({ form, onChange, onSubmit, onCancel }: ProfileEditFormProps) {
  return (
    <div className="space-y-4">
      <Input
        id="firstName"
        name="firstName"
        type="text"
        label="Prénom"
        value={form.firstName}
        onChange={(e) => onChange({ ...form, firstName: e.target.value })}
        required
      />
      
      <Input
        id="lastName"
        name="lastName"
        type="text"
        label="Nom"
        value={form.lastName}
        onChange={(e) => onChange({ ...form, lastName: e.target.value })}
        required
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        value={form.email}
        onChange={(e) => onChange({ ...form, email: e.target.value })}
        required
      />

      <Select
        id="gender"
        name="gender"
        label="Genre"
        value={form.gender || ''}
        onChange={(e) => onChange({ ...form, gender: (e.target.value || '') as '' | Gender })}
        options={[
          { value: 'MALE', label: 'Homme' },
          { value: 'FEMALE', label: 'Femme' },
        ]}
        placeholder="Sélectionner..."
      />

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={onSubmit}>
          Sauvegarder
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
}

// Dumb component for user info display
interface UserInfoDisplayProps {
  readonly user: User;
}

function UserInfoDisplay({ user }: UserInfoDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">{user.email}</div>
    </div>
  );
}
