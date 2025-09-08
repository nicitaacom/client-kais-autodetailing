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
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm uppercase transition-all duration-300 border backdrop-blur-sm ${
        isSelected
          ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30"
          : "bg-black/30 text-white/70 border-white/10 hover:border-red-500/50 hover:text-white hover:bg-red-900/20"
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
    <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 hover:border-red-500/30 p-6 shadow-2xl shadow-black/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
        <h3 className="text-2xl text-white drop-shadow-sm">
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
              className="bg-black/30 backdrop-blur-sm hover:bg-red-900/30 rounded-xl border border-white/10 hover:border-red-500/30 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/10"
              key={`step-${index}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-red-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/10">
                  {step.iconSrc && step.iconSrc !== "/" ? (
                    <Image className="w-5 h-5" src={step.iconSrc} alt={step.title} width={20} height={20} />
                  ) : (
                    <span className="text-red-400 font-bold text-sm">{index + 1}</span>
                  )}
                </div>
                <h5 className="font-bold text-white drop-shadow-sm">{step.title}</h5>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
