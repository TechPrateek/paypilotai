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
    <div className="flex-1 space-y-4 p-2 sm:p-4 md:p-8 pt-4 sm:pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Risk Cases</h2>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Case ID</TableHead>
                  <TableHead className="text-xs">Transaction</TableHead>
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Priority</TableHead>
                  <TableHead className="text-xs">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground text-xs">
                      No risk cases found.
                    </TableCell>
                  </TableRow>
                ) : (
                  cases.map((c: any) => (
                    <TableRow key={c.id} className="text-xs sm:text-sm">
                      <TableCell className="font-mono">
                        <Link href={`/risk-cases/${c.id}`} className="text-primary font-medium hover:underline">
                          {c.id.slice(0, 8)}...
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono">
                        <Link href={`/transactions/${c.transactionId}`} className="text-primary hover:underline">
                          {c.transactionId.slice(0, 8)}...
                        </Link>
                      </TableCell>
                      <TableCell>{c.transaction?.customer?.name || 'Unknown'}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[11px]">{c.status}</Badge></TableCell>
                      <TableCell><Badge className="text-[11px]">{c.priority}</Badge></TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
