import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "./Dashboard";
import ActivationRequest from "./ActivationRequest";
import { configApi } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Settings } from "lucide-react";

interface Config {
  ID: number;
  SERVICE: string;
  STATUS: number;
  AUTRE: string;
}

export default function Home() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<Config[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Handle database typo: CUSTMER should be CUSTOMER
  const normalizedRole = user?.ROLE === 'CUSTMER' ? 'CUSTOMER' : user?.ROLE;
  
  useEffect(() => {
    if (normalizedRole === 'ADMIN') {
      fetchConfigs();
    }
  }, [normalizedRole]);

  const fetchConfigs = async () => {
    try {
      const data = await configApi.getAll() as Config[];
      setConfigs(data);
    } catch (error) {
      console.error('Failed to fetch configs:', error);
    }
  };

  const handleToggleService = async (config: Config) => {
    setLoading(true);
    try {
      await configApi.update({
        ID: config.ID,
        STATUS: config.STATUS === 1 ? 0 : 1,
      });
      
      setConfigs(prev => prev.map(c => 
        c.ID === config.ID ? { ...c, STATUS: c.STATUS === 1 ? 0 : 1 } : c
      ));
      
      toast.success(`${config.SERVICE} ${config.STATUS === 1 ? 'disabled' : 'enabled'}`);
    } catch (error) {
      toast.error('Failed to update service status');
      console.error('Error updating config:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (normalizedRole === 'ADMIN') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Service Management</CardTitle>
            </div>
            <CardDescription>Enable or disable services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {configs.map((config) => (
                <div key={config.ID} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{config.SERVICE}</p>
                    {config.AUTRE && <p className="text-sm text-muted-foreground">{config.AUTRE}</p>}
                  </div>
                  <Switch
                    checked={config.STATUS === 1}
                    onCheckedChange={() => handleToggleService(config)}
                    disabled={loading}
                  />
                </div>
              ))}
              {configs.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No services configured</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Dashboard />
      </div>
    );
  }
  
  if (normalizedRole === 'CUSTOMER') {
    return <ActivationRequest />;
  }
  
  return null;
}
