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
      toast.error("Please enter phone number and password");
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
        toast.error("Phone number or password is incorrect");
        setLoading(false);
        return;
      }
      await login(foundUser.ID);
      toast.success(`Welcome ${foundUser.USERNAME}`);

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
      toast.error("An error occurred during login");
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
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your phone number and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tel" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input id="tel" type="tel" placeholder="0612345678" value={tel} onChange={e => setTel(e.target.value)} maxLength={10} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </> : "Login"}
            </Button>
          </form>

          
        </CardContent>
      </Card>
    </div>;
}