'use client';

import { useState } from 'react';
import { PencilIcon } from 'lucide-react';
import { useFormik } from 'formik';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CommonModal from '@/components/CommonModal';
import { userService } from '@/services/user.services';
import { aboutUpdateSchema } from '@/schemas/fe/user';
import FormikErrorMessage from '@/components/FormikErrorMessage';
import { UserProfile, UserProfileDetails } from '@/types/shared/user';
import { toast } from '@/lib/toast';

interface EditProfileModalProps {
  isOwnProfile: boolean;
  user: UserProfileDetails;
  handleUpdateProfileAction: (updateUserDetails: UserProfileDetails) => void;
}

export default function EditProfileModal({ user, isOwnProfile, handleUpdateProfileAction }: EditProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { values, touched, errors, setFieldError, handleChange, handleSubmit } = useFormik({
    initialValues: {
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      bio: user.profile?.bio || ''
    },
    validationSchema: aboutUpdateSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const payload = {
          first_name: values.firstName,
          last_name: values.lastName,
          bio: values.bio
        };

        const response = await userService.updateAboutDetails(payload);

        handleUpdateProfileAction({
          ...user,
          first_name: values.firstName,
          last_name: values.lastName,
          profile: response.data as UserProfile
        });

        toast.success('Profile updated successfully.');
        setOpen(false);
      } catch (error: any) {
        const apiError = error?.response?.data?.error;

        toast.error(apiError?.message || 'Something went wrong.');

        const fieldErrors = apiError?.fieldErrors;
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, msg]) => {
            setFieldError(field, msg as string);
          });
        }

        console.error('Education update error:', apiError?.details || error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div>
      {isOwnProfile && <PencilIcon onClick={() => setOpen(true)} className="mb-2 h-4 w-4 cursor-pointer text-white hover:text-gray-300" />}
      <CommonModal
        open={open}
        onOpenChange={setOpen}
        className="max-h-[90vh] overflow-y-auto rounded-xl bg-[#111] px-6 py-4 text-white sm:max-w-[600px]"
        title="Edit Profile Details"
        subtitle="Write a little bit about you."
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="col-span-1 text-right">
                First Name<span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="firstName"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  className="border border-[#333] bg-[#1a1a1a] text-white"
                  placeholder="First name"
                />
                <FormikErrorMessage name="firstName" touched={touched} errors={errors} />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="col-span-1 text-right">
                Last Name<span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="lastName"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  className="border border-[#333] bg-[#1a1a1a] text-white"
                  placeholder="Last name"
                />
                <FormikErrorMessage name="lastName" touched={touched} errors={errors} />
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="bio" className="col-span-1 mt-2 text-right">
                About Yourself
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="bio"
                  name="bio"
                  value={values.bio}
                  onChange={handleChange}
                  className="border border-[#333] bg-[#1a1a1a] text-white"
                  placeholder="Tell us something about you..."
                  rows={4}
                />
                <FormikErrorMessage name="bio" touched={touched} errors={errors} />
              </div>
            </div>
          </div>

          <div className="my-4 border-t border-[#333]" />

          <div className="flex justify-end gap-3">
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
