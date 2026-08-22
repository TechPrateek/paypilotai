"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatCurrency, getRiskLevelColor } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function TransactionTable({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredData = initialData.filter((t) =>
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((t) => (
              <TableRow
                key={t.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/transactions/${t.id}`)}
              >
                <TableCell className="font-medium">{t.id.slice(0, 8)}...</TableCell>
                <TableCell>{t.customer?.name || 'Unknown'}</TableCell>
                <TableCell>{formatCurrency(t.amount, t.currency)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getRiskLevelColor(t.riskAssessment?.riskLevel)}>
                    {t.riskAssessment?.riskScore || 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getRiskLevelColor(t.riskAssessment?.riskLevel)}>
                    {t.riskAssessment?.riskLevel || 'UNKNOWN'}
                  </Badge>
                </TableCell>
                <TableCell>{t.status}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
