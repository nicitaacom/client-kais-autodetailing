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
      className={twMerge("flex flex-col justify-center items-center gap-x-2", className)}
      href={href}
      target="_blank">
      <Image
        className="w-[24px] h-[24px] laptop:w-[16px] laptop:h-[16px]"
        src={iconSrc}
        alt={altText}
        width={32}
        height={32}
      />
      <p className="text-title">{text}</p>
    </Link>
  )
}

export function Header() {
  return (
    <header className="bg-[#4B4B4B] flex flex-col desktop:flex-row justify-around items-center">
      {/* LOGO */}
      <div className="w-[220px] hidden desktop:flex justify-center items-center gap-x-2">
        <Image className="w-[24px] h-[24px]" src="/favicon.ico" alt="logo" width={32} height={32} />
        <h1 className="text-xl font-bold whitespace-nowrap">{businessInfo.name}</h1>
      </div>

      <div className="w-full flex flex-col laptop:flex-row justify-around gap-y-2">
        {/* GOOGLE REVIEWS */}
        <GoogleReviews />

        <div className="flex flex-col gap-y-2 laptop:gap-y-0 gap-x-8 desktop:flex-row border-b laptop:border-none pb-2 laptop:pb-0">
          {/* EMAIL */}
          <div className="flex justify-center items-center gap-x-2">
            <Image
              className="w-[24px] h-[24px] laptop:w-[16px] laptop:h-[16px]"
              src="/email.svg"
              alt="logo"
              width={32}
              height={32}
            />
            <p className="text-title">{businessInfo.email}</p>
          </div>
          {/* PHONE */}
          <div className="flex justify-center items-center gap-x-2">
            <Image
              className="w-[24px] h-[24px] laptop:w-[16px] laptop:h-[16px]"
              src="/phone.svg"
              alt="logo"
              width={32}
              height={32}
            />
            <p className="text-title">{formatPhoneNumber(businessInfo.phone)}</p>
          </div>
        </div>

        <div className="flex flex-row justify-around items-center gap-x-4 laptop:pt-2">
          <SocialItem
            className="text-xl laptop:text-base"
            iconSrc="/social-icons/instagram.png"
            altText="instagram"
            text="our work"
            href={businessInfo.instagramUrl}
          />
          <SocialItem
            className="hidden tablet:flex text-xl laptop:text-base"
            iconSrc="/social-icons/facebook.png"
            altText="facebook"
            text="our blog"
            href={businessInfo.facebookUrl}
          />
          <SocialItem
            className="hidden tablet:flex text-xl laptop:text-base"
            iconSrc="/social-icons/yell-pages.png"
            altText="yell-pages"
            text="our reviews"
            href={businessInfo.yellPagesUrl}
          />
          <SocialItem
            className="text-xl laptop:text-base"
            iconSrc="/social-icons/whatsapp.png"
            altText="whatsapp"
            text="2 min response"
            href={`https://wa.me/${businessInfo.phone.replace(/[^0-9+]/g, "")}`}
          />
        </div>
      </div>
    </header>
  )
}
