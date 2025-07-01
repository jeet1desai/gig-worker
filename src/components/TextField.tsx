'use client';

import React from 'react';
import { Form, Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

interface TextFieldProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  icon?: React.ReactNode;
  size?: 'large' | 'middle' | 'small';
  className?: string;
  labelClassName?: string;
  style?: React.CSSProperties;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  required = false,
  placeholder,
  type = 'text',
  icon,
  size = 'large',
  className = '',
  labelClassName = '',
  style = {},
}) => {
  const InputComponent = type === 'password' ? Input.Password : Input;

  return (
    <Form.Item
      name={name}
      rules={[{ required, message: `${label || name} is required` }]}
      className="mb-4"
    >
      <div>
        {label && (
          <label htmlFor={name} className={`mb-1 block font-medium ${labelClassName}`}>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        {type === 'password' ? (
          <Input.Password
            id={name}
            name={name}
            prefix={icon}
            placeholder={placeholder}
            size={size}
            className={className}
            style={{
              background: 'transparent',
              color: '#FFF2E3',
              ...style,
            }}
            rootClassName="custom-ant-input"
            iconRender={(visible) =>
              visible ? (
                <EyeTwoTone twoToneColor="#FFF2E3" />
              ) : (
                <EyeInvisibleOutlined style={{ color: '#FFF2E3' }} />
              )
            }
          />
        ) : (
          <InputComponent
            id={name}
            name={name}
            prefix={icon}
            placeholder={placeholder}
            size={size}
            className={className}
            style={{
              background: 'transparent',
              color: '#FFF2E3',
              ...style,
            }}
            rootClassName="custom-ant-input"
          />
        )}
        <style jsx global>{`
          .custom-ant-input input::placeholder {
            color: #fff2e3 !important;
            opacity: 1;
          }
        `}</style>
      </div>
    </Form.Item>
  );
};

export default TextField;
