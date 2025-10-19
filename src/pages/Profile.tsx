import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Wallet } from "lucide-react";
import { toast } from "sonner";
import { usersApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user: currentUser, login } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    USERNAME: currentUser?.username || "",
    NOM: currentUser?.nom || "",
    PRENOM: currentUser?.prenom || "",
    EMAIL: currentUser?.email || "",
    TEL: currentUser?.tel || "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        USERNAME: currentUser.username || "",
        NOM: currentUser.nom || "",
        PRENOM: currentUser.prenom || "",
        EMAIL: currentUser.email || "",
        TEL: currentUser.tel || "",
      });
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("لم يتم العثور على بيانات المستخدم");
      return;
    }

    setSaving(true);
    
    try {
      await usersApi.update({
        ID: currentUser.id,
        USERNAME: formData.USERNAME,
        NOM: formData.NOM,
        PRENOM: formData.PRENOM,
        EMAIL: formData.EMAIL,
        TEL: formData.TEL,
        STATUS: currentUser.status,
        BALANCE: currentUser.balance,
        DEVICE: currentUser.device,
        ROLE: currentUser.role,
      });
      
      toast.success("تم تحديث الملف الشخصي بنجاح");
      
      // Refresh user data
      await login(currentUser.id);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("حدث خطأ أثناء تحديث الملف الشخصي");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">لم يتم العثور على بيانات المستخدم</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">الملف الشخصي</h1>
          <p className="text-muted-foreground mt-2">عرض وتحديث معلوماتك الشخصية</p>
        </div>
        <User className="h-8 w-8 text-primary" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              الرصيد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {currentUser?.balance || "0.000"} <span className="text-lg">درهم</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">رصيدك الحالي</p>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                currentUser?.status === 'ACCEPT' ? 'bg-success' : 
                currentUser?.status === 'PENDING' ? 'bg-warning' : 'bg-destructive'
              }`}></div>
              <span className="text-lg font-semibold">
                {currentUser?.status === 'ACCEPT' ? 'مفعل' :
                 currentUser?.status === 'PENDING' ? 'قيد المراجعة' : 'محظور'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">حالة الحساب</p>
          </CardContent>
        </Card>

        {/* Device Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>الجهاز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono truncate" title={currentUser?.device}>
              {currentUser?.device || "لا يوجد"}
            </div>
            <p className="text-sm text-muted-foreground mt-2">معرف الجهاز</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الشخصية</CardTitle>
          <CardDescription>قم بتحديث معلوماتك الشخصية</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="USERNAME" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  اسم المستخدم
                </Label>
                <Input
                  id="USERNAME"
                  name="USERNAME"
                  value={formData.USERNAME}
                  onChange={handleInputChange}
                  placeholder="أدخل اسم المستخدم"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="EMAIL" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="EMAIL"
                  name="EMAIL"
                  type="email"
                  value={formData.EMAIL}
                  onChange={handleInputChange}
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="NOM">الاسم العائلي</Label>
                <Input
                  id="NOM"
                  name="NOM"
                  value={formData.NOM}
                  onChange={handleInputChange}
                  placeholder="أدخل الاسم العائلي"
                />
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="PRENOM">الاسم الشخصي</Label>
                <Input
                  id="PRENOM"
                  name="PRENOM"
                  value={formData.PRENOM}
                  onChange={handleInputChange}
                  placeholder="أدخل الاسم الشخصي"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="TEL" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  رقم الهاتف
                </Label>
                <Input
                  id="TEL"
                  name="TEL"
                  type="tel"
                  value={formData.TEL}
                  onChange={handleInputChange}
                  placeholder="0612345678"
                  maxLength={10}
                />
              </div>

              {/* Role Display */}
              <div className="space-y-2">
                <Label>الدور</Label>
                <Input
                  value={currentUser.role}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={saving}
            >
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
