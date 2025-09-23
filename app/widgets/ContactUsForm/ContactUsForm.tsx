"use client"

import { Input } from "@/components/Input"
import { businessInfo } from "@/consts/businessInfo"
import React, { useState } from "react"
import { twMerge } from "tailwind-merge"
import { contactUsAction } from "./actions/contactUsAction"

interface ContactFormData {
  firstName: string
  phone: string
  message: string
}

interface ValidationErrors {
  firstName?: string
  phone?: string
  message?: string
}

export function ContactUsForm() {
  const [formData, setFormData] = useState<ContactFormData>({ firstName: "", phone: "", message: "" })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  // 1. Validate name field
  const validateName = (value: string): string | undefined =>
    value.length < 2 ? "Name must be at least 2 characters" : undefined

  // 2. Validate phone field
  const validatePhone = (value: string): string | undefined => {
    const phoneRegex = /^[+0-9\s]*$/
    return !phoneRegex.test(value)
      ? "Phone can only contain +, space, and numbers"
      : value.length === 0
        ? "Phone is required"
        : undefined
  }

  // 3. Validate message field
  const validateMessage = (value: string): string | undefined =>
    value.length < 3 ? "Message must be at least 3 characters" : undefined

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // 4. Filter phone input
    const filteredValue = name === "phone" ? value.replace(/[^+0-9\s]/g, "") : value
    setFormData(prev => ({ ...prev, [name]: filteredValue }))
    // 5. Clear error on type
    errors[name as keyof ValidationErrors] && setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // 6. Validate all fields
    const newErrors: ValidationErrors = {
      firstName: validateName(formData.firstName),
      phone: validatePhone(formData.phone),
      message: validateMessage(formData.message),
    }
    setErrors(newErrors)
    setErrorMessage("")
    setSuccessMessage("")

    // 7. Submit if valid
    if (!Object.values(newErrors).some(error => error)) {
      try {
        await contactUsAction(formData.firstName, formData.phone, formData.message)
        setSuccessMessage("We will respond ASAP")
      } catch (error) {
        setErrorMessage("Failed to send message. Please try again.")
      }
    }
  }

  const isFormValid =
    formData.firstName &&
    formData.phone &&
    formData.message &&
    !validateName(formData.firstName) &&
    !validatePhone(formData.phone) &&
    !validateMessage(formData.message)

  return (
    <div className="w-full max-w-[500px]">
      {/* Status Messages */}
      {(errorMessage || successMessage) && (
        <div
          className={twMerge(
            "mb-4 px-4 py-3 rounded-lg border text-sm font-medium",
            errorMessage ? "bg-danger/10 border-danger/30 text-danger" : "bg-success/10 border-success/30 text-success",
          )}>
          {errorMessage || successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full bg-foreground rounded-xl border border-border-color p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-brand rounded-full" />
          <h1 className="text-title text-2xl font-bold">Contact us</h1>
        </div>

        {/* Name and Phone Grid */}
        <div className="grid grid-cols-1 mobile:grid-cols-[1fr,1.5fr] gap-4">
          <div className="space-y-1">
            <Input
              className="w-full"
              type="text"
              id="firstName"
              name="firstName"
              label="My name is"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="James"
              maxLength={32}
            />
            {errors.firstName && <p className="text-danger text-xs">{errors.firstName}</p>}
          </div>

          <div className="space-y-1">
            <Input
              className="w-full"
              type="text"
              id="phone"
              name="phone"
              label="How do we contact you?"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+44 123 456 7890"
              maxLength={17}
            />
            {errors.phone && <p className="text-danger text-xs">{errors.phone}</p>}
          </div>
        </div>

        {/* Message Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-subTitle" htmlFor="message">
            I want
          </label>
          <div className="relative">
            <textarea
              className="w-full bg-foreground-accent text-title border border-border-color rounded-lg focus:ring-2 focus:ring-brand/30 focus:border-brand focus:outline-none px-3 py-3 text-sm transition-all min-h-[100px] resize-none pr-16"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={businessInfo.cta}
              maxLength={300}
            />
            <p className="absolute bottom-3 right-3 text-subTitle/60 text-xs pointer-events-none font-mono">
              {formData.message.length}/300
            </p>
          </div>
          {errors.message && <p className="text-danger text-xs">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          className={twMerge(
            "w-full bg-brand hover:bg-brand/90 text-title-foreground px-4 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg",
            isFormValid ? "hover:shadow-brand/25 active:scale-[0.98] hover:shadow-xl" : "opacity-50 cursor-not-allowed",
          )}
          type="submit"
          disabled={!isFormValid}>
          {businessInfo.cta}
        </button>
      </form>
    </div>
  )
}
