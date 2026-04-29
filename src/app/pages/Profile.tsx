import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const TEXT = {
  login: "Vui lòng đăng nhập",
  loginBtn: "Đăng nhập",
  title: "Hồ sơ của tôi",
  personal: "Thông tin cá nhân",
  account: "Thông tin tài khoản",
  update: "Cập nhật",
  cancel: "Hủy",
};
export function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
  });

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
          <Button onClick={() => navigate('/login')} className="bg-orange-500 hover:bg-orange-600">
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }
  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!currentUser) return;

  updateProfile(currentUser.id, formData);
  toast.success('Cập nhật hồ sơ thành công!');
};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hồ sơ của tôi</h1>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
              </div>

              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  const handleChange = (field: string, value: string) => {
                  setFormData({
                    ...formData,
                    [field]: value,
                  });
                };
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Cập nhật
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">Thông tin tài khoản</h3>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Vai trò:</span>
              <span className="font-medium capitalize">{currentUser.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày tạo:</span>
              <span className="font-medium">
                {const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN');}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
