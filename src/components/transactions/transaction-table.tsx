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
import { Search } from 'lucide-react';

export default function TransactionTable({ initialData }: { initialData: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredData = (initialData || []).filter((t) =>
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3 sm:space-y-4 p-2 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs sm:text-sm w-full"
          />
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">ID</TableHead>
              <TableHead className="text-xs">Customer</TableHead>
              <TableHead className="text-xs">Amount</TableHead>
              <TableHead className="text-xs">Risk Score</TableHead>
              <TableHead className="text-xs">Level</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground text-xs">
                  No transactions match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((t) => (
                <TableRow
                  key={t.id}
                  className="cursor-pointer hover:bg-muted/50 text-xs sm:text-sm"
                  onClick={() => router.push(`/transactions/${t.id}`)}
                >
                  <TableCell className="font-medium font-mono">{t.id.slice(0, 8)}...</TableCell>
                  <TableCell>{t.customer?.name || 'Unknown'}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(t.amount, t.currency)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRiskLevelColor(t.riskAssessment?.riskLevel)}>
                      {t.riskAssessment?.riskScore ?? 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskLevelColor(t.riskAssessment?.riskLevel)}>
                      {t.riskAssessment?.riskLevel || 'UNKNOWN'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{t.status?.toLowerCase() || 'pending'}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {t.createdAt ? formatDistanceToNow(new Date(t.createdAt), { addSuffix: true }) : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
