import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Package } from 'lucide-react';
import { toast } from 'sonner';
export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const success = login(formData.email, formData.password);

    if (success) {
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } else {
      toast.error('Email hoặc mật khẩu không đúng');
    }
  };
 return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
              <Package className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Đăng nhập</h1>
            <p className="text-gray-600 mt-2">Chào mừng bạn quay lại SnackShop</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              size="lg"
            >
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Link
              to="/register"
              className="text-orange-500 hover:underline font-medium"
            >
              Đăng ký ngay
            </Link>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
            <p className="font-semibold mb-2">Tài khoản demo:</p>
            <p className="text-gray-700">
              Admin: admin@snackshop.com / admin123
            </p>
            <p className="text-gray-700">
              User: user@example.com / user123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
