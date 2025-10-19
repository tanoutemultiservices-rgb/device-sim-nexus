import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, CreditCard, Users, PlayCircle, Coins, Activity } from "lucide-react";
import { mockDevices, mockSimCards, mockUsers, mockActivations, mockTopups } from "@/lib/mockData";

export default function Dashboard() {
  const activeDevices = mockDevices.filter(d => d.status === "1").length;
  const activeSimCards = mockSimCards.filter(s => s.connected === "1").length;
  const totalUsers = mockUsers.length;
  const todayActivations = mockActivations.length;
  const todayTopups = mockTopups.length;
  const totalBalance = mockUsers.reduce((sum, user) => sum + user.balance, 0);

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your telecom operations management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Current operational status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Device Utilization</span>
              <span className="text-sm font-medium">{((activeDevices / mockDevices.length) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all" 
                style={{ width: `${(activeDevices / mockDevices.length) * 100}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">SIM Card Utilization</span>
              <span className="text-sm font-medium">{((activeSimCards / mockSimCards.length) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all" 
                style={{ width: `${(activeSimCards / mockSimCards.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <PlayCircle className="h-5 w-5 text-warning mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">SIM Activation</p>
                <p className="text-xs text-muted-foreground">Phone: 654166466 - Status: Accepted</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Coins className="h-5 w-5 text-success mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Credit Top-up</p>
                <p className="text-xs text-muted-foreground">Amount: 5 MAD - Status: Completed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Device Connected</p>
                <p className="text-xs text-muted-foreground">A12 de Ben Dahmane - Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
