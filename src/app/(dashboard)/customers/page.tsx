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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Risk Cases</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.country}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</TableCell>
                  <TableCell>{c._count.transactions}</TableCell>
                  <TableCell>{c._count.riskCases}</TableCell>
                  <TableCell>
                    <Link href={`/customers/${c.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
