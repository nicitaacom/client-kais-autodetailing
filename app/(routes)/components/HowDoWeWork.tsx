"use client"

import { useState } from "react"
import Image from "next/image"
import { consts } from "@/consts/consts"

function Tab({
  selectedTab,
  buttonText,
  iconSrc,
  onClick,
}: {
  selectedTab: string
  buttonText: string
  iconSrc: string
  onClick: (tab: string) => void
}) {
  const isSelected = selectedTab === buttonText

  return (
    <button
      onClick={() => onClick(buttonText)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm uppercase transition-all duration-200 border ${
        isSelected
          ? "bg-red-600 text-white border-red-600 shadow-lg"
          : "bg-foreground-accent text-subTitle border-red-900/20 hover:border-red-600/50 hover:text-title"
      }`}>
      {buttonText}
      <Image
        className={`w-4 h-4 transition-all ${isSelected ? "filter brightness-0 invert" : ""}`}
        src={iconSrc}
        alt="icon"
        width={16}
        height={16}
      />
    </button>
  )
}

export function HowDoWeWork() {
  const [selectedTab, setSelectedTab] = useState<string>(consts.howWeWorkTabs[0]?.text || "")

  const handleTabClick = (tab: string) => setSelectedTab(tab)
  const selectedTabContent = consts.howWeWorkTabs.find(tab => tab.text === selectedTab)

  return (
    <div className="bg-foreground rounded-xl border border-red-900/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-red-600 rounded-full" />
        <h3 className="text-2xl text-title">
          How do we <span className="font-bold">work?</span>
        </h3>
      </div>

      {/* Tabs */}
      <ul className="flex flex-wrap gap-3 mb-6">
        {consts.howWeWorkTabs.map(tab => (
          <li key={`tab-${tab.text}`}>
            <Tab selectedTab={selectedTab} buttonText={tab.text} iconSrc={tab.iconSrc} onClick={handleTabClick} />
          </li>
        ))}
      </ul>

      {/* Steps */}
      {selectedTabContent && (
        <div className="grid gap-4 laptop:grid-cols-2 desktop:grid-cols-3">
          {selectedTabContent.steps.map((step, index) => (
            <div
              className="bg-foreground-accent hover:bg-red-900/10 rounded-xl border border-red-900/20 p-4 transition-all duration-200 hover:border-red-600/30"
              key={`step-${index}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                  {step.iconSrc && step.iconSrc !== "/" ? (
                    <Image className="w-5 h-5" src={step.iconSrc} alt={step.title} width={20} height={20} />
                  ) : (
                    <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                  )}
                </div>
                <h5 className="font-bold text-title">{step.title}</h5>
              </div>
              <p className="text-sm text-subTitle leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
