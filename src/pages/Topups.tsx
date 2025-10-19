import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar } from "@/components/FilterBar";
import { mockTopups } from "@/lib/mockData";
import { Coins, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Topups() {
  const [searchTerm, setSearchTerm] = useState("");
  const [topups, setTopups] = useState(mockTopups);
  const [statusFilter, setStatusFilter] = useState("all");
  const [operatorFilter, setOperatorFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ar-MA');
  };

  const cleanPending = () => {
    const pendingCount = topups.filter(t => t.status === "PENDING" as any).length;
    if (pendingCount === 0) {
      toast.info("لا توجد عمليات معلقة");
      return;
    }
    setTopups(prev => prev.map(topup => 
      topup.status === "PENDING" 
        ? { ...topup, status: "REFUSED", msgResponse: "تم إلغاء العملية" }
        : topup
    ));
    toast.success(`تم إلغاء ${pendingCount} عملية معلقة`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setOperatorFilter("all");
    setAmountFilter("all");
    setDateFilter("all");
  };

  const uniqueOperators = useMemo(() => {
    return Array.from(new Set(topups.map(t => t.operator)));
  }, [topups]);

  const isWithinDateRange = (timestamp: number, filter: string) => {
    if (filter === "all") return true;
    const date = new Date(timestamp);
    const now = new Date();
    
    if (filter === "today") {
      return date.toDateString() === now.toDateString();
    } else if (filter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    } else if (filter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return date >= monthAgo;
    }
    return true;
  };

  const filteredTopups = topups.filter(topup => {
    const matchesSearch = topup.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topup.phoneNumber.includes(searchTerm) ||
      topup.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topup.user.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || topup.status === statusFilter;
    const matchesOperator = operatorFilter === "all" || topup.operator === operatorFilter;
    const matchesDate = isWithinDateRange(topup.dateOperation, dateFilter);
    
    let matchesAmount = true;
    if (amountFilter !== "all") {
      const amount = topup.montant;
      if (amountFilter === "0-10") matchesAmount = amount >= 0 && amount <= 10;
      else if (amountFilter === "10-30") matchesAmount = amount > 10 && amount <= 30;
      else if (amountFilter === "30-50") matchesAmount = amount > 30 && amount <= 50;
      else if (amountFilter === "50+") matchesAmount = amount > 50;
    }
    
    return matchesSearch && matchesStatus && matchesOperator && matchesDate && matchesAmount;
  });

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">إجمالي الشحنات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topups.length}</div>
            <p className="text-xs text-muted-foreground mt-1">جميع المعاملات</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">مقبولة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {topups.filter(t => t.status === "ACCEPTED").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">ناجحة</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">مرفوضة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {topups.filter(t => t.status === "REFUSED").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">فاشلة</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">المبلغ الإجمالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {topups.filter(t => t.status === "ACCEPTED").reduce((sum, t) => sum + t.montant, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">درهم</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">شحن الرصيد</h1>
          <p className="text-muted-foreground mt-2">مراقبة عمليات إعادة شحن الرصيد</p>
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
          <Coins className="h-8 w-8 text-success" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>سجل الشحنات</CardTitle>
          <CardDescription>جميع معاملات إعادة شحن الرصيد</CardDescription>
          <div className="mt-4">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              operatorFilter={operatorFilter}
              onOperatorChange={setOperatorFilter}
              amountFilter={amountFilter}
              onAmountChange={setAmountFilter}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
              onReset={resetFilters}
              searchPlaceholder="ابحث بالمشغل، الهاتف، المستخدم، أو الحالة..."
              showOperator={true}
              showAmount={true}
              showDate={true}
              operators={uniqueOperators}
            />
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
                <TableHead>المبلغ (درهم)</TableHead>
                <TableHead>الرصيد الجديد</TableHead>
                <TableHead>المستخدم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الرسالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTopups.map((topup) => (
                <TableRow key={topup.id}>
                  <TableCell className="font-medium">#{topup.id}</TableCell>
                  <TableCell className="text-sm">{formatDate(topup.dateOperation)}</TableCell>
                  <TableCell>{topup.operator}</TableCell>
                  <TableCell className="font-mono">{topup.phoneNumber}</TableCell>
                  <TableCell className="font-mono font-medium">{topup.montant}</TableCell>
                  <TableCell className="font-mono">{topup.newBalance.toFixed(3)}</TableCell>
                  <TableCell className="font-mono text-xs">{topup.user.substring(0, 12)}...</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={topup.status.toLowerCase() as any} 
                    />
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{topup.msgResponse}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
