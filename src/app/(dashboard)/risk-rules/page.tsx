"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function RiskRulesPage() {
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    // Mock initial data
    setRules([
      { id: '1', name: 'Velocity Check', category: 'VELOCITY', score: 20, severity: 'HIGH', enabled: true },
      { id: '2', name: 'High Amount', category: 'AMOUNT', score: 10, severity: 'MEDIUM', enabled: false },
      { id: '3', name: 'New Device', category: 'DEVICE', score: 15, severity: 'MEDIUM', enabled: true },
    ]);
  }, []);

  return (
    <div className="space-y-4 p-2 sm:p-4 md:p-8 pt-4 sm:pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Risk Rules</h2>
        <Button size="sm" className="h-8 text-xs sm:text-sm">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Create Rule
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs">Score</TableHead>
                  <TableHead className="text-xs">Severity</TableHead>
                  <TableHead className="text-xs">Enabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((r) => (
                  <TableRow key={r.id} className="text-xs sm:text-sm">
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[11px]">{r.category}</Badge></TableCell>
                    <TableCell className="font-semibold">+{r.score}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[11px]">{r.severity}</Badge></TableCell>
                    <TableCell>
                      <Switch checked={r.enabled} onCheckedChange={() => {}} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
