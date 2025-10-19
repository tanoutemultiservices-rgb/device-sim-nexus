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
    return new Date(timestamp).toLocaleString('ar-MA');
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
              ? `تم تفعيل التفعيل لبطاقة SIM ${sim.number}` 
              : `تم تعطيل التفعيل لبطاقة SIM ${sim.number}`
          );
          return { ...sim, activationStatus: newStatus };
        } else {
          const newStatus = sim.topupStatus === "1" ? "0" : "1";
          toast.success(
            newStatus === "1" 
              ? `تم تفعيل الشحن لبطاقة SIM ${sim.number}` 
              : `تم تعطيل الشحن لبطاقة SIM ${sim.number}`
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
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">إجمالي البطاقات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{simCards.length}</div>
            <p className="text-xs text-muted-foreground mt-1">جميع بطاقات SIM</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">متصلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {simCards.filter(s => s.connected === "1").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">نشطة حالياً</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">تفعيلات اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {simCards.reduce((sum, s) => sum + s.todayActivations, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">إجمالي العمليات</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">الرصيد الإجمالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {simCards.reduce((sum, s) => sum + s.balance, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">درهم</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">إدارة بطاقات SIM</h1>
          <p className="text-muted-foreground mt-2">مراقبة والتحكم في عمليات بطاقات SIM</p>
        </div>
        <CreditCard className="h-8 w-8 text-success" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>نظرة عامة على بطاقات SIM</CardTitle>
          <CardDescription>
            يمكن لكل بطاقة SIM تنفيذ ما يصل إلى 20 عملية تفعيل ناجحة يومياً
          </CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالمشغل، الرقم، أو الجهاز..."
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
                <TableHead>المعرف</TableHead>
                <TableHead>المشغل</TableHead>
                <TableHead>الرقم</TableHead>
                <TableHead>اسم الجهاز</TableHead>
                <TableHead>عمليات اليوم</TableHead>
                <TableHead>الرصيد (درهم)</TableHead>
                <TableHead>الاتصال</TableHead>
                <TableHead>آخر اتصال</TableHead>
                <TableHead>الإجراءات</TableHead>
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
                        <span className="text-xs text-muted-foreground">التفعيلات:</span>
                        <span className="text-xs font-medium">{sim.todayActivations}/20</span>
                      </div>
                      <Progress value={(sim.todayActivations / 20) * 100} className="h-1" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">الشحنات:</span>
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
                        variant={sim.activationStatus === "1" ? "default" : "destructive"}
                        onClick={() => toggleSimStatus(sim.id, "activation")}
                        title={sim.activationStatus === "1" ? "تعطيل التفعيل" : "تفعيل التفعيل"}
                        className={sim.activationStatus === "1" ? "bg-success hover:bg-success/90" : ""}
                      >
                        {sim.activationStatus === "1" ? (
                          <Power className="h-4 w-4" />
                        ) : (
                          <PowerOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant={sim.topupStatus === "1" ? "default" : "destructive"}
                        onClick={() => toggleSimStatus(sim.id, "topup")}
                        title={sim.topupStatus === "1" ? "تعطيل الشحن" : "تفعيل الشحن"}
                        className={sim.topupStatus === "1" ? "bg-success hover:bg-success/90" : ""}
                      >
                        {sim.topupStatus === "1" ? (
                          <Power className="h-4 w-4" />
                        ) : (
                          <PowerOff className="h-4 w-4" />
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
    </div>
  );
}
