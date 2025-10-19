import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { mockSimCards, mockDevices } from "@/lib/mockData";
import { CreditCard, Power, PowerOff, Search } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function SimCards() {
  const [simCards, setSimCards] = useState(mockSimCards);
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getDeviceName = (deviceId: string) => {
    const device = mockDevices.find(d => d.id === deviceId);
    return device ? device.name : "Unknown Device";
  };

  const toggleSimStatus = (simId: number, type: "activation" | "topup") => {
    setSimCards(prev => prev.map(sim => {
      if (sim.id === simId) {
        if (type === "activation") {
          const newStatus = sim.activationStatus === "1" ? "0" : "1";
          toast.success(
            newStatus === "1" 
              ? `SIM ${sim.number} activation enabled` 
              : `SIM ${sim.number} activation disabled`
          );
          return { ...sim, activationStatus: newStatus };
        } else {
          const newStatus = sim.topupStatus === "1" ? "0" : "1";
          toast.success(
            newStatus === "1" 
              ? `SIM ${sim.number} top-up enabled` 
              : `SIM ${sim.number} top-up disabled`
          );
          return { ...sim, topupStatus: newStatus };
        }
      }
      return sim;
    }));
  };

  const filteredSimCards = simCards.filter(sim =>
    sim.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sim.number.includes(searchTerm) ||
    getDeviceName(sim.device).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">SIM Cards Management</h1>
          <p className="text-muted-foreground mt-2">Monitor and control SIM card operations</p>
        </div>
        <CreditCard className="h-8 w-8 text-success" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SIM Cards Overview</CardTitle>
          <CardDescription>
            Each SIM card can execute up to 20 successful activation operations per day
          </CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by operator, number, or device..."
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
                <TableHead>Operator</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Device Name</TableHead>
                <TableHead>Today Operations</TableHead>
                <TableHead>Balance (MAD)</TableHead>
                <TableHead>Connection</TableHead>
                <TableHead>Last Connect</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSimCards.map((sim) => (
                <TableRow key={sim.id}>
                  <TableCell className="font-medium">#{sim.id}</TableCell>
                  <TableCell>{sim.operator}</TableCell>
                  <TableCell className="font-mono">{sim.number}</TableCell>
                  <TableCell className="text-sm">{getDeviceName(sim.device)}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Activations:</span>
                        <span className="text-xs font-medium">{sim.todayActivations}/20</span>
                      </div>
                      <Progress value={(sim.todayActivations / 20) * 100} className="h-1" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Top-ups:</span>
                        <span className="text-xs font-medium">{sim.todayTopups}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{sim.balance.toFixed(3)}</TableCell>
                  <TableCell>
                    <StatusBadge status={sim.connected === "1" ? "active" : "blocked"} />
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(sim.lastConnect)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={sim.activationStatus === "1" ? "outline" : "default"}
                        onClick={() => toggleSimStatus(sim.id, "activation")}
                        title={sim.activationStatus === "1" ? "Disable Activation" : "Enable Activation"}
                      >
                        {sim.activationStatus === "1" ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant={sim.topupStatus === "1" ? "outline" : "default"}
                        onClick={() => toggleSimStatus(sim.id, "topup")}
                        title={sim.topupStatus === "1" ? "Disable Top-up" : "Enable Top-up"}
                      >
                        {sim.topupStatus === "1" ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total SIM Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{simCards.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All SIM cards</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {simCards.filter(s => s.connected === "1").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Today Activations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {simCards.reduce((sum, s) => sum + s.todayActivations, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total operations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {simCards.reduce((sum, s) => sum + s.balance, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">MAD</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
