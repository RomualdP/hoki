import {
  PrismaClient,
  ClubRole,
  TeamRole,
  VolleyballSkill,
  AttributeType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seeding...');

  // ============================================
  // CLEAN EXISTING DATA
  // ============================================

  console.log('🧹 Cleaning existing data...');

  await prisma.trainingRegistration.deleteMany();
  await prisma.trainingTeam.deleteMany();
  await prisma.training.deleteMany();
  await prisma.match.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.news.deleteMany();
  await prisma.userAttribute.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.member.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.club.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Database cleaned');

  // ============================================
  // PREPARATION
  // ============================================

  const hashedPassword = await bcrypt.hash('password123', 10);
  const allSkillTypes: VolleyballSkill[] = [
    VolleyballSkill.ATTACK,
    VolleyballSkill.DEFENSE,
    VolleyballSkill.SERVING,
    VolleyballSkill.RECEPTION,
    VolleyballSkill.SETTING,
    VolleyballSkill.BLOCKING,
  ];

  // ============================================
  // CLUB & SUBSCRIPTION
  // ============================================

  console.log('\n🏢 Creating club...');

  const ownerId = faker.string.alphanumeric(26); // Temporary ID, will be updated after user creation

  const club = await prisma.club.create({
    data: {
      name: 'Volley Club Dev',
      description: 'Club de développement pour les tests',
      location: 'Paris, France',
      logo: faker.image.urlLoremFlickr({ category: 'sports' }),
      ownerId,
      subscription: {
        create: {
          planId: 'BETA',
          price: 0,
          maxTeams: null,
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          stripeCustomerId: `cus_${faker.string.alphanumeric(14)}`,
          stripeSubscriptionId: `sub_${faker.string.alphanumeric(14)}`,
        },
      },
    },
  });

  console.log(`✅ Created club: ${club.name}`);

  // ============================================
  // OWNER
  // ============================================

  console.log('\n👤 Creating owner...');

  // Use fixed email for owner to make testing easier
  const ownerFirstName = 'Owner';
  const ownerLastName = 'Test';
  const ownerEmail = 'owner@volley-app.test';

  const owner = await prisma.user.create({
    data: {
      email: ownerEmail,
      firstName: ownerFirstName,
      lastName: ownerLastName,
      avatar: faker.image.avatar(),
      password: hashedPassword,
      role: 'USER',
      clubId: club.id,
      clubRole: ClubRole.OWNER,
      isActive: true,
      profile: {
        create: {
          biography: faker.lorem.paragraph(),
          birthDate: faker.date.birthdate({ min: 25, max: 50, mode: 'age' }),
          gender: faker.helpers.arrayElement(['MALE', 'FEMALE'] as const),
          phoneNumber: faker.phone.number(),
          city: faker.location.city(),
          country: 'France',
          preferredHand: faker.helpers.arrayElement([
            'LEFT',
            'RIGHT',
            'AMBIDEXTROUS',
          ] as const),
        },
      },
    },
  });

  await prisma.club.update({
    where: { id: club.id },
    data: { ownerId: owner.id },
  });

  await prisma.member.create({
    data: {
      userId: owner.id,
      clubId: club.id,
      role: ClubRole.OWNER,
      invitedBy: null,
    },
  });

  console.log(`✅ Created owner: ${owner.email}`);

  // ============================================
  // COACHES (3 coaches)
  // ============================================

  console.log('\n👨‍🏫 Creating 3 coaches...');

  const coaches: any[] = [];

  for (let i = 0; i < 3; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    const coach = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        avatar: faker.image.avatar(),
        password: hashedPassword,
        role: 'USER',
        clubId: club.id,
        clubRole: ClubRole.COACH,
        isActive: true,
        profile: {
          create: {
            biography: faker.lorem.paragraph(),
            birthDate: faker.date.birthdate({ min: 25, max: 50, mode: 'age' }),
            gender: faker.helpers.arrayElement(['MALE', 'FEMALE'] as const),
            phoneNumber: faker.phone.number(),
            city: faker.location.city(),
            country: 'France',
            preferredHand: faker.helpers.arrayElement([
              'LEFT',
              'RIGHT',
              'AMBIDEXTROUS',
            ] as const),
          },
        },
      },
    });

    await prisma.member.create({
      data: {
        userId: coach.id,
        clubId: club.id,
        role: ClubRole.COACH,
        invitedBy: owner.id,
      },
    });

    coaches.push(coach);
    console.log(`✅ Created coach ${i + 1}/3: ${coach.email}`);
  }

  // ============================================
  // PLAYERS (22 players)
  // ============================================

  console.log('\n🏐 Creating 22 players...');

  const players: any[] = [];
  const positions = [
    'SETTER',
    'OUTSIDE_HITTER',
    'MIDDLE_BLOCKER',
    'OPPOSITE',
    'LIBERO',
    'DEFENSIVE_SPECIALIST',
  ] as const;

  for (let i = 0; i < 22; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const gender = faker.helpers.arrayElement(['MALE', 'FEMALE'] as const);
    const birthDate = faker.date.birthdate({ min: 16, max: 35, mode: 'age' });

    const player = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        avatar: faker.image.avatar(),
        password: hashedPassword,
        role: 'USER',
        clubId: club.id,
        clubRole: ClubRole.PLAYER,
        isActive: true,
        profile: {
          create: {
            biography: faker.lorem.paragraph(),
            birthDate,
            gender,
            position: faker.helpers.arrayElement(positions),
            height: faker.number.int({ min: 160, max: 210 }),
            weight: faker.number.int({ min: 60, max: 110 }),
            phoneNumber: faker.phone.number(),
            city: faker.location.city(),
            country: 'France',
            preferredHand: faker.helpers.arrayElement([
              'LEFT',
              'RIGHT',
              'AMBIDEXTROUS',
            ] as const),
          },
        },
        skills: {
          create: allSkillTypes.map((skill) => ({
            skill,
            level: faker.number.int({ min: 3, max: 8 }),
            experienceYears: faker.number.int({ min: 1, max: 20 }),
            assessedAt: faker.date.recent({ days: 30 }),
          })),
        },
        attributes: {
          create: [
            {
              attribute: AttributeType.FITNESS,
              value: faker.number.float({
                min: 0.8,
                max: 1.2,
                fractionDigits: 2,
              }),
              assessedAt: faker.date.recent({ days: 60 }),
            },
            {
              attribute: AttributeType.LEADERSHIP,
              value: faker.number.float({
                min: 0.8,
                max: 1.2,
                fractionDigits: 2,
              }),
              assessedAt: faker.date.recent({ days: 60 }),
            },
          ],
        },
      },
    });

    await prisma.member.create({
      data: {
        userId: player.id,
        clubId: club.id,
        role: ClubRole.PLAYER,
        invitedBy: owner.id,
      },
    });

    players.push(player);
    console.log(`✅ Created player ${i + 1}/22: ${player.email}`);
  }

  // ============================================
  // TEAM
  // ============================================

  console.log('\n🏐 Creating team...');

  const team = await prisma.team.create({
    data: {
      name: 'Équipe Principale',
      description: 'Équipe principale du club',
      clubId: club.id,
      logo: faker.image.urlLoremFlickr({ category: 'sports' }),
      foundedYear: faker.number.int({ min: 2020, max: 2024 }),
    },
  });

  console.log(`✅ Created team: ${team.name}`);

  // ============================================
  // TEAM MEMBERS
  // ============================================

  console.log('\n👥 Assigning players to team...');

  for (const player of players) {
    await prisma.teamMember.create({
      data: {
        userId: player.id,
        teamId: team.id,
        role: TeamRole.PLAYER,
      },
    });
  }

  console.log(`✅ Assigned ${players.length} players to team`);

  // ============================================
  // SUMMARY
  // ============================================

  console.log(`\n✨ Seeding completed successfully!`);
  console.log(`📊 Summary:`);
  console.log(`   - Club: ${club.name}`);
  console.log(`   - Owner: 1 (${owner.email})`);
  console.log(`   - Coaches: ${coaches.length}`);
  console.log(`   - Players: ${players.length}`);
  console.log(`   - Team: ${team.name}`);
  console.log(`\n🔑 You can login with:`);
  console.log(`   Email: ${owner.email}`);
  console.log(`   Password: password123`);
  console.log(`\n📋 All users have the same password: password123`);
}

main()
  .catch((error) => {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  })
  .finally(async (): Promise<void> => {
    await prisma.$disconnect();
  });
