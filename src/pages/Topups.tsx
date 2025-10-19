import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { mockTopups } from "@/lib/mockData";
import { Coins, Search } from "lucide-react";

export default function Topups() {
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredTopups = mockTopups.filter(topup =>
    topup.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topup.phoneNumber.includes(searchTerm) ||
    topup.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topup.user.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Credit Top-ups</h1>
          <p className="text-muted-foreground mt-2">Monitor mobile credit recharge operations</p>
        </div>
        <Coins className="h-8 w-8 text-success" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top-up History</CardTitle>
          <CardDescription>All mobile credit recharge transactions</CardDescription>
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
                <TableHead>Amount (MAD)</TableHead>
                <TableHead>New Balance</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTopups.map((topup) => (
                <TableRow key={topup.id}>
                  <TableCell className="font-medium">#{topup.id}</TableCell>
                  <TableCell className="text-sm">{formatDate(topup.dateOperation)}</TableCell>
                  <TableCell>{topup.operator}</TableCell>
                  <TableCell className="font-mono">{topup.phoneNumber}</TableCell>
                  <TableCell className="font-mono font-medium">{topup.montant}</TableCell>
                  <TableCell className="font-mono">{topup.newBalance.toFixed(3)}</TableCell>
                  <TableCell className="font-mono text-xs">{topup.user.substring(0, 12)}...</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={topup.status.toLowerCase() as any} 
                    />
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{topup.msgResponse}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Top-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTopups.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {mockTopups.filter(t => t.status === "ACCEPTED").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Successful</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Refused</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockTopups.filter(t => t.status === "REFUSED").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Failed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {mockTopups.filter(t => t.status === "ACCEPTED").reduce((sum, t) => sum + t.montant, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">MAD</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
