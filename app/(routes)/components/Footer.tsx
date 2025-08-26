import { businessInfo } from "@/consts/businessInfo"
import Image from "next/image"
import Link from "next/link"
import { formatPhoneNumber } from "../utils/formatPhoneNumber"

export function Footer() {
  return (
    <footer className="bg-black border-t border-red-900/30 px-6 py-8">
      <div className="flex flex-col laptop:flex-row justify-between items-center gap-8">
        <div className="flex flex-col laptop:flex-row gap-8 laptop:gap-16">
          {/* LOGO */}
          <div className="flex justify-center items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <h1 className="text-xl font-bold text-title">{businessInfo.name}</h1>
          </div>

          {/* SERVICES HOURS */}
          <div className="flex flex-col items-center laptop:items-start">
            <h6 className="font-bold text-red-400 mb-2">Services:</h6>
            <div className="text-sm text-subTitle space-y-1">
              <p>Mo-Fr: 09:00 - 17:00</p>
              <p>Sat-Sun: 09:00 - 15:00</p>
              <p className="text-red-400">Need 24/7? - call +44 752 599 69 49</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col laptop:flex-row gap-8">
          {/* LEGAL LINKS */}
          <div className="flex flex-col items-center gap-3">
            <Link className="text-red-400 hover:text-red-300 text-sm transition-colors" href="/terms-of-service">
              Terms of Service
            </Link>
            <Link className="text-red-400 hover:text-red-300 text-sm transition-colors" href="/privacy-policy">
              Privacy Policy
            </Link>
          </div>

          {/* CONTACT INFO */}
          <div className="flex flex-col items-center laptop:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
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
              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
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
