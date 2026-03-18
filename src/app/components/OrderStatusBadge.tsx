import { OrderStatus } from '../types';
import { Badge } from './ui/badge';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Chờ xác nhận', variant: 'secondary' },
  confirmed: { label: 'Đã xác nhận', variant: 'default' },
  shipping: { label: 'Đang giao', variant: 'outline' },
  delivered: { label: 'Đã giao', variant: 'default' },
  cancelled: { label: 'Đã hủy', variant: 'destructive' },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
