import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.auditLog.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const carmen = await prisma.user.create({
    data: {
      email: 'carmen.ruiz@example.es',
      name: 'Carmen Ruiz',
      password: 'hashedpassword123',
    },
  });

  const javier = await prisma.user.create({
    data: {
      email: 'javier.moreno@example.es',
      name: 'Javier Moreno',
      password: 'hashedpassword456',
    },
  });

  const lucia = await prisma.user.create({
    data: {
      email: 'lucia.fernandez@example.es',
      name: 'Lucía Fernández',
      password: 'hashedpassword789',
    },
  });

  // Create categories
  const groceries = await prisma.category.create({
    data: { name: 'Alimentación', icon: 'cart', color: '#4CAF50' },
  });
  const transport = await prisma.category.create({
    data: { name: 'Transporte', icon: 'bus', color: '#2196F3' },
  });
  const rent = await prisma.category.create({
    data: { name: 'Vivienda', icon: 'home', color: '#FF9800' },
  });
  const entertainment = await prisma.category.create({
    data: { name: 'Ocio', icon: 'film', color: '#9C27B0' },
  });
  const salary = await prisma.category.create({
    data: { name: 'Nómina', icon: 'briefcase', color: '#00BCD4' },
  });
  const utilities = await prisma.category.create({
    data: { name: 'Suministros', icon: 'bolt', color: '#FFC107' },
  });
  const dining = await prisma.category.create({
    data: { name: 'Restaurantes', icon: 'utensils', color: '#F44336' },
  });
  const health = await prisma.category.create({
    data: { name: 'Salud', icon: 'heart', color: '#E91E63' },
  });

  // Create accounts for Carmen
  const carmenChecking = await prisma.account.create({
    data: {
      userId: carmen.id,
      name: 'Cuenta Corriente',
      iban: 'ES76 2100 0418 4021 2345 6789',
      balance: 154250, // €1,542.50 in cents
      currency: 'EUR',
      type: 'checking',
    },
  });

  const carmenSavings = await prisma.account.create({
    data: {
      userId: carmen.id,
      name: 'Cuenta Ahorro',
      iban: 'ES79 2100 0418 4021 9876 5432',
      balance: 8750000, // €87,500.00
      currency: 'EUR',
      type: 'savings',
    },
  });

  // Account for Javier
  const javierChecking = await prisma.account.create({
    data: {
      userId: javier.id,
      name: 'Cuenta Nómina',
      iban: 'ES91 2100 0418 4021 1111 2222',
      balance: 328075, // €3,280.75
      currency: 'EUR',
      type: 'checking',
    },
  });

  // Account for Lucía
  const luciaChecking = await prisma.account.create({
    data: {
      userId: lucia.id,
      name: 'Cuenta Corriente',
      iban: 'ES55 2100 0418 4021 3333 4444',
      balance: 78932, // €789.32
      currency: 'EUR',
      type: 'checking',
    },
  });

  const luciaCredit = await prisma.account.create({
    data: {
      userId: lucia.id,
      name: 'Tarjeta Crédito',
      iban: 'ES66 2100 0418 4021 5555 6666',
      balance: -45230, // -€452.30
      currency: 'EUR',
      type: 'credit',
    },
  });

  // Create transactions for Carmen's checking account
  const transactions = [
    { accountId: carmenChecking.id, categoryId: salary.id, amount: 250000, description: 'Nómina mensual julio', merchant: 'Empresa Tech S.L.', date: new Date('2026-07-01') },
    { accountId: carmenChecking.id, categoryId: rent.id, amount: -85000, description: 'Alquiler piso', merchant: 'Inmobiliaria Madrid', date: new Date('2026-07-03') },
    { accountId: carmenChecking.id, categoryId: groceries.id, amount: -6420, description: 'Compra semanal Mercadona', merchant: 'Mercadona', date: new Date('2026-07-05') },
    { accountId: carmenChecking.id, categoryId: transport.id, amount: -6000, description: 'Abono transporte', merchant: 'Metro Madrid', date: new Date('2026-07-05') },
    { accountId: carmenChecking.id, categoryId: utilities.id, amount: -7850, description: 'Factura electricidad', merchant: 'Iberdrola', date: new Date('2026-07-08') },
    { accountId: carmenChecking.id, categoryId: dining.id, amount: -3200, description: 'Cena restaurante', merchant: 'La Tagliatella', date: new Date('2026-07-10') },
    { accountId: carmenChecking.id, categoryId: groceries.id, amount: -4830, description: 'Compra semanal Carrefour', merchant: 'Carrefour', date: new Date('2026-07-12') },
    { accountId: carmenChecking.id, categoryId: entertainment.id, amount: -1299, description: 'Suscripción Netflix', merchant: 'Netflix', date: new Date('2026-07-14') },
    { accountId: carmenChecking.id, categoryId: health.id, amount: -3500, description: 'Farmacia', merchant: 'Farmacia García', date: new Date('2026-07-15') },
    { accountId: carmenChecking.id, categoryId: transport.id, amount: -4500, description: 'Gasolina repsol', merchant: 'Repsol', date: new Date('2026-07-16') },
    { accountId: carmenChecking.id, categoryId: dining.id, amount: -1850, description: 'Café Starbucks', merchant: 'Starbucks', date: new Date('2026-07-17') },
    { accountId: carmenChecking.id, categoryId: entertainment.id, amount: -2800, description: 'Entradas cine', merchant: 'Cinesa', date: new Date('2026-07-17') },
  ];

  for (const tx of transactions) {
    await prisma.transaction.create({ data: tx });
  }

  // Transactions for Javier
  const javierTx = [
    { accountId: javierChecking.id, categoryId: salary.id, amount: 320000, description: 'Nómina julio', merchant: 'Consulting BCN', date: new Date('2026-07-01') },
    { accountId: javierChecking.id, categoryId: rent.id, amount: -120000, description: 'Alquiler', merchant: 'Habitat BCN', date: new Date('2026-07-02') },
    { accountId: javierChecking.id, categoryId: groceries.id, amount: -8200, description: 'Supermercado Consum', merchant: 'Consum', date: new Date('2026-07-06') },
    { accountId: javierChecking.id, categoryId: transport.id, amount: -8000, description: 'Tren AVE Sevilla', merchant: 'Renfe', date: new Date('2026-07-10') },
    { accountId: javierChecking.id, categoryId: dining.id, amount: -4500, description: 'Comida grupo', merchant: 'TGB Burger', date: new Date('2026-07-12') },
    { accountId: javierChecking.id, categoryId: utilities.id, amount: -9200, description: 'Agua y luz', merchant: 'Aigües BCN', date: new Date('2026-07-14') },
  ];
  for (const tx of javierTx) {
    await prisma.transaction.create({ data: tx });
  }

  // Transactions for Lucía
  const luciaTx = [
    { accountId: luciaChecking.id, categoryId: salary.id, amount: 185000, description: 'Salario julio', merchant: 'Diseño Valencia', date: new Date('2026-07-01') },
    { accountId: luciaChecking.id, categoryId: rent.id, amount: -65000, description: 'Alquiler habitación', merchant: 'Piso compartido', date: new Date('2026-07-03') },
    { accountId: luciaChecking.id, categoryId: groceries.id, amount: -3200, description: 'Supermercado Lidl', merchant: 'Lidl', date: new Date('2026-07-07') },
    { accountId: luciaChecking.id, categoryId: entertainment.id, amount: -1500, description: 'Spotify Premium', merchant: 'Spotify', date: new Date('2026-07-10') },
    { accountId: luciaCredit.id, categoryId: dining.id, amount: -2800, description: 'Goiko Griller', merchant: 'Goiko', date: new Date('2026-07-13') },
    { accountId: luciaCredit.id, categoryId: transport.id, amount: -3500, description: 'Taxi Cabify', merchant: 'Cabify', date: new Date('2026-07-15') },
  ];
  for (const tx of luciaTx) {
    await prisma.transaction.create({ data: tx });
  }

  // Create budgets
  await prisma.budget.create({
    data: { accountId: carmenChecking.id, categoryId: groceries.id, limit: 30000, period: 'monthly', startDate: new Date('2026-07-01') },
  });
  await prisma.budget.create({
    data: { accountId: carmenChecking.id, categoryId: dining.id, limit: 10000, period: 'monthly', startDate: new Date('2026-07-01') },
  });
  await prisma.budget.create({
    data: { accountId: carmenChecking.id, categoryId: transport.id, limit: 15000, period: 'monthly', startDate: new Date('2026-07-01') },
  });
  await prisma.budget.create({
    data: { accountId: javierChecking.id, categoryId: groceries.id, limit: 25000, period: 'monthly', startDate: new Date('2026-07-01') },
  });
  await prisma.budget.create({
    data: { accountId: javierChecking.id, categoryId: entertainment.id, limit: 8000, period: 'monthly', startDate: new Date('2026-07-01') },
  });
  await prisma.budget.create({
    data: { accountId: luciaChecking.id, categoryId: groceries.id, limit: 15000, period: 'monthly', startDate: new Date('2026-07-01') },
  });

  // Create some transfers
  await prisma.transfer.create({
    data: {
      fromAccountId: carmenChecking.id,
      toAccountId: carmenSavings.id,
      amount: 50000, // €500.00
      description: 'Ahorro mensual',
      status: 'completed',
    },
  });

  await prisma.transfer.create({
    data: {
      fromAccountId: carmenSavings.id,
      toAccountId: carmenChecking.id,
      amount: 20000, // €200.00
      description: 'Transferencia emergencia',
      status: 'completed',
    },
  });

  // Audit logs
  await prisma.auditLog.create({
    data: {
      userId: carmen.id,
      action: 'transfer.create',
      entity: 'transfer',
      entityId: 'seed-transfer-1',
      metadata: JSON.stringify({ amount: 50000 }),
      ipAddress: '192.168.1.100',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: carmen.id,
      action: 'account.view',
      entity: 'account',
      entityId: carmenChecking.id,
      metadata: JSON.stringify({ balance: 154250 }),
      ipAddress: '192.168.1.100',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: javier.id,
      action: 'transaction.create',
      entity: 'transaction',
      metadata: JSON.stringify({ description: 'Nómina julio' }),
      ipAddress: '192.168.1.101',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: lucia.id,
      action: 'budget.update',
      entity: 'budget',
      metadata: JSON.stringify({ limit: 15000 }),
      ipAddress: '192.168.1.102',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
