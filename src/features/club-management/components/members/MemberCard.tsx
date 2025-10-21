/**
 * MemberCard Component (Dumb)
 *
 * Displays a single member card with actions
 * Mobile-first design with touch-friendly buttons
 */

import { Button } from "../../../../components/ui";
import type { Member } from "../../types";

export interface MemberCardProps {
  readonly member: Member;
  readonly onRemove?: (userId: string) => void;
  readonly isRemoving?: boolean;
  readonly showActions?: boolean;
}

export function MemberCard({
  member,
  onRemove,
  isRemoving = false,
  showActions = true,
}: MemberCardProps) {
  const getRoleBadge = () => {
    const roleColors = {
      COACH: "bg-purple-100 text-purple-800",
      ASSISTANT_COACH: "bg-blue-100 text-blue-800",
      PLAYER: "bg-green-100 text-green-800",
    };

    const roleLabels = {
      COACH: "Entraîneur",
      ASSISTANT_COACH: "Assistant",
      PLAYER: "Joueur",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[member.role]}`}
      >
        {roleLabels[member.role]}
      </span>
    );
  };

  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      {/* Avatar */}
      <div className="shrink-0">
        {member.profilePictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.profilePictureUrl}
            alt={`${member.firstName} ${member.lastName}`}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-800">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {member.firstName} {member.lastName}
          </h4>
          {getRoleBadge()}
        </div>
        <p className="text-xs text-gray-500 truncate">{member.email}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span>
            Rejoint le {new Date(member.joinedAt).toLocaleDateString("fr-FR")}
          </span>
          {member.teamCount > 0 && (
            <span>
              {member.teamCount} équipe{member.teamCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && member.canBeRemoved && onRemove && (
        <div className="shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(member.userId)}
            disabled={isRemoving}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[44px] min-w-[44px]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}
