import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar } from "@/components/FilterBar";
import { activationsApi } from "@/services/api";
import { PlayCircle, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
export default function Activations() {
  const {
    user
  } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activations, setActivations] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [operatorFilter, setOperatorFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchActivations();
  }, []);
  const fetchActivations = async () => {
    try {
      setLoading(true);
      const data = await activationsApi.getAll();
      setActivations(data as any[]);
    } catch (error: any) {
      toast.error(`فشل تحميل التفعيلات: ${error.message}`);
      console.error('Error fetching activations:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return "غير متوفر";
    return new Date(timestamp).toLocaleString('ar-MA');
  };
  const cleanPending = async () => {
    const pendingActivations = activations.filter(a => a.STATUS === "PENDING");
    const pendingCount = pendingActivations.length;
    if (pendingCount === 0) {
      toast.info("لا توجد عمليات معلقة");
      return;
    }
    try {
      // Update all pending to refused
      for (const activation of pendingActivations) {
        await activationsApi.update({
          ...activation,
          STATUS: "REFUSED",
          MSG_RESPONSE: "تم إلغاء العملية"
        });
      }

      // Refresh data
      await fetchActivations();
      toast.success(`تم إلغاء ${pendingCount} عملية معلقة`);
    } catch (error: any) {
      toast.error(`فشل إلغاء العمليات: ${error.message}`);
    }
  };
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setOperatorFilter("all");
    setDateFilter("all");
  };
  const uniqueOperators = useMemo(() => {
    return Array.from(new Set(activations.map(a => a.OPERATOR)));
  }, [activations]);
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
  const filteredActivations = activations.filter(activation => {
    // Filter by user role
    if (user?.ROLE === 'CUSTOMER' && activation.USER !== user.ID) {
      return false;
    }
    const matchesSearch = activation.OPERATOR?.toLowerCase().includes(searchTerm.toLowerCase()) || activation.PHONE_NUMBER?.includes(searchTerm) || activation.STATUS?.toLowerCase().includes(searchTerm.toLowerCase()) || activation.USER?.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || activation.STATUS === statusFilter;
    const matchesOperator = operatorFilter === "all" || activation.OPERATOR === operatorFilter;
    const matchesDate = isWithinDateRange(parseInt(activation.DATE_OPERATION), dateFilter);
    return matchesSearch && matchesStatus && matchesOperator && matchesDate;
  });
  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div className="space-y-6 animate-fade-in" dir="rtl">
      

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {user?.ROLE === 'CUSTOMER' ? 'تفعيلاتي' : 'جميع تفعيلات SIM'}
          </h1>
          
        </div>
        <div className="flex items-center gap-3">
          {user?.ROLE === 'ADMIN' && <Button variant="destructive" onClick={cleanPending} className="gap-2">
              <Trash2 className="h-4 w-4" />
              إلغاء العمليات المعلقة
            </Button>}
          <PlayCircle className="h-8 w-8 text-warning" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {user?.ROLE === 'CUSTOMER' ? 'سجل تفعيلاتي' : 'سجل جميع التفعيلات'}
          </CardTitle>
          <CardDescription>
            {user?.ROLE === 'CUSTOMER' ? 'جميع عمليات التفعيل الخاصة بك' : 'جميع محاولات ونتائج تفعيل بطاقات SIM'}
          </CardDescription>
          <div className="mt-4">
            <FilterBar searchTerm={searchTerm} onSearchChange={setSearchTerm} statusFilter={statusFilter} onStatusChange={setStatusFilter} operatorFilter={operatorFilter} onOperatorChange={setOperatorFilter} dateFilter={dateFilter} onDateChange={setDateFilter} onReset={resetFilters} searchPlaceholder="ابحث بالمشغل، الهاتف، المستخدم، أو الحالة..." showOperator={true} showDate={true} operators={uniqueOperators} />
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
                <TableHead>كود USSD</TableHead>
                <TableHead>المستخدم</TableHead>
                <TableHead>تاريخ الرد</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الرسالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivations.map((activation: any) => <TableRow key={activation.ID}>
                  <TableCell className="font-medium">#{activation.ID}</TableCell>
                  <TableCell className="text-sm">{formatDate(parseInt(activation.DATE_OPERATION))}</TableCell>
                  <TableCell>{activation.OPERATOR}</TableCell>
                  <TableCell className="font-mono">{activation.PHONE_NUMBER}</TableCell>
                  <TableCell className="font-mono text-sm text-primary">{activation.CODE_USSD || "N/A"}</TableCell>
                  <TableCell className="font-mono text-xs">{activation.USER?.substring(0, 12)}...</TableCell>
                  <TableCell className="text-sm">{formatDate(parseInt(activation.DATE_RESPONSE || 0))}</TableCell>
                  <TableCell>
                    <StatusBadge status={activation.STATUS?.toLowerCase() as any} />
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{activation.MSG_RESPONSE || "قيد الانتظار..."}</TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
}