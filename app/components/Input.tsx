import React, { forwardRef, InputHTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Additional class names to apply to the input */
  className?: string
  /** Error message to display (shows red border if present) */
  error?: string
  /** Helper text to display below the input */
  helperText?: string
  /** Label text for the input */
  label?: string
  /** Whether the input is required */
  required?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, label, required, id, ...props }, ref) => {
    // Generate a unique ID if none provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            "w-full bg-[#303030] text-lg focus:ring-2 focus:outline-none px-2 py-1",
            "disabled:brightness-50 disabled:cursor-default",
            error
              ? "border-danger focus:border-danger focus:ring-red-200"
              : "border-gray-300 focus:border-info focus:ring-blue-200",
            className,
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-description` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-description`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"
