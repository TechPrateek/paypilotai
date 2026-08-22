import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRiskLevelColor } from '@/lib/utils';

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { riskAssessment: true }
      },
    }
  });

  if (!customer) return notFound();

  const avgScore = customer.transactions.length > 0
    ? Math.round(customer.transactions.reduce((acc: number, t: any) => acc + (t.riskAssessment?.riskScore || 0), 0) / customer.transactions.length)
    : 15;

  return (
    <div className="space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{customer.name}</h2>
        <Badge variant="outline" className="text-lg">Risk Score: {avgScore}</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Country:</strong> {customer.country}</p>
            <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customer.transactions.map((t: any) => (
                <div key={t.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{t.amount} {t.currency}</p>
                    <p className="text-sm text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className={getRiskLevelColor(t.riskAssessment?.riskLevel || 'LOW')}>
                    {t.riskAssessment?.riskLevel || 'UNKNOWN'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
