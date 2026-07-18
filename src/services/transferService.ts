import { prisma } from '../models';
import { auditService } from './auditService';

export class TransferService {
  async createTransfer(fromAccountId: string, toAccountId: string, amount: number, description?: string) {
    // Validate accounts exist
    const fromAccount = await prisma.account.findUnique({ where: { id: fromAccountId } });
    const toAccount = await prisma.account.findUnique({ where: { id: toAccountId } });

    if (!fromAccount || !toAccount) {
      throw new Error('Account not found');
    }

    if (fromAccountId === toAccountId) {
      throw new Error('Cannot transfer to the same account');
    }

    // TODO: Validate amount is positive
    // FIXME: Should check if fromAccount has sufficient balance
    // For now we just process it

    // Create transfer record and update balances
    const transfer = await prisma.transfer.create({
      data: {
        fromAccountId,
        toAccountId,
        amount,
        description,
        status: 'completed',
      },
    });

    // Update account balances
    await prisma.account.update({
      where: { id: fromAccountId },
      data: { balance: { decrement: amount } },
    });

    await prisma.account.update({
      where: { id: toAccountId },
      data: { balance: { increment: amount } },
    });

    // Create transaction records for both accounts
    await prisma.transaction.create({
      data: {
        accountId: fromAccountId,
        amount: -amount,
        description: description || `Transferencia a ${toAccount.name}`,
        date: new Date(),
        status: 'completed',
        reference: transfer.id,
      },
    });

    await prisma.transaction.create({
      data: {
        accountId: toAccountId,
        amount: amount,
        description: description || `Transferencia desde ${fromAccount.name}`,
        date: new Date(),
        status: 'completed',
        reference: transfer.id,
      },
    });

    // Audit log
    await auditService.log({
      action: 'transfer.create',
      entity: 'transfer',
      entityId: transfer.id,
      metadata: JSON.stringify({ fromAccountId, toAccountId, amount }),
    });

    return transfer;
  }

  async listTransfers(accountId?: string) {
    // FIXME: No pagination here
    const where = accountId ? {
      OR: [
        { fromAccountId },
        { toAccountId },
      ]
    } : {};
    return prisma.transfer.findMany({
      where,
      include: {
        fromAccount: true,
        toAccount: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const transferService = new TransferService();
