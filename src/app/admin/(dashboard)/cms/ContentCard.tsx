'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cmsSchemas } from '@/schemas/fe/auth';
import * as Yup from 'yup';
import { ContentItem } from '@/types/fe';
import { contentTypes, singleEntryTypes } from '@/constants';
import TipTapEditor from '@/components/TipTapEditor';

export default function ContentCard({
  item,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  canMoveUp,
  canMoveDown
}: {
  item: ContentItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (
    id: string,
    title: string,
    description: string,
    content: string,
    color?: string
  ) => void;
  onDelete: () => void;
  onCancel: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormErrors({});
    setTitle('');
    setColor('');
    setContent('');
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  useEffect(() => {
    setTitle(item.title);
    setContent(item.content);
    setColor(item.color || '');
  }, [isEditing]);

  const handleSave = async () => {
    try {
      const schema = cmsSchemas[item.type];

      await schema.validate({ title, content, color }, { abortEarly: false });
      setFormErrors({});
      onSave(item.id, title, content, color);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) errors[e.path] = e.message;
        });
        setFormErrors(errors);
      }
    }
  };

  return (
    <Card className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {!isEditing && (
        <button
          onClick={onDelete}
          className="absolute top-1 right-4 z-10 cursor-pointer rounded-lg p-2 text-red-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-300"
        >
          <Trash2 size={18} />
        </button>
      )}
      <CardContent className="px-6 py-1">
        <div className="flex items-start gap-4">
          {item.type === 'step' && (
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-semibold text-white"
              style={{ backgroundColor: item.color }}
            >
              {item.order}
            </div>
          )}

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                {!singleEntryTypes.includes(item.type) && (
                  <div className="space-y-2">
                    <Label className="text-white">
                      {item.type === 'faq' ? 'Question' : 'Title'}
                    </Label>
                    <Input
                      placeholder={`Enter ${item.type === 'faq' ? 'question' : 'title'}`}
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setFormErrors({ ...formErrors, title: '' });
                      }}
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-xs text-red-400">
                        {formErrors.title}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-white">
                    {item.type === 'faq' ? 'Answer' : 'Content'}
                  </Label>
                  {singleEntryTypes.includes(item.type) ? (
                    <TipTapEditor
                      value={content}
                      onChange={(content) => {
                        setContent(content);
                        setFormErrors({ ...formErrors, content: '' });
                      }}
                      placeholder={`Enter ${contentTypes[item.type]} content`}
                    />
                  ) : (
                    <Textarea
                      placeholder={`Enter ${item.type === 'faq' ? 'answer' : 'content'}`}
                      value={content}
                      className="bg-transparent text-white placeholder:text-slate-400"
                      onChange={(e) => {
                        setContent(e.target.value);
                        setFormErrors({ ...formErrors, content: '' });
                      }}
                      rows={6}
                    />
                  )}

                  {formErrors.content && (
                    <p className="mt-1 text-xs text-red-400">
                      {formErrors.content}
                    </p>
                  )}
                </div>

                {item.type === 'step' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Choose Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          setColor(e.target.value);
                          setFormErrors({ ...formErrors, color: '' });
                        }}
                        className="border-input h-10 w-12 cursor-pointer rounded-md border"
                      />
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => {
                          setColor(e.target.value);
                          setFormErrors({ ...formErrors, color: '' });
                        }}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                      <div
                        className="border-input h-10 w-10 rounded-md border"
                        style={{ backgroundColor: color }}
                        title="Color preview"
                      />
                    </div>
                    {formErrors.color && (
                      <p className="mt-1 text-xs text-red-400">
                        {formErrors.color}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    size="sm"
                    className="border-slate-600 bg-transparent text-sm text-white hover:border-blue-400 sm:text-base"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {item.type === 'faq' && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`visible-${item.id}`}
                      checked={item.isVisible}
                      onCheckedChange={onToggleVisibility}
                    />
                    <label
                      htmlFor={`visible-${item.id}`}
                      className="cursor-pointer text-sm font-medium"
                    >
                      Show on landing page
                    </label>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.type === 'step' && item.color && (
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                      title="Step Color"
                    />
                  )}
                </div>
                {item.type !== 'faq' &&
                  (singleEntryTypes.includes(item.type) ? (
                    <div
                      className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </p>
                  ))}
              </div>
            )}
          </div>

          {!isEditing && item.type === 'step' && (
            <div className="flex flex-col gap-2 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className="h-8 w-8 bg-transparent p-1"
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className="h-8 w-8 bg-transparent p-1"
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="font-base cursor-pointer rounded-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Card>
  );
}
