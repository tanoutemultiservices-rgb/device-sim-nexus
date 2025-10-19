import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar } from "@/components/FilterBar";
import { mockUsers } from "@/lib/mockData";
import { Users as UsersIcon, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === "ACCEPT" ? "BLOCK" : "ACCEPT";
        toast.success(
          newStatus === "ACCEPT" 
            ? `تم تفعيل المستخدم ${user.username}` 
            : `تم تعطيل المستخدم ${user.username}`
        );
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setAmountFilter("all");
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tel.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    let matchesAmount = true;
    if (amountFilter !== "all") {
      const balance = user.balance;
      if (amountFilter === "0-10") matchesAmount = balance >= 0 && balance <= 10;
      else if (amountFilter === "10-30") matchesAmount = balance > 10 && balance <= 30;
      else if (amountFilter === "30-50") matchesAmount = balance > 30 && balance <= 50;
      else if (amountFilter === "50+") matchesAmount = balance > 50;
    }
    
    return matchesSearch && matchesStatus && matchesAmount;
  });

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
              {users.filter(u => u.status === "ACCEPT").length}
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
              {users.reduce((sum, u) => sum + u.balance, 0).toFixed(3)}
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
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{`${user.prenom} ${user.nom}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="font-mono">{user.tel}</TableCell>
                  <TableCell className="font-mono">{user.balance.toFixed(3)}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={
                        user.status === "ACCEPT" ? "active" : 
                        user.status === "PENDING" ? "pending" : 
                        "blocked"
                      } 
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={user.status === "ACCEPT" ? "default" : "destructive"}
                      onClick={() => toggleUserStatus(user.id)}
                      className={user.status === "ACCEPT" ? "bg-success hover:bg-success/90" : ""}
                    >
                      {user.status === "ACCEPT" ? (
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
        </CardContent>
      </Card>
    </div>
  );
}
