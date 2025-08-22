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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[500px] flex flex-col gap-2 bg-foreground p-4 rounded-lg">
      <h1 className="text-title text-2xl font-bold text-center desktop:text-start">Contact us</h1>
      <div className="grid grid-cols-[35%,65%] gap-x-2">
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
        <label className="block text-sm font-medium" htmlFor="message">
          I want
        </label>
        <textarea
          className={`w-full bg-[#303030] text-lg focus:ring-2 focus:outline-none px-2 py-1 text-title
            disabled:brightness-50 disabled:cursor-default`}
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={businessInfo.cta}
        />
      </div>

      <button
        type="submit"
        disabled={!formData.name || !formData.contactInfo || !formData.message}
        className={twMerge(
          "w-full bg-brand text-title p-3 font-bold rounded-md hover:opacity-90 transition-opacity",
          (!formData.name || !formData.contactInfo || !formData.message) &&
            "brightness-75 cursor-default pointer-events-none",
        )}>
        Contact us - get response in 2mins
      </button>
    </form>
  )
}
