import Image from "next/image"
import { twMerge } from "tailwind-merge"
import { GoogleReviews } from "./GoogleReviews"
import { consts } from "@/consts/consts"
import { businessInfo } from "@/consts/businessInfo"
import { formatPhoneNumber } from "@/(routes)/utils/formatPhoneNumber"
import Link from "next/link"

interface SocialItemProps {
  className?: string
  iconSrc: string
  altText: string
  text: string
  href: string
}

function SocialItem({ className, iconSrc, altText, text, href }: SocialItemProps) {
  return (
    <Link
      className={twMerge("flex flex-col items-center gap-1 hover:text-red-400 transition-colors group", className)}
      href={href}
      target="_blank">
      <Image
        className="w-4 h-4 group-hover:scale-110 transition-transform"
        src={iconSrc}
        alt={altText}
        width={16}
        height={16}
      />
      <p className="text-xs text-subTitle group-hover:text-red-400">{text}</p>
    </Link>
  )
}

export function Header() {
  return (
    <header className="bg-black border-b border-red-900/30 flex flex-col desktop:flex-row justify-around items-center py-3 px-4 mobile:px-6 tablet:px-8 laptop:px-12 desktop:px-16">
      {/* LOGO */}
      <div className="w-[220px] hidden desktop:flex justify-center items-center gap-x-3">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">K</span>
        </div>
        <h1 className="text-lg font-bold text-title">{businessInfo.name}</h1>
      </div>

      <div className="w-full flex flex-col laptop:flex-row justify-around gap-y-3">
        {/* GOOGLE REVIEWS */}
        <GoogleReviews />

        <div className="flex flex-col gap-y-2 laptop:gap-y-0 gap-x-6 desktop:flex-row border-b border-red-900/30 laptop:border-none pb-2 laptop:pb-0">
          {/* EMAIL */}
          <div className="flex justify-center items-center gap-x-2">
            <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
              <Image
                className="w-3 h-3 filter brightness-0 invert"
                src="/email.svg"
                alt="email"
                width={12}
                height={12}
              />
            </div>
            <p className="text-sm text-title">{businessInfo.email}</p>
          </div>
          {/* PHONE */}
          <div className="flex justify-center items-center gap-x-2">
            <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
              <Image
                className="w-3 h-3 filter brightness-0 invert"
                src="/phone.svg"
                alt="phone"
                width={12}
                height={12}
              />
            </div>
            <p className="text-sm text-title font-medium">{formatPhoneNumber(businessInfo.phone)}</p>
          </div>
        </div>

        <div className="flex flex-row justify-around items-center gap-x-6">
          <SocialItem
            iconSrc="/social-icons/instagram.png"
            altText="instagram"
            text="our work"
            href={businessInfo.instagramUrl}
          />
          <SocialItem
            className="hidden tablet:flex"
            iconSrc="/social-icons/facebook.png"
            altText="facebook"
            text="our blog"
            href={businessInfo.facebookUrl}
          />
          <SocialItem
            className="hidden tablet:flex"
            iconSrc="/social-icons/yell-pages.png"
            altText="yell-pages"
            text="our reviews"
            href={businessInfo.yellPagesUrl}
          />
          <SocialItem
            iconSrc="/social-icons/whatsapp.png"
            altText="whatsapp"
            text="2min response"
            href={`https://wa.me/${businessInfo.phone.replace(/[^0-9+]/g, "")}`}
          />
        </div>
      </div>
    </header>
  )
}
