'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, X } from 'lucide-react';
import { toast } from '@/lib/toast';
import { FAQ, FAQsPlanResponse } from '@/types/fe';
import FAQCard from './FAQCard';
import { faqSchema } from '@/schemas/fe/auth';
import * as Yup from 'yup';
import { Label } from '@/components/ui/label';
import Loader from '@/components/Loader';
import apiService from '@/services/api';
import { PUBLIC_API_ROUTES } from '@/constants/app-routes';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import CommonDeleteDialog from '@/components/CommonDeleteDialog';

export default function FAQsList() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteFAQId, setDeleteFAQId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [formErrors, setFormErrors] = useState<{ question?: string; answer?: string }>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, question: string, answer: string) => {
    updateFAQ({
      id: id,
      question: question,
      answer: answer
    });
  };

  const handleDelete = (id: string) => {
    setDeleteFAQId(id);
    setIsDeleteOpen(true);
  };

  const handleAdd = async () => {
    try {
      await faqSchema.validate(newFAQ, { abortEarly: false });

      createFAQs();
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

  const handleCloseAdd = () => {
    setShowAddForm(false);
    setFormErrors({});
    setNewFAQ({ question: '', answer: '' });
  };

  const getAllFAQs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<FAQsPlanResponse>(PUBLIC_API_ROUTES.CMS_FAQS_API, { withAuth: true });

      if (response.data.data && response.status === HttpStatusCode.OK && response.data.message) {
        setFaqs(response.data.data);
      }
    } catch (error: unknown) {
      console.error('Error fetching faqs', error);
      toast.error('Error fetching faqs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFAQs = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.post<FAQsPlanResponse>(PUBLIC_API_ROUTES.CMS_FAQS_API, newFAQ, { withAuth: true });

      if (response.status === HttpStatusCode.OK && response.data.message) {
        setNewFAQ({ question: '', answer: '' });
        setFormErrors({});
        setShowAddForm(false);
        getAllFAQs();
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      console.error('Error creating faqs plan', error);
      toast.error('Error creating faqs plan');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFAQ = async (updated_data: { id: string; question: string; answer: string }) => {
    setIsLoading(true);
    try {
      const response = await apiService.patch<FAQsPlanResponse>(PUBLIC_API_ROUTES.CMS_FAQS_API, updated_data, { withAuth: true });

      if (response.status === HttpStatusCode.OK && response.data.message) {
        setEditingId(null);
        getAllFAQs();
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      console.error('Error updating faqs plan', error);
      toast.error('Error updating faqs plan');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFAQ = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.delete<FAQsPlanResponse>(`${PUBLIC_API_ROUTES.CMS_FAQS_API}/${deleteFAQId}`, { withAuth: true });

      if (response.status === HttpStatusCode.OK && response.data.message) {
        setDeleteFAQId('');
        getAllFAQs();
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      console.error('Error deleting faqs plan', error);
      toast.error('Error deleting faqs plan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllFAQs();
  }, []);

  return (
    <div className="space-y-6">
      <Loader isLoading={isLoading} />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-lg font-bold text-white sm:text-xl md:text-2xl lg:text-3xl">FAQs Management</h1>
          <p className="text-xs text-slate-400 sm:text-sm md:text-base lg:text-lg">Manage frequently asked questions for your landing page</p>
        </div>
      </div>

      {showAddForm ? (
        <Card className="group animate-fade-in relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-base text-white sm:text-lg md:text-xl">Add New FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="question" className="text-white">
                Question
              </Label>
              <Input
                id="question"
                placeholder="Enter question"
                value={newFAQ.question}
                onChange={(e) => {
                  setNewFAQ({ ...newFAQ, question: e.target.value });
                  setFormErrors((prev) => ({ ...prev, question: '' }));
                }}
                className="bg-transparent text-white placeholder:text-slate-400"
              />
              {formErrors.question && <p className="mt-1 text-xs text-red-400">{formErrors.question}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="answer" className="text-white">
                Answer
              </Label>
              <Textarea
                id="answer"
                placeholder="Enter answer"
                value={newFAQ.answer}
                onChange={(e) => {
                  setNewFAQ({ ...newFAQ, answer: e.target.value });
                  setFormErrors((prev) => ({ ...prev, answer: '' }));
                }}
                rows={3}
                className="bg-transparent text-white placeholder:text-slate-400"
              />
              {formErrors.answer && <p className="mt-1 text-xs text-red-400">{formErrors.answer}</p>}
            </div>

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
                onClick={handleCloseAdd}
                size="sm"
                className="border-slate-600 bg-transparent text-sm text-white hover:border-blue-400 sm:text-base"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          onClick={() => setShowAddForm(true)}
          className="group flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-600/50 bg-slate-800/30 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-800/50"
        >
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-200 group-hover:scale-110">
              <Plus size={32} className="text-white" />
            </div>
            <h3 className="text-base font-semibold text-slate-300 transition-colors duration-200 group-hover:text-white sm:text-lg md:text-xl">
              Add New FAQ
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm md:text-base">Create a new frequently asked question</p>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {faqs.map((faq) => (
          <FAQCard
            key={faq.id}
            faq={faq}
            isEditing={editingId === faq.id}
            onEdit={() => handleEdit(faq.id)}
            onSave={handleSave}
            onDelete={() => handleDelete(faq.id)}
            onCancel={() => setEditingId(null)}
          />
        ))}
      </div>

      {isDeleteOpen && (
        <CommonDeleteDialog
          open={isDeleteOpen}
          isLoading={isLoading}
          onOpenChange={setIsDeleteOpen}
          onConfirm={deleteFAQ}
          title="Delete FAQ"
          description="Are you sure you want to delete this FAQ? This action cannot be undone."
        />
      )}
    </div>
  );
}
