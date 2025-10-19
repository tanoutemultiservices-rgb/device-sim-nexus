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
    return new Date(timestamp).toLocaleString('ar-MA');
  };

  const toggleDeviceStatus = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const newStatus = device.status === "1" ? "0" : "1";
        toast.success(
          newStatus === "1" 
            ? `تم تفعيل الجهاز ${device.name}. تم تفعيل جميع بطاقات SIM.` 
            : `تم تعطيل الجهاز ${device.name}. تم تعطيل جميع بطاقات SIM.`
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
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">إجمالي الأجهزة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">الأجهزة المسجلة</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">الأجهزة النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {devices.filter(d => d.status === "1").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">متصلة حالياً</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">الأجهزة غير النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {devices.filter(d => d.status === "0").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">غير متصلة حالياً</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">إدارة الأجهزة</h1>
          <p className="text-muted-foreground mt-2">إدارة أجهزتك المحمولة وحالتها</p>
        </div>
        <Smartphone className="h-8 w-8 text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الأجهزة النشطة</CardTitle>
          <CardDescription>
            يمكن لكل جهاز أن يحتوي على بطاقتي SIM. تعطيل الجهاز يؤدي تلقائياً لتعطيل جميع بطاقات SIM الخاصة به.
          </CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالاسم، العلامة التجارية، النظام، أو IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الجهاز</TableHead>
                <TableHead>العلامة التجارية</TableHead>
                <TableHead>نظام التشغيل</TableHead>
                <TableHead>عنوان IP</TableHead>
                <TableHead>بطاقات SIM</TableHead>
                <TableHead>آخر اتصال</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
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
                      variant={device.status === "1" ? "default" : "destructive"}
                      onClick={() => toggleDeviceStatus(device.id)}
                      className={`gap-2 ${device.status === "1" ? "bg-success hover:bg-success/90" : ""}`}
                    >
                      {device.status === "1" ? (
                        <>
                          <Power className="h-4 w-4" />
                          تعطيل
                        </>
                      ) : (
                        <>
                          <PowerOff className="h-4 w-4" />
                          تفعيل
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
    </div>
  );
}
