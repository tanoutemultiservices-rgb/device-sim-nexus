import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Smartphone, CreditCard, Users, PlayCircle, Coins, Activity, Search, Loader2 } from "lucide-react";
import { devicesApi, simCardsApi, usersApi, activationsApi, topupsApi } from "@/services/api";
import { toast } from "sonner";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [topupSearchTerm, setTopupSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<any[]>([]);
  const [simCards, setSimCards] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activations, setActivations] = useState<any[]>([]);
  const [topups, setTopups] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [devicesData, simCardsData, usersData, activationsData, topupsData] = await Promise.all([
          devicesApi.getAll(),
          simCardsApi.getAll(),
          usersApi.getAll(),
          activationsApi.getAll(),
          topupsApi.getAll(),
        ]);
        
        setDevices(devicesData as any[]);
        setSimCards(simCardsData as any[]);
        setUsers(usersData as any[]);
        setActivations(activationsData as any[]);
        setTopups(topupsData as any[]);
      } catch (error: any) {
        toast.error(`فشل تحميل البيانات: ${error.message}`);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeDevices = devices.filter(d => d.STATUS === "1").length;
  const activeSimCards = simCards.filter(s => s.CONNECTED === "1").length;
  const totalUsers = users.length;
  const todayActivations = activations.length;
  const todayTopups = topups.length;
  const totalBalance = users.reduce((sum, user) => sum + parseFloat(user.BALANCE || 0), 0);

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const filteredActivations = activations.filter(activation =>
    activation.OPERATOR.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activation.PHONE_NUMBER.includes(searchTerm) ||
    activation.STATUS.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTopups = topups.filter(topup =>
    topup.OPERATOR.toLowerCase().includes(topupSearchTerm.toLowerCase()) ||
    topup.STATUS.toLowerCase().includes(topupSearchTerm.toLowerCase()) ||
    topup.USER.includes(topupSearchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { 
      title: "الأجهزة النشطة", 
      value: `${activeDevices}/${devices.length}`,
      icon: Smartphone, 
      description: "الأجهزة المتصلة",
      color: "text-primary",
      url: "/devices"
    },
    { 
      title: "بطاقات SIM النشطة", 
      value: `${activeSimCards}/${simCards.length}`,
      icon: CreditCard, 
      description: "البطاقات المتصلة",
      color: "text-success",
      url: "/sim-cards"
    },
    { 
      title: "إجمالي المستخدمين", 
      value: totalUsers, 
      icon: Users, 
      description: "المستخدمين المسجلين",
      color: "text-accent",
      url: "/users"
    },
    { 
      title: "التفعيلات اليوم", 
      value: todayActivations, 
      icon: PlayCircle, 
      description: "تفعيل البطاقات",
      color: "text-warning",
      url: "/activations"
    },
    { 
      title: "الشحنات اليوم", 
      value: todayTopups, 
      icon: Coins, 
      description: "إعادة الشحن",
      color: "text-primary",
      url: "/topups"
    },
    { 
      title: "الرصيد الإجمالي", 
      value: `${totalBalance.toFixed(3)} درهم`, 
      icon: Activity, 
      description: "رصيد المستخدمين",
      color: "text-success",
      url: "/users"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-2">مرحباً بك في نظام إدارة عمليات الاتصالات</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="hover:shadow-lg transition-all duration-200 animate-fade-in cursor-pointer" 
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => navigate(stat.url)}
          >
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
          <CardTitle>التفعيلات الأخيرة</CardTitle>
          <CardDescription>آخر عمليات تفعيل بطاقات SIM</CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالمشغل، الهاتف، أو الحالة..."
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
                <TableHead>التاريخ</TableHead>
                <TableHead>المشغل</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الرسالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivations.slice(0, 10).map((activation) => (
                <TableRow key={activation.ID}>
                  <TableCell className="font-medium">#{activation.ID}</TableCell>
                  <TableCell className="text-sm">{formatDate(parseInt(activation.DATE_OPERATION))}</TableCell>
                  <TableCell>{activation.OPERATOR}</TableCell>
                  <TableCell className="font-mono">{activation.PHONE_NUMBER}</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={activation.STATUS.toLowerCase() as any} 
                    />
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{activation.MSG_RESPONSE || "قيد الانتظار..."}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الشحنات الأخيرة</CardTitle>
          <CardDescription>آخر عمليات شحن الرصيد</CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالمشغل، المستخدم، أو الحالة..."
                value={topupSearchTerm}
                onChange={(e) => setTopupSearchTerm(e.target.value)}
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
                <TableHead>التاريخ</TableHead>
                <TableHead>المشغل</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>المستخدم</TableHead>
                <TableHead>الرصيد الجديد</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الرسالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTopups.slice(0, 10).map((topup: any) => (
                <TableRow key={topup.ID}>
                  <TableCell className="font-medium">#{topup.ID}</TableCell>
                  <TableCell className="text-sm">{formatDate(parseInt(topup.DATE_OPERATION))}</TableCell>
                  <TableCell>{topup.OPERATOR}</TableCell>
                  <TableCell className="font-mono">{topup.MONTANT} درهم</TableCell>
                  <TableCell className="font-mono text-xs">{topup.USER.substring(0, 12)}...</TableCell>
                  <TableCell className="font-mono">{parseFloat(topup.NEW_BALANCE || 0).toFixed(3)} درهم</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={topup.STATUS.toLowerCase() as any} 
                    />
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{topup.MSG_RESPONSE || "قيد الانتظار..."}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
