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
