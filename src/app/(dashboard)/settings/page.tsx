"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Beaker, CheckCircle, ShieldAlert, Cpu } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="model">Model Monitoring</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and change your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Admin User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@paypilot.ai" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Administrator" readOnly disabled className="bg-muted" />
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Change Password</h4>
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input id="new" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input id="confirm" type="password" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what events you want to be notified about.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label>High-Risk Transactions</Label>
                  <span className="text-sm text-muted-foreground">
                    Get notified immediately when a transaction scores above 90.
                  </span>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label>Daily Digest</Label>
                  <span className="text-sm text-muted-foreground">
                    Receive a daily summary of system performance and metrics.
                  </span>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label>Model Updates</Label>
                  <span className="text-sm text-muted-foreground">
                    Notifications about AI model retraining and deployments.
                  </span>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label>Case Assignments</Label>
                  <span className="text-sm text-muted-foreground">
                    Alerts when a manual review case is assigned to you.
                  </span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model" className="space-y-4">
          <div className="flex items-center gap-2 mb-4 text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
            <Beaker className="h-5 w-5" />
            <p className="text-sm font-medium">Demo Model Metrics - Synthetic performance data</p>
          </div>
          
          <Card className="border-primary/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    Active Model: RiskEngine-V2.4.1
                  </CardTitle>
                  <CardDescription>Deployed on May 10, 2024</CardDescription>
                </div>
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="mr-1 h-3 w-3" /> Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Accuracy</span>
                    <span className="text-muted-foreground">98.5%</span>
                  </div>
                  <Progress value={98.5} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Precision</span>
                    <span className="text-muted-foreground">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Recall</span>
                    <span className="text-muted-foreground">96.8%</span>
                  </div>
                  <Progress value={96.8} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">F1 Score</span>
                    <span className="text-muted-foreground">95.5%</span>
                  </div>
                  <Progress value={95.5} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">False Positive Rate</span>
                    <span className="text-muted-foreground">0.8%</span>
                  </div>
                  <Progress value={0.8} className="h-2 bg-muted [&>div]:bg-amber-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Detection Rate</span>
                    <span className="text-muted-foreground">99.1%</span>
                  </div>
                  <Progress value={99.1} className="h-2 bg-muted [&>div]:bg-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Deployed</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">V2.4.1</TableCell>
                    <TableCell><Badge className="bg-green-500">Active</Badge></TableCell>
                    <TableCell>98.5%</TableCell>
                    <TableCell>May 10, 2024</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">V2.3.0</TableCell>
                    <TableCell><Badge variant="outline">Archived</Badge></TableCell>
                    <TableCell>97.2%</TableCell>
                    <TableCell>Feb 15, 2024</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">V2.2.5</TableCell>
                    <TableCell><Badge variant="outline">Archived</Badge></TableCell>
                    <TableCell>96.1%</TableCell>
                    <TableCell>Nov 02, 2023</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About PayPilot AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6">
                <ShieldAlert className="h-16 w-16 text-primary mb-4" />
                <h3 className="text-2xl font-bold">PayPilot AI</h3>
                <p className="text-muted-foreground mt-2">Intelligent Payment Risk Management</p>
                <Badge variant="secondary" className="mt-4">Version 1.0.0-beta</Badge>
              </div>
              <Separator />
              <div className="grid gap-2 text-sm text-center">
                <p>© 2024 PayPilot AI Inc. All rights reserved.</p>
                <div className="flex items-center justify-center gap-4 text-primary mt-2">
                  <a href="#" className="hover:underline">Documentation</a>
                  <a href="#" className="hover:underline">Support</a>
                  <a href="#" className="hover:underline">Privacy Policy</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
