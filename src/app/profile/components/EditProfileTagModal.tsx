'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PencilIcon, PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import CommonModal from '@/components/CommonModal';
import { HammerSvg, BulbSvg, DartSvg } from '@/components/icons';

export default function EditProfileTagsModal() {
  const [open, setOpen] = useState(false);

  const [skills, setSkills] = useState<string[]>(['Graphic Design', 'Typography']);
  const [skillInput, setSkillInput] = useState('');

  const [extracurricular, setExtracurricular] = useState<string[]>([
    'Photography',
    'Public Speaking'
  ]);
  const [extraInput, setExtraInput] = useState('');

  const [interests, setInterests] = useState<string[]>(['UI/UX Design', 'Animation']);
  const [interestInput, setInterestInput] = useState('');

  // Add item helper
  const handleAdd = (type: 'skill' | 'extra' | 'interest') => {
    const trimmed =
      type === 'skill'
        ? skillInput.trim()
        : type === 'extra'
          ? extraInput.trim()
          : type === 'interest'
            ? interestInput.trim()
            : '';

    if (!trimmed) return;

    if (type === 'skill' && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput('');
    } else if (type === 'extra' && !extracurricular.includes(trimmed)) {
      setExtracurricular((prev) => [...prev, trimmed]);
      setExtraInput('');
    } else if (type === 'interest' && !interests.includes(trimmed)) {
      setInterests((prev) => [...prev, trimmed]);
      setInterestInput('');
    }
  };

  const removeItem = (type: 'skill' | 'extra' | 'interest', item: string) => {
    if (type === 'skill') setSkills((prev) => prev.filter((i) => i !== item));
    else if (type === 'extra')
      setExtracurricular((prev) => prev.filter((i) => i !== item));
    else if (type === 'interest') setInterests((prev) => prev.filter((i) => i !== item));
  };

  const handleSave = () => {
    console.log('Skills:', skills);
    console.log('Extracurricular:', extracurricular);
    console.log('Interests:', interests);
    setOpen(false);
  };

  return (
    <div>
      <PencilIcon
        onClick={() => setOpen(true)}
        className="h-4 w-4 cursor-pointer text-white hover:text-gray-300"
      />
      <CommonModal
        open={open}
        onOpenChange={setOpen}
        className="max-h-[90vh] overflow-y-auto rounded-xl bg-[#111] px-6 py-4 text-white sm:max-w-[600px]"
        title="Edit Profile Tags"
        subtitle="Update your skills, interests, and activities"
      >
        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-1 text-sm font-semibold text-white">
            <HammerSvg /> Skills
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd('skill')}
              placeholder="Enter skill"
              className="border border-[#333] bg-[#1a1a1a] text-white"
            />
            <Button
              size="icon"
              className="border border-[#333] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
              onClick={() => handleAdd('skill')}
            >
              <PlusIcon size={18} />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((item, idx) => (
              <span
                key={idx}
                className="flex items-center gap-2 rounded-full border border-[#333] bg-[#1b1b1b] px-3 py-1 text-sm text-white"
              >
                {item}
                <XIcon
                  size={14}
                  className="cursor-pointer hover:text-red-400"
                  onClick={() => removeItem('skill', item)}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="flex items-center gap-1 text-sm font-semibold text-white">
            <DartSvg /> Extracurricular
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={extraInput}
              onChange={(e) => setExtraInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd('extra')}
              placeholder="Enter extracurricular"
              className="border border-[#333] bg-[#1a1a1a] text-white"
            />
            <Button
              size="icon"
              className="border border-[#333] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
              onClick={() => handleAdd('extra')}
            >
              <PlusIcon size={18} />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {extracurricular.map((item, idx) => (
              <span
                key={idx}
                className="flex items-center gap-2 rounded-full border border-[#333] bg-[#1b1b1b] px-3 py-1 text-sm text-white"
              >
                {item}
                <XIcon
                  size={14}
                  className="cursor-pointer hover:text-red-400"
                  onClick={() => removeItem('extra', item)}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="flex items-center gap-1 text-sm font-semibold text-white">
            <BulbSvg /> Interests
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd('interest')}
              placeholder="Enter interest"
              className="border border-[#333] bg-[#1a1a1a] text-white"
            />
            <Button
              size="icon"
              className="border border-[#333] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
              onClick={() => handleAdd('interest')}
            >
              <PlusIcon size={18} />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {interests.map((item, idx) => (
              <span
                key={idx}
                className="flex items-center gap-2 rounded-full border border-[#333] bg-[#1a1a1a] px-3 py-1 text-sm text-white"
              >
                {item}
                <XIcon
                  size={14}
                  className="cursor-pointer hover:text-red-400"
                  onClick={() => removeItem('interest', item)}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-[#333] pt-4">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="cursor-pointer text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="cursor-pointer bg-white text-black hover:bg-gray-200"
          >
            Save Changes
          </Button>
        </div>
      </CommonModal>
    </div>
  );
}
