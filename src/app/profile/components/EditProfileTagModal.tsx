'use client';

import { PencilIcon, PlusIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CommonModal from '@/components/CommonModal';
import { HammerSvg, BulbSvg, DartSvg } from '@/components/icons';
import { userService } from '@/services/user.services';
import { toast } from '@/lib/toast';
import { UserProfile, UserProfileDetails } from '@/types/shared/user';

interface EditProfileTagModalProps {
  isOwnProfile: boolean;
  user: UserProfileDetails;
  handleUpdateProfileAction: (updateUserDetails: UserProfileDetails) => void;
}

interface FormValues {
  skills: string[];
  extracurricular: string[];
  interests: string[];
  skillInput: string;
  extraInput: string;
  interestInput: string;
}

export default function EditProfileTagsModal({ user, isOwnProfile, handleUpdateProfileAction }: EditProfileTagModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    skills: user.profile?.skills || [],
    extracurricular: user.profile?.extracurricular || [],
    interests: user.profile?.interests || [],
    skillInput: '',
    extraInput: '',
    interestInput: ''
  };

  const handleTagsSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const { skillInput, extraInput, interestInput, ...profileValues } = values;

      const response = await userService.updateUserTags({
        skills: profileValues.skills,
        interests: profileValues.interests,
        extracurricular: profileValues.extracurricular
      });

      handleUpdateProfileAction({
        ...user,
        profile: response.data as UserProfile
      });

      toast.success('Profile updated successfully');
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

      console.error('Error updating profile tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const { values, setFieldValue, setFieldError, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: handleTagsSubmit
  });

  useEffect(() => {
    if (open) {
      resetForm({
        values: {
          skills: user.profile?.skills ?? [],
          extracurricular: user.profile?.extracurricular ?? [],
          interests: user.profile?.interests ?? [],
          skillInput: '',
          extraInput: '',
          interestInput: ''
        }
      });
    }
  }, [open]);

  const handleAdd = (type: 'skills' | 'extracurricular' | 'interests') => {
    const inputKey = type === 'skills' ? 'skillInput' : type === 'extracurricular' ? 'extraInput' : 'interestInput';

    const trimmed = values[inputKey].trim();
    if (!trimmed || values[type].includes(trimmed)) return;

    setFieldValue(type, [...values[type], trimmed]);
    setFieldValue(inputKey, '');
  };

  const removeItem = (type: 'skills' | 'extracurricular' | 'interests', item: string) => {
    setFieldValue(
      type,
      values[type].filter((i: string) => i !== item)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'skills' | 'extracurricular' | 'interests') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd(type);
    }
  };

  return (
    <div>
      {isOwnProfile && <PencilIcon onClick={() => setOpen(true)} className="h-4 w-4 cursor-pointer text-white hover:text-gray-300" />}
      <CommonModal
        open={open}
        onOpenChange={setOpen}
        className="max-h-[90vh] overflow-y-auto rounded-xl bg-[#111] px-6 py-4 text-white sm:max-w-[600px]"
        title="Edit Profile Tags"
        subtitle="Update your skills, interests, and activities"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-1 text-sm font-semibold text-white">
              <HammerSvg /> Skills
            </label>
            <div className="flex items-center gap-2">
              <Input
                name="skillInput"
                value={values.skillInput}
                onChange={handleChange}
                placeholder="Enter skill"
                onKeyDown={(event) => handleKeyDown(event, 'skills')}
                className="border border-[#333] bg-[#1a1a1a] text-white"
              />
              <Button type="button" size="icon" onClick={() => handleAdd('skills')}>
                <PlusIcon size={18} />
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {values.skills.map((item: string, idx: number) => (
                <span key={idx} className="flex items-center gap-2 rounded-full border border-[#333] bg-[#1b1b1b] px-3 py-1 text-sm">
                  {item}
                  <XIcon size={14} className="cursor-pointer hover:text-red-400" onClick={() => removeItem('skills', item)} />
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1 text-sm font-semibold text-white">
              <DartSvg /> Extracurricular
            </label>
            <div className="flex items-center gap-2">
              <Input
                name="extraInput"
                value={values.extraInput}
                onChange={handleChange}
                onKeyDown={(event) => handleKeyDown(event, 'extracurricular')}
                placeholder="Enter extracurricular"
                className="border border-[#333] bg-[#1a1a1a] text-white"
              />
              <Button type="button" size="icon" onClick={() => handleAdd('extracurricular')}>
                <PlusIcon size={18} />
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {values.extracurricular.map((item: string, idx: number) => (
                <span key={idx} className="flex items-center gap-2 rounded-full border border-[#333] bg-[#1b1b1b] px-3 py-1 text-sm">
                  {item}
                  <XIcon size={14} className="cursor-pointer hover:text-red-400" onClick={() => removeItem('extracurricular', item)} />
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1 text-sm font-semibold text-white">
              <BulbSvg /> Interests
            </label>
            <div className="flex items-center gap-2">
              <Input
                name="interestInput"
                value={values.interestInput}
                onChange={handleChange}
                onKeyDown={(event) => handleKeyDown(event, 'interests')}
                placeholder="Enter interest"
                className="border border-[#333] bg-[#1a1a1a] text-white"
              />
              <Button type="button" size="icon" onClick={() => handleAdd('interests')}>
                <PlusIcon size={18} />
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {values.interests.map((item: string, idx: number) => (
                <span key={idx} className="flex items-center gap-2 rounded-full border border-[#333] bg-[#1b1b1b] px-3 py-1 text-sm">
                  {item}
                  <XIcon size={14} className="cursor-pointer hover:text-red-400" onClick={() => removeItem('interests', item)} />
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#333] pt-4">
            <Button type="button" variant="ghost" disabled={isLoading} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading} className="bg-white text-black hover:bg-gray-200">
              Save Changes
            </Button>
          </div>
        </form>
      </CommonModal>
    </div>
  );
}
