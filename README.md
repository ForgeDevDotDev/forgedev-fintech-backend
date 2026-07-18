# ForgeDev Fintech (Backend)

> Banking dashboard + transactions API — Express + TypeScript + Prisma + SQLite

**Part of [ForgeDev](https://forgedev.dev)** — Structured work simulation for junior developers.

---

## 📜 License

This project is dual-licensed:

| Version | License | Use Case |
|---------|---------|----------|
| Community | AGPL-3.0 | Free for personal and open-source use. Network service modifications must be published. |
| Commercial | Commercial License | For organizations that want to use this project without AGPL obligations. Contact **info@forgedev.dev** |

See [LICENSE](./LICENSE), [COMMERCIAL-LICENSE.md](./COMMERCIAL-LICENSE.md), and [CLA.md](./CLA.md) for details.

---

## 🤝 Contributing

Contributions are welcome! Please read:

- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution guide, revenue sharing model, and PR process
- [CLA.md](./CLA.md) — Contributor License Agreement (must sign before merging)

---

## 🏗 Project Structure

```
src/
├── index.ts            # App entry point
├── routes/             # API routes
│   ├── index.ts        # Route aggregator
│   ├── accounts.ts     # Account CRUD
│   ├── transactions.ts # Transaction list/create/filter
│   ├── transfers.ts    # Transfer between accounts
│   ├── budgets.ts      # Budget CRUD
│   ├── categories.ts   # Category CRUD
│   └── auditLogs.ts    # Audit log read
├── middleware/          # Express middleware
│   ├── index.ts        # Error handler, request logger
│   └── auth.ts         # Auth stub (TODO)
├── models/             # Prisma client
├── services/           # Business logic
│   ├── transferService.ts
│   └── auditService.ts
├── utils/              # Utility functions
└── tests/              # Test files
prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Seed data
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npm run prisma:seed

# Start dev server
npm run dev
```

---

## 📊 Domain

**Fintech — Banking dashboard + transactions API**

Features:
- Transaction feeds with pagination and filtering
- Transfer flows between accounts
- Budget analytics with category breakdowns
- Account management (CRUD)
- Audit logs for compliance

All amounts are stored as **integer cents** (never floats).

---

## 🔗 Links

- **ForgeDev:** https://forgedev.dev
- **GitHub Org:** https://github.com/ForgeDevDotDev
- **Contact:** info@forgedev.dev

---

## 📁 Related Repositories

Part of the **Fintech** domain:

| Repo | Role |
|------|------|
| forgedev-fintech-backend | Backend API (this repo) |
| forgedev-fintech-vue | Vue 3 frontend |
| forgedev-fintech-react | React frontend |
