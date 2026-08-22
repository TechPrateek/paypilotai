import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = "force-dynamic";

export default async function RiskCasesPage() {
  let cases: any[] = [];
  try {
    cases = await prisma.riskCase.findMany({
      orderBy: { createdAt: 'desc' },
      include: { transaction: { include: { customer: true } } },
      take: 50,
    });
  } catch (err) {
    console.warn("Failed to load risk cases:", err);
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Risk Cases</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link href={`/risk-cases/${c.id}`} className="text-blue-500 hover:underline">
                      {c.id.slice(0, 8)}...
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/transactions/${c.transactionId}`} className="text-blue-500 hover:underline">
                      {c.transactionId.slice(0, 8)}...
                    </Link>
                  </TableCell>
                  <TableCell>{c.transaction.customer?.name || 'Unknown'}</TableCell>
                  <TableCell><Badge variant="secondary">{c.status}</Badge></TableCell>
                  <TableCell><Badge>{c.priority}</Badge></TableCell>
                  <TableCell>{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
