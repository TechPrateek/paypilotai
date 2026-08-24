import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  let customers: any[] = [];
  try {
    customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { transactions: true, riskCases: true }
        }
      },
      take: 50,
    });
  } catch (err) {
    console.warn("Failed to load customers from DB:", err);
  }

  return (
    <div className="flex-1 space-y-4 p-2 sm:p-4 md:p-8 pt-4 sm:pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Customers</h2>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Email</TableHead>
                  <TableHead className="text-xs">Country</TableHead>
                  <TableHead className="text-xs">Joined</TableHead>
                  <TableHead className="text-xs">Transactions</TableHead>
                  <TableHead className="text-xs">Risk Cases</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground text-xs">
                      No customer records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((c: any) => (
                    <TableRow key={c.id} className="text-xs sm:text-sm">
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.email}</TableCell>
                      <TableCell>{c.country}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {c.createdAt ? formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }) : 'N/A'}
                      </TableCell>
                      <TableCell>{c._count.transactions}</TableCell>
                      <TableCell>{c._count.riskCases}</TableCell>
                      <TableCell>
                        <Link href={`/customers/${c.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2.5 text-xs">View</Button>
                        </Link>
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
