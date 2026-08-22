"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Risk Rules</h2>
        <Button>Create Rule</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Enabled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.score}</TableCell>
                  <TableCell><Badge variant="outline">{r.severity}</Badge></TableCell>
                  <TableCell>
                    <Switch checked={r.enabled} onCheckedChange={() => {}} />
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
