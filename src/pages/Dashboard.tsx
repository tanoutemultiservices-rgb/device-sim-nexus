import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Smartphone, CreditCard, Users, PlayCircle, Coins, Activity, Search } from "lucide-react";
import { mockDevices, mockSimCards, mockUsers, mockActivations, mockTopups } from "@/lib/mockData";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const activeDevices = mockDevices.filter(d => d.status === "1").length;
  const activeSimCards = mockSimCards.filter(s => s.connected === "1").length;
  const totalUsers = mockUsers.length;
  const todayActivations = mockActivations.length;
  const todayTopups = mockTopups.length;
  const totalBalance = mockUsers.reduce((sum, user) => sum + user.balance, 0);

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const filteredActivations = mockActivations.filter(activation =>
    activation.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activation.phoneNumber.includes(searchTerm) ||
    activation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { 
      title: "الأجهزة النشطة", 
      value: `${activeDevices}/${mockDevices.length}`, 
      icon: Smartphone, 
      description: "الأجهزة المتصلة",
      color: "text-primary",
      url: "/devices"
    },
    { 
      title: "بطاقات SIM النشطة", 
      value: `${activeSimCards}/${mockSimCards.length}`, 
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
                <TableRow key={activation.id}>
                  <TableCell className="font-medium">#{activation.id}</TableCell>
                  <TableCell className="text-sm">{formatDate(activation.dateOperation)}</TableCell>
                  <TableCell>{activation.operator}</TableCell>
                  <TableCell className="font-mono">{activation.phoneNumber}</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={activation.status.toLowerCase() as any} 
                    />
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{activation.msgResponse || "قيد الانتظار..."}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
