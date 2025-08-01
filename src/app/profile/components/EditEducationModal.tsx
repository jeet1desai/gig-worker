'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import CommonModal from '@/components/CommonModal';
import { UserProfileDetails, UpdateEducationPayload, UserProfile, EducationEntry } from '@/types/shared/user';
import { userService } from '@/services/user.services';
import { toast } from '@/lib/toast';

interface EditEducationModalProps {
  isOwnProfile: boolean;
  user: UserProfileDetails;
  handleUpdateProfileAction: (profileDetails: UserProfileDetails) => void;
}

interface FormValues {
  educations: EducationEntry[];
}

const validationSchema = Yup.object().shape({
  educations: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required('Title is required'),
        startYear: Yup.number().typeError('Start year must be a number').required('Start year is required').min(1900, 'Invalid start year'),
        endYear: Yup.number()
          .typeError('End year must be a number')
          .required('End year is required')
          .min(Yup.ref('startYear'), 'End year must be after start year')
          .max(new Date().getFullYear(), 'End year cannot be in the future')
      })
    )
    .required()
});

export default function EditEducationModal({ user, isOwnProfile, handleUpdateProfileAction }: EditEducationModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEducationSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const payload: UpdateEducationPayload = {
        educations: values.educations
      };
      const response = await userService.updateUserEducationHistory(payload);
      const updatedProfile: UserProfileDetails = {
        ...user,
        profile: response.data as UserProfile
      };

      handleUpdateProfileAction?.(updatedProfile);
      toast.success('Profile updated successfully.');
      setOpen(false);
    } catch (error: any) {
      const apiError = error?.response?.data?.error;

      toast.error(apiError?.message || 'Something went wrong.');

      const fieldErrors = apiError?.fieldErrors;
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          formik.setFieldError(field, msg as string);
        });
      }

      console.error('Education update error:', apiError?.details || error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      educations: user.profile?.educations || []
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: handleEducationSubmit
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  const handleAdd = () => {
    formik.setFieldValue('educations', [...formik.values.educations, { title: '', startYear: '', endYear: '' }]);
  };

  const handleRemove = (index: number) => {
    const updated = [...formik.values.educations];
    updated.splice(index, 1);
    formik.setFieldValue('educations', updated);
  };

  return (
    <div>
      {isOwnProfile && <PencilIcon onClick={() => setOpen(true)} className="h-4 w-4 cursor-pointer text-white hover:text-gray-300" />}

      <CommonModal
        open={open}
        className="max-h-[90vh] overflow-y-auto rounded-xl bg-[#111] px-6 py-4 text-white sm:max-w-[600px]"
        onOpenChange={setOpen}
        title="Edit Education"
        subtitle="Add or update your education history"
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="mt-4 space-y-4">
            {formik.values.educations.map((item, idx) => (
              <div key={idx} className="space-y-2 border-b border-[#333] pb-4">
                <div className="flex items-center justify-between gap-2">
                  <Input
                    placeholder="Education title"
                    name={`educations[${idx}].title`}
                    value={item.title}
                    onChange={formik.handleChange}
                    className="flex-1 border border-[#333] bg-[#1a1a1a] text-white"
                  />
                  {formik.values.educations.length > 1 && (
                    <Trash2Icon className="h-4 w-4 cursor-pointer text-red-400 hover:text-red-500" onClick={() => handleRemove(idx)} />
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Start year"
                    name={`educations[${idx}].startYear`}
                    type="number"
                    value={item.startYear}
                    onChange={formik.handleChange}
                    className="w-full [appearance:textfield] border border-[#333] bg-[#1a1a1a] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <Input
                    placeholder="End year"
                    name={`educations[${idx}].endYear`}
                    type="number"
                    value={item.endYear}
                    onChange={formik.handleChange}
                    className="w-full [appearance:textfield] border border-[#333] bg-[#1a1a1a] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                {formik.errors.educations?.[idx] && typeof formik.errors.educations[idx] === 'object' && (
                  <p className="mt-1 text-sm text-red-400">
                    {(formik.errors.educations[idx] as any).title ||
                      (formik.errors.educations[idx] as any).startYear ||
                      (formik.errors.educations[idx] as any).endYear}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-start">
            <Button variant="ghost" type="button" onClick={handleAdd} className="border border-[#333] text-white hover:bg-[#1b1b1b]">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-[#333] pt-4">
            <Button variant="ghost" type="button" disabled={isLoading} onClick={() => setOpen(false)} className="cursor-pointer text-white">
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading} className="cursor-pointer bg-white text-black hover:bg-gray-200">
              Save Changes
            </Button>
          </div>
        </form>
      </CommonModal>
    </div>
  );
}
