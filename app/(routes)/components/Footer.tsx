import { businessInfo } from "@/consts/businessInfo"
import Image from "next/image"
import Link from "next/link"
import { formatPhoneNumber } from "../utils/formatPhoneNumber"

export function Footer() {
  return (
    <footer className="bg-foreground flex flex-col laptop:flex-row justify-between items-center gap-y-4 px-4 py-2">
      <div className="flex flex-col laptop:flex-row gap-y-2 gap-x-24">
        {/* LOGO */}
        <div className="w-[220px] flex justify-center items-center gap-x-2">
          <Image className="w-[32px] h-[32px]" src="/favicon.ico" alt="logo" width={32} height={32} />
          <h1 className="text-xl font-bold whitespace-nowrap">{businessInfo.name}</h1>
        </div>

        <div className="flex flex-col justify-center items-center laptop:items-start text-sm">
          <h6 className="font-bold">Services:</h6>
          <p className="text-title leading-tight">Mo-Fr: 09:00 - 17:00</p>
          <p className="text-title leading-tight">Sat-Sun: 09:00 - 15:00</p>
          <p className="text-title leading-tight">Need 24/7? - call +44 752 599 69 49</p>
        </div>
      </div>

      <div className="flex flex-col laptop:flex-row gap-y-2 gap-x-8">
        {/* ToS + Privacy Policy */}
        <div className="flex flex-col justify-center items-center gap-y-2">
          <Link className="text-info" href="/terms-of-service">
            Terms of Service
          </Link>
          <Link className="text-info" href="/privacy-policy">
            Privacy Policy
          </Link>
        </div>

        {/* EMAIL + PHONE */}
        <div className="flex flex-col justify-center items-center laptop:items-start gap-y-2">
          <div className="flex flex-row items-center gap-x-2">
            <Image
              className="w-[24px] h-[24px] laptop:w-[16px] laptop:h-[16px]"
              src="/phone.svg"
              alt="phone"
              width={20}
              height={20}
            />
            <h6>{formatPhoneNumber(businessInfo.phone)}</h6>
          </div>
          <div className="flex flex-row items-center gap-x-2">
            <Image
              className="w-[24px] h-[24px] laptop:w-[16px] laptop:h-[16px]"
              src="/email.svg"
              alt="email"
              width={22}
              height={16}
            />
            <h6>{businessInfo.email}</h6>
          </div>
        </div>
      </div>
    </footer>
  )
}
