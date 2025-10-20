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

  // ============================================
  // CLUBS & SUBSCRIPTIONS
  // ============================================

  console.log('\n🏢 Creating clubs...');

  const clubsData = [
    {
      name: 'Paris Volley Club',
      description: 'Premier club de volleyball de Paris',
      location: 'Paris, France',
      logo: faker.image.urlLoremFlickr({ category: 'sports' }),
      planId: 'PRO',
      ownerId: users[1]?.id, // Coach
    },
    {
      name: 'Lyon Volleyball Association',
      description: 'Association de volleyball de Lyon',
      location: 'Lyon, France',
      logo: faker.image.urlLoremFlickr({ category: 'sports' }),
      planId: 'STARTER',
      ownerId: users[2]?.id, // Coach
    },
    {
      name: 'Marseille Beach Volley',
      description: 'Club de beach volley de Marseille',
      location: 'Marseille, France',
      logo: faker.image.urlLoremFlickr({ category: 'sports' }),
      planId: 'BETA',
      ownerId: users[3]?.id, // Coach (beta tester)
    },
  ];

  const clubs: any[] = [];
  for (const clubData of clubsData) {
    const club = await prisma.club.create({
      data: {
        name: clubData.name,
        description: clubData.description,
        location: clubData.location,
        logo: clubData.logo,
        ownerId: clubData.ownerId,
        subscription: {
          create: {
            planId: clubData.planId as 'BETA' | 'STARTER' | 'PRO',
            price:
              clubData.planId === 'BETA'
                ? 0
                : clubData.planId === 'STARTER'
                  ? 500
                  : 1500,
            maxTeams:
              clubData.planId === 'BETA'
                ? null
                : clubData.planId === 'STARTER'
                  ? 1
                  : 5,
            status: 'ACTIVE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            stripeCustomerId:
              clubData.planId !== 'BETA'
                ? `cus_${faker.string.alphanumeric(14)}`
                : null,
            stripeSubscriptionId:
              clubData.planId !== 'BETA'
                ? `sub_${faker.string.alphanumeric(14)}`
                : null,
          },
        },
      },
      include: {
        subscription: true,
      },
    });

    clubs.push(club);
    console.log(`✅ Created club: ${club.name} (${clubData.planId} plan)`);
  }

  // ============================================
  // MEMBERS (Users in Clubs)
  // ============================================

  console.log('\n👥 Assigning members to clubs...');

  // Club 1 (Paris Volley) - PRO plan (5 teams max)
  // Owner (Coach)
  await prisma.user.update({
    where: { id: users[1].id },
    data: { clubId: clubs[0].id, clubRole: 'COACH' },
  });

  await prisma.member.create({
    data: {
      userId: users[1].id,
      clubId: clubs[0].id,
      role: 'COACH',
      invitedBy: null,
    },
  });

  // Assistant Coach
  await prisma.user.update({
    where: { id: users[4].id },
    data: { clubId: clubs[0].id, clubRole: 'ASSISTANT_COACH' },
  });

  await prisma.member.create({
    data: {
      userId: users[4].id,
      clubId: clubs[0].id,
      role: 'ASSISTANT_COACH',
      invitedBy: users[1].id,
    },
  });

  // Players (8 players)
  for (let i = 5; i <= 12; i++) {
    await prisma.user.update({
      where: { id: users[i].id },
      data: { clubId: clubs[0].id, clubRole: 'PLAYER' },
    });

    await prisma.member.create({
      data: {
        userId: users[i].id,
        clubId: clubs[0].id,
        role: 'PLAYER',
        invitedBy: users[1].id,
      },
    });
  }

  // Club 2 (Lyon Volleyball) - STARTER plan (1 team max)
  // Owner (Coach)
  await prisma.user.update({
    where: { id: users[2].id },
    data: { clubId: clubs[1].id, clubRole: 'COACH' },
  });

  await prisma.member.create({
    data: {
      userId: users[2].id,
      clubId: clubs[1].id,
      role: 'COACH',
      invitedBy: null,
    },
  });

  // Players (5 players)
  for (let i = 13; i <= 17; i++) {
    await prisma.user.update({
      where: { id: users[i].id },
      data: { clubId: clubs[1].id, clubRole: 'PLAYER' },
    });

    await prisma.member.create({
      data: {
        userId: users[i].id,
        clubId: clubs[1].id,
        role: 'PLAYER',
        invitedBy: users[2].id,
      },
    });
  }

  // Club 3 (Marseille Beach Volley) - BETA plan (unlimited)
  // Owner (Coach)
  await prisma.user.update({
    where: { id: users[3].id },
    data: { clubId: clubs[2].id, clubRole: 'COACH' },
  });

  await prisma.member.create({
    data: {
      userId: users[3].id,
      clubId: clubs[2].id,
      role: 'COACH',
      invitedBy: null,
    },
  });

  // Players (6 players)
  for (let i = 18; i <= 23; i++) {
    await prisma.user.update({
      where: { id: users[i].id },
      data: { clubId: clubs[2].id, clubRole: 'PLAYER' },
    });

    await prisma.member.create({
      data: {
        userId: users[i].id,
        clubId: clubs[2].id,
        role: 'PLAYER',
        invitedBy: users[3].id,
      },
    });
  }

  console.log('✅ Members assigned to clubs');

  // ============================================
  // TEAMS (linked to clubs)
  // ============================================

  console.log('\n🏐 Creating teams for clubs...');

  // Paris Volley Club (PRO - 5 teams max) - Create 3 teams
  const parisTeams = [
    {
      name: 'Paris Volley - Seniors Masculins',
      description: 'Équipe senior masculine',
      clubId: clubs[0].id,
    },
    {
      name: 'Paris Volley - Seniors Féminins',
      description: 'Équipe senior féminine',
      clubId: clubs[0].id,
    },
    {
      name: 'Paris Volley - Juniors',
      description: 'Équipe junior mixte',
      clubId: clubs[0].id,
    },
  ];

  for (const teamData of parisTeams) {
    const team = await prisma.team.create({
      data: {
        name: teamData.name,
        description: teamData.description,
        clubId: teamData.clubId,
        logo: faker.image.urlLoremFlickr({ category: 'sports' }),
        foundedYear: faker.number.int({ min: 2010, max: 2024 }),
      },
    });
    console.log(`✅ Created team: ${team.name}`);
  }

  // Lyon Volleyball (STARTER - 1 team max) - Create 1 team
  const lyonTeam = await prisma.team.create({
    data: {
      name: 'Lyon Volleyball - Équipe 1',
      description: 'Équipe principale',
      clubId: clubs[1].id,
      logo: faker.image.urlLoremFlickr({ category: 'sports' }),
      foundedYear: faker.number.int({ min: 2010, max: 2024 }),
    },
  });
  console.log(`✅ Created team: ${lyonTeam.name}`);

  // Marseille Beach Volley (BETA - unlimited) - Create 2 teams
  const marseilleTeams = [
    {
      name: 'Marseille Beach Volley - Pro',
      description: 'Équipe professionnelle',
      clubId: clubs[2].id,
    },
    {
      name: 'Marseille Beach Volley - Loisirs',
      description: 'Équipe loisirs',
      clubId: clubs[2].id,
    },
  ];

  for (const teamData of marseilleTeams) {
    const team = await prisma.team.create({
      data: {
        name: teamData.name,
        description: teamData.description,
        clubId: teamData.clubId,
        logo: faker.image.urlLoremFlickr({ category: 'sports' }),
        foundedYear: faker.number.int({ min: 2010, max: 2024 }),
      },
    });
    console.log(`✅ Created team: ${team.name}`);
  }

  // ============================================
  // INVITATIONS
  // ============================================

  console.log('\n✉️ Creating invitations...');

  // Paris Volley - 2 active invitations
  const parisInvitation1 = await prisma.invitation.create({
    data: {
      token: faker.string.alphanumeric(32),
      clubId: clubs[0].id,
      type: 'PLAYER',
      createdBy: users[1].id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  const parisInvitation2 = await prisma.invitation.create({
    data: {
      token: faker.string.alphanumeric(32),
      clubId: clubs[0].id,
      type: 'ASSISTANT_COACH',
      createdBy: users[1].id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Lyon - 1 active invitation
  const lyonInvitation = await prisma.invitation.create({
    data: {
      token: faker.string.alphanumeric(32),
      clubId: clubs[1].id,
      type: 'PLAYER',
      createdBy: users[2].id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  console.log(`✅ Created ${3} invitations`);

  console.log(`\n✨ Seeding completed successfully!`);
  console.log(`📊 Summary:`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Clubs: ${clubs.length}`);
  console.log(`   - Subscriptions: ${clubs.length}`);
  console.log(`   - Teams: 6`);
  console.log(`   - Invitations: 3`);
  console.log(`\n🔑 You can login with any user using:`);
  console.log(`   Email: ${users[0]?.email}`);
  console.log(`   Password: password123`);
  console.log(`   Role: ADMIN`);
  console.log(`\n🏢 Clubs created:`);
  console.log(`   1. ${clubs[0]?.name} (PRO plan) - Coach: ${users[1]?.email}`);
  console.log(
    `   2. ${clubs[1]?.name} (STARTER plan) - Coach: ${users[2]?.email}`,
  );
  console.log(
    `   3. ${clubs[2]?.name} (BETA plan) - Coach: ${users[3]?.email}`,
  );
}

main()
  .catch((error) => {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  })
  .finally(async (): Promise<void> => {
    await prisma.$disconnect();
  });
