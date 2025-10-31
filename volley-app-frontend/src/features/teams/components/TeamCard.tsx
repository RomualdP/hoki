'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components';
import { formatDate, getTeamRoleText } from '../../../shared/utils';
import type { Team } from '../../../shared/types';

interface TeamCardProps {
  readonly team: Team;
  readonly onSelect?: (team: Team) => void;
}

export const TeamCard = ({ team, onSelect }: TeamCardProps) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(team);
    }
  };

  const membersCount = team.members.length;
  const captains = team.members.filter(member => member.role === 'CAPTAIN');
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        onSelect ? 'hover:shadow-lg hover:scale-105' : ''
      }`}
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-center space-x-4">
          {team.logo ? (
            <Image
              src={team.logo}
              alt={`Logo de ${team.name}`}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">
                {team.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1">
            <CardTitle level={3} className="text-xl">
              {team.name}
            </CardTitle>
            {team.foundedYear && (
              <p className="text-sm text-neutral-500">
                Fondée en {team.foundedYear}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {team.description && (
          <p className="text-neutral-600 mb-4">
            {team.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500">Membres:</span>
            <span className="font-medium">{membersCount}</span>
          </div>
          
          {captains.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">Capitaine(s):</span>
              <div className="text-right">
                {captains.map((captain, index) => (
                  <div key={captain.id} className="text-sm font-medium">
                    {captain.user.firstName} {captain.user.lastName}
                    {index < captains.length - 1 && ', '}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500">Créée le:</span>
            <span className="text-sm">{formatDate(team.createdAt)}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex flex-wrap gap-1">
            {team.members.slice(0, 3).map((member) => (
              <span
                key={member.id}
                className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full"
              >
                {getTeamRoleText(member.role)}
              </span>
            ))}
            {membersCount > 3 && (
              <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                +{membersCount - 3} autres
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

TeamCard.displayName = 'TeamCard'; 