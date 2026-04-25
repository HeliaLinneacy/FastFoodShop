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

  // State lưu thông tin form đăng nhập
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
// Xử lý submit form
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
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
              <Package className="h-7 w-7 text-white" />
            </div>
          </div>
