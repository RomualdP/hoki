/**
 * ClubTransferService - Domain Service
 *
 * Domain service for managing player transfers between clubs.
 * This service encapsulates the complex business logic involved
 * when a player changes clubs.
 *
 * Why a Domain Service?
 * - Involves coordination between multiple entities (Member, Club)
 * - Complex business rules (leaving old club, joining new club)
 * - Cross-aggregate operations that need domain logic
 */

import { Member } from '../entities/member.entity';
import { Injectable } from '@nestjs/common';

export interface TransferPlayerParams {
  currentMember: Member;
  newClubId: string;
  newMemberId: string;
}

export interface TransferValidationResult {
  canTransfer: boolean;
  reason?: string;
  warnings?: string[];
}

@Injectable()
export class ClubTransferService {
  /**
   * Validate if a player can transfer to a new club
   *
   * @param currentMember - Player's current membership
   * @param newClubId - ID of the club to transfer to
   * @returns Validation result with reason if transfer is not allowed
   */
  validateTransfer(
    currentMember: Member,
    newClubId: string,
  ): TransferValidationResult {
    const warnings: string[] = [];

    // Cannot transfer to the same club
    if (currentMember.clubId === newClubId) {
      return {
        canTransfer: false,
        reason: 'Player is already a member of this club',
      };
    }

    // Only active members can transfer
    if (!currentMember.isActive()) {
      return {
        canTransfer: false,
        reason: 'Only active members can transfer to another club',
      };
    }

    // Only PLAYERS can transfer (coaches and assistants cannot)
    if (!currentMember.isPlayer()) {
      return {
        canTransfer: false,
        reason:
          'Only players can transfer between clubs. Coaches and assistants must leave their current club first.',
      };
    }

    // Add warning about team memberships
    warnings.push('Player will be removed from all teams in the current club');

    // Add warning about statistics
    warnings.push(
      'Player statistics will remain associated with the previous club',
    );

    return {
      canTransfer: true,
      warnings,
    };
  }

  /**
   * Execute the transfer process
   * This method coordinates the domain logic, but the actual
   * persistence will be handled by command handlers
   *
   * @param params - Transfer parameters
   * @returns Updated member entity for the old club
   */
  executeTransfer(params: TransferPlayerParams): Member {
    const { currentMember, newClubId } = params;

    // Validate transfer
    const validation = this.validateTransfer(currentMember, newClubId);
    if (!validation.canTransfer) {
      throw new Error(validation.reason);
    }

    // Mark current membership as inactive (player left the club)
    currentMember.markAsLeft();

    return currentMember;
  }

  /**
   * Check if player has a transfer history
   * (i.e., has been member of multiple clubs)
   */
  hasTransferHistory(memberships: Member[]): boolean {
    // Count distinct clubs (excluding current)
    const distinctClubs = new Set(memberships.map((m) => m.clubId));

    return distinctClubs.size > 1;
  }

  /**
   * Get transfer count for a player
   */
  getTransferCount(memberships: Member[]): number {
    // Count how many times player has left a club
    return memberships.filter((m) => !m.isActive()).length;
  }

  /**
   * Get warning message for club change
   */
  getTransferWarningMessage(currentClubName: string): string {
    return `
      You are about to leave ${currentClubName}.

      Important:
      - You will be removed from all teams in ${currentClubName}
      - Your statistics will remain associated with ${currentClubName}
      - You cannot undo this action

      Are you sure you want to proceed?
    `.trim();
  }

  /**
   * Validate transfer eligibility period
   * (This could be extended to include transfer windows, etc.)
   */
  isTransferEligible(currentMember: Member): boolean {
    // For now, all active players are eligible
    // This could be extended with business rules like:
    // - Minimum membership duration before transfer
    // - Transfer windows (specific periods when transfers are allowed)
    // - Contract obligations, etc.

    return currentMember.isActive();
  }

  /**
   * Calculate days until transfer eligibility
   * (Example: player must be member for at least 30 days before transferring)
   */
  getDaysUntilTransferEligible(
    currentMember: Member,
    minimumDays = 30,
  ): number | null {
    if (!currentMember.isActive()) {
      return null; // Inactive members cannot transfer
    }

    const tenureDays = currentMember.getTenureDays();

    if (tenureDays >= minimumDays) {
      return 0; // Already eligible
    }

    return minimumDays - tenureDays;
  }
}
