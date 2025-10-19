import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockSimCards, mockDevices } from "@/lib/mockData";
import { CreditCard, Power, PowerOff, Search, Signal, Coins, Activity } from "lucide-react";
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSimCards.map((sim) => (
              <Card key={sim.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">{sim.operator}</CardTitle>
                      </div>
                      <p className="text-sm font-mono text-muted-foreground">{sim.number}</p>
                    </div>
                    <Badge variant={sim.connected === "1" ? "default" : "secondary"}>
                      {sim.connected === "1" ? "متصل" : "غير متصل"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Signal className="h-3 w-3" />
                        <span>الجهاز</span>
                      </div>
                      <p className="font-medium">{getDeviceName(sim.device)}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Coins className="h-3 w-3" />
                        <span>الرصيد</span>
                      </div>
                      <p className="font-medium font-mono">{sim.balance.toFixed(3)} د</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">التفعيلات اليوم</span>
                        </div>
                        <span className="text-xs font-medium">{sim.todayActivations}/20</span>
                      </div>
                      <Progress value={(sim.todayActivations / 20) * 100} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">الشحنات اليوم</span>
                      <span className="font-medium">{sim.todayTopups}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-3">
                      آخر اتصال: {formatDate(sim.lastConnect)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={sim.activationStatus === "1" ? "default" : "destructive"}
                        onClick={() => toggleSimStatus(sim.id, "activation")}
                        className={`flex-1 ${sim.activationStatus === "1" ? "bg-success hover:bg-success/90" : ""}`}
                      >
                        {sim.activationStatus === "1" ? (
                          <>
                            <Power className="h-3 w-3 ml-1" />
                            تفعيل
                          </>
                        ) : (
                          <>
                            <PowerOff className="h-3 w-3 ml-1" />
                            تفعيل
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant={sim.topupStatus === "1" ? "default" : "destructive"}
                        onClick={() => toggleSimStatus(sim.id, "topup")}
                        className={`flex-1 ${sim.topupStatus === "1" ? "bg-success hover:bg-success/90" : ""}`}
                      >
                        {sim.topupStatus === "1" ? (
                          <>
                            <Power className="h-3 w-3 ml-1" />
                            شحن
                          </>
                        ) : (
                          <>
                            <PowerOff className="h-3 w-3 ml-1" />
                            شحن
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
