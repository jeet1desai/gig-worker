'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { PencilIcon } from 'lucide-react';
import CommonModal from '@/components/CommonModal';

export default function EditProfileModal() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    website: '',
    location: '',
    about: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <PencilIcon onClick={() => setOpen(true)} className="mb-2 h-4 w-4 cursor-pointer text-white hover:text-gray-300" />
      <CommonModal
        open={open}
        onOpenChange={setOpen}
        className="max-h-[90vh] overflow-y-auto rounded-xl bg-[#111] px-6 py-4 text-white sm:max-w-[600px]"
        title="Edit Profile Details"
        subtitle="Write a little bit about you."
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="col-span-1 text-right">
              First Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className="col-span-3 border border-[#333] bg-[#1a1a1a] text-white"
              placeholder="First name"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="col-span-1 text-right">
              Last Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className="col-span-3 border border-[#333] bg-[#1a1a1a] text-white"
              placeholder="Last name"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="about" className="col-span-1 mt-2 text-right">
              About Yourself
            </Label>
            <Textarea
              id="about"
              name="about"
              value={profile.about}
              onChange={handleChange}
              className="col-span-3 border border-[#333] bg-[#1a1a1a] text-white"
              placeholder="Tell us something about you..."
              rows={4}
            />
          </div>
        </div>

        <div className="my-4 border-t border-[#333]" />

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)} className="cursor-pointer text-white">
            Cancel
          </Button>
          <Button
            className="cursor-pointer bg-white text-black hover:bg-gray-200"
            onClick={() => {
              console.log('Saved data:', profile);
              setOpen(false);
            }}
          >
            Save Changes
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}
