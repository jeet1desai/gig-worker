'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, X } from 'lucide-react';
import { toast } from '@/lib/toast';
import { WorkingStepsResponse, WorkingStep, WorkingStepDirectionType } from '@/types/fe';
import { workingStepSchema } from '@/schemas/fe/auth';
import * as Yup from 'yup';
import { Label } from '@/components/ui/label';
import Loader from '@/components/Loader';
import apiService from '@/services/api';
import { PUBLIC_API_ROUTES } from '@/constants/app-routes';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import CommonDeleteDialog from '@/components/CommonDeleteDialog';
import StepCard from './StepCard';
import { WORKING_STEPS_MOVE_DIRECTION } from '@/constants';

export default function StepsList() {
  const [steps, setSteps] = useState<WorkingStep[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteWorkingStepId, setDeleteWorkingStepId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [newStep, setNewStep] = useState({ title: '', description: '', color: '' });
  const [formErrors, setFormErrors] = useState<{ title?: string; description?: string; color?: string }>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, title: string, description: string, color: string) => {
    updateWorkingStep({
      id: id,
      title: title,
      description: description,
      color: color
    });
  };

  const handleDelete = (id: string) => {
    setDeleteWorkingStepId(id);
    setIsDeleteOpen(true);
  };

  const handleAdd = async () => {
    try {
      await workingStepSchema.validate(newStep, { abortEarly: false });
      createWorkingStep();
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
    setNewStep({ title: '', description: '', color: '' });
  };

  const getAllWorkingSteps = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<WorkingStepsResponse>(PUBLIC_API_ROUTES.CMS_STEPS_API, { withAuth: true });

      if (response.data.data && response.status === HttpStatusCode.OK && response.data.message) {
        setSteps(response.data.data);
      }
    } catch (error: unknown) {
      console.error('Error fetching working steps', error);
      toast.error('Error fetching working steps');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createWorkingStep = async () => {
    setIsLoading(true);
    const maxOrder = Math.max(...steps.map((s) => s.order), 0);
    const payload = {
      ...newStep,
      order: maxOrder + 1
    };
    try {
      const response = await apiService.post<WorkingStepsResponse>(PUBLIC_API_ROUTES.CMS_STEPS_API, payload, { withAuth: true });

      if (response.status === HttpStatusCode.OK && response.data.message) {
        setNewStep({ title: '', description: '', color: '' });
        setFormErrors({});
        setShowAddForm(false);
        getAllWorkingSteps();
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      console.error('Error creating working step', error);
      toast.error('Error creating working step');
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkingStep = async (updated_data: { id: string; title: string; description: string; color: string }) => {
    setIsLoading(true);
    try {
      const response = await apiService.patch<WorkingStepsResponse>(PUBLIC_API_ROUTES.CMS_STEPS_API, updated_data, { withAuth: true });

      if (response.status === HttpStatusCode.OK && response.data.message) {
        setEditingId(null);
        getAllWorkingSteps();
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      console.error('Error updating working step', error);
      toast.error('Error updating working step');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkingStep = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.delete<WorkingStepsResponse>(`${PUBLIC_API_ROUTES.CMS_STEPS_API}/${deleteWorkingStepId}`, { withAuth: true });

      if (response.status === HttpStatusCode.OK && response.data.message) {
        setDeleteWorkingStepId('');
        getAllWorkingSteps();
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      console.error('Error deleting working step', error);
      toast.error('Error deleting working step');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllWorkingSteps();
  }, []);

  const moveStep = async (id: string, direction: WorkingStepDirectionType) => {
    setIsLoading(true);
    try {
      const response = await apiService.patch<WorkingStepsResponse>(
        `${PUBLIC_API_ROUTES.CMS_STEPS_API}/${id}`,
        { direction: direction },
        { withAuth: true }
      );

      if (response.status === HttpStatusCode.OK && response.data.message) {
        getAllWorkingSteps();
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      console.error('Error reordering working step', error);
      toast.error('Error reordering working step');
    } finally {
      setIsLoading(false);
    }
  };

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <Loader isLoading={isLoading} />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-lg font-bold text-white sm:text-xl md:text-2xl lg:text-3xl">Steps Management</h1>
          <p className="text-xs text-slate-400 sm:text-sm md:text-base lg:text-lg">Manage step-by-step process for your landing page</p>
        </div>
      </div>

      {showAddForm ? (
        <Card className="group animate-fade-in relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-base text-white sm:text-lg md:text-xl">Add New Step</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-white">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter step title"
                value={newStep.title}
                onChange={(e) => {
                  setNewStep({ ...newStep, title: e.target.value });
                  setFormErrors((prev) => ({ ...prev, title: '' }));
                }}
                className="bg-transparent text-white placeholder:text-slate-400"
              />
              {formErrors.title && <p className="mt-1 text-xs text-red-400">{formErrors.title}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-white">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter step description"
                value={newStep.description}
                onChange={(e) => {
                  setNewStep({ ...newStep, description: e.target.value });
                  setFormErrors((prev) => ({ ...prev, description: '' }));
                }}
                rows={3}
                className="bg-transparent text-white placeholder:text-slate-400"
              />
              {formErrors.description && <p className="mt-1 text-xs text-red-400">{formErrors.description}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="color" className="text-white">
                Choose Color
              </Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newStep.color}
                  onChange={(e) => {
                    setNewStep({ ...newStep, color: e.target.value });
                    setFormErrors((prev) => ({ ...prev, color: '' }));
                  }}
                  className="border-input h-10 w-12 cursor-pointer rounded-md border"
                />
                <Input
                  type="text"
                  value={newStep.color}
                  onChange={(e) => {
                    setNewStep({ ...newStep, color: e.target.value });
                    setFormErrors((prev) => ({ ...prev, color: '' }));
                  }}
                  placeholder="Choose Color"
                  className="flex-1"
                />
                <div className="border-input h-10 w-10 rounded-md border" style={{ backgroundColor: newStep.color }} title="Color preview" />
              </div>
              {formErrors.color && <p className="mt-1 text-xs text-red-400">{formErrors.color}</p>}
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
              Add New Step
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm md:text-base">Create a new working step</p>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {sortedSteps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            isEditing={editingId === step.id}
            onEdit={() => handleEdit(step.id)}
            onSave={handleSave}
            onDelete={() => handleDelete(step.id)}
            onCancel={() => setEditingId(null)}
            onMoveUp={() => moveStep(step.id, WORKING_STEPS_MOVE_DIRECTION.up as WorkingStepDirectionType)}
            onMoveDown={() => moveStep(step.id, WORKING_STEPS_MOVE_DIRECTION.down as WorkingStepDirectionType)}
            canMoveUp={index > 0}
            canMoveDown={index < sortedSteps.length - 1}
          />
        ))}
      </div>

      {isDeleteOpen && (
        <CommonDeleteDialog
          open={isDeleteOpen}
          isLoading={isLoading}
          onOpenChange={setIsDeleteOpen}
          onConfirm={deleteWorkingStep}
          title="Delete Step"
          description="Are you sure you want to delete this step? This action cannot be undone."
        />
      )}
    </div>
  );
}
