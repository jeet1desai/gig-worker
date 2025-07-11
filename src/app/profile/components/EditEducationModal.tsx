'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import CommonModal from '@/components/CommonModal';

interface EducationItem {
  education: string;
  startYear: string;
  endYear: string;
  error?: string;
}

export default function EditEducationModal() {
  const [open, setOpen] = useState(false);

  const [educationList, setEducationList] = useState<EducationItem[]>([
    { education: 'UI/UX Design Essentials', startYear: '2019', endYear: '2023' },
    { education: 'Wireframing and Prototyping', startYear: '2023', endYear: '2024' }
  ]);

  const handleChange = (index: number, field: keyof EducationItem, value: string) => {
    setEducationList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value, error: '' } : item))
    );
  };

  const handleAdd = () => {
    setEducationList((prev) => [...prev, { education: '', startYear: '', endYear: '' }]);
  };

  const handleRemove = (index: number) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    let valid = true;
    const updated = educationList.map((item) => {
      const start = parseInt(item.startYear);
      const end = parseInt(item.endYear);
      if (!item.education || !start || !end) {
        valid = false;
        return { ...item, error: 'All fields are required' };
      } else if (end < start) {
        valid = false;
        return { ...item, error: 'End year must be greater than or equal to start year' };
      }
      return { ...item, error: '' };
    });
    setEducationList(updated);
    return valid;
  };

  const handleSave = () => {
    if (validate()) {
      console.log('Saved education:', educationList);
      setOpen(false);
    }
  };

  return (
    <div>
      <PencilIcon
        onClick={() => setOpen(true)}
        className="h-4 w-4 cursor-pointer text-white hover:text-gray-300"
      />

      <CommonModal
        open={open}
        className="max-h-[90vh] overflow-y-auto rounded-xl bg-[#111] px-6 py-4 text-white sm:max-w-[600px]"
        onOpenChange={setOpen}
        title="Edit Education"
        subtitle="Add or update your education history"
      >
        <div className="mt-4 space-y-4">
          {educationList.map((item, idx) => (
            <div key={idx} className="space-y-2 border-b border-[#333] pb-4">
              <div className="flex items-center justify-between gap-2">
                <Input
                  placeholder="Education title"
                  value={item.education}
                  onChange={(e) => handleChange(idx, 'education', e.target.value)}
                  className="flex-1 border border-[#333] bg-[#1a1a1a] text-white"
                />
                {educationList.length > 1 && (
                  <Trash2Icon
                    className="h-4 w-4 cursor-pointer text-red-400 hover:text-red-500"
                    onClick={() => handleRemove(idx)}
                  />
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Start year"
                  type="number"
                  min="1900"
                  max="2100"
                  value={item.startYear}
                  onChange={(e) => handleChange(idx, 'startYear', e.target.value)}
                  className="w-full [appearance:textfield] border border-[#333] bg-[#1a1a1a] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <Input
                  placeholder="End year"
                  type="number"
                  min="1900"
                  max="2100"
                  value={item.endYear}
                  onChange={(e) => handleChange(idx, 'endYear', e.target.value)}
                  className="w-full [appearance:textfield] border border-[#333] bg-[#1a1a1a] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              {item.error && <p className="mt-1 text-sm text-red-400">{item.error}</p>}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-start">
          <Button
            variant="ghost"
            onClick={handleAdd}
            className="border border-[#333] text-white hover:bg-[#1b1b1b]"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Education
          </Button>
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
