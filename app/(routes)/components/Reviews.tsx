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
    <li className="min-w-[300px] flex flex-col bg-black/30 backdrop-blur-sm hover:bg-red-900/30 rounded-xl border border-white/10 hover:border-red-500/30 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/10">
      {/* HEADER */}
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Image
              className="w-10 h-10 rounded-full border-2 border-white/20"
              src={usrAvatarUrl}
              alt="user avatar"
              width={40}
              height={40}
            />
            <div>
              <h5 className="text-white font-semibold text-sm drop-shadow-sm">{username}</h5>
              <p className="text-white/70 text-xs">{timeAgo(date)}</p>
            </div>
          </div>
          <div className="bg-red-500/20 backdrop-blur-sm p-1 rounded border border-white/10">
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

      <p className="text-white/90 text-sm leading-relaxed drop-shadow-sm">
        {displayedText}
        {isTruncated && (
          <Link
            className="text-red-400 hover:text-red-300 inline ml-1 font-medium transition-colors"
            href={businessInfo.mapUrl}>
            more
          </Link>
        )}
      </p>
    </li>
  )
}

export function Reviews() {
  return (
    <section className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 hover:border-red-500/30 p-6 shadow-2xl shadow-black/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
        <h1 className="text-2xl font-bold text-white drop-shadow-sm">What our clients write about us</h1>
      </div>

      <ul className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-red-500/30 scrollbar-track-transparent">
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
