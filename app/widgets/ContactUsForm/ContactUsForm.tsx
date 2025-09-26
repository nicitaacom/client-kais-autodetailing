"use client"

import React, { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Input } from "@/components/Input"
import { businessInfo } from "@/consts/businessInfo"
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
  const [formData, setFormData] = useState<ContactFormData>({ firstName: "", phone: "+44 ", message: "" })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  // 1. Format phone number with mask +XX XXX XXX XX XX
  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "")
    if (digits.length === 0) return "+44 "
    let formattedDigits = digits.startsWith("44") ? digits : "44" + digits
    if (formattedDigits.length <= 2) return `+${formattedDigits}`
    if (formattedDigits.length <= 5) return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2)}`
    if (formattedDigits.length <= 8)
      return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2, 5)} ${formattedDigits.slice(5)}`
    if (formattedDigits.length <= 10)
      return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2, 5)} ${formattedDigits.slice(5, 8)} ${formattedDigits.slice(8)}`
    return `+${formattedDigits.slice(0, 2)} ${formattedDigits.slice(2, 5)} ${formattedDigits.slice(5, 8)} ${formattedDigits.slice(8, 10)} ${formattedDigits.slice(10, 12)}`
  }

  // 2. Validate name field
  const validateName = (value: string): string | undefined =>
    value.length < 2 ? "Name must be at least 2 characters" : undefined

  // 3. Validate phone field
  const validatePhone = (value: string): string | undefined =>
    value.replace(/\D/g, "").length < 10 ? "Please enter a valid phone number" : undefined

  // 4. Validate message field
  const validateMessage = (value: string): string | undefined =>
    value.length < 3 ? "Message must be at least 3 characters" : undefined

  // 5. Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "phone") {
      const formatted = formatPhoneNumber(value)
      setFormData(prev => ({ ...prev, [name]: formatted }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    errors[name as keyof ValidationErrors] && setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  // 6. Handle phone input key events
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ([8, 9, 27, 13, 46, 35, 36, 37, 39].includes(e.keyCode)) return
    if ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88) && e.ctrlKey) return
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  // 7. Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: ValidationErrors = {
      firstName: validateName(formData.firstName),
      phone: validatePhone(formData.phone),
      message: validateMessage(formData.message),
    }
    setErrors(newErrors)
    setErrorMessage("")
    setSuccessMessage("")
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
    formData.phone.length >= 7 &&
    formData.message &&
    !validateName(formData.firstName) &&
    !validatePhone(formData.phone) &&
    !validateMessage(formData.message)

  return (
    <div className="w-full max-w-[500px]">
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
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-brand rounded-full" />
          <h1 className="text-title text-2xl font-bold">Contact us</h1>
        </div>

        <div className="grid grid-cols-1 mobile:grid-cols-[1fr,1.5fr] gap-4">
          <div className="space-y-1">
            <Input
              className="w-full focus:ring-2 focus:ring-brand/30 focus:border-brand rounded-lg"
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
              className="w-full focus:ring-2 focus:ring-brand/30 focus:border-brand rounded-lg font-mono"
              type="text"
              id="phone"
              name="phone"
              label="How do we contact you?"
              value={formData.phone}
              onChange={handleChange}
              onKeyDown={handlePhoneKeyDown}
              placeholder="+44 123 456 78 90"
              maxLength={17}
            />
            {errors.phone && <p className="text-danger text-xs">{errors.phone}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-subTitle" htmlFor="message">
            I want
          </label>
          <div className="relative">
            <textarea
              className="w-full bg-foreground-accent text-title border border-border-color rounded-lg
              focus:ring-2 focus:ring-brand/30 focus:border-brand focus:outline-none px-3 py-3 text-sm transition-all min-h-[100px] resize-none pr-16"
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
