import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, GripVertical, Hash } from "lucide-react";
import { useTags, Tag } from "@/hooks/useTags";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableRow = ({ tag, onEdit, onDelete, onToggleActive }: { 
  tag: Tag; 
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tag.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <div className="flex items-center gap-2 cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{tag.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <Switch
          checked={tag.is_active}
          onCheckedChange={(checked) => onToggleActive(tag.id, checked)}
        />
      </TableCell>
      <TableCell>
        <Badge variant={tag.is_active ? "default" : "secondary"}>
          {tag.is_active ? "فعال" : "غیرفعال"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(tag)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(tag.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const AdminTags = () => {
  const { tags, loading, createTag, updateTag, deleteTag, updateDisplayOrder } = useTags();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState("");
  const [sortedTags, setSortedTags] = useState<Tag[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update sorted tags when tags change
  useState(() => {
    setSortedTags([...tags]);
  });

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSortedTags((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update display orders in database
        newItems.forEach((item, index) => {
          if (item.display_order !== index) {
            updateDisplayOrder(item.id, index);
          }
        });
        
        return newItems;
      });
    }
  };

  const handleOpenDialog = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setTagName(tag.name);
    } else {
      setEditingTag(null);
      setTagName("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTag(null);
    setTagName("");
  };

  const handleSubmit = async () => {
    if (!tagName.trim()) return;

    try {
      if (editingTag) {
        await updateTag(editingTag.id, { name: tagName });
      } else {
        await createTag(tagName, tags.length);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving tag:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("آیا از حذف این هشتگ اطمینان دارید؟")) {
      await deleteTag(id);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateTag(id, { is_active: isActive });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    );
  }

  const displayTags = sortedTags.length > 0 ? sortedTags : tags;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مدیریت هشتگ‌ها</h1>
          <p className="text-muted-foreground mt-2">
            هشتگ‌های خود را مدیریت کنید و به محصولات اختصاص دهید
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="ml-2 h-4 w-4" />
          هشتگ جدید
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            لیست هشتگ‌ها ({tags.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayTags.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Hash className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>هیچ هشتگی وجود ندارد</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="ml-2 h-4 w-4" />
                اولین هشتگ را اضافه کنید
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ترتیب</TableHead>
                    <TableHead>نام هشتگ</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead>نمایش</TableHead>
                    <TableHead className="text-left">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SortableContext
                    items={displayTags.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {displayTags.map((tag) => (
                      <SortableRow
                        key={tag.id}
                        tag={tag}
                        onEdit={handleOpenDialog}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                      />
                    ))}
                  </SortableContext>
                </TableBody>
              </Table>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? "ویرایش هشتگ" : "هشتگ جدید"}
            </DialogTitle>
            <DialogDescription>
              نام هشتگ را وارد کنید
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">نام هشتگ</Label>
              <Input
                id="tag-name"
                placeholder="مثال: پیشنهاد ویژه، محصول جدید، ..."
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              لغو
            </Button>
            <Button onClick={handleSubmit} disabled={!tagName.trim()}>
              {editingTag ? "به‌روزرسانی" : "ایجاد"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTags;
