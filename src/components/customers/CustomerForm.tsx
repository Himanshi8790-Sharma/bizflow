"use client";

import { CreateCustomerInput, Customer } from "@/src/types/customer.types";
import { useEffect, useState } from "react";


interface CustomerFormProps {
  customer?: Customer | null;
  isSubmitting?: boolean;
  onSubmit: (data: CreateCustomerInput) => void | Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function CustomerForm({
  customer,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: CustomerFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditMode = Boolean(customer);

  useEffect(() => {
    setName(customer?.name ?? "");
    setEmail(customer?.email ?? "");
    setPhone(customer?.phone ?? "");
    setAddress(customer?.address ?? "");
    setErrors({});
  }, [customer]);

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Customer name is required.";
    } else if (name.trim().length > 100) {
      newErrors.name = "Name cannot exceed 100 characters.";
    }

    const trimmedEmail = email.trim();

    if (
      trimmedEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      newErrors.email = "Please enter a valid email address.";
    } else if (trimmedEmail.length > 254) {
      newErrors.email = "Email cannot exceed 254 characters.";
    }

    if (phone.trim().length > 20) {
      newErrors.phone = "Phone cannot exceed 20 characters.";
    }

    if (address.trim().length > 500) {
      newErrors.address = "Address cannot exceed 500 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data: CreateCustomerInput = {
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      address: address.trim() || null,
    };

    await onSubmit(data);
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300";

  function renderError(error?: string) {
    if (!error) return null;

    return (
      <p role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
        {error}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-5">
        {/* Customer Name */}
        <div>
          <label htmlFor="customer-name" className={labelClass}>
            Customer Name <span className="text-red-500">*</span>
          </label>

          <input
            id="customer-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter customer name"
            maxLength={100}
            disabled={isSubmitting}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "customer-name-error" : undefined}
            className={inputClass}
          />

          {errors.name && (
            <p
              id="customer-name-error"
              role="alert"
              className="mt-1.5 text-xs text-red-600 dark:text-red-400"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="customer-email" className={labelClass}>
            Email Address
          </label>

          <input
            id="customer-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="customer@example.com"
            maxLength={254}
            disabled={isSubmitting}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={inputClass}
          />

          {renderError(errors.email)}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="customer-phone" className={labelClass}>
            Phone Number
          </label>

          <input
            id="customer-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter phone number"
            maxLength={20}
            disabled={isSubmitting}
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            className={inputClass}
          />

          {renderError(errors.phone)}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="customer-address" className={labelClass}>
            Address
          </label>

          <textarea
            id="customer-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Enter customer address"
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
            autoComplete="street-address"
            aria-invalid={Boolean(errors.address)}
            className={`${inputClass} resize-y`}
          />

          {renderError(errors.address)}
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Customer"
              : "Create Customer"}
        </button>
      </div>
    </form>
  );
}