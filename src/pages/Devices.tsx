import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { devicesApi } from "@/services/api";
import { Power, PowerOff, Smartphone, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Devices() {
  const [devices, setDevices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const data = await devicesApi.getAll();
      setDevices(data as any[]);
    } catch (error: any) {
      toast.error(`فشل تحميل الأجهزة: ${error.message}`);
      console.error('Error fetching devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ar-MA');
  };

  const toggleDeviceStatus = async (deviceId: string) => {
    const device = devices.find(d => d.ID === deviceId);
    if (!device) return;

    const newStatus = device.STATUS === "1" ? "0" : "1";
    
    try {
      await devicesApi.update({ ...device, STATUS: newStatus });
      setDevices(prev => prev.map(d => 
        d.ID === deviceId ? { ...d, STATUS: newStatus } : d
      ));
      toast.success(
        newStatus === "1" 
          ? `تم تفعيل الجهاز ${device.NOM}. تم تفعيل جميع بطاقات SIM.` 
          : `تم تعطيل الجهاز ${device.NOM}. تم تعطيل جميع بطاقات SIM.`
      );
    } catch (error: any) {
      toast.error(`فشل تحديث الجهاز: ${error.message}`);
    }
  };

  const executorDevices = devices.filter(device => device.TYPE === "EXECUTOR");
  
  const filteredDevices = executorDevices.filter(device =>
    device.NOM?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.BRAND?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.OS?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.IP?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">إجمالي الأجهزة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executorDevices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">أجهزة التنفيذ المسجلة</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">الأجهزة النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {executorDevices.filter(d => d.STATUS === "1").length}
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
              {executorDevices.filter(d => d.STATUS === "0").length}
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
                <TableRow key={device.ID}>
                  <TableCell className="font-medium">{device.NOM}</TableCell>
                  <TableCell>{device.BRAND}</TableCell>
                  <TableCell>{device.OS}</TableCell>
                  <TableCell className="font-mono text-sm">{device.IP}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell className="text-sm">{formatDate(parseInt(device.LAST_CONNECT))}</TableCell>
                  <TableCell>
                    <StatusBadge status={device.STATUS === "1" ? "active" : "blocked"} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={device.STATUS === "1" ? "default" : "destructive"}
                      onClick={() => toggleDeviceStatus(device.ID)}
                      className={`gap-2 ${device.STATUS === "1" ? "bg-success hover:bg-success/90" : ""}`}
                    >
                      {device.STATUS === "1" ? (
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
