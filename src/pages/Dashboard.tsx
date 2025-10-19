import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Smartphone, CreditCard, Users, PlayCircle, Coins, Activity, Search } from "lucide-react";
import { mockDevices, mockSimCards, mockUsers, mockActivations, mockTopups } from "@/lib/mockData";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const activeDevices = mockDevices.filter(d => d.status === "1").length;
  const activeSimCards = mockSimCards.filter(s => s.connected === "1").length;
  const totalUsers = mockUsers.length;
  const todayActivations = mockActivations.length;
  const todayTopups = mockTopups.length;
  const totalBalance = mockUsers.reduce((sum, user) => sum + user.balance, 0);

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const filteredActivations = mockActivations.filter(activation =>
    activation.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activation.phoneNumber.includes(searchTerm) ||
    activation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { 
      title: "Active Devices", 
      value: `${activeDevices}/${mockDevices.length}`, 
      icon: Smartphone, 
      description: "Devices online",
      color: "text-primary"
    },
    { 
      title: "Active SIM Cards", 
      value: `${activeSimCards}/${mockSimCards.length}`, 
      icon: CreditCard, 
      description: "Connected SIMs",
      color: "text-success"
    },
    { 
      title: "Total Users", 
      value: totalUsers, 
      icon: Users, 
      description: "Registered users",
      color: "text-accent"
    },
    { 
      title: "Today Activations", 
      value: todayActivations, 
      icon: PlayCircle, 
      description: "SIM activations",
      color: "text-warning"
    },
    { 
      title: "Today Top-ups", 
      value: todayTopups, 
      icon: Coins, 
      description: "Credit recharges",
      color: "text-primary"
    },
    { 
      title: "Total Balance", 
      value: `${totalBalance.toFixed(3)} MAD`, 
      icon: Activity, 
      description: "Users balance",
      color: "text-success"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your telecom operations management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-200 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activations</CardTitle>
          <CardDescription>Latest SIM card activation operations</CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by operator, phone, or status..."
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
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivations.slice(0, 10).map((activation) => (
                <TableRow key={activation.id}>
                  <TableCell className="font-medium">#{activation.id}</TableCell>
                  <TableCell className="text-sm">{formatDate(activation.dateOperation)}</TableCell>
                  <TableCell>{activation.operator}</TableCell>
                  <TableCell className="font-mono">{activation.phoneNumber}</TableCell>
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
    </div>
  );
}
