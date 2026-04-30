import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Category } from '../../types';
import { toast } from 'sonner';

export function AdminCategories() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
  });

  const resetForm = useCallback(() => {
    setFormData({ name: '', description: '', slug: '' });
    setEditingCategory(null);
  };

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
      toast.success('Cập nhật danh mục thành công');
    } else {
      addCategory(formData);
      toast.success('Thêm danh mục thành công');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = useCallback((id: string, name: string) => {
    const hasProducts = products.some(p => p.categoryId === id);
    if (hasProducts) {
      toast.error('Không thể xóa danh mục có sản phẩm');
      return;
    }
    if (confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) {
      deleteCategory(id);
      toast.success('Đã xóa danh mục');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm danh mục
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Số sản phẩm</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {categories.map(category) => {
                const productCount = products.filter(p => p.categoryId === category.id).length;
                return (
                  <TableRow key={category.id ?? category.slug}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell className="text-gray-600">{category.slug}</TableCell>
                    <TableCell>{productCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id, category.name)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Tên danh mục *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="vd: snack-man"
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                {editingCategory ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Hủy
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
