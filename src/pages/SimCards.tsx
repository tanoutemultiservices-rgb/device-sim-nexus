import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockSimCards, mockDevices } from "@/lib/mockData";
import { CreditCard, Power, PowerOff, Search, Signal, Coins, Activity, Smartphone, Wifi } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function SimCards() {
  const [simCards, setSimCards] = useState(mockSimCards);
  const [devices, setDevices] = useState(mockDevices);
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ar-MA');
  };

  const getDevice = (deviceId: string) => {
    // Remove 'X' prefix if present in SIM card device ID
    const cleanDeviceId = deviceId.replace(/^X/, '');
    return devices.find(d => d.id === cleanDeviceId || d.id === deviceId);
  };

  const toggleDeviceStatus = (deviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        const newStatus = device.status === "1" ? "0" : "1";
        
        // If deactivating device, deactivate all its SIM cards
        if (newStatus === "0") {
          setSimCards(prevSims => prevSims.map(sim => {
            const cleanSimDeviceId = sim.device.replace(/^X/, '');
            if (cleanSimDeviceId === deviceId || sim.device === deviceId) {
              return {
                ...sim,
                activationStatus: "0",
                topupStatus: "0"
              };
            }
            return sim;
          }));
          
          toast.success(`تم تعطيل الجهاز ${device.name} وجميع بطاقات SIM الخاصة به`);
        } else {
          toast.success(`تم تفعيل الجهاز ${device.name}`);
        }
        
        return { ...device, status: newStatus };
      }
      return device;
    }));
  };

  const toggleSimStatus = (simId: number, type: "activation" | "topup") => {
    // Find the SIM card
    const sim = simCards.find(s => s.id === simId);
    if (!sim) return;

    // Check if device is active
    const device = getDevice(sim.device);
    if (!device || device.status === "0") {
      toast.error("لا يمكن تفعيل بطاقة SIM عندما يكون الجهاز غير نشط");
      return;
    }

    setSimCards(prev => prev.map(s => {
      if (s.id === simId) {
        if (type === "activation") {
          const newStatus = s.activationStatus === "1" ? "0" : "1";
          toast.success(
            newStatus === "1" 
              ? `تم تفعيل التفعيل لبطاقة SIM ${s.number}` 
              : `تم تعطيل التفعيل لبطاقة SIM ${s.number}`
          );
          return { ...s, activationStatus: newStatus };
        } else {
          const newStatus = s.topupStatus === "1" ? "0" : "1";
          toast.success(
            newStatus === "1" 
              ? `تم تفعيل الشحن لبطاقة SIM ${s.number}` 
              : `تم تعطيل الشحن لبطاقة SIM ${s.number}`
          );
          return { ...s, topupStatus: newStatus };
        }
      }
      return s;
    }));
  };

  // Group SIM cards by device
  const deviceGroups = devices.map(device => {
    const deviceSimCards = simCards.filter(sim => {
      const cleanSimDeviceId = sim.device.replace(/^X/, '');
      return cleanSimDeviceId === device.id || sim.device === device.id;
    });
    return {
      device,
      simCards: deviceSimCards
    };
  });

  // Filter by search term
  const filteredDeviceGroups = deviceGroups.filter(group => {
    const deviceMatch = group.device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        group.device.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const simMatch = group.simCards.some(sim => 
      sim.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.number.includes(searchTerm)
    );
    return deviceMatch || simMatch;
  });

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
          <CardTitle>نظرة عامة على الأجهزة وبطاقات SIM</CardTitle>
          <CardDescription>
            كل جهاز يمكن أن يحتوي على بطاقتين SIM - يمكن لكل بطاقة تنفيذ ما يصل إلى 20 عملية تفعيل يومياً
          </CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالجهاز، المشغل، أو رقم البطاقة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredDeviceGroups.map((group) => (
              <Card key={group.device.id} className="overflow-hidden border-2">
                <CardHeader className="bg-muted/50 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{group.device.name}</CardTitle>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span>{group.device.brand}</span>
                          <span>•</span>
                          <span>{group.device.os}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Wifi className="h-3 w-3" />
                            <span className="font-mono text-xs">{group.device.ip}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={group.device.status === "1" ? "default" : "secondary"}>
                          {group.device.status === "1" ? "نشط" : "غير نشط"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(group.device.lastConnect)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant={group.device.status === "1" ? "default" : "destructive"}
                        onClick={() => toggleDeviceStatus(group.device.id)}
                        className={group.device.status === "1" ? "bg-success hover:bg-success/90" : ""}
                      >
                        {group.device.status === "1" ? (
                          <>
                            <Power className="h-4 w-4 ml-1" />
                            تعطيل
                          </>
                        ) : (
                          <>
                            <PowerOff className="h-4 w-4 ml-1" />
                            تفعيل
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {group.simCards.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {group.simCards.map((sim) => (
                        <Card key={sim.id} className="bg-card/50">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-primary" />
                                  <CardTitle className="text-base">{sim.operator}</CardTitle>
                                </div>
                                <p className="text-sm font-mono text-muted-foreground">{sim.number}</p>
                              </div>
                              <Badge variant={sim.connected === "1" ? "default" : "secondary"} className="text-xs">
                                {sim.connected === "1" ? "متصل" : "غير متصل"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Coins className="h-3 w-3" />
                                  <span className="text-xs">الرصيد</span>
                                </div>
                                <p className="font-medium font-mono text-sm">{sim.balance.toFixed(3)} د</p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Activity className="h-3 w-3" />
                                  <span className="text-xs">الشحنات</span>
                                </div>
                                <p className="font-medium text-sm">{sim.todayTopups} اليوم</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">التفعيلات اليوم</span>
                                <span className="text-xs font-medium">{sim.todayActivations}/20</span>
                              </div>
                              <Progress value={(sim.todayActivations / 20) * 100} className="h-2" />
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
                                  disabled={group.device.status === "0"}
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
                                  disabled={group.device.status === "0"}
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
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>لا توجد بطاقات SIM مرتبطة بهذا الجهاز</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
