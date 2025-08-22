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
    <li className={twMerge("flex flex-col justify-center items-center gap-x-2 overflow-hidden", className)}>
      <Image src={imgSrc} alt={altText} width={720} height={480} />
      <p className="text-title text-xl desktop:text-lg p-1 desktop:p-0">{text}</p>
    </li>
  )
}

export function HowWeCanHelpYou() {
  return (
    <div className="w-full desktop:max-w-[50vw] bg-foreground rounded-lg flex flex-col justify-center items-start gap-y-4 p-4">
      <h2 className="text-2xl font-bold">How we can help you?</h2>
      <ul className="flex flex-col tablet:grid grid-cols-2 laptop:grid-cols-3 gap-4">
        {consts.ourServices.map(service => (
          <OurService
            className="rounded-lg bg-foreground-accent uppercase"
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
