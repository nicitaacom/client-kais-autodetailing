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
      className="w-full max-w-[500px] flex flex-col gap-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 hover:border-red-500/30 p-6 shadow-2xl shadow-black/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
        <h1 className="text-white text-2xl font-bold drop-shadow-lg">Contact us</h1>
      </div>

      <div className="grid grid-cols-[35%,65%] gap-x-3">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2 drop-shadow-sm" htmlFor="name">
            My name is
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="James"
            className="w-full bg-black/30 backdrop-blur-sm text-white placeholder-gray-400 border border-white/20 focus:border-red-500/50 rounded-lg focus:ring-2 focus:ring-red-500/30 focus:outline-none px-3 py-2 text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2 drop-shadow-sm" htmlFor="contactInfo">
            How do we contact you?
          </label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="+44 123 456 78 90"
            className="w-full bg-black/30 backdrop-blur-sm text-white placeholder-gray-400 border border-white/20 focus:border-red-500/50 rounded-lg focus:ring-2 focus:ring-red-500/30 focus:outline-none px-3 py-2 text-sm transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2 drop-shadow-sm" htmlFor="message">
          I want
        </label>
        <textarea
          className="w-full bg-black/30 backdrop-blur-sm text-white placeholder-gray-400 border border-white/20 focus:border-red-500/50 rounded-lg focus:ring-2 focus:ring-red-500/30 focus:outline-none px-3 py-2 text-sm transition-all min-h-[80px] resize-none"
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
          "w-full bg-red-600/90 backdrop-blur-sm hover:bg-red-600 border border-red-500/30 text-white px-4 py-3 font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-red-600/25",
          isFormValid
            ? "hover:shadow-red-600/40 active:scale-[0.98] hover:border-red-400"
            : "opacity-50 cursor-not-allowed",
        )}>
        Contact us - get response in 2mins
      </button>
    </form>
  )
}
