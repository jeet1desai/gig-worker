'use client';

import { useState } from 'react';
import * as Yup from 'yup';
import { WorkingStep } from '@/types/fe';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowDown, ArrowUp, Edit, Save, Trash2, X } from 'lucide-react';
import { workingStepSchema } from '@/schemas/fe/auth';

export default function StepCardStepCard({
  step,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}: {
  step: WorkingStep;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (id: string, title: string, description: string, color: string) => void;
  onDelete: () => void;
  onCancel: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const [title, setTitle] = useState(step.title);
  const [description, setDescription] = useState(step.description);
  const [color, setColor] = useState(step.color);
  const [formErrors, setFormErrors] = useState<{ title?: string; description?: string; color?: string }>({});

  const handleSave = async () => {
    try {
      await workingStepSchema.validate({ title, description, color }, { abortEarly: false });
      setFormErrors({});
      onSave(step.id, title.trim(), description.trim(), color.trim());
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

  const handleCancel = () => {
    setTitle(step.title);
    setDescription(step.description);
    setColor(step.color);
    setFormErrors({});
    onCancel();
  };

  return (
    <Card className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {!isEditing && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-4 z-10 cursor-pointer rounded-lg p-2 text-red-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-300"
        >
          <Trash2 size={18} />
        </button>
      )}

      <CardContent className="px-6 py-3">
        <div className="flex items-start gap-4">
          <div
            style={{ color: step.color }}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white bg-white font-semibold"
          >
            {step.order}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor={`title-${step.id}`} className="text-white">
                    Title
                  </Label>
                  <Input
                    id={`title-${step.id}`}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setFormErrors((prev) => ({ ...prev, title: '' }));
                    }}
                    className="text-sm text-white placeholder:text-slate-400 sm:text-base"
                    placeholder="Enter step title"
                  />
                  {formErrors.title && <p className="mt-1 text-xs text-red-400">{formErrors.title}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`description-${step.id}`} className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id={`description-${step.id}`}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setFormErrors((prev) => ({ ...prev, description: '' }));
                    }}
                    rows={3}
                    className="bg-transparent text-sm text-white placeholder:text-slate-400 sm:text-base"
                    placeholder="Enter step description"
                  />
                  {formErrors.description && <p className="mt-1 text-xs text-red-400">{formErrors.description}</p>}
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Choose Color
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        setColor(e.target.value);
                        setFormErrors((prev) => ({ ...prev, color: '' }));
                      }}
                      className="border-input h-10 w-12 cursor-pointer rounded-md border"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => {
                        setColor(e.target.value);
                        setFormErrors((prev) => ({ ...prev, color: '' }));
                      }}
                      placeholder="Choose Color"
                      className="flex-1"
                    />
                    <div className="border-input h-10 w-10 rounded-md border" style={{ backgroundColor: color }} title="Color preview" />
                  </div>
                  {formErrors.color && <p className="mt-1 text-xs text-red-400">{formErrors.color}</p>}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="font-base w-full cursor-pointer rounded-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg sm:w-auto"
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
              <div className="space-y-2">
                <h3 className="text-base font-bold !text-white sm:text-lg md:text-xl">{step.title}</h3>
                <p className="text-sm leading-relaxed !text-slate-300 sm:text-base">{step.description}</p>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex flex-col gap-2 pt-3">
              <Button variant="outline" size="sm" onClick={onMoveUp} disabled={!canMoveUp} className="h-8 w-8 bg-transparent p-1">
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={onMoveDown} disabled={!canMoveDown} className="h-8 w-8 bg-transparent p-1">
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="mt-4 ml-12 flex gap-2">
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
        )}
      </CardContent>

      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </Card>
  );
}
