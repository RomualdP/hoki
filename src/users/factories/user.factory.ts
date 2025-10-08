import { faker } from '@faker-js/faker';
import { CreateUserDto, UpdateProfileDto } from '../dto';

const DEFAULT_PASSWORD_LENGTH = 12;
const ROLES: ReadonlyArray<'USER' | 'ADMIN'> = ['USER', 'ADMIN'];
const GENDERS: ReadonlyArray<'MALE' | 'FEMALE'> = ['MALE', 'FEMALE'];
const POSITIONS: ReadonlyArray<
  | 'SETTER'
  | 'OUTSIDE_HITTER'
  | 'MIDDLE_BLOCKER'
  | 'OPPOSITE'
  | 'LIBERO'
  | 'DEFENSIVE_SPECIALIST'
> = [
  'SETTER',
  'OUTSIDE_HITTER',
  'MIDDLE_BLOCKER',
  'OPPOSITE',
  'LIBERO',
  'DEFENSIVE_SPECIALIST',
] as const;
const PREFERRED_HANDS: ReadonlyArray<'LEFT' | 'RIGHT' | 'AMBIDEXTROUS'> = [
  'LEFT',
  'RIGHT',
  'AMBIDEXTROUS',
] as const;

export function createMockUserCreateDto(): CreateUserDto {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();
  const password = faker.internet.password({ length: DEFAULT_PASSWORD_LENGTH });
  const role = faker.helpers.arrayElement(ROLES);
  const avatar = faker.helpers.maybe(() => faker.image.avatarGitHub(), {
    probability: 0.6,
  });

  return { email, firstName, lastName, password, role, avatar };
}

export function createMockUpdateProfileDto(): UpdateProfileDto {
  const birthDate = faker.date.birthdate({ min: 16, max: 60, mode: 'age' });
  const gender = faker.helpers.arrayElement(GENDERS);
  const position = faker.helpers.arrayElement(POSITIONS);
  const height = faker.number.int({ min: 155, max: 210 });
  const weight = faker.number.int({ min: 50, max: 120 });
  const preferredHand = faker.helpers.arrayElement(PREFERRED_HANDS);
  const phoneNumber = faker.phone.number();
  const city = faker.location.city();
  const country = faker.location.country();
  const biography = faker.lorem.sentence();

  return {
    biography,
    birthDate,
    gender,
    position,
    height,
    weight,
    phoneNumber,
    city,
    country,
    preferredHand,
  };
}
