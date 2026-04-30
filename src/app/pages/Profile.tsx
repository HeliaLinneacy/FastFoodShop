import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();

  // ===== CONSTANTS =====
  const TEXT = {
    login: "Vui lòng đăng nhập",
    loginBtn: "Đăng nhập",
    title: "Hồ sơ của tôi",
    personal: "Thông tin cá nhân",
    account: "Thông tin tài khoản",
    update: "Cập nhật",
    cancel: "Hủy",
  };

  const containerClass = "container mx-auto px-4";

  // ===== STATE =====
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
  });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateProfile(currentUser.id, formData);
      toast.success('Cập nhật hồ sơ thành công!');
    };

  // ===== NOT LOGIN =====
  if (!currentUser) {
    return (
      <div className={`${containerClass} py-12`}>
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{TEXT.login}</h2>
          <Button
            onClick={goLogin}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {TEXT.loginBtn}
          </Button>
        </div>
      </div>
    );
  }

  // ===== MAIN =====
  return (
    <div className={`${containerClass} py-8`}>
      <h1 className="text-3xl font-bold mb-8">{TEXT.title}</h1>

      <div className="max-w-2xl">
        {/* PERSONAL INFO */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{TEXT.personal}</h3>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentUser.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email không thể thay đổi
                </p>
              </div>

              {/* FULL NAME */}
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleChange('fullName', e.target.value)
                  }
                  required
                />
              </div>

              {/* PHONE */}
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    handleChange('phone', e.target.value)
                  }
                  required
                />
              </div>

              {/* ADDRESS */}
              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    handleChange('address', e.target.value)
                  }
                  required
                />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {TEXT.update}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                >
                  {TEXT.cancel}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ACCOUNT INFO */}
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">{TEXT.account}</h3>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Vai trò:</span>
              <span className="font-medium capitalize">
                {currentUser.role}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Ngày tạo:</span>
              <span className="font-medium">
                {formatDate(currentUser.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
