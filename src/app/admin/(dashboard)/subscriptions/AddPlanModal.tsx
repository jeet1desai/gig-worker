'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { SubscriptionPlan, SubscriptionPlanPayload } from '@/types/fe';
import { subscriptionsPlanValidationSchema } from '@/schemas/fe/auth';
import { SUBSCRIPTION_PLAN_TYPES } from '@/constants';
import CommonModal from '@/components/CommonModal';
import { SUBSCRIPTION_TYPE } from '@prisma/client';

interface AddPlanModalProps {
  isOpen: boolean;
  availablePlanTypes: string[];
  onClose: () => void;
  onSave: (planData: SubscriptionPlanPayload) => void;
  initialData?: SubscriptionPlan | null;
  mode?: 'add' | 'edit';
}

const AddPlanModal = ({ isOpen, onClose, onSave, initialData, mode = 'add', availablePlanTypes = [] }: AddPlanModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    benefits: [''],
    price: '0',
    maxGigs: '0',
    maxBids: '0',
    subscriptionType: ''
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const parseUnlimited = (value: string): number => (value.trim().toLowerCase() === 'unlimited' ? -1 : Number(value));

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          benefits: initialData.benefits?.length ? initialData.benefits : [''],
          price: initialData.price?.toString() || '0',
          maxGigs: initialData.maxGigs === -1 ? 'unlimited' : initialData.maxGigs?.toString() || '0',
          maxBids: initialData.maxBids === -1 ? 'unlimited' : initialData.maxBids?.toString() || '0',
          subscriptionType: initialData.type || ''
        });
      } else {
        setFormData({
          name: '',
          description: '',
          price: '0',
          maxGigs: '0',
          maxBids: '0',
          benefits: [''],
          subscriptionType: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'subscriptionType' && value === SUBSCRIPTION_TYPE.free) {
      setFormData((prev) => ({ ...prev, price: '0' }));
    }
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const normalizeEmptyToZero = (value: string) => (value.trim() === '' ? '0' : value);

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...formData.benefits];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, benefits: updated }));
    const errorKey = `benefits[${index}]`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[errorKey];
        return updated;
      });
    }
  };

  const handleAddFeature = () => {
    if (formData.benefits.length < 5) {
      setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, ''] }));
    }
  };

  const handleRemoveFeature = (index: number) => {
    const updated = formData.benefits.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, benefits: updated }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`benefits[${index}]`) || key === `benefits[${index}]`) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const validateForm = () => {
    try {
      subscriptionsPlanValidationSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const newErrors: Record<string, boolean> = {};
      if (err.inner) {
        err.inner.forEach((e: any) => {
          if (e.path) {
            newErrors[e.path] = true;
          }
        });
      }
      setErrors(newErrors);
      return false;
    }
  };

  const handleSave = () => {
    const cleanedFormData = {
      ...formData,
      price: normalizeEmptyToZero(formData.price),
      maxGigs: normalizeEmptyToZero(formData.maxGigs),
      maxBids: normalizeEmptyToZero(formData.maxBids)
    };

    setFormData(cleanedFormData);
    if (validateForm()) {
      onSave({
        name: formData.name,
        description: formData.description,
        benefits: formData.benefits.filter((b) => b.trim() !== ''),
        price: formData.price,
        maxGigs: parseUnlimited(formData.maxGigs),
        maxBids: parseUnlimited(formData.maxBids),
        subscriptionType: formData.subscriptionType
      });
      handleCancel();
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '0',
      maxGigs: '0',
      maxBids: '0',
      benefits: [''],
      subscriptionType: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <CommonModal
      open={isOpen}
      onOpenChange={onClose}
      className="no-scrollbar max-h-[90vh] overflow-y-auto border-slate-700 bg-slate-800 text-white sm:max-w-md"
      title={mode === 'edit' ? 'Edit Plan' : 'Add New Plan'}
      classTitle="text-xl font-semibold"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Subscription Type</Label>
          <Select
            disabled={mode === 'edit'}
            value={formData.subscriptionType}
            onValueChange={(value) => handleInputChange('subscriptionType', value)}
          >
            <SelectTrigger className={`w-full border-slate-600 bg-slate-700 text-white ${errors.subscriptionType ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select subscription type" />
            </SelectTrigger>
            <SelectContent className="border-slate-600 bg-slate-700 text-white">
              {SUBSCRIPTION_PLAN_TYPES.map((option) => (
                <SelectItem key={option} value={option} disabled={availablePlanTypes.includes(option)} className="text-white hover:bg-slate-600">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subscriptionType && <p className="text-sm text-red-400">Subscription type is required</p>}
          {mode === 'edit' && (
            <p className="mt-1 text-sm text-red-400">
              Subscription type cannot be changed for an existing plan. Create a new plan for updated subscription type.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            placeholder="Enter plan name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`border-slate-600 bg-slate-700 text-white ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-sm text-red-400">Name is required</p>}
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            placeholder="Enter plan description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`border-slate-600 bg-slate-700 text-white ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && <p className="text-sm text-red-400">Description is required</p>}
        </div>

        <div className="space-y-2">
          <Label>Features</Label>
          {formData.benefits.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`Feature ${index + 1}`}
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className={`border-slate-600 bg-slate-700 text-white ${errors[`benefits[${index}]`] ? 'border-red-500' : ''}`}
              />
              {formData.benefits.length > 1 && (
                <Button type="button" variant="ghost" className="text-red-400 hover:text-red-600" onClick={() => handleRemoveFeature(index)}>
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
          {formData.benefits.length < 5 && (
            <Button type="button" onClick={handleAddFeature} className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              + Add Feature
            </Button>
          )}
          {Object.keys(errors).some((k) => k.startsWith('benefits')) && <p className="text-sm text-red-400">Enter 1 to 5 non-empty features</p>}
        </div>

        <div className="space-y-2">
          <Label>Bid Limit</Label>
          <Input
            placeholder="Enter max bids or 'unlimited'"
            value={formData.maxBids}
            onChange={(e) => handleInputChange('maxBids', e.target.value)}
            className={`border-slate-600 bg-slate-700 text-white ${errors.maxBids ? 'border-red-500' : ''}`}
            type="text"
          />
          {errors.maxBids && <p className="text-sm text-red-400">Must be 0, positive number, or "unlimited"</p>}
        </div>

        <div className="space-y-2">
          <Label>Gig Limit</Label>
          <Input
            placeholder="Enter max gigs or 'unlimited'"
            value={formData.maxGigs}
            onChange={(e) => handleInputChange('maxGigs', e.target.value)}
            className={`border-slate-600 bg-slate-700 text-white ${errors.maxGigs ? 'border-red-500' : ''}`}
            type="text"
          />
          {errors.maxGigs && <p className="text-sm text-red-400">Must be 0, positive number, or "unlimited"</p>}
        </div>

        <div className="space-y-2">
          <Label>Plan Price</Label>
          <div className="relative">
            <span className="absolute top-[6px] left-3 transform text-slate-400">$</span>
            <Input
              placeholder="Enter plan price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className={`border-slate-600 bg-slate-700 pl-8 text-white ${errors.price ? 'border-red-500' : ''} ${mode === 'edit' ? 'cursor-not-allowed opacity-50' : ''}`}
              type="number"
              min="0"
              disabled={mode === 'edit' || formData.subscriptionType === SUBSCRIPTION_TYPE.free}
            />
            {errors.price && <p className="text-sm text-red-400">Valid price (0 or more) required</p>}
            {mode === 'edit' && (
              <p className="mt-1 text-sm text-red-400">Price cannot be changed for an existing plan. Create a new plan for updated pricing.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="cursor-pointer border-slate-600 bg-transparent text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          Cancel
        </Button>
        <Button onClick={handleSave} className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          {mode === 'edit' ? 'Update' : 'Save'}
        </Button>
      </div>
    </CommonModal>
  );
};

export default AddPlanModal;
