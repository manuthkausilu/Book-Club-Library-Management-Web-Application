import React, { useState, useEffect } from "react";
import type { Reader, ReaderFormData } from "../../types/Reader";

interface ReaderFormProps {
  reader?: Reader | null;
  onSubmit: (readerData: Omit<Reader, "_id">) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  registerDate?: string;
}

const ReaderForm = ({ reader, onSubmit }: ReaderFormProps) => {
  const [formData, setFormData] = useState<ReaderFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    registerDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (reader) {
      setFormData({
        name: reader.name,
        email: reader.email,
        phoneNumber: reader.phoneNumber,
        address: reader.address,
        registerDate: new Date(reader.registerDate).toISOString().split("T")[0],
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        registerDate: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [reader]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    if (!formData.registerDate) {
      newErrors.registerDate = "Register date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.name ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter reader name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.email ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter email address"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.phoneNumber ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter phone number"
        />
        {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.address ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter address"
        />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
      </div>

      <div>
        <label htmlFor="registerDate" className="block text-sm font-medium text-gray-700 mb-1">
          Register Date
        </label>
        <input
          type="date"
          id="registerDate"
          name="registerDate"
          value={formData.registerDate}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.registerDate ? "border-red-300" : "border-gray-300"
          }`}
          required
        />
        {errors.registerDate && <p className="mt-1 text-sm text-red-600">{errors.registerDate}</p>}
      </div>

      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Submit
      </button>
    </form>
  );
};

export default ReaderForm;