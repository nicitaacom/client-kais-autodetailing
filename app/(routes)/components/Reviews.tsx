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
  const maxChars = 100
  const isTruncated = reviewMessage.length > maxChars
  const displayedText = isTruncated ? reviewMessage.substring(0, maxChars) + "..." : reviewMessage

  return (
    <li className="min-w-[300px] flex flex-col bg-foreground-accent hover:bg-red-900/10 rounded-xl border border-red-900/20 p-4 transition-all duration-200 hover:border-red-600/30">
      {/* HEADER */}
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Image
              className="w-10 h-10 rounded-full border-2 border-red-900/20"
              src={usrAvatarUrl}
              alt="user avatar"
              width={40}
              height={40}
            />
            <div>
              <h5 className="text-title font-semibold text-sm">{username}</h5>
              <p className="text-subTitle text-xs">{timeAgo(date)}</p>
            </div>
          </div>
          <div className="bg-red-600/10 p-1 rounded">
            <Image src="/google.svg" alt="google" width={16} height={16} />
          </div>
        </div>

        <div className="flex gap-1">
          {Array(amountOfStarts)
            .fill(0)
            .map((_, index) => (
              <Image key={index} className="w-4 h-4" src="/star.svg" alt="star" width={16} height={16} />
            ))}
        </div>
      </div>

      <p className="text-title text-sm leading-relaxed">
        {displayedText}
        {isTruncated && (
          <Link className="text-red-400 hover:text-red-300 inline ml-1 font-medium" href={businessInfo.mapUrl}>
            more
          </Link>
        )}
      </p>
    </li>
  )
}

export function Reviews() {
  return (
    <section className="bg-foreground rounded-xl border border-red-900/20 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-red-600 rounded-full" />
        <h1 className="text-2xl font-bold text-center">What our clients write about us</h1>
      </div>

      <ul className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-red-600/20 scrollbar-track-transparent">
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
