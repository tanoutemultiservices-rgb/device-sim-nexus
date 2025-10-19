import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { mockActivations } from "@/lib/mockData";
import { PlayCircle, Search } from "lucide-react";

export default function Activations() {
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const filteredActivations = mockActivations.filter(activation =>
    activation.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activation.phoneNumber.includes(searchTerm) ||
    activation.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activation.user.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">SIM Activations</h1>
          <p className="text-muted-foreground mt-2">Monitor SIM card activation operations</p>
        </div>
        <PlayCircle className="h-8 w-8 text-warning" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activation History</CardTitle>
          <CardDescription>All SIM card activation attempts and results</CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by operator, phone, user, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Response Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivations.map((activation) => (
                <TableRow key={activation.id}>
                  <TableCell className="font-medium">#{activation.id}</TableCell>
                  <TableCell className="text-sm">{formatDate(activation.dateOperation)}</TableCell>
                  <TableCell>{activation.operator}</TableCell>
                  <TableCell className="font-mono">{activation.phoneNumber}</TableCell>
                  <TableCell className="font-mono text-xs">{activation.user.substring(0, 12)}...</TableCell>
                  <TableCell className="text-sm">{formatDate(activation.dateResponse)}</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={activation.status.toLowerCase() as any} 
                    />
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{activation.msgResponse || "Pending..."}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Activations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockActivations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All attempts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {mockActivations.filter(a => a.status === "ACCEPTED").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Successful operations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {mockActivations.filter(a => a.status === "PENDING").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
