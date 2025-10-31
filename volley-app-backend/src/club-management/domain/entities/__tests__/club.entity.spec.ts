import { Club } from '../club.entity';

describe('Club Entity', () => {
  describe('create()', () => {
    it('should successfully create a club with valid data', () => {
      const club = Club.create({
        id: 'club-1',
        name: 'Test Volleyball Club',
        ownerId: 'user-1',
      });

      expect(club.id).toBe('club-1');
      expect(club.name).toBe('Test Volleyball Club');
      expect(club.ownerId).toBe('user-1');
      expect(club.description).toBeNull();
      expect(club.logo).toBeNull();
      expect(club.location).toBeNull();
      expect(club.createdAt).toBeInstanceOf(Date);
      expect(club.updatedAt).toBeInstanceOf(Date);
    });

    it('should create club with optional fields', () => {
      const club = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
        description: 'A great volleyball club',
        logo: 'https://example.com/logo.png',
        location: 'Paris, France',
      });

      expect(club.description).toBe('A great volleyball club');
      expect(club.logo).toBe('https://example.com/logo.png');
      expect(club.location).toBe('Paris, France');
    });

    it('should throw error when name is empty', () => {
      expect(() =>
        Club.create({
          id: 'club-1',
          name: '',
          ownerId: 'user-1',
        }),
      ).toThrow('Club name cannot be empty');
    });

    it('should throw error when name is too long', () => {
      const longName = 'A'.repeat(101);

      expect(() =>
        Club.create({
          id: 'club-1',
          name: longName,
          ownerId: 'user-1',
        }),
      ).toThrow('Club name cannot exceed 100 characters');
    });

    it('should throw error when ownerId is empty', () => {
      expect(() =>
        Club.create({
          id: 'club-1',
          name: 'Test Club',
          ownerId: '',
        }),
      ).toThrow('Club must have an owner');
    });
  });

  describe('reconstitute()', () => {
    it('should reconstitute club from persisted data', () => {
      const createdAt = new Date('2025-01-01');
      const updatedAt = new Date('2025-01-15');

      const club = Club.reconstitute({
        id: 'club-1',
        name: 'Test Club',
        description: 'Description',
        logo: 'logo.png',
        location: 'Paris',
        ownerId: 'user-1',
        createdAt,
        updatedAt,
      });

      expect(club.id).toBe('club-1');
      expect(club.name).toBe('Test Club');
      expect(club.createdAt).toEqual(createdAt);
      expect(club.updatedAt).toEqual(updatedAt);
    });
  });

  describe('update()', () => {
    it('should update club name', () => {
      const club = Club.create({
        id: 'club-1',
        name: 'Old Name',
        ownerId: 'user-1',
      });

      club.update({ name: 'New Name' });

      expect(club.name).toBe('New Name');
    });

    it('should update club description', () => {
      const club = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      club.update({ description: 'New description' });

      expect(club.description).toBe('New description');
    });

    it('should update club logo', () => {
      const club = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      club.update({ logo: 'https://example.com/new-logo.png' });

      expect(club.logo).toBe('https://example.com/new-logo.png');
    });

    it('should update club location', () => {
      const club = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      club.update({ location: 'Lyon, France' });

      expect(club.location).toBe('Lyon, France');
    });

    it('should update multiple fields at once', () => {
      const club = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      club.update({
        name: 'Updated Club',
        description: 'Updated description',
        location: 'Marseille',
      });

      expect(club.name).toBe('Updated Club');
      expect(club.description).toBe('Updated description');
      expect(club.location).toBe('Marseille');
    });

    it('should update updatedAt timestamp when updating', () => {
      const club = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const originalUpdatedAt = club.updatedAt;

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        club.update({ name: 'New Name' });
        expect(club.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      }, 10);
    });

    it('should throw error when updating name to empty string', () => {
      const club = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      expect(() => club.update({ name: '' })).toThrow(
        'Club name cannot be empty',
      );
    });

    it('should throw error when updating name to be too long', () => {
      const club = Club.create({
        id: 'club-1',
        name: 'Test Club',
        ownerId: 'user-1',
      });

      const longName = 'A'.repeat(101);

      expect(() => club.update({ name: longName })).toThrow(
        'Club name cannot exceed 100 characters',
      );
    });
  });

  describe('validateNameUniqueness()', () => {
    it('should not throw when name is unique', () => {
      const existingNames = ['Club A', 'Club B', 'Club C'];

      expect(() =>
        Club.validateNameUniqueness('Club D', existingNames),
      ).not.toThrow();
    });

    it('should throw when name already exists (case sensitive)', () => {
      const existingNames = ['Club A', 'Club B', 'Club C'];

      expect(() =>
        Club.validateNameUniqueness('Club A', existingNames),
      ).toThrow('A club with this name already exists');
    });

    it('should throw when name exists with different casing', () => {
      const existingNames = ['Club A', 'Club B', 'Club C'];

      expect(() =>
        Club.validateNameUniqueness('club a', existingNames),
      ).toThrow('A club with this name already exists');
    });

    it('should trim whitespace before checking uniqueness', () => {
      const existingNames = ['Club A', 'Club B'];

      expect(() =>
        Club.validateNameUniqueness('  Club A  ', existingNames),
      ).toThrow('A club with this name already exists');
    });

    it('should not throw for empty existing names array', () => {
      expect(() => Club.validateNameUniqueness('New Club', [])).not.toThrow();
    });
  });
});
