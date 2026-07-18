import { Router } from 'express';
import { accountsRouter } from './accounts';
import { transactionsRouter } from './transactions';
import { transfersRouter } from './transfers';
import { budgetsRouter } from './budgets';
import { categoriesRouter } from './categories';
import { auditLogsRouter } from './auditLogs';

const router = Router();

router.use('/accounts', accountsRouter);
router.use('/transactions', transactionsRouter);
router.use('/transfers', transfersRouter);
router.use('/budgets', budgetsRouter);
router.use('/categories', categoriesRouter);
router.use('/audit-logs', auditLogsRouter);

export { router as routes };
