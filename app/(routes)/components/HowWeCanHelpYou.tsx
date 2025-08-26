import { consts } from "@/consts/consts"
import Image from "next/image"
import { twMerge } from "tailwind-merge"

interface SocialItemProps {
  className?: string
  imgSrc: string
  altText: string
  text: string
}

function OurService({ className, imgSrc, altText, text }: SocialItemProps) {
  return (
    <li
      className={twMerge(
        "group bg-foreground-accent hover:bg-red-900/20 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]",
        className,
      )}>
      <div className="relative overflow-hidden">
        <Image
          src={imgSrc}
          alt={altText}
          width={720}
          height={480}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="p-3">
        <p className="text-title text-sm font-semibold uppercase tracking-wide">{text}</p>
      </div>
    </li>
  )
}

export function HowWeCanHelpYou() {
  return (
    <div className="w-full desktop:max-w-[50vw] bg-foreground rounded-xl border border-red-900/20 flex flex-col gap-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-red-600 rounded-full" />
        <h2 className="text-2xl font-bold text-title">How we can help you?</h2>
      </div>
      <ul className="grid grid-cols-2 laptop:grid-cols-3 gap-3">
        {consts.ourServices.map(service => (
          <OurService
            key={service.serviceName}
            imgSrc={service.imgUrl}
            altText={service.serviceName}
            text={service.serviceName}
          />
        ))}
      </ul>
    </div>
  )
}
