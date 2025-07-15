'use client';

import { useState } from 'react';
import * as Yup from 'yup';
import { FAQ } from '@/types/fe';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit, Save, Trash2, X } from 'lucide-react';
import { faqSchema } from '@/schemas/fe/auth';

export default function FAQCard({
  faq,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onCancel
}: {
  faq: FAQ;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (id: string, question: string, answer: string) => void;
  onDelete: () => void;
  onCancel: () => void;
}) {
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [formErrors, setFormErrors] = useState<{ question?: string; answer?: string }>(
    {}
  );

  const handleSave = async () => {
    try {
      await faqSchema.validate({ question, answer }, { abortEarly: false });
      setFormErrors({});
      onSave(faq.id, question.trim(), answer.trim());
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

  const handleCancle = () => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setFormErrors({});
    onCancel();
  };

  return (
    <Card className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {!isEditing && (
        <button
          onClick={onDelete}
          className="absolute top-4 right-4 z-10 cursor-pointer rounded-lg p-2 text-red-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-300"
        >
          <Trash2 size={18} />
        </button>
      )}

      <CardContent className="px-6 py-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor={`question-${faq.id}`} className="text-white">
                Question
              </Label>
              <Input
                id={`question-${faq.id}`}
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  setFormErrors((prev) => ({ ...prev, question: '' }));
                }}
                className="text-sm text-white placeholder:text-slate-400 sm:text-base"
                placeholder="Enter question"
              />
              {formErrors.question && (
                <p className="mt-1 text-xs text-red-400">{formErrors.question}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor={`answer-${faq.id}`} className="text-white">
                Answer
              </Label>
              <Textarea
                id={`answer-${faq.id}`}
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setFormErrors((prev) => ({ ...prev, answer: '' }));
                }}
                rows={3}
                className="bg-transparent text-sm text-white placeholder:text-slate-400 sm:text-base"
                placeholder="Enter answer"
              />
              {formErrors.answer && (
                <p className="mt-1 text-xs text-red-400">{formErrors.answer}</p>
              )}
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
                onClick={handleCancle}
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
            <h3 className="text-base font-bold text-white sm:text-lg md:text-xl">
              {faq.question}
            </h3>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              {faq.answer}
            </p>
            <div className="flex gap-2 pt-2">
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

      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </Card>
  );
}
