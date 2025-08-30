import Image from "next/image"
import { businessInfo } from "@/consts/businessInfo"

export function GoogleReviews() {
  return (
    <div className="flex justify-center items-center border-b laptop:border-none">
      <Image
        className="w-[24px] h-[24px] laptop:w-[32px] laptop:h-[32px]"
        src="/google.svg"
        alt="Google Logo"
        width={32}
        height={32}
      />
      <div className="ml-2 flex flex-col items-center">
        <p className="text-title text-sm font-medium">Google Reviews</p>
        <div className="w-full flex flex-row items-center">
          <p className="text-title mr-1 text-lg font-bold">{businessInfo.rating.googleMaps}</p>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Image
                key={index}
                className="w-[22px] h-[22px] laptop:w-[16px] laptop:h-[16px]"
                src="/star.svg"
                alt=""
                width={22}
                height={22}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
