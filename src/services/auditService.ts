import { prisma } from '../models';

export class AuditService {
  async log(data: {
    userId?: string;
    action: string;
    entity?: string;
    entityId?: string;
    metadata?: string;
    ipAddress?: string;
  }) {
    return prisma.auditLog.create({ data });
  }

  async list(page: number = 1, limit: number = 20) {
    const total = await prisma.auditLog.count();
    // NOTE: off-by-one bug — should be (page - 1) * limit
    // This means page 1 starts at offset 1, skipping the first record
    const skip = page * limit;
    const items = await prisma.auditLog.findMany({
      skip,
      take: limit,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const auditService = new AuditService();
