import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seeding...');

  // Clean existing data (optional - uncomment if you want to reset the database)
  // await prisma.trainingRegistration.deleteMany();
  // await prisma.trainingTeam.deleteMany();
  // await prisma.training.deleteMany();
  // await prisma.userAttribute.deleteMany();
  // await prisma.userSkill.deleteMany();
  // await prisma.userProfile.deleteMany();
  // await prisma.teamMember.deleteMany();
  // await prisma.team.deleteMany();
  // await prisma.match.deleteMany();
  // await prisma.news.deleteMany();
  // await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);
  const users: User[] = [];

  console.log('👥 Creating 30 users...');

  // Create 30 users with complete profiles
  for (let i = 0; i < 30; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const gender = faker.helpers.arrayElement(['MALE', 'FEMALE'] as const);
    const birthDate = faker.date.birthdate({ min: 18, max: 45, mode: 'age' });

    try {
      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          avatar: faker.image.avatar(),
          password: hashedPassword,
          role: i === 0 ? 'ADMIN' : 'USER', // First user is admin
          isActive: true,
          lastLoginAt: faker.date.recent({ days: 30 }),
          profile: {
            create: {
              biography: faker.lorem.paragraph(),
              birthDate,
              gender,
              position: faker.helpers.arrayElement([
                'SETTER',
                'OUTSIDE_HITTER',
                'MIDDLE_BLOCKER',
                'OPPOSITE',
                'LIBERO',
                'DEFENSIVE_SPECIALIST',
              ]),
              height: faker.number.int({ min: 160, max: 210 }),
              weight: faker.number.int({ min: 60, max: 110 }),
              phoneNumber: faker.phone.number(),
              city: faker.location.city(),
              country: 'France',
              preferredHand: faker.helpers.arrayElement([
                'LEFT',
                'RIGHT',
                'AMBIDEXTROUS',
              ]),
            },
          },
          skills: {
            create: [
              {
                skill: 'ATTACK',
                level: faker.number.int({ min: 1, max: 10 }),
                experienceYears: faker.number.int({ min: 1, max: 20 }),
              },
              {
                skill: 'DEFENSE',
                level: faker.number.int({ min: 1, max: 10 }),
                experienceYears: faker.number.int({ min: 1, max: 20 }),
              },
              {
                skill: 'SERVING',
                level: faker.number.int({ min: 1, max: 10 }),
                experienceYears: faker.number.int({ min: 1, max: 20 }),
              },
              {
                skill: 'RECEPTION',
                level: faker.number.int({ min: 1, max: 10 }),
                experienceYears: faker.number.int({ min: 1, max: 20 }),
              },
              {
                skill: 'SETTING',
                level: faker.number.int({ min: 1, max: 10 }),
                experienceYears: faker.number.int({ min: 1, max: 20 }),
              },
              {
                skill: 'BLOCKING',
                level: faker.number.int({ min: 1, max: 10 }),
                experienceYears: faker.number.int({ min: 1, max: 20 }),
              },
            ],
          },
          attributes: {
            create: [
              {
                attribute: 'FITNESS',
                value: faker.number.float({
                  min: 0,
                  max: 2,
                  fractionDigits: 1,
                }),
                assessedAt: faker.date.recent({ days: 60 }),
              },
              {
                attribute: 'LEADERSHIP',
                value: faker.number.float({
                  min: 0,
                  max: 2,
                  fractionDigits: 1,
                }),
                assessedAt: faker.date.recent({ days: 60 }),
              },
            ],
          },
        },
      });

      users.push(user);
      console.log(`✅ Created user ${i + 1}/30: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error creating user ${i + 1}:`, error);
    }
  }

  console.log(`\n✨ Seeding completed successfully!`);
  console.log(`📊 Created ${users.length} users`);
  console.log(`\n🔑 You can login with any user using:`);
  console.log(`   Email: ${users[0]?.email}`);
  console.log(`   Password: password123`);
  console.log(`   Role: ADMIN`);
}

main()
  .catch((error) => {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  })
  .finally(async (): Promise<void> => {
    await prisma.$disconnect();
  });
