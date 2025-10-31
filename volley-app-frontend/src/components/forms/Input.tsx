'use client';

import React from 'react';

interface InputProps {
  readonly id: string;
  readonly name: string;
  readonly type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime-local';
  readonly label: string;
  readonly value: string;
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly className?: string;
}

export function Input({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
}: InputProps) {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          px-3 py-2 border rounded-lg
          bg-white dark:bg-gray-800
          border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-gray-100
          placeholder-gray-500 dark:placeholder-gray-400
          focus:ring-2 focus:ring-orange-500 focus:border-orange-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
          ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
        `}
      />
      
      {error && (
        <span className="text-sm text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
} 