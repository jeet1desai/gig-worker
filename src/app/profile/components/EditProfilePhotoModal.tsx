'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Pencil } from 'lucide-react';

import CommonModal from '@/components/CommonModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/user.services';
import { UserProfileDetails } from '@/types/shared/user';
import { toast } from '@/lib/toast';
import { useFilePicker } from '@/hooks/useFilePicker';

type EditProfilePhotoModalProps = {
  isOwnProfile: boolean;
  user: UserProfileDetails;
  handleUpdateProfileAction: (updateUserDetails: UserProfileDetails) => void;
};

export function getInitials(first_name: string = '', last_name: string = '') {
  return `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase();
}

export default function EditProfilePhotoModal({ user, isOwnProfile, handleUpdateProfileAction }: EditProfilePhotoModalProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { file, previewUrl, error, openFileDialog, clearFiles } = useFilePicker({
    allowedCategories: ['image'],
    maxSizes: { image: 5 },
    multiple: false
  });

  const initials = getInitials(user.first_name!, user.last_name!);
  const isImageAvailable = !!(previewUrl || user.profile_url);

  const handleUpload = async () => {
    if (!file) {
      setLocalError('Please choose an image to upload.');
      return;
    }

    setLocalError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const res = await userService.updateUserProfilePicture(formData);
      setOpen(false);
      clearFiles();
      handleUpdateProfileAction({
        ...user,
        profile_url: res.data?.profile_url as string
      });
      toast.success('Profile picture updated successfully');
    } catch (err) {
      setLocalError('Something went wrong while uploading.');
    } finally {
      setIsUploading(false);
    }
  };

  return isOwnProfile ? (
    <CommonModal
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-sm rounded-xl bg-[#1E1E1E] px-6 py-8 text-white"
      title="Edit Profile Photo"
      classTitle="text-center text-lg font-medium mb-6"
      trigger={
        <div className="group relative h-24 w-24 cursor-pointer rounded-full border-4 border-[#0d0d0d] shadow-md">
          <Avatar className="h-full w-full">
            <AvatarImage src={user.profile_url || '/images/avatar.jpg'} alt="Avatar" />
            <AvatarFallback className="bg-yellow-500 text-black">{initials}</AvatarFallback>
          </Avatar>

          {isOwnProfile && (
            <div className="absolute inset-0 z-10 hidden items-center justify-center rounded-full bg-black/35 group-hover:flex">
              <Pencil className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      }
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex justify-center">
          {isImageAvailable ? (
            <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-[#0d0d0d] shadow">
              <Image
                src={previewUrl || user.profile_url || '/images/avatar.jpg'}
                alt="Profile"
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-[#0d0d0d] bg-yellow-500 text-4xl font-semibold text-black shadow">
              {initials}
            </div>
          )}
        </div>
        {previewUrl && (
          <button
            type="button"
            className="cursor-pointer text-sm text-red-400 hover:text-red-500"
            onClick={() => {
              clearFiles();
              setLocalError(null);
            }}
          >
            Remove
          </button>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            disabled={isUploading}
            onClick={openFileDialog}
            className="cursor-pointer border border-gray-300 bg-transparent text-white hover:bg-[#2a2a2a]"
          >
            Add photo
          </Button>

          <Button
            type="button"
            isLoading={isUploading}
            disabled={!file || isUploading}
            className="cursor-pointer bg-white text-black hover:bg-gray-200"
            onClick={handleUpload}
          >
            Upload
          </Button>
        </div>

        {(localError || error) && <p className="mt-2 text-center text-sm text-red-500">{localError || error}</p>}
      </div>
    </CommonModal>
  ) : (
    <Avatar className="h-24 w-24 border-4 border-[#0d0d0d] shadow-md">
      <AvatarImage src={user.profile_url || '/images/avatar.jpg'} alt="Avatar" />
      <AvatarFallback className="bg-yellow-500 text-black">{initials}</AvatarFallback>
    </Avatar>
  );
}
