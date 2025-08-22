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
      <Image
        className="w-[24px] h-[24px] laptop:w-[16px] laptop:h-[16px]"
        src={iconSrc}
        alt={altText}
        width={32}
        height={32}
      />
      <p className="text-title">{text}</p>
    </div>
  )
}

export function NotificationBar() {
  return (
    <section className="h-[48px] laptop:h-[32px] bg-[#0007B4] flex justify-around items-center">
      <Item
        className="text-xl laptop:text-base"
        iconSrc="/notification-bar/time.svg"
        altText="exp"
        text={`${consts.yoe} years of experience`}
      />
      <Item
        className="hidden tablet:flex text-xl laptop:text-base"
        iconSrc="/notification-bar/guarantee.svg"
        altText="grnt"
        text={`${consts.yog} years guarantee`}
      />
      <Item
        className="hidden laptop:flex text-xl laptop:text-base"
        iconSrc="/notification-bar/price-down.svg"
        altText="prc"
        text="Best price on market"
      />
      <Item
        className="hidden laptop:flex text-xl laptop:text-base"
        iconSrc="/notification-bar/free.svg"
        altText="free"
        text={consts.notificationBarOffer}
      />
    </section>
  )
}
