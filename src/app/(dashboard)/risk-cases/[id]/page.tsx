import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function RiskCaseDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const riskCase = await prisma.riskCase.findUnique({
    where: { id: params.id },
    include: { transaction: { include: { customer: true } }, notes: true }
  });

  if (!riskCase) return notFound();

  return (
    <div className="space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Risk Case Investigation</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-lg">Status: {riskCase.status}</Badge>
          <Badge className="text-lg">Priority: {riskCase.priority}</Badge>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Case Details</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Case ID:</strong> {riskCase.id}</p>
            <p><strong>Transaction ID:</strong> {riskCase.transactionId}</p>
            <p><strong>Created:</strong> {new Date(riskCase.createdAt).toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Name:</strong> {riskCase.transaction.customer?.name}</p>
            <p><strong>Email:</strong> {riskCase.transaction.customer?.email}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
