export class TeamSize {
  private static readonly MIN_TEAM_SIZE = 4;
  private static readonly MAX_TEAM_SIZE = 6;

  static get min(): number {
    return this.MIN_TEAM_SIZE;
  }

  static get max(): number {
    return this.MAX_TEAM_SIZE;
  }

  static isValid(size: number): boolean {
    return size >= this.MIN_TEAM_SIZE && size <= this.MAX_TEAM_SIZE;
  }

  static isFull(size: number): boolean {
    return size >= this.MAX_TEAM_SIZE;
  }

  static isEmpty(size: number): boolean {
    return size === 0;
  }

  static canAddMember(currentSize: number): boolean {
    return currentSize < this.MAX_TEAM_SIZE;
  }
}
