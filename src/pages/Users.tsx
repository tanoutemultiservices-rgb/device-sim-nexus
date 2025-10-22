import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar } from "@/components/FilterBar";
import { usersApi } from "@/services/api";
import { Users as UsersIcon, Power, PowerOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data as any[]);
    } catch (error: any) {
      toast.error(`فشل تحميل المستخدمين: ${error.message}`);
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.ID === userId);
    if (!user) return;

    const newStatus = user.STATUS === "ACCEPT" ? "BLOCK" : "ACCEPT";
    
    try {
      await usersApi.update({ ...user, STATUS: newStatus });
      setUsers(prev => prev.map(u => 
        u.ID === userId ? { ...u, STATUS: newStatus } : u
      ));
      toast.success(
        newStatus === "ACCEPT" 
          ? `تم تفعيل المستخدم ${user.USERNAME}` 
          : `تم تعطيل المستخدم ${user.USERNAME}`
      );
    } catch (error: any) {
      toast.error(`فشل تحديث المستخدم: ${error.message}`);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setAmountFilter("all");
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.USERNAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.NOM?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.PRENOM?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.EMAIL?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.TEL?.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || user.STATUS === statusFilter;
    
    let matchesAmount = true;
    if (amountFilter !== "all") {
      const balance = parseFloat(user.BALANCE || 0);
      if (amountFilter === "0-10") matchesAmount = balance >= 0 && balance <= 10;
      else if (amountFilter === "10-30") matchesAmount = balance > 10 && balance <= 30;
      else if (amountFilter === "30-50") matchesAmount = balance > 30 && balance <= 50;
      else if (amountFilter === "50+") matchesAmount = balance > 50;
    }
    
    return matchesSearch && matchesStatus && matchesAmount;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">الحسابات المسجلة</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">المستخدمون النشطون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {users.filter(u => u.STATUS === "ACCEPT").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">الحسابات المعتمدة</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">الرصيد الإجمالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {users.reduce((sum, u) => sum + parseFloat(u.BALANCE || 0), 0).toFixed(3)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">درهم</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">إدارة المستخدمين</h1>
          <p className="text-muted-foreground mt-2">عرض وإدارة حسابات العملاء</p>
        </div>
        <UsersIcon className="h-8 w-8 text-accent" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>المستخدمون المسجلون</CardTitle>
          <CardDescription>جميع حسابات العملاء في النظام</CardDescription>
          <div className="mt-4">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              amountFilter={amountFilter}
              onAmountChange={setAmountFilter}
              onReset={resetFilters}
              searchPlaceholder="ابحث باسم المستخدم، الاسم، البريد الإلكتروني، أو الهاتف..."
              showAmount={true}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المستخدم</TableHead>
                <TableHead>الاسم الكامل</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الهاتف</TableHead>
                <TableHead>الرصيد (درهم)</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.ID}>
                  <TableCell className="font-medium">{user.USERNAME}</TableCell>
                  <TableCell>{`${user.PRENOM} ${user.NOM}`}</TableCell>
                  <TableCell>{user.EMAIL}</TableCell>
                  <TableCell className="font-mono">{user.TEL}</TableCell>
                  <TableCell className="font-mono">{parseFloat(user.BALANCE || 0).toFixed(3)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      user
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={
                        user.STATUS === "ACCEPT" ? "active" : 
                        user.STATUS === "PENDING" ? "pending" : 
                        "blocked"
                      } 
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={user.STATUS === "ACCEPT" ? "default" : "destructive"}
                      onClick={() => toggleUserStatus(user.ID)}
                      className={user.STATUS === "ACCEPT" ? "bg-success hover:bg-success/90" : ""}
                    >
                      {user.STATUS === "ACCEPT" ? (
                        <Power className="h-4 w-4" />
                      ) : (
                        <PowerOff className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                عرض {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} من {filteredUsers.length}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  الأول
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>
                <span className="text-sm">
                  صفحة {currentPage} من {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  التالي
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  الأخير
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
