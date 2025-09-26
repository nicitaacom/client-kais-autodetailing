import { twMerge } from "tailwind-merge"
import Image from "next/image"
import Link from "next/link"
import { businessInfo } from "@/consts/businessInfo"
import { formatPhoneNumber } from "../utils/formatPhoneNumber"

interface BusinessHours {
  [key: string]: { opens: string; closes: string } | null
}

interface BusinessHoursProps {
  businessHours: BusinessHours
  className?: string
}

function BusinessHours({ businessHours, className }: BusinessHoursProps) {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1, 3)

  // 1. Group days by identical hours or closed status
  const groupedHours = Object.entries(businessHours).reduce(
    (acc, [day, hours]) => {
      const key = hours ? `${hours.opens}-${hours.closes}` : "closed"
      acc[key] = acc[key] ? [...acc[key], day] : [day]
      return acc
    },
    {} as Record<string, string[]>,
  )

  // 2. Format display groups
  const displayGroups = Object.entries(groupedHours).map(([key, days]) => {
    const isClosed = key === "closed"
    const [opens, closes] = isClosed ? ["", ""] : key.split("-")
    const dayRange =
      days.length > 1 ? `${capitalize(days[0])}-${capitalize(days[days.length - 1])}` : capitalize(days[0])
    return { dayRange, opens, closes, isClosed }
  })

  // 3. Sort groups by day order
  const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  displayGroups.sort((a, b) => {
    const aDay = a.dayRange.split("-")[0].toLowerCase()
    const bDay = b.dayRange.split("-")[0].toLowerCase()
    return dayOrder.indexOf(aDay) - dayOrder.indexOf(bDay)
  })

  return (
    <div className={twMerge("text-sm text-subTitle space-y-1", className)}>
      {displayGroups.map(({ dayRange, opens, closes, isClosed }, index) => (
        <p key={index}>
          {dayRange}: {isClosed ? "Closed" : `${opens} - ${closes}`}
        </p>
      ))}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-black border-t border-brand/30 px-6 py-8">
      <div className="flex flex-col laptop:flex-row justify-between items-center gap-8">
        <div className="flex flex-col laptop:flex-row gap-8 laptop:gap-16">
          {/* LOGO */}
          <div className="flex justify-center items-center gap-3">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <h1 className="text-xl font-bold text-title">{businessInfo.name}</h1>
          </div>

          {/* BUSINESS HOURS */}
          <BusinessHours businessHours={businessInfo.businessHours} />
        </div>

        <div className="flex flex-col laptop:flex-row gap-8">
          {/* LEGAL LINKS */}
          <div className="flex flex-col items-center gap-3">
            <Link className="text-brand hover:text-brand text-sm transition-colors" href="/terms-of-service">
              Terms of Service
            </Link>
            <Link className="text-brand hover:text-brand text-sm transition-colors" href="/privacy-policy">
              Privacy Policy
            </Link>
          </div>

          {/* CONTACT INFO */}
          <div className="flex flex-col items-center laptop:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-brand rounded-full flex items-center justify-center">
                <Image
                  className="w-3 h-3 filter brightness-0 invert"
                  src="/phone.svg"
                  alt="phone"
                  width={12}
                  height={12}
                />
              </div>
              <span className="text-title text-sm font-medium">{formatPhoneNumber(businessInfo.phone)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-brand rounded-full flex items-center justify-center">
                <Image
                  className="w-3 h-3 filter brightness-0 invert"
                  src="/email.svg"
                  alt="email"
                  width={12}
                  height={12}
                />
              </div>
              <span className="text-title text-sm">{businessInfo.email}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
