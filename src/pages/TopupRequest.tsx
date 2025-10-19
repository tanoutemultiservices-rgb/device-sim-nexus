import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Coins, CreditCard } from "lucide-react";
import { toast } from "sonner";

const operators = [
  { id: "maroc-telecom", name: "Maroc Telecom", color: "bg-blue-500" },
  { id: "inwi", name: "inwi", color: "bg-red-500" },
  { id: "orange", name: "Orange MA", color: "bg-orange-500" }
];

const amounts = [5, 10, 20, 50, 100, 200];

const offers = ["*1", "*2", "*3", "*6", "*22"];

export default function TopupRequest() {
  const [selectedOperator, setSelectedOperator] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedOffer, setSelectedOffer] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
    
    if (!selectedAmount) {
      toast.error("الرجاء اختيار المبلغ");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("تم إرسال طلب الشحن بنجاح");
      setLoading(false);
      // Reset form
      setSelectedOperator("");
      setSelectedAmount("");
      setSelectedOffer("");
      setPhoneNumber("");
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">طلب شحن رصيد</h1>
          <p className="text-muted-foreground mt-2">اختر المشغل والمبلغ لشحن رصيدك</p>
        </div>
        <Coins className="h-8 w-8 text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الشحن</CardTitle>
          <CardDescription>املأ النموذج لطلب شحن الرصيد</CardDescription>
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
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                      >
                        <div className={`w-16 h-16 rounded-full ${operator.color} flex items-center justify-center mb-3`}>
                          <CreditCard className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-lg font-semibold">{operator.name}</span>
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
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="text-lg"
                maxLength={10}
              />
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">اختر المبلغ (درهم)</Label>
              <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount}>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {amounts.map((amount) => (
                    <div key={amount}>
                      <RadioGroupItem
                        value={amount.toString()}
                        id={`amount-${amount}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`amount-${amount}`}
                        className="flex items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                      >
                        <span className="text-xl font-bold">{amount}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Offer Selection (Optional) */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">اختر عرض (اختياري)</Label>
              <div className="flex flex-wrap gap-3">
                {offers.map((offer) => (
                  <Button
                    key={offer}
                    type="button"
                    variant={selectedOffer === offer ? "default" : "outline"}
                    onClick={() => setSelectedOffer(selectedOffer === offer ? "" : offer)}
                    className="text-lg font-mono px-6 py-6"
                  >
                    {offer}
                  </Button>
                ))}
              </div>
              {selectedOffer && (
                <p className="text-sm text-muted-foreground">العرض المختار: {selectedOffer}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-success hover:bg-success/90"
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "شحن الرصيد"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
