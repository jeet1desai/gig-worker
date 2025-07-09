'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { useRef, useState } from 'react';
import CommonModal from '@/components/CommonModal';

type EditProfilePhotoModalProps = {
  avatarSrc: string;
  name: string;
};

function getInitials(name: string) {
  const [first = '', last = ''] = name.trim().split(' ');
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export default function EditProfilePhotoModal({ avatarSrc, name }: EditProfilePhotoModalProps) {
  const [open, setOpen] = useState(false);
  const initials = getInitials(name);
  const isImageAvailable = !!avatarSrc;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
    }
  };

  return (
    <CommonModal
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-sm rounded-xl bg-[#1E1E1E] px-6 py-8 text-white"
      title="Edit Profile Photo"
      classTitle="text-center text-lg font-medium mb-6"
      trigger={
        <Avatar className="h-24 w-24 cursor-pointer border-4 border-[#0d0d0d] shadow-md">
          <AvatarImage src="/avatar.jpg" alt="Avatar" />
          <AvatarFallback className="bg-yellow-500 text-black">{initials}</AvatarFallback>
        </Avatar>
      }
    >
      <div className="flex justify-center">
        {isImageAvailable ? (
          <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-[#0d0d0d] shadow">
            <Image src={avatarSrc!} alt="Profile" width={160} height={160} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-[#0d0d0d] bg-yellow-500 text-4xl font-semibold text-black shadow">
            {initials}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button className="cursor-pointer rounded-md bg-black px-5 py-2 text-white transition hover:bg-gray-900" onClick={handleProfileClick}>
          Add photo
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <button onClick={() => setOpen(false)} className="cursor-pointer rounded-md bg-[#FFF2E0] px-5 py-2 text-black transition hover:bg-[#f7e8d1]">
          Delete
        </button>
      </div>
    </CommonModal>
  );
}
