import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Audit Logs - PayPilot AI",
  description: "View system audit logs",
};

const logs = [
  {
    id: "log_1",
    timestamp: "2024-05-18T14:23:45Z",
    user: "admin@paypilot.ai",
    action: "UPDATE_THRESHOLD",
    resource: "Risk Profile: Default",
    details: "Changed block threshold from 85 to 80",
    ip: "192.168.1.45",
  },
  {
    id: "log_2",
    timestamp: "2024-05-18T13:15:02Z",
    user: "analyst@paypilot.ai",
    action: "REVIEW_CASE",
    resource: "Case #4982",
    details: "Marked case as Resolved - True Positive",
    ip: "10.0.0.12",
  },
  {
    id: "log_3",
    timestamp: "2024-05-18T10:45:11Z",
    user: "system",
    action: "MODEL_UPDATE",
    resource: "Risk Engine",
    details: "Deployed new model version v2.4.1",
    ip: "127.0.0.1",
  },
  {
    id: "log_4",
    timestamp: "2024-05-17T09:22:15Z",
    user: "merchant@paypilot.ai",
    action: "LOGIN",
    resource: "Session",
    details: "Successful login",
    ip: "172.16.254.1",
  },
  {
    id: "log_5",
    timestamp: "2024-05-17T08:14:22Z",
    user: "admin@paypilot.ai",
    action: "CREATE_RULE",
    resource: "Custom Rules",
    details: "Created rule: Block IP range 45.33.x.x",
    ip: "192.168.1.45",
  },
];

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Access search params natively via async in Next 15
  const sp = await searchParams;
  const q = sp?.q || "";

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-8"
              defaultValue={q as string}
            />
          </div>
          <Select defaultValue="7d">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="login">Logins</SelectItem>
              <SelectItem value="update">Updates</SelectItem>
              <SelectItem value="system">System Events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead className="w-[300px]">Details</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/10">
                    {log.action}
                  </span>
                </TableCell>
                <TableCell>{log.resource}</TableCell>
                <TableCell className="text-muted-foreground truncate max-w-[300px]" title={log.details}>
                  {log.details}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs font-mono">
                  {log.ip}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>
    </div>
  );
}
