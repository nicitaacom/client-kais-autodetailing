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
        "group bg-black/30 backdrop-blur-sm hover:bg-red-900/30 border border-white/10 hover:border-red-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/10",
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <div className="p-3">
        <p className="text-white text-sm font-semibold uppercase tracking-wide drop-shadow-sm">{text}</p>
      </div>
    </li>
  )
}

export function HowWeCanHelpYou() {
  return (
    <div className="w-full desktop:max-w-[50vw] bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 hover:border-red-500/30 flex flex-col gap-y-6 p-6 shadow-2xl shadow-black/50 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">How we can help you?</h2>
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
