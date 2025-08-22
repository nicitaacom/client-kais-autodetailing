import { consts } from "@/consts/consts"
import Image from "next/image"
import Link from "next/link"
import { timeAgo } from "../utils/timeAgo"
import { businessInfo } from "@/consts/businessInfo"

interface SocialItemProps {
  className?: string
  usrAvatarUrl: string
  username: string
  date: string
  reviewMessage: string
  amountOfStarts: number
}

function GoogleReview({ className, usrAvatarUrl, username, date, amountOfStarts, reviewMessage }: SocialItemProps) {
  const maxChars = 100 // Adjust this based on your 3-line estimate
  const isTruncated = reviewMessage.length > maxChars
  const displayedText = isTruncated ? reviewMessage.substring(0, maxChars) + "..." : reviewMessage

  return (
    <li className="w-full min-w-[325px] flex flex-col items-center gap-x-2 bg-[#303030] rounded-lg px-4 py-2">
      {/* HEADER */}
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-row justify-between items-center">
          <div className="flex flex-row justify-center items-center gap-x-2">
            <Image className="w-8 h-8" src={usrAvatarUrl} alt="usr-img" width={32} height={32} />
            <div className="flex flex-col">
              <h5>{username}</h5>
              <p>{timeAgo(date)}</p>
            </div>
          </div>
          <Image src="/google.svg" alt="usr-img" width={16} height={16} />
        </div>
        <div className="w-full flex flex-row">
          {Array(amountOfStarts)
            .fill(0)
            .map((star, index) => (
              <Image
                key={`${star}-${index}-${username}-${amountOfStarts}-${usrAvatarUrl}`}
                className="w-[22px] h-[22px] laptop:w-[20px] laptop:h-[20px]"
                src="/star.svg"
                alt="star"
                width={22}
                height={22}
              />
            ))}
        </div>
      </div>

      <p className="w-full text-title text-start text-sm p-1 desktop:p-0 desktop:pl-0.5">
        {displayedText}
        {isTruncated && (
          <Link className="text-info inline ml-1" href={businessInfo.mapUrl}>
            more
          </Link>
        )}
      </p>
    </li>
  )
}

export function Reviews() {
  return (
    <section className="bg-foreground rounded-lg flex flex-col gap-y-4 px-2 mobile:px-4 tablet:px-8 py-8">
      <h1 className="text-2xl font-bold text-center">What out clients write about us</h1>

      <ul className="max-h-[400px] overflow-x-auto flex flex-col laptop:flex-row gap-4">
        {consts.reviews.map((review, index) => (
          <GoogleReview
            key={index}
            usrAvatarUrl={review.usrAvatarUrl}
            username={review.username}
            date={review.date}
            reviewMessage={review.reviewMessage}
            amountOfStarts={review.amountOfStars}
          />
        ))}
      </ul>
    </section>
  )
}
