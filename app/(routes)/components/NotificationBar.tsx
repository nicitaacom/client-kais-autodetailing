import Image from "next/image"
import { twMerge } from "tailwind-merge"
import { consts } from "@/consts/consts"

interface ItemProps {
  className?: string
  iconSrc: string
  altText: string
  text: string
}

function Item({ className, iconSrc, altText, text }: ItemProps) {
  return (
    <div className={twMerge("flex justify-center items-center gap-x-2", className)}>
      <Image className="w-4 h-4 filter brightness-0 invert" src={iconSrc} alt={altText} width={16} height={16} />
      <p className="text-white text-sm font-medium">{text}</p>
    </div>
  )
}

export function NotificationBar() {
  return (
    <section className="h-10 bg-gradient-to-r from-red-600 to-red-700 flex justify-around items-center shadow-lg">
      <Item iconSrc="/notification-bar/time.svg" altText="exp" text={`${consts.yoe} years experience`} />
      <Item
        className="hidden tablet:flex"
        iconSrc="/notification-bar/guarantee.svg"
        altText="grnt"
        text={`${consts.yog} years guarantee`}
      />
      <Item
        className="hidden laptop:flex"
        iconSrc="/notification-bar/price-down.svg"
        altText="prc"
        text="Best market price"
      />
      <Item
        className="hidden laptop:flex"
        iconSrc="/notification-bar/free.svg"
        altText="free"
        text={consts.notificationBarOffer}
      />
    </section>
  )
}
