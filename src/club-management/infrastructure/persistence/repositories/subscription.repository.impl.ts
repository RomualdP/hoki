/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import type { Subscription as PrismaSubscription } from '@prisma/client';
import { ISubscriptionRepository } from '../../../domain/repositories/subscription.repository';
import { Subscription } from '../../../domain/entities/subscription.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import { SubscriptionMapper } from '../mappers/subscription.mapper';

/**
 * Prisma implementation of ISubscriptionRepository
 * Handles persistence of Subscription aggregates
 */
@Injectable()
export class SubscriptionRepositoryImpl implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(subscription: Subscription): Promise<Subscription> {
    const prismaData = SubscriptionMapper.toPrismaCreate(subscription);

    const savedSubscription = (await this.prisma.subscription.upsert({
      where: { id: subscription.id },
      create: prismaData,
      update: SubscriptionMapper.toPrismaUpdate(subscription),
    })) as PrismaSubscription;

    return SubscriptionMapper.toDomain(savedSubscription);
  }

  async findById(id: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    return subscription ? SubscriptionMapper.toDomain(subscription) : null;
  }

  async findByClubId(clubId: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { clubId },
    });

    return subscription ? SubscriptionMapper.toDomain(subscription) : null;
  }

  async findByStripeCustomerId(
    stripeCustomerId: string,
  ): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeCustomerId },
    });

    return subscription ? SubscriptionMapper.toDomain(subscription) : null;
  }

  async findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId },
    });

    return subscription ? SubscriptionMapper.toDomain(subscription) : null;
  }

  async update(subscription: Subscription): Promise<Subscription> {
    const prismaData = SubscriptionMapper.toPrismaUpdate(subscription);

    const updatedSubscription = (await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: prismaData,
    })) as PrismaSubscription;

    return SubscriptionMapper.toDomain(updatedSubscription);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subscription.delete({
      where: { id },
    });
  }
}
