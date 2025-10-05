import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initializeUserAttributes() {
  console.log('Starting user attributes initialization...');

  try {
    // Récupérer tous les users
    const users = await prisma.user.findMany({
      select: { id: true, email: true },
    });

    console.log(`Found ${users.length} users`);

    let createdCount = 0;

    for (const user of users) {
      // Vérifier si l'user a déjà des attributs
      const existingAttributes = await prisma.userAttribute.findMany({
        where: { userId: user.id },
      });

      const existingTypes = existingAttributes.map((attr) => attr.attribute);

      // Créer FITNESS si n'existe pas
      if (!existingTypes.includes('FITNESS')) {
        await prisma.userAttribute.create({
          data: {
            userId: user.id,
            attribute: 'FITNESS',
            value: 1.0,
          },
        });
        createdCount++;
        console.log(`✓ Created FITNESS attribute for user ${user.email}`);
      }

      // Créer LEADERSHIP si n'existe pas
      if (!existingTypes.includes('LEADERSHIP')) {
        await prisma.userAttribute.create({
          data: {
            userId: user.id,
            attribute: 'LEADERSHIP',
            value: 1.0,
          },
        });
        createdCount++;
        console.log(`✓ Created LEADERSHIP attribute for user ${user.email}`);
      }
    }

    console.log(
      `\n✅ Initialization complete! Created ${createdCount} attributes.`,
    );
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

initializeUserAttributes();
