"use client"

import { useState } from "react"
import Image from "next/image"

import { consts } from "@/consts/consts"
import { TSelectedTab, selectedTabOptions } from "@/consts/howDoWeWork"

function Tab({
  selectedTab,
  buttonText,
  iconSrc,
  onClick,
}: {
  selectedTab: TSelectedTab
  buttonText: TSelectedTab
  iconSrc: string
  onClick: (tab: TSelectedTab) => void
}) {
  const isSelected = selectedTab === buttonText

  return (
    <button
      onClick={() => onClick(buttonText)}
      className={`tablet:w-fit flex flex-row justify-center tablet:justify-start items-center gap-x-1 px-2 py-1 rounded text-title uppercase border duration-75
        ${isSelected ? "bg-foreground text-background" : "bg-background text-foreground"}`}>
      {buttonText}
      <Image className="w-[20px] h-[20px]" src={iconSrc} alt="icon" width={20} height={20} />
    </button>
  )
}

export function HowDoWeWork() {
  const [selectedTab, setSelectedTab] = useState<TSelectedTab>(selectedTabOptions[0])

  // Handler for tab click
  const handleTabClick = (tab: TSelectedTab) => {
    setSelectedTab(tab)
  }

  // Get the content for the selected tab
  const selectedTabContent = consts.howWeWorkTabs.find(tab => tab.text === selectedTab)

  return (
    <div className="py-8">
      <h3 className="text-2xl mb-6">
        How do we <b>work?</b>
      </h3>

      {/* Tabs */}
      <ul className="flex flex-col mobile:flex-row flex-wrap gap-2 mb-6">
        {consts.howWeWorkTabs.map(tab => (
          <li key={`tab-${tab.text}`}>
            <Tab
              selectedTab={selectedTab}
              buttonText={tab.text as TSelectedTab}
              iconSrc={tab.iconSrc}
              onClick={handleTabClick}
            />
          </li>
        ))}
      </ul>

      {/* Display steps for selected tab */}
      {selectedTabContent && (
        <div className="mt-6">
          {/* Decided to comment it */}
          {/* <h4 className="text-xl mb-4">{selectedTabContent.text} Process:</h4> */}

          <div className="flex flex-col laptop:flex-row flex-wrap gap-4">
            {selectedTabContent.steps.map((step, index) => (
              <div
                className="laptop:w-[300px] bg-background flex flex-col gap-y-2 border rounded p-4"
                key={`step-${index}`}>
                <div className="flex items-center gap-x-2">
                  {step.iconSrc && step.iconSrc !== "/" && (
                    <Image className="w-auto h-auto" src={step.iconSrc} alt={step.title} width={32} height={32} />
                  )}
                  <h5 className="font-bold">{step.title}</h5>
                </div>

                <p className="text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
