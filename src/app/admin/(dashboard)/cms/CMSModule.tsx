'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save, X } from 'lucide-react';
import { useContent } from '@/hooks/use-content';
import Loader from '@/components/Loader';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';
import CommonDeleteDialog from '@/components/CommonDeleteDialog';
import ContentCard from './ContentCard';
import { WorkingStepDirectionType } from '@/types/fe';
import { contentTypes, singleEntryTypes, WORKING_STEPS_MOVE_DIRECTION } from '@/constants';
import { cmsSchemas } from '@/schemas/fe/auth';
import * as Yup from 'yup';
import TipTapEditor from '@/components/TipTapEditor';

export default function CMSModule() {
  const [selectedType, setSelectedType] = useState<keyof typeof contentTypes>('faq');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteContentId, setDeleteContentId] = useState<string>('');
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    color: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const { contents, isLoading, isCreating, isDeleting, isUpdating, isReordering, createContent, updateContent, deleteContent, reorderContent } =
    useContent(selectedType);

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, title: string, content: string, color?: string) => {
    updateContent({
      id,
      data: { title, content, color }
    });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setIsDeleteOpen(true);
    setDeleteContentId(id);
  };

  const resetForm = () => {
    setNewContent({ title: '', content: '', color: '' });
    setFormErrors({});
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    try {
      const schema = cmsSchemas[selectedType];
      await schema.validate(newContent, { abortEarly: false });

      if (singleEntryTypes.includes(selectedType) && contents.length > 0) {
        toast.error(`Only one ${contentTypes[selectedType]} entry is allowed.`);
        return;
      }

      createContent({
        type: selectedType,
        title: singleEntryTypes.includes(selectedType) ? contentTypes[selectedType] : newContent.title,
        content: newContent.content,
        order: 1,
        isVisible: true,
        color: selectedType === 'step' ? newContent.color : undefined
      });
      resetForm();
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const fieldErrors: Record<string, string> = {};
        error.inner.forEach((err: Yup.ValidationError) => {
          if (err.path) fieldErrors[err.path] = err.message;
        });
        setFormErrors(fieldErrors);
      }
    }
  };

  const moveItem = (id: string, direction: WorkingStepDirectionType) => {
    reorderContent({ id, direction });
  };

  const toggleVisibility = (id: string) => {
    const item = contents.find((c) => c.id === id);
    if (item) {
      updateContent({
        id,
        data: { isVisible: !item.isVisible }
      });
    }
  };

  const handleConfirmedDelete = () => {
    deleteContent(deleteContentId);
    setIsDeleteOpen(false);
    setDeleteContentId('');
  };

  return (
    <div className="space-y-6">
      <Loader isLoading={isLoading || isCreating || isUpdating || isDeleting || isReordering} />
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-lg font-bold text-white sm:text-xl md:text-2xl lg:text-3xl">CMS Module</h1>
          <p className="text-xs text-slate-400 sm:text-sm md:text-base lg:text-lg">Manage all your landing page content from one place</p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedType}
            onValueChange={(value: keyof typeof contentTypes) => {
              setSelectedType(value);
              resetForm();
            }}
          >
            <SelectTrigger className="w-36 text-white">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(contentTypes).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!singleEntryTypes.includes(selectedType) || contents.length === 0 ? (
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4" />
              Add {contentTypes[selectedType]}
            </Button>
          ) : null}
        </div>
      </div>

      {showAddForm && (
        <Card className="border-border animate-fade-in border-2 border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">Add New {contentTypes[selectedType]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!singleEntryTypes.includes(selectedType) && (
              <div className="space-y-2">
                <Label className="text-white">{selectedType === 'faq' ? 'Question' : 'Title'}</Label>
                <Input
                  placeholder={`Enter ${selectedType === 'faq' ? 'question' : 'title'}`}
                  value={newContent.title}
                  onChange={(e) => {
                    setNewContent({ ...newContent, title: e.target.value });
                    setFormErrors({ ...formErrors, title: '' });
                  }}
                />
                {formErrors.title && <p className="mt-1 text-xs text-red-400">{formErrors.title}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-white">{selectedType === 'faq' ? 'Answer' : 'Content'}</Label>
              {singleEntryTypes.includes(selectedType) ? (
                <TipTapEditor
                  value={newContent.content}
                  onChange={(content) => {
                    setNewContent({ ...newContent, content });
                    setFormErrors({ ...formErrors, content: '' });
                  }}
                  placeholder={`Enter ${contentTypes[selectedType]} content`}
                />
              ) : (
                <Textarea
                  placeholder={`Enter ${selectedType === 'faq' ? 'answer' : 'content'}`}
                  value={newContent.content}
                  className="bg-transparent text-white placeholder:text-slate-400"
                  onChange={(e) => {
                    setNewContent({ ...newContent, content: e.target.value });
                    setFormErrors({ ...formErrors, content: '' });
                  }}
                  rows={6}
                />
              )}

              {formErrors.content && <p className="mt-1 text-xs text-red-400">{formErrors.content}</p>}
            </div>

            {selectedType === 'step' && (
              <div>
                <Label className="text-white">Choose Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newContent.color}
                    onChange={(e) => {
                      setNewContent({ ...newContent, color: e.target.value });
                      setFormErrors({ ...formErrors, color: '' });
                    }}
                    className="border-input h-10 w-12 cursor-pointer rounded-md border"
                  />
                  <Input
                    type="text"
                    value={newContent.color}
                    onChange={(e) => {
                      setNewContent({ ...newContent, color: e.target.value });
                      setFormErrors({ ...formErrors, color: '' });
                    }}
                    placeholder="Choose color"
                    className="flex-1"
                  />
                  <div className="border-input h-10 w-10 rounded-md border" style={{ backgroundColor: newContent.color }} title="Color preview" />
                </div>
                {formErrors.color && <p className="mt-1 text-xs text-red-400">{formErrors.color}</p>}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleAdd}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                size="sm"
                className="border-slate-600 bg-transparent text-sm text-white hover:border-blue-400 sm:text-base"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {contents.map((item, index) => (
          <ContentCard
            key={item.id}
            item={item}
            isEditing={editingId === item.id}
            onEdit={() => handleEdit(item.id)}
            onSave={handleSave}
            onDelete={() => handleDelete(item.id)}
            onCancel={() => setEditingId(null)}
            onMoveUp={() => moveItem(item.id, WORKING_STEPS_MOVE_DIRECTION.up as WorkingStepDirectionType)}
            onMoveDown={() => moveItem(item.id, WORKING_STEPS_MOVE_DIRECTION.down as WorkingStepDirectionType)}
            onToggleVisibility={() => toggleVisibility(item.id)}
            canMoveUp={index > 0}
            canMoveDown={index < contents.length - 1}
          />
        ))}
        {contents.length === 0 && !showAddForm && (
          <Card className="border-dashed p-8 text-center">
            <p className="text-muted-foreground">No {contentTypes[selectedType].toLowerCase()} items found. Add one to get started!</p>
          </Card>
        )}
      </div>

      {isDeleteOpen && (
        <CommonDeleteDialog
          open={isDeleteOpen}
          isLoading={isLoading}
          onOpenChange={setIsDeleteOpen}
          onConfirm={handleConfirmedDelete}
          title={`Delete ${contentTypes[selectedType]}`}
          description={`Are you sure you want to delete this ${contentTypes[selectedType]}? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
