'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Check, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AddPlanModal from './AddPlanModal';
import { SubscriptionPlan, SubscriptionPlanPayload, SubscriptionPlanResponse } from '@/types/fe';
import apiService from '@/services/api';
import { HttpStatusCode } from '@/enums/shared/http-status-code';
import { toast } from '@/lib/toast';
import Loader from '@/components/Loader';
import { PRIVATE_API_ROUTES } from '@/constants/app-routes';
import CommonDeleteDialog from '@/components/CommonDeleteDialog';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [availablePlanTypes, setAvailablePlanTypes] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const handleDeletePlan = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.delete<SubscriptionPlanResponse>(`${PRIVATE_API_ROUTES.SUBSCRIPTION_PLANS_API}/${selectedPlanId}`, {
        withAuth: true,
      });

      if (response.data.message) {
        getSubscriptionPlans();
        toast.success(response.data.message);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Error deleting subscription plan';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteConfirmation = (id: string) => {
    setSelectedPlanId(id);
    setIsDeleteOpen(true);
  };

  const handleUpdatePlan = (planId: number | string) => {
    const plan = plans.find((p) => p.plan_id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setIsUpdateModalOpen(true);
    }
  };

  const handleAddPlan = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewPlan = async (planData: SubscriptionPlanPayload) => {
    setIsLoading(true);
    try {
      const response = await apiService.post<SubscriptionPlanResponse>(`${PRIVATE_API_ROUTES.SUBSCRIPTION_PLANS_API}`, planData, { withAuth: true });

      if (response.data.message) {
        getSubscriptionPlans();
        toast.success(response.data.message);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Error deleting subscription plan';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUpdatedPlan = async (planData: SubscriptionPlanPayload) => {
    setIsLoading(true);

    const payload_data = {
      old_data: selectedPlan,
      updated_data: planData,
    };

    try {
      const response = await apiService.patch<SubscriptionPlanResponse>(`${PRIVATE_API_ROUTES.SUBSCRIPTION_PLANS_API}`, payload_data, {
        withAuth: true,
      });

      if (response.data.message) {
        getSubscriptionPlans();
        toast.success(response.data.message);
      }
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Error deleting subscription plan';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionPlans = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get<SubscriptionPlanResponse>(PRIVATE_API_ROUTES.SUBSCRIPTION_PLANS_API, { withAuth: true });

      if (response.data.data && response.status === HttpStatusCode.OK && response.data.message) {
        setPlans(response.data.data);
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
      console.error('Error fetching subscription plans', error);
      toast.error('Error fetching subscription plans');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSubscriptionPlans();
  }, []);

  const getAvailablePlanTypeDetails = useCallback(() => {
    const available_type = plans.map((plan) => plan.type);
    setAvailablePlanTypes(available_type);
  }, [plans]);

  useEffect(() => {
    getAvailablePlanTypeDetails();
  }, [plans, getAvailablePlanTypeDetails]);

  return (
    <div className="min-h-screen bg-[#020d1a]">
      <Loader isLoading={isLoading} />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">Subscription Plans</h1>
            <p className="text-slate-400">Manage your subscription plans and pricing</p>
          </div>
          {plans.length < 3 && (
            <Button
              onClick={handleAddPlan}
              className="font-base flex cursor-pointer items-center gap-2 rounded-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              <Plus size={20} />
              Add Plan
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <button
                onClick={() => openDeleteConfirmation(plan.plan_id)}
                className="absolute top-4 right-4 z-10 cursor-pointer rounded-lg p-2 text-red-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-300"
              >
                <Trash2 size={18} />
              </button>

              <CardHeader>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <h6 className="text-xs font-medium text-white">{`Plan Type: ${plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}`}</h6>
                  <h6 className="text-sm font-medium text-white">{plan.description}</h6>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{`$ ${Number(plan.price).toFixed(1)} `}</span>
                    <span className="text-sm text-slate-400">per month</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mb-6 space-y-3">
                  {plan.benefits.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                        <Check size={12} className="text-blue-400" />
                      </div>
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleUpdatePlan(plan.plan_id)}
                  className="font-base w-full cursor-pointer rounded-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
                >
                  Update Plan
                </Button>
              </CardContent>

              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Card>
          ))}

          {plans.length < 3 && (
            <Card
              onClick={handleAddPlan}
              className="group flex min-h-[280px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-600/50 bg-slate-800/30 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-800/50"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-200 group-hover:scale-110">
                  <Plus size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 transition-colors duration-200 group-hover:text-white">Add New Plan</h3>
                <p className="mt-1 text-sm text-slate-500">Create a custom subscription plan</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <AddPlanModal
          isOpen={isAddModalOpen}
          availablePlanTypes={availablePlanTypes}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveNewPlan}
          mode="add"
        />
      )}

      {isUpdateModalOpen && (
        <AddPlanModal
          isOpen={isUpdateModalOpen}
          availablePlanTypes={availablePlanTypes}
          onClose={() => setIsUpdateModalOpen(false)}
          onSave={handleSaveUpdatedPlan}
          initialData={selectedPlan}
          mode="edit"
        />
      )}

      {isDeleteOpen && (
        <CommonDeleteDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          onConfirm={handleDeletePlan}
          title="Delete Subscription Plan"
          description="Are you sure you want to delete this plan? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default SubscriptionPlans;
