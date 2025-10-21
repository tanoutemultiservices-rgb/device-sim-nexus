import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { simCardsApi, activationsApi, usersApi } from "@/services/api";
import marocTelecomLogo from "@/assets/maroc-telecom-logo.png";
import inwiLogo from "@/assets/inwi-logo.jpg";
import orangeLogo from "@/assets/orange-logo.png";
import { useAuth } from "@/contexts/AuthContext";
const operators = [
  {
    id: "Maroc Telecom",
    name: "Maroc Telecom",
    logo: marocTelecomLogo,
  },
  {
    id: "inwi",
    name: "inwi",
    logo: inwiLogo,
  },
  {
    id: "Orange MA",
    name: "Orange MA",
    logo: orangeLogo,
  },
];
export default function ActivationRequest() {
  const [selectedOperator, setSelectedOperator] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pukCode, setPukCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [simCards, setSimCards] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [resultMessage, setResultMessage] = useState("");
  const [resultStatus, setResultStatus] = useState<"SUCCESS" | "FAILED" | "">("");
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const simData = await simCardsApi.getAll();
        setSimCards(simData as any[]);
        setCurrentUser(authUser);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("خطأ في تحميل البيانات");
      }
    };
    fetchData();
  }, [authUser]);

  useEffect(() => {
    if (resultMessage && resultStatus) {
      const timer = setTimeout(() => {
        setResultMessage("");
        setResultStatus("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [resultMessage, resultStatus]);
  const pollActivationStatus = async (activationId: number): Promise<void> => {
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        try {
          const activation = (await activationsApi.getById(activationId)) as any;

          if (activation.MSG_TO_RETURN && activation.MSG_TO_RETURN.trim() !== "") {
            clearInterval(interval);

            if (activation.STATUS === "SUCCESS") {
              setResultMessage(activation.MSG_TO_RETURN);
              setResultStatus("SUCCESS");
            } else {
              setResultMessage(activation.MSG_TO_RETURN);
              setResultStatus("FAILED");
            }
            resolve();
          }
        } catch (error) {
          console.error("Error polling activation:", error);
        }
      }, 2000); // Poll every 2 seconds

      // Timeout after 60 seconds
      setTimeout(() => {
        clearInterval(interval);
        setResultMessage("انتهت مهلة الانتظار. يرجى التحقق من حالة الطلب لاحقاً");
        setResultStatus("FAILED");
        resolve();
      }, 60000);
    });
  };

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

    if (!currentUser) {
      toast.error("لم يتم العثور على المستخدم");
      return;
    }

    // Check if user has activation permission
    if (currentUser.ACTIVATION !== 1 && currentUser.ACTIVATION !== "1") {
      toast.error("ليس لديك صلاحية لطلب التفعيل");
      return;
    }

    // Find available SIM card with same operator and activation enabled
    const normalize = (s: any) => (s ?? "").toString().trim().toLowerCase();
    const availableSim = simCards.find(
      (sim: any) =>
        normalize(sim.OPERATOR) === normalize(selectedOperator) &&
        (sim.ACTIVATION_STATUS === 1 || sim.ACTIVATION_STATUS === "1"),
    );
    if (!availableSim) {
      toast.error(`لا توجد بطاقة SIM متاحة لشركة ${selectedOperator}`);
      return;
    }

    setLoading(true);
    try {
      // Build CODE_USSD based on operator
      let codeUSSD = "";
      if (selectedOperator === "Orange MA") {
        codeUSSD = `#555#,1,${phoneNumber},1,${pukCode},nom,prenom,AA5566`;
      } else if (selectedOperator === "inwi") {
        codeUSSD = `*1012*${phoneNumber}${pukCode}#,nom prenom,AA7878`;
      } else if (selectedOperator === "Maroc Telecom") {
        codeUSSD = `*100*${pukCode}*${phoneNumber}#`;
      }

      // Create activation request
      const activationData = {
        DATE_OPERATION: Date.now(),
        OPERATOR: selectedOperator,
        SERIE: "",
        PHONE_NUMBER: phoneNumber,
        PUK: pukCode,
        CODE_USSD: codeUSSD,
        DATE_RESPONSE: 0,
        MSG_RESPONSE: "",
        STATUS: "PENDING",
        USER: currentUser.ID,
        SIM_CARD: availableSim.ID,
        MSG_TO_RETURN: "",
      };

      const response = (await activationsApi.create(activationData)) as any;
      const activationId = response.id;

      setResultMessage("جاري معالجة طلب التفعيل...");
      setResultStatus("");

      // Reset form
      setSelectedOperator("");
      setPhoneNumber("");
      setPukCode("");

      // Poll for activation result
      await pollActivationStatus(activationId);

      // Refresh user data
      const refreshed = await usersApi.getById(currentUser.ID);
      setCurrentUser(refreshed as any);
    } catch (error) {
      console.error("Error submitting activation:", error);
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };
  const handlePukChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPukCode(value);
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(value);
  };
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">تفعيل البطاقات</h1>
        </div>
        <PlayCircle className="h-8 w-8 text-warning" />
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Operator Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">اختر المشغل</Label>
              <RadioGroup value={selectedOperator} onValueChange={setSelectedOperator}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {operators.map((operator) => (
                    <div key={operator.id}>
                      <RadioGroupItem value={operator.id} id={operator.id} className="peer sr-only" />
                      <Label
                        htmlFor={operator.id}
                        className="flex items-center justify-center rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all h-24"
                      >
                        <img src={operator.logo} alt={operator.name} className="h-16 w-auto object-contain" />
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-semibold">
                رقم الهاتف
              </Label>
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
            </div>

            {/* PUK Code */}
            <div className="space-y-2">
              <Label htmlFor="puk" className="text-base font-semibold">
                اربع الارقام الاخيرة من رمز PUK
              </Label>
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
            </div>

            {/* Visual PUK Display */}
            <div style={{ display: "none" }} className="flex justify-center gap-3 py-4">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="w-12 h-16 rounded-lg border-2 border-muted flex items-center justify-center text-2xl font-mono font-bold"
                >
                  {pukCode[index] || "•"}
                </div>
              ))}
            </div>

            {/* Result Message */}
            {resultMessage && (
              <div
                className={`p-4 rounded-lg text-center font-semibold ${
                  resultStatus === "SUCCESS"
                    ? "bg-success/20 text-success border-2 border-success"
                    : resultStatus === "FAILED"
                    ? "bg-destructive/20 text-destructive border-2 border-destructive"
                    : "bg-primary/20 text-primary border-2 border-primary"
                }`}
              >
                {resultMessage}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full bg-warning hover:bg-warning/90" disabled={loading}>
              {loading ? "جاري الإرسال..." : "تفعيل البطاقة"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
