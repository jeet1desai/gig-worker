'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useRef, useState } from "react";
import CommonModal from "@/components/CommonModal";

type EditProfilePhotoModalProps = {
  avatarSrc: string;
  name: string;
};

function getInitials(name: string) {
  const [first = '', last = ''] = name.trim().split(' ');
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export default function EditProfilePhotoModal({ avatarSrc, name }: EditProfilePhotoModalProps) {
  const [open, setOpen] = useState(false)
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
      className="bg-[#1E1E1E] text-white rounded-xl px-6 py-8 max-w-sm w-full"
      title="Edit Profile Photo"
      classTitle="text-center text-lg font-medium mb-6"
      trigger={
        <Avatar className="w-24 h-24 border-4 border-[#0d0d0d] shadow-md cursor-pointer">
          <AvatarImage src="/avatar.jpg" alt="Avatar" />
          <AvatarFallback className="bg-yellow-500 text-black">
            {initials}
          </AvatarFallback>
        </Avatar>
      }
    >
      <div className="flex justify-center">
        {isImageAvailable ? (
          <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-[#0d0d0d] shadow">
            <Image
              src={avatarSrc!}
              alt="Profile"
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="h-40 w-40 rounded-full flex items-center justify-center bg-yellow-500 text-black text-4xl font-semibold border-4 border-[#0d0d0d] shadow">
            {initials}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button className="px-5 py-2 rounded-md bg-black text-white hover:bg-gray-900 transition cursor-pointer" onClick={handleProfileClick}>
          Add photo
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <button onClick={() => setOpen(false)} className="px-5 py-2 rounded-md bg-[#FFF2E0] text-black hover:bg-[#f7e8d1] transition cursor-pointer">
          Delete
        </button>
      </div>
    </CommonModal>
  );
}
