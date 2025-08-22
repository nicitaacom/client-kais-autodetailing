import Link from "next/link"
import { businessInfo } from "./consts/businessInfo"

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col gap-4 justify-center items-center text-center">
      <h1 className="text-4xl mobile:text-5xl tablet:text-6xl min-[1900px]:text-7xl font-bold">{businessInfo.name}</h1>

      <p className="mobile:text-xl tablet:text-2xl font-bold">This page not found</p>

      <Link
        href="/"
        className="flex items-center gap-2 px-4 py-2 border text-title group hover:bg-foreground hover:text-background transition-colors">
        <svg
          className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform"
          fill="currentColor"
          viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        Back to home
      </Link>
    </div>
  )
}
