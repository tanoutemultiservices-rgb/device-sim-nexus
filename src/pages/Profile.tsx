import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Wallet } from "lucide-react";
import { toast } from "sonner";
import { usersApi } from "@/services/api";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    USERNAME: "",
    NOM: "",
    PRENOM: "",
    EMAIL: "",
    TEL: "",
    VILLE: "",
    ADRESSE: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await usersApi.getAll();
        // Get first active user for demo (in production, use authentication)
        const activeUser = (userData as any[]).find((u: any) => u.STATUS === 'ACCEPT');
        if (activeUser) {
          setCurrentUser(activeUser);
          setFormData({
            USERNAME: activeUser.USERNAME || "",
            NOM: activeUser.NOM || "",
            PRENOM: activeUser.PRENOM || "",
            EMAIL: activeUser.EMAIL || "",
            TEL: activeUser.TEL || "",
            VILLE: activeUser.VILLE || "",
            ADRESSE: activeUser.ADRESSE || "",
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error("خطأ في تحميل بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("لم يتم العثور على المستخدم");
      return;
    }

    setSaving(true);
    
    try {
      await usersApi.update({
        ...currentUser,
        ...formData,
      });
      
      toast.success("تم تحديث الملف الشخصي بنجاح");
      
      // Refresh user data
      const userData = await usersApi.getAll();
      const activeUser = (userData as any[]).find((u: any) => u.STATUS === 'ACCEPT');
      setCurrentUser(activeUser);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("حدث خطأ أثناء تحديث الملف الشخصي");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
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
              {currentUser?.BALANCE || "0.000"} <span className="text-lg">درهم</span>
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
                currentUser?.STATUS === 'ACCEPT' ? 'bg-success' : 
                currentUser?.STATUS === 'PENDING' ? 'bg-warning' : 'bg-destructive'
              }`}></div>
              <span className="text-lg font-semibold">
                {currentUser?.STATUS === 'ACCEPT' ? 'مفعل' :
                 currentUser?.STATUS === 'PENDING' ? 'قيد المراجعة' : 'محظور'}
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
            <div className="text-sm font-mono truncate" title={currentUser?.DEVICE}>
              {currentUser?.DEVICE || "لا يوجد"}
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

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="VILLE" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  المدينة
                </Label>
                <Input
                  id="VILLE"
                  name="VILLE"
                  value={formData.VILLE}
                  onChange={handleInputChange}
                  placeholder="أدخل المدينة"
                />
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ADRESSE">العنوان</Label>
                <Input
                  id="ADRESSE"
                  name="ADRESSE"
                  value={formData.ADRESSE}
                  onChange={handleInputChange}
                  placeholder="أدخل العنوان الكامل"
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
