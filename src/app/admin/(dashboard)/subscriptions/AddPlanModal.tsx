'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Plan } from '@/types/fe';

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planData: {
    name: string;
    description: string;
    features: string[];
    price: number;
    maxGigs: number;
    maxBids: number;
  }) => void;
  initialData?: Plan | null;
  mode?: 'add' | 'edit';
}

const AddPlanModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode = 'add',
}: AddPlanModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: [''],
    price: '',
    maxGigs: '',
    maxBids: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    description: false,
    features: false,
    price: false,
    maxGigs: false,
    maxBids: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          features: initialData.description?.length ? initialData.features : [''],
          price: initialData.price?.toString() || '',
          maxGigs: initialData.maxGigs?.toString() || '',
          maxBids: initialData.maxBids?.toString() || '',
        });
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          maxGigs: '',
          maxBids: '',
          features: [''],
        });
      }
      setErrors({
        name: false,
        description: false,
        features: false,
        price: false,
        maxGigs: false,
        maxBids: false,
      });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const handleAddFeature = () => {
    if (formData.description.length < 5) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, ''] }));
    }
  };

  const handleRemoveFeature = (index: number) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const validateForm = () => {
    const featureCount = formData.features.filter((b) => b.trim() !== '').length;

    const newErrors = {
      name: !formData.name.trim(),
      description: !formData.description.trim(),
      features: featureCount < 1 || featureCount > 4,
      price:
        !formData.price.trim() ||
        isNaN(Number(formData.price)) ||
        Number(formData.price) <= 0,
      maxGigs:
        !formData.maxGigs.trim() ||
        isNaN(Number(formData.maxGigs)) ||
        Number(formData.maxGigs) <= 0,
      maxBids:
        !formData.maxBids.trim() ||
        isNaN(Number(formData.maxBids)) ||
        Number(formData.maxBids) <= 0,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name: formData.name,
        description: formData.description,
        features: formData.features.filter((b) => b.trim() !== ''),
        price: Number(formData.price),
        maxGigs: Number(formData.maxGigs),
        maxBids: Number(formData.maxBids),
      });
      setFormData({
        name: '',
        features: [''],
        description: '',
        price: '',
        maxGigs: '',
        maxBids: '',
      });
      setErrors({
        name: false,
        description: false,
        price: false,
        maxGigs: false,
        features: false,
        maxBids: false,
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      maxGigs: '',
      maxBids: '',
      features: [''],
    });
    setErrors({
      name: false,
      description: false,
      price: false,
      maxGigs: false,
      maxBids: false,
      features: false,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="border-slate-700 bg-slate-800 text-white sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">
            {mode === 'edit' ? 'Edit Plan' : 'Add New Plan'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Name</Label>
            <Input
              placeholder="Enter plan name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`border-slate-600 bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p className="text-sm text-red-400">Name is required</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <Input
              placeholder="Enter plan description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`border-slate-600 bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-400">Description is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Features</Label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Features ${index + 1}`}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className={`border-slate-600 bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.features && feature.trim() === '' ? 'border-red-500' : ''
                  }`}
                />
                {formData.features.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-400 hover:text-red-600"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            {formData.features.length < 5 && (
              <Button
                type="button"
                onClick={handleAddFeature}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
              >
                + Add Feature
              </Button>
            )}
            {errors.features && (
              <p className="text-sm text-red-400">Enter 1 to 5 non-empty features</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Bid Limit</Label>
            <Input
              placeholder="Enter max bids"
              value={formData.maxBids}
              onChange={(e) => handleInputChange('maxBids', e.target.value)}
              className={`border-slate-600 bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.maxBids ? 'border-red-500' : ''
              }`}
              type="number"
              min="0"
              step="1"
            />
            {errors.maxBids && (
              <p className="text-sm text-red-400">Valid max bids is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Gig Limit</Label>
            <Input
              placeholder="Enter max gigs"
              value={formData.maxGigs}
              onChange={(e) => handleInputChange('maxGigs', e.target.value)}
              className={`border-slate-600 bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.maxGigs ? 'border-red-500' : ''
              }`}
              type="number"
              min="0"
              step="1"
            />
            {errors.maxGigs && (
              <p className="text-sm text-red-400">Valid max gigs is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Plan Price</Label>
            <div className="relative">
              <span className="absolute top-2 left-3 transform text-slate-400">$</span>
              <Input
                placeholder="Enter plan price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`border-slate-600 bg-slate-700 pl-8 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.price ? 'border-red-500' : ''
                }`}
                type="number"
                min="0"
                step="1"
              />
              {errors.price && (
                <p className="text-sm text-red-400">Valid plan price is required</p>
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
          <Button
            onClick={handleSave}
            className="cursor-pointer border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
          >
            {mode === 'edit' ? 'Update' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlanModal;
