import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { usersApi } from '@/services/api';
import { toast } from 'sonner';
import { LogIn, Phone, Lock } from 'lucide-react';
export default function Login() {
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    login,
    user
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tel || !password) {
      toast.error('الرجاء إدخال رقم الهاتف وكلمة المرور');
      return;
    }
    setLoading(true);
    try {
      const users = (await usersApi.getAll()) as any[];
      console.log('All users from database:', users);
      console.log('Attempting login with TEL:', tel);
      
      // Check each condition separately for debugging
      const userWithTel = users.find((u: any) => u.TEL === tel);
      console.log('User found with this phone:', userWithTel);
      
      if (userWithTel) {
        console.log('User STATUS:', userWithTel.STATUS);
        console.log('Password match:', userWithTel.PASSWORD === password);
      }
      
      const foundUser = users.find((u: any) => u.TEL === tel && u.PASSWORD === password && u.STATUS === 'ACCEPT');
      if (!foundUser) {
        toast.error('رقم الهاتف أو كلمة المرور غير صحيحة');
        setLoading(false);
        return;
      }
      await login(foundUser.ID);
      toast.success(`مرحباً ${foundUser.USERNAME}`);

      // Redirect based on role
      if (foundUser.ROLE === 'ADMIN') {
        navigate('/');
      } else if (foundUser.ROLE === 'CUSTOMER') {
        navigate('/activations');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };
  return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل رقم هاتفك وكلمة المرور للدخول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4" dir="rtl">
            <div className="space-y-2">
              <Label htmlFor="tel" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                رقم الهاتف
              </Label>
              <Input id="tel" type="tel" placeholder="0612345678" value={tel} onChange={e => setTel(e.target.value)} maxLength={10} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                كلمة المرور
              </Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري تسجيل الدخول...
                </> : 'تسجيل الدخول'}
            </Button>
          </form>

          
        </CardContent>
      </Card>
    </div>;
}