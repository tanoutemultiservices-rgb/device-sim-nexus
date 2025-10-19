import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Coins } from "lucide-react";
import { toast } from "sonner";
import { simCardsApi, topupsApi, usersApi } from "@/services/api";
import marocTelecomLogo from "@/assets/maroc-telecom-logo.png";
import inwiLogo from "@/assets/inwi-logo.jpg";
import orangeLogo from "@/assets/orange-logo.png";
const operators = [{
  id: "Maroc Telecom",
  name: "Maroc Telecom",
  logo: marocTelecomLogo
}, {
  id: "inwi",
  name: "inwi",
  logo: inwiLogo
}, {
  id: "Orange MA",
  name: "Orange MA",
  logo: orangeLogo
}];
const amounts = [5, 10, 20, 50, 100, 200];
const offers = ["*1", "*2", "*3", "*6", "*22"];
export default function TopupRequest() {
  const [selectedOperator, setSelectedOperator] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedOffer, setSelectedOffer] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [simCards, setSimCards] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [simData, userData] = await Promise.all([simCardsApi.getAll(), usersApi.getAll()]);
        setSimCards(simData as any[]);
        setUsers(userData as any[]);

        // Get first active user for demo (in production, use authentication)
        const activeUser = (userData as any[]).find((u: any) => u.STATUS === 'ACCEPT');
        setCurrentUser(activeUser);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("خطأ في تحميل البيانات");
      }
    };
    fetchData();
  }, []);
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
    if (!currentUser) {
      toast.error("لم يتم العثور على المستخدم");
      return;
    }

    // Check user balance
    const amount = parseFloat(selectedAmount);
    if (currentUser.BALANCE < amount) {
      toast.error(`رصيدك غير كافٍ. رصيدك الحالي: ${currentUser.BALANCE} درهم`);
      return;
    }

    // Find available SIM card with same operator and topup enabled
    const availableSim = simCards.find((sim: any) => sim.OPERATOR === selectedOperator && sim.TOPUP_STATUS === '1');
    if (!availableSim) {
      toast.error(`لا توجد بطاقة SIM متاحة لشركة ${selectedOperator}`);
      return;
    }
    setLoading(true);
    try {
      // Build CODE_USSD based on operator
      let codeUSSD = "";
      if (selectedOperator === "Orange MA") {
        codeUSSD = `*139*${availableSim.PIN || 1234}*${phoneNumber}*${amount}${selectedOffer || ''}#`;
      } else if (selectedOperator === "inwi") {
        codeUSSD = `*139*${phoneNumber}*${amount}${selectedOffer || ''}#`;
      } else if (selectedOperator === "Maroc Telecom") {
        codeUSSD = `*139*${phoneNumber}*${amount}${selectedOffer || ''}#`;
      }

      // Create topup request
      const topupData = {
        DATE_OPERATION: Date.now(),
        OPERATOR: selectedOperator,
        MONTANT: amount,
        PHONE_NUMBER: phoneNumber,
        OFFRE: selectedOffer.replace('*', '') || '',
        CODE_USSD: codeUSSD,
        DATE_RESPONSE: 0,
        MSG_RESPONSE: '',
        STATUS: 'PENDING',
        USER: currentUser.ID,
        SIM_CARD: availableSim.ID,
        MSG_TO_RETURN: 'Request in progress. Please wait...',
        NEW_BALANCE: 0
      };
      await topupsApi.create(topupData);

      // Update user balance
      const updatedBalance = parseFloat(currentUser.BALANCE) - amount;
      await usersApi.update({
        ...currentUser,
        BALANCE: updatedBalance
      });
      toast.success("تم إرسال طلب الشحن بنجاح");

      // Reset form
      setSelectedOperator("");
      setSelectedAmount("");
      setSelectedOffer("");
      setPhoneNumber("");

      // Refresh user data
      const userData = await usersApi.getAll();
      const activeUser = (userData as any[]).find((u: any) => u.STATUS === 'ACCEPT');
      setCurrentUser(activeUser);
    } catch (error) {
      console.error('Error submitting topup:', error);
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };
  return <div className="space-y-6 animate-fade-in max-w-4xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">التعبئة السريـــعة</h1>
          
          {currentUser && <p className="text-sm text-muted-foreground mt-1">
              رصيدك الحالي: <span className="font-bold text-primary">{currentUser.BALANCE} درهم</span>
            </p>}
        </div>
        <Coins className="h-8 w-8 text-primary" />
      </div>

      <Card>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Operator Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">اختر المشغل</Label>
              <RadioGroup value={selectedOperator} onValueChange={setSelectedOperator}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {operators.map(operator => <div key={operator.id}>
                      <RadioGroupItem value={operator.id} id={operator.id} className="peer sr-only" />
                      <Label htmlFor={operator.id} className="flex items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all h-24">
                        <img src={operator.logo} alt={operator.name} className="h-16 w-auto object-contain" />
                      </Label>
                    </div>)}
                </div>
              </RadioGroup>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-semibold">رقم الهاتف</Label>
              <Input id="phone" type="tel" placeholder="0612345678" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="text-lg" maxLength={10} />
            </div>

            {/* Amount Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">اختر المبلغ (درهم)</Label>
              <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount}>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {amounts.map(amount => <div key={amount}>
                      <RadioGroupItem value={amount.toString()} id={`amount-${amount}`} className="peer sr-only" />
                      <Label htmlFor={`amount-${amount}`} className="flex items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all">
                        <span className="text-xl font-bold">{amount}</span>
                      </Label>
                    </div>)}
                </div>
              </RadioGroup>
            </div>

            {/* Offer Selection (Optional) */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">اختر عرض (اختياري)</Label>
              <div className="flex flex-wrap gap-3">
                {offers.map(offer => <Button key={offer} type="button" variant={selectedOffer === offer ? "default" : "outline"} onClick={() => setSelectedOffer(selectedOffer === offer ? "" : offer)} className="text-lg font-mono px-6 py-6">
                    {offer}
                  </Button>)}
              </div>
              {selectedOffer && <p className="text-sm text-muted-foreground">العرض المختار: {selectedOffer}</p>}
            </div>

            <Button type="submit" size="lg" className="w-full bg-success hover:bg-success/90" disabled={loading}>
              {loading ? "جاري الإرسال..." : "شحن الرصيد"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>;
}