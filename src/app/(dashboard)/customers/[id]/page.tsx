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
    <div className="space-y-4 p-2 sm:p-4 md:p-8 pt-4 sm:pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{customer.name}</h2>
        <Badge variant="outline" className="text-sm sm:text-base self-start sm:self-auto">Risk Score: {avgScore}</Badge>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="text-base sm:text-lg">Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-2 text-xs sm:text-sm">
            <p><strong>Email:</strong> <span className="text-muted-foreground">{customer.email}</span></p>
            <p><strong>Country:</strong> <span className="text-muted-foreground">{customer.country}</span></p>
            <p><strong>Phone:</strong> <span className="text-muted-foreground">{customer.phone || 'N/A'}</span></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="text-base sm:text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3">
              {customer.transactions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No recent transactions recorded.</p>
              ) : (
                customer.transactions.map((t: any) => (
                  <div key={t.id} className="flex justify-between items-center border-b pb-2 text-xs sm:text-sm">
                    <div>
                      <p className="font-medium">{t.amount} {t.currency}</p>
                      <p className="text-[11px] text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge className={getRiskLevelColor(t.riskAssessment?.riskLevel || 'LOW')}>
                      {t.riskAssessment?.riskLevel || 'UNKNOWN'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
