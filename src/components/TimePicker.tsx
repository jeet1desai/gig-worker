import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const isDateSelected = value instanceof Date && !isNaN(value.getTime());
  const hour = value.getHours();
  const minute = value.getMinutes();
  const isPM = hour >= 12;

  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const minuteStr = minute.toString().padStart(2, '0');
  const ampm = isPM ? 'PM' : 'AM';

  const updateTime = (newHour12: number, newMinute: number, newIsPM: boolean) => {
    let hr24 = newHour12 % 12;
    if (newIsPM) hr24 += 12;

    const updated = new Date(value);
    updated.setHours(hr24);
    updated.setMinutes(newMinute);
    updated.setSeconds(0);
    onChange(updated);
  };

  return (
    <div className="flex w-full items-center justify-evenly">
      <Select value={hour12.toString()} onValueChange={(val) => updateTime(parseInt(val), minute, isPM)} disabled={!isDateSelected}>
        <SelectTrigger className="w-max">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }, (_, i) => {
            const h = (i + 1).toString();
            return (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select value={minuteStr} onValueChange={(val) => updateTime(hour12, parseInt(val), isPM)} disabled={!isDateSelected}>
        <SelectTrigger className="w-max">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 60 }, (_, i) => {
            const m = i.toString().padStart(2, '0');
            return (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select value={ampm} onValueChange={(val) => updateTime(hour12, minute, val === 'PM')} disabled={!isDateSelected}>
        <SelectTrigger className="w-max">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
