import prisma from '@/lib/prisma';
import TransactionTable from '@/components/transactions/transaction-table';
import { Card, CardContent } from '@/components/ui/card';

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      riskAssessment: true,
    },
    take: 100,
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
      </div>
      <Card>
        <CardContent className="p-0">
          <TransactionTable initialData={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
