"use client"

import { Input } from "@/components/Input"
import { businessInfo } from "@/consts/businessInfo"
import React, { useState } from "react"
import { twMerge } from "tailwind-merge"

interface ContactFormData {
  name: string
  contactInfo: string
  message: string
}

export function ContactUsForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    contactInfo: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const isFormValid = formData.name && formData.contactInfo && formData.message

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[500px] flex flex-col gap-4 bg-foreground rounded-xl border border-red-900/20 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 bg-red-600 rounded-full" />
        <h1 className="text-title text-2xl font-bold">Contact us</h1>
      </div>

      <div className="grid grid-cols-[35%,65%] gap-x-3">
        <Input
          type="text"
          id="name"
          name="name"
          label="My name is"
          value={formData.name}
          onChange={handleChange}
          placeholder="James"
        />
        <Input
          type="text"
          id="contactInfo"
          name="contactInfo"
          label="How do we contact you?"
          value={formData.contactInfo}
          onChange={handleChange}
          placeholder="+44 123 456 78 90"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-subTitle mb-2" htmlFor="message">
          I want
        </label>
        <textarea
          className="w-full bg-foreground-accent text-title border border-red-900/20 rounded-lg focus:ring-2 focus:ring-red-600/50 focus:border-red-600 focus:outline-none px-3 py-2 text-sm transition-all min-h-[80px] resize-none"
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={businessInfo.cta}
        />
      </div>

      <button
        type="submit"
        disabled={!isFormValid}
        className={twMerge(
          "w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg",
          isFormValid ? "hover:shadow-red-600/25 active:scale-[0.98]" : "opacity-50 cursor-not-allowed",
        )}>
        Contact us - get response in 2mins
      </button>
    </form>
  )
}
