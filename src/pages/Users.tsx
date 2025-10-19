import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { mockUsers } from "@/lib/mockData";
import { Users as UsersIcon } from "lucide-react";

export default function Users() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Users Management</h1>
          <p className="text-muted-foreground mt-2">View and manage customer accounts</p>
        </div>
        <UsersIcon className="h-8 w-8 text-accent" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>All customer accounts in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Balance (MAD)</TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{`${user.prenom} ${user.nom}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="font-mono">{user.tel}</TableCell>
                  <TableCell className="font-mono">{user.balance.toFixed(3)}</TableCell>
                  <TableCell className="font-mono text-xs">{user.device.substring(0, 16)}...</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={
                        user.status === "ACCEPT" ? "active" : 
                        user.status === "PENDING" ? "pending" : 
                        "blocked"
                      } 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {mockUsers.filter(u => u.status === "ACCEPT").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Approved accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {mockUsers.reduce((sum, u) => sum + u.balance, 0).toFixed(3)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">MAD</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
