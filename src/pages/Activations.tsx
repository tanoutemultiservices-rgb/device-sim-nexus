import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { mockActivations } from "@/lib/mockData";
import { PlayCircle, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Activations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activations, setActivations] = useState(mockActivations);

  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return "غير متوفر";
    return new Date(timestamp).toLocaleString('ar-MA');
  };

  const cleanPending = () => {
    const pendingCount = activations.filter(a => a.status === "PENDING").length;
    if (pendingCount === 0) {
      toast.info("لا توجد عمليات معلقة");
      return;
    }
    setActivations(prev => prev.map(activation => 
      activation.status === "PENDING" 
        ? { ...activation, status: "REFUSED" as any, msgResponse: "تم إلغاء العملية" }
        : activation
    ));
    toast.success(`تم إلغاء ${pendingCount} عملية معلقة`);
  };

  const filteredActivations = activations.filter(activation =>
    activation.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activation.phoneNumber.includes(searchTerm) ||
    activation.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activation.user.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">إجمالي التفعيلات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">جميع المحاولات</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">مقبولة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {activations.filter(a => a.status === "ACCEPTED").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">عمليات ناجحة</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">معلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {activations.filter(a => a.status === "PENDING").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">بانتظار الرد</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">تفعيلات SIM</h1>
          <p className="text-muted-foreground mt-2">مراقبة عمليات تفعيل بطاقات SIM</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="destructive"
            onClick={cleanPending}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            إلغاء العمليات المعلقة
          </Button>
          <PlayCircle className="h-8 w-8 text-warning" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سجل التفعيلات</CardTitle>
          <CardDescription>جميع محاولات ونتائج تفعيل بطاقات SIM</CardDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث بالمشغل، الهاتف، المستخدم، أو الحالة..."
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
                <TableHead>المستخدم</TableHead>
                <TableHead>تاريخ الرد</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الرسالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivations.map((activation) => (
                <TableRow key={activation.id}>
                  <TableCell className="font-medium">#{activation.id}</TableCell>
                  <TableCell className="text-sm">{formatDate(activation.dateOperation)}</TableCell>
                  <TableCell>{activation.operator}</TableCell>
                  <TableCell className="font-mono">{activation.phoneNumber}</TableCell>
                  <TableCell className="font-mono text-xs">{activation.user.substring(0, 12)}...</TableCell>
                  <TableCell className="text-sm">{formatDate(activation.dateResponse)}</TableCell>
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
