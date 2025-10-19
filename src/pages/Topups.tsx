import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar } from "@/components/FilterBar";
import { topupsApi } from "@/services/api";
import { Coins, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Topups() {
  const [searchTerm, setSearchTerm] = useState("");
  const [topups, setTopups] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [operatorFilter, setOperatorFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopups();
  }, []);

  const fetchTopups = async () => {
    try {
      setLoading(true);
      const data = await topupsApi.getAll();
      setTopups(data as any[]);
    } catch (error: any) {
      toast.error(`فشل تحميل الشحنات: ${error.message}`);
      console.error('Error fetching topups:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ar-MA');
  };

  const cleanPending = async () => {
    const pendingTopups = topups.filter(t => t.STATUS === "PENDING");
    const pendingCount = pendingTopups.length;
    
    if (pendingCount === 0) {
      toast.info("لا توجد عمليات معلقة");
      return;
    }

    try {
      // Update all pending to refused
      for (const topup of pendingTopups) {
        await topupsApi.update({
          ...topup,
          STATUS: "REFUSED",
          MSG_RESPONSE: "تم إلغاء العملية"
        });
      }
      
      // Refresh data
      await fetchTopups();
      toast.success(`تم إلغاء ${pendingCount} عملية معلقة`);
    } catch (error: any) {
      toast.error(`فشل إلغاء العمليات: ${error.message}`);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setOperatorFilter("all");
    setAmountFilter("all");
    setDateFilter("all");
  };

  const uniqueOperators = useMemo(() => {
    return Array.from(new Set(topups.map(t => t.OPERATOR)));
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
    const matchesSearch = topup.OPERATOR?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topup.PHONE_NUMBER?.includes(searchTerm) ||
      topup.STATUS?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topup.USER?.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || topup.STATUS === statusFilter;
    const matchesOperator = operatorFilter === "all" || topup.OPERATOR === operatorFilter;
    const matchesDate = isWithinDateRange(parseInt(topup.DATE_OPERATION), dateFilter);
    
    let matchesAmount = true;
    if (amountFilter !== "all") {
      const amount = parseInt(topup.MONTANT || 0);
      if (amountFilter === "0-10") matchesAmount = amount >= 0 && amount <= 10;
      else if (amountFilter === "10-30") matchesAmount = amount > 10 && amount <= 30;
      else if (amountFilter === "30-50") matchesAmount = amount > 30 && amount <= 50;
      else if (amountFilter === "50+") matchesAmount = amount > 50;
    }
    
    return matchesSearch && matchesStatus && matchesOperator && matchesDate && matchesAmount;
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
              {topups.filter(t => t.STATUS === "ACCEPTED").length}
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
              {topups.filter(t => t.STATUS === "REFUSED").length}
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
              {topups.filter(t => t.STATUS === "ACCEPTED").reduce((sum, t) => sum + parseInt(t.MONTANT || 0), 0)}
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
                <TableRow key={topup.ID}>
                  <TableCell className="font-medium">#{topup.ID}</TableCell>
                  <TableCell className="text-sm">{formatDate(parseInt(topup.DATE_OPERATION))}</TableCell>
                  <TableCell>{topup.OPERATOR}</TableCell>
                  <TableCell className="font-mono">{topup.PHONE_NUMBER}</TableCell>
                  <TableCell className="font-mono font-medium">{topup.MONTANT}</TableCell>
                  <TableCell className="font-mono">{parseFloat(topup.NEW_BALANCE || 0).toFixed(3)}</TableCell>
                  <TableCell className="font-mono text-xs">{topup.USER?.substring(0, 12)}...</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={topup.STATUS?.toLowerCase() as any} 
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
