import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlayCircle } from "lucide-react";
import { toast } from "sonner";
import marocTelecomLogo from "@/assets/maroc-telecom-logo.png";
import inwiLogo from "@/assets/inwi-logo.jpg";
import orangeLogo from "@/assets/orange-logo.png";

const operators = [
  { id: "maroc-telecom", name: "Maroc Telecom", logo: marocTelecomLogo },
  { id: "inwi", name: "inwi", logo: inwiLogo },
  { id: "orange", name: "Orange MA", logo: orangeLogo }
];

export default function ActivationRequest() {
  const [selectedOperator, setSelectedOperator] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pukCode, setPukCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOperator) {
      toast.error("الرجاء اختيار المشغل");
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("الرجاء إدخال رقم هاتف صحيح");
      return;
    }
    
    if (!pukCode || pukCode.length !== 4) {
      toast.error("الرجاء إدخال رمز PUK المكون من 4 أرقام");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("تم إرسال طلب التفعيل بنجاح");
      setLoading(false);
      // Reset form
      setSelectedOperator("");
      setPhoneNumber("");
      setPukCode("");
    }, 1500);
  };

  const handlePukChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPukCode(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">طلب تفعيل بطاقة SIM</h1>
          <p className="text-muted-foreground mt-2">اختر المشغل وأدخل البيانات لتفعيل البطاقة</p>
        </div>
        <PlayCircle className="h-8 w-8 text-warning" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل التفعيل</CardTitle>
          <CardDescription>املأ النموذج لطلب تفعيل بطاقة SIM</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Operator Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">اختر المشغل</Label>
              <RadioGroup value={selectedOperator} onValueChange={setSelectedOperator}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {operators.map((operator) => (
                    <div key={operator.id}>
                      <RadioGroupItem
                        value={operator.id}
                        id={operator.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={operator.id}
                        className="flex items-center justify-center rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all aspect-square"
                      >
                        <img src={operator.logo} alt={operator.name} className="w-full h-full object-contain rounded-lg" />
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-semibold">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0612345678"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="text-lg font-mono"
                maxLength={10}
                dir="ltr"
              />
              <p className="text-sm text-muted-foreground">أدخل رقم الهاتف المكون من 10 أرقام</p>
            </div>

            {/* PUK Code */}
            <div className="space-y-2">
              <Label htmlFor="puk" className="text-base font-semibold">رمز PUK (4 أرقام)</Label>
              <Input
                id="puk"
                type="text"
                inputMode="numeric"
                placeholder="1234"
                value={pukCode}
                onChange={handlePukChange}
                className="text-2xl font-mono text-center tracking-widest"
                maxLength={4}
                dir="ltr"
              />
              <p className="text-sm text-muted-foreground">أدخل رمز PUK المكون من 4 أرقام فقط</p>
            </div>

            {/* Visual PUK Display */}
            <div className="flex justify-center gap-3 py-4">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="w-14 h-14 rounded-lg border-2 border-primary/30 bg-primary/5 flex items-center justify-center text-2xl font-bold"
                >
                  {pukCode[index] || "•"}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-warning hover:bg-warning/90"
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "تفعيل البطاقة"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
