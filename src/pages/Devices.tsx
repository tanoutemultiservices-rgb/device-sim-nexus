import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { mockDevices } from "@/lib/mockData";
import { Power, PowerOff, Smartphone, Search } from "lucide-react";
import { toast } from "sonner";

export default function Devices() {
  const [devices, setDevices] = useState(mockDevices);
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const toggleDeviceStatus = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const newStatus = device.status === "1" ? "0" : "1";
        toast.success(
          newStatus === "1" 
            ? `Device ${device.name} activated. All SIM cards enabled.` 
            : `Device ${device.name} deactivated. All SIM cards disabled.`
        );
        return { ...device, status: newStatus };
      }
      return device;
    }));
  };

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.os.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.ip.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Devices Management</h1>
          <p className="text-muted-foreground mt-2">Manage your mobile devices and their status</p>
        </div>
        <Smartphone className="h-8 w-8 text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Devices</CardTitle>
          <CardDescription>
            Each device can have up to 2 SIM cards. Deactivating a device automatically deactivates all its SIM cards.
          </CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, brand, OS, or IP..."
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
                <TableHead>Device Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>SIM Cards</TableHead>
                <TableHead>Last Connect</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.brand}</TableCell>
                  <TableCell>{device.os}</TableCell>
                  <TableCell className="font-mono text-sm">{device.ip}</TableCell>
                  <TableCell>{device.simCards}</TableCell>
                  <TableCell className="text-sm">{formatDate(device.lastConnect)}</TableCell>
                  <TableCell>
                    <StatusBadge status={device.status === "1" ? "active" : "blocked"} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={device.status === "1" ? "destructive" : "default"}
                      onClick={() => toggleDeviceStatus(device.id)}
                      className="gap-2"
                    >
                      {device.status === "1" ? (
                        <>
                          <PowerOff className="h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>
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
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered devices</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {devices.filter(d => d.status === "1").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently online</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Inactive Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {devices.filter(d => d.status === "0").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Currently offline</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
