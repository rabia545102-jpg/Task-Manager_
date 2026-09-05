import React from 'react';

const FormInput = ({ label, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input className={`input ${error ? 'border-red-400 focus:ring-red-400' : ''}`} {...props} />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default FormInput;
