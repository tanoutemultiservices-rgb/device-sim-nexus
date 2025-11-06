import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { simCardsApi, devicesApi } from "@/services/api";
import { CreditCard, Power, PowerOff, Search, Coins, Activity, Smartphone, Wifi, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function SimCards() {
  const [simCards, setSimCards] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [simData, deviceData] = await Promise.all([
        simCardsApi.getAll(),
        devicesApi.getAll(),
      ]);
      setSimCards(simData as any[]);
      setDevices(deviceData as any[]);
    } catch (error: any) {
      toast.error(`Failed to load data: ${error.message}`);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp || timestamp === 0) return "Not available";
    return new Date(parseInt(timestamp.toString())).toLocaleString('en-US');
  };

  const getDevice = (deviceId: string) => {
    // Remove 'X' prefix if present in SIM card device ID
    const cleanDeviceId = deviceId?.replace(/^X/, '');
    return devices.find(d => d.ID === cleanDeviceId || d.ID === deviceId);
  };

  const toggleDeviceStatus = async (deviceId: string) => {
    const device = devices.find(d => d.ID === deviceId);
    if (!device) return;

    const newStatus = device.STATUS === "1" ? "0" : "1";
    
    try {
      await devicesApi.update({ ...device, STATUS: newStatus });
      
      // If deactivating device, deactivate all its SIM cards
      if (newStatus === "0") {
        const deviceSims = simCards.filter(sim => {
          const cleanSimDeviceId = sim.DEVICE?.replace(/^X/, '');
          return cleanSimDeviceId === deviceId || sim.DEVICE === deviceId;
        });
        
        for (const sim of deviceSims) {
          await simCardsApi.update({
            ...sim,
            ACTIVATION_STATUS: "0",
            TOPUP_STATUS: "0"
          });
        }
      }
      
      // Refresh data
      await fetchData();
      
      toast.success(
        newStatus === "1" 
          ? `Device ${device.NOM} activated` 
          : `Device ${device.NOM} and all its SIM cards deactivated`
      );
    } catch (error: any) {
      toast.error(`Failed to update device: ${error.message}`);
    }
  };

  const toggleSimStatus = async (simId: number, type: "activation" | "topup") => {
    // Find the SIM card
    const sim = simCards.find(s => s.ID === simId);
    if (!sim) return;

    // Check if device is active
    const device = getDevice(sim.DEVICE);
    if (!device || device.STATUS === "0") {
      toast.error("Cannot activate SIM card when device is inactive");
      return;
    }

    try {
      const newStatus = type === "activation" 
        ? (sim.ACTIVATION_STATUS === "1" ? "0" : "1")
        : (sim.TOPUP_STATUS === "1" ? "0" : "1");

      await simCardsApi.update({
        ...sim,
        [type === "activation" ? "ACTIVATION_STATUS" : "TOPUP_STATUS"]: newStatus
      });

      await fetchData();

      toast.success(
        newStatus === "1" 
          ? `${type === "activation" ? "Activation" : "Top-up"} enabled for SIM card ${sim.NUMBER}` 
          : `${type === "activation" ? "Activation" : "Top-up"} disabled for SIM card ${sim.NUMBER}`
      );
    } catch (error: any) {
      toast.error(`Failed to update SIM card: ${error.message}`);
    }
  };

  // Filter devices to only show EXECUTOR type
  const executorDevices = devices.filter(device => device.TYPE === "EXECUTOR");
  
  // Group SIM cards by executor devices only
  const deviceGroups = executorDevices.map(device => {
    const deviceSimCards = simCards.filter(sim => {
      const cleanSimDeviceId = sim.DEVICE?.replace(/^X/, '');
      return cleanSimDeviceId === device.ID || sim.DEVICE === device.ID;
    });
    return {
      device,
      simCards: deviceSimCards
    };
  });
  
  // Get all SIM cards from executor devices for statistics
  const executorSimCards = simCards.filter(sim => {
    const cleanSimDeviceId = sim.DEVICE?.replace(/^X/, '');
    return executorDevices.some(device => 
      device.ID === cleanSimDeviceId || device.ID === sim.DEVICE
    );
  });

  // Filter by search term
  const filteredDeviceGroups = deviceGroups.filter(group => {
    const deviceMatch = group.device.NOM?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        group.device.BRAND?.toLowerCase().includes(searchTerm.toLowerCase());
    const simMatch = group.simCards.some(sim => 
      sim.OPERATOR?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.NUMBER?.toString().includes(searchTerm)
    );
    return deviceMatch || simMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">إجمالي البطاقات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{executorSimCards.length}</div>
            <p className="text-xs text-muted-foreground mt-1">بطاقات SIM للتنفيذ</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">متصلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {executorSimCards.filter(s => s.CONNECTED === "1").length}
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
              {executorSimCards.reduce((sum, s) => sum + parseInt(s.TODAY_NB_ACTIVATION || 0), 0)}
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
              {executorSimCards.reduce((sum, s) => sum + parseFloat(s.BALANCE || 0), 0).toFixed(2)}
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
              <Card key={group.device.ID} className="overflow-hidden border-2">
                <CardHeader className="bg-muted/50 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{group.device.NOM}</CardTitle>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span>{group.device.BRAND}</span>
                          <span>•</span>
                          <span>{group.device.OS}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Wifi className="h-3 w-3" />
                            <span className="font-mono text-xs">{group.device.IP}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={group.device.STATUS === "1" ? "default" : "secondary"}>
                          {group.device.STATUS === "1" ? "نشط" : "غير نشط"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(parseInt(group.device.LAST_CONNECT))}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant={group.device.STATUS === "1" ? "default" : "destructive"}
                        onClick={() => toggleDeviceStatus(group.device.ID)}
                        className={group.device.STATUS === "1" ? "bg-success hover:bg-success/90" : ""}
                      >
                        {group.device.STATUS === "1" ? (
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
                        <Card key={sim.ID} className="bg-card/50">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-primary" />
                                  <CardTitle className="text-base">{sim.OPERATOR}</CardTitle>
                                </div>
                                <p className="text-sm font-mono text-muted-foreground">{sim.NUMBER || "غير متوفر"}</p>
                              </div>
                              <Badge variant={sim.CONNECTED === "1" ? "default" : "secondary"} className="text-xs">
                                {sim.CONNECTED === "1" ? "متصل" : "غير متصل"}
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
                                <p className="font-medium font-mono text-sm">{parseFloat(sim.BALANCE || 0).toFixed(3)} د</p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Activity className="h-3 w-3" />
                                  <span className="text-xs">الشحنات</span>
                                </div>
                                <p className="font-medium text-sm">{sim.TODAY_NB_TOPUP || 0} اليوم</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">التفعيلات اليوم</span>
                                <span className="text-xs font-medium">{sim.TODAY_NB_ACTIVATION || 0}/20</span>
                              </div>
                              <Progress value={(parseInt(sim.TODAY_NB_ACTIVATION || 0) / 20) * 100} className="h-2" />
                            </div>

                            <div className="pt-3 border-t">
                              <p className="text-xs text-muted-foreground mb-3">
                                آخر اتصال: {formatDate(parseInt(sim.LAST_CONNECT || 0))}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant={sim.ACTIVATION_STATUS === "1" ? "default" : "destructive"}
                                  onClick={() => toggleSimStatus(sim.ID, "activation")}
                                  disabled={group.device.STATUS === "0"}
                                  className={`flex-1 ${sim.ACTIVATION_STATUS === "1" ? "bg-success hover:bg-success/90" : ""}`}
                                >
                                  {sim.ACTIVATION_STATUS === "1" ? (
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
                                  variant={sim.TOPUP_STATUS === "1" ? "default" : "destructive"}
                                  onClick={() => toggleSimStatus(sim.ID, "topup")}
                                  disabled={group.device.STATUS === "0"}
                                  className={`flex-1 ${sim.TOPUP_STATUS === "1" ? "bg-success hover:bg-success/90" : ""}`}
                                >
                                  {sim.TOPUP_STATUS === "1" ? (
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
