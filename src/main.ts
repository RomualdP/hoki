import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = isProduction
    ? [process.env.FRONTEND_URL ?? 'https://your-frontend.vercel.app']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Swagger API Documentation Configuration
  const config = new DocumentBuilder()
    .setTitle('Volleyball Team Management API')
    .setDescription(
      "API REST pour la gestion d'équipes de volleyball - Gestion des clubs, abonnements, invitations, entraînements, matchs et statistiques",
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentification et gestion des utilisateurs')
    .addTag('clubs', 'Gestion des clubs')
    .addTag('subscriptions', 'Gestion des abonnements')
    .addTag('invitations', "Système d'invitations")
    .addTag('trainings', 'Gestion des entraînements')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for later use
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep JWT token in browser storage
    },
  });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`🚀 Backend démarré sur http://localhost:${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
  console.log(`📚 API Documentation (Swagger): http://localhost:${port}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 CORS origins: ${allowedOrigins.join(', ')}`);
}
void bootstrap();
