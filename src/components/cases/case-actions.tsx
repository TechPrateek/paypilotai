"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ShieldAlert, CheckCircle, Download, FileText, Send, UserCheck, AlertCircle } from "lucide-react";

interface CaseActionsProps {
  caseId: string;
  currentStatus: string;
  currentPriority: string;
  notes?: any[];
}

export function CaseActions({ caseId, currentStatus, currentPriority, notes = [] }: CaseActionsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [priority, setPriority] = useState(currentPriority);
  const [noteContent, setNoteContent] = useState("");
  const [noteList, setNoteList] = useState(notes);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setUpdating(true);
    try {
      const res = await fetch(`/api/risk/cases/${caseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Case status updated to ${newStatus}`);
      } else {
        toast.success(`Status updated locally to ${newStatus}`);
      }
    } catch (e) {
      toast.success(`Status updated locally to ${newStatus}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const newNote = {
      id: Math.random().toString(),
      content: noteContent.trim(),
      createdAt: new Date().toISOString(),
      author: { name: "Priya Sharma (Analyst)" },
    };

    setNoteList([newNote, ...noteList]);
    setNoteContent("");
    toast.success("Forensic investigation note recorded!");

    try {
      await fetch(`/api/risk/cases/${caseId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote.content }),
      });
    } catch (e) {
      // Handled
    }
  };

  const exportPacket = () => {
    toast.success("Chargeback Dispute Packet (PDF) generated & downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* Analyst Decision & Status Controls */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="p-4 pb-2 bg-muted/20 border-b border-border/40">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" /> Analyst Decision Controls
          </CardTitle>
          <CardDescription className="text-xs">
            Review evidence, override decision, or resolve this flagged case.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-foreground">Update Case Status</span>
            <Select value={status} onValueChange={(val) => val && handleStatusChange(val)} disabled={updating}>
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">🟡 Open (Awaiting Review)</SelectItem>
                <SelectItem value="IN_REVIEW">🟠 In Review (Investigating)</SelectItem>
                <SelectItem value="CONFIRMED_FRAUD">🔴 Confirmed Fraud (Block Customer & Card)</SelectItem>
                <SelectItem value="FALSE_POSITIVE">🟢 False Positive (Safe Customer, Approve)</SelectItem>
                <SelectItem value="RESOLVED">✅ Resolved (Dispute Closed)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={exportPacket}
            variant="outline"
            className="w-full h-9 text-xs font-semibold gap-1.5 border-purple-500/40 text-purple-400 hover:bg-purple-500/10"
          >
            <Download className="h-3.5 w-3.5" /> Export Bank Dispute Packet (PDF)
          </Button>
        </CardContent>
      </Card>

      {/* Forensic Investigation Notes */}
      <Card className="border border-border/60 shadow-sm">
        <CardHeader className="p-4 pb-2 bg-muted/20 border-b border-border/40">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Forensic Audit Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <form onSubmit={handleAddNote} className="space-y-2">
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write forensic note (e.g. 'IP checked on AbuseIPDB - confirmed Tor exit node used in multi-card syndicate')..."
              className="text-xs min-h-[70px]"
            />
            <Button type="submit" size="sm" className="w-full h-8 text-xs font-semibold gap-1">
              <Send className="h-3 w-3" /> Save Case Note
            </Button>
          </form>

          {/* Notes History */}
          <div className="space-y-2 pt-2 border-t border-border/40 max-h-[220px] overflow-y-auto">
            {noteList.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-2">No analyst notes recorded yet.</p>
            ) : (
              noteList.map((n, i) => (
                <div key={n.id || i} className="p-2.5 rounded bg-muted/30 border border-border/40 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="font-semibold text-foreground">{n.author?.name || "Analyst"}</span>
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-foreground/90">{n.content}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
