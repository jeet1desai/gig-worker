'use client';
import { cn } from '@/lib/utils';
import { type HTMLInputTypeAttribute, useId } from 'react';

type InputGroupProps = {
  className?: string;
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  fileStyleVariant?: 'style1' | 'style2';
  required?: boolean;
  disabled?: boolean;
  active?: boolean;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value?: string | number;
  name?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  height?: 'sm' | 'default';
  defaultValue?: string;
  error: string;
  isNumeric?: boolean;
  min?: number;
  max?: number;
};

const InputGroup: React.FC<InputGroupProps> = ({
  className,
  label,
  type,
  placeholder,
  required,
  disabled,
  active,
  handleChange,
  icon,
  handleBlur,
  isNumeric,
  min,
  max,
  ...props
}) => {
  const id = useId();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isNumeric) {
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
      if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key) && ['e', 'E', '+', '-'].includes(event.key)) {
        event.preventDefault();
      }
    }
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="text-body-sm text-dark font-medium text-white">
        {label}
        {required && <span className="ml-1 text-red-500 select-none">*</span>}
      </label>

      <div
        className={cn(
          'relative mt-1 [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:-translate-y-1/2',
          props.iconPosition === 'left' ? '[&_svg]:left-4.5' : '[&_svg]:right-4.5',
        )}
      >
        <input
          id={id}
          type={type}
          name={props.name}
          placeholder={placeholder}
          onChange={handleChange}
          value={props.value}
          defaultValue={props.defaultValue}
          className={cn(
            'disabled:bg-gray-2 disabled:bg-dark w-full rounded-lg border-[1.5px] border-[#374151] bg-[#1F2A37] transition outline-none focus:border-[#5750F1] disabled:cursor-default data-[active=true]:border-[#5750F1]',
            type === 'file' ? getFileStyles(props.fileStyleVariant!) : 'text-dark placeholder:text-dark-6 px-5.5 py-3 text-white',
            props.iconPosition === 'left' && 'pl-12.5',
            props.height === 'sm' && 'py-2.5',
          )}
          required={required}
          disabled={disabled}
          min={min}
          data-active={active}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          max={max}
        />

        {icon}
      </div>
      {props.error && <p className="mt-2 text-xs text-red-500">{props.error}</p>}
    </div>
  );
};

export default InputGroup;

function getFileStyles(variant: 'style1' | 'style2') {
  switch (variant) {
    case 'style1':
      return `file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-[#E6EBF1] file:bg-[#E2E8F0] file:px-6.5 file:py-[13px] file:text-body-sm file:font-medium file:text-dark-5 file:hover:bg-[#5750F1] file:hover:bg-opacity-10 file:border-[#374151] file:bg-white/30 file:text-white`;
    default:
      return `file:mr-4 file:rounded file:border-[0.5px] file:border-[#E6EBF1] file:bg-[#E6EBF1] file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 file:focus:border-[#5750F1] file:border-[#374151] file:bg-white/30 file:text-white px-3 py-[9px]`;
  }
}
