import Link from "next/link"
import { businessInfo } from "@/consts/businessInfo"

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto p-4 tablet:p-6 space-y-6 tablet:space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl mobile:text-4xl tablet:text-5xl font-secondary font-bold text-title">
          Terms of Service
        </h1>
        <Link className="flex w-fit text-subTitle py-2 flex-row gap-x-2 justify-center items-center group" href="/">
          <svg
            className="group-hover:-translate-x-0.5 duration-300"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="24px"
            width="24px"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M401.4 224h-214l83-79.4c11.9-12.5 11.9-32.7 0-45.2s-31.2-12.5-43.2 0L89 233.4c-6 5.8-9 13.7-9 22.4v.4c0 8.7 3 16.6 9 22.4l138.1 134c12 12.5 31.3 12.5 43.2 0 11.9-12.5 11.9-32.7 0-45.2l-83-79.4h214c16.9 0 30.6-14.3 30.6-32 .1-18-13.6-32-30.5-32z"></path>
          </svg>
          Back to home
        </Link>
        <p className="text-sm text-subTitle">Last update: 12.09.2025</p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-8 tablet:space-y-10">
        {/* INTRODUCTION */}
        <section className="space-y-3">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Introduction</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            These Terms of Service explain how {businessInfo.name} provides services, user responsibilities, payment
            terms, intellectual property rights, liability limitations, termination, and updates.
          </p>
        </section>

        {/* SERVICE DESCRIPTION */}
        <section className="space-y-3">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Service Description</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            {businessInfo.name} specialises in mobile valeting and detailing. We come to your location and deliver
            professional cleaning services including {businessInfo.primaryServices.map(s => s.name).join(", ")}.
          </p>
        </section>

        {/* USER RESPONSIBILITIES */}
        <section className="space-y-3">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">User Responsibilities</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            You agree to provide accurate booking details and ensure your vehicle is accessible at the agreed time.
            Payments must be made as agreed. Any cancellations or rescheduling should be communicated promptly.
          </p>
        </section>

        {/* PAYMENT TERMS */}
        <section className="space-y-3">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Payment Terms</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            Payments are accepted via cash, card, or other methods agreed with {businessInfo.name}. A deposit may be
            required for certain bookings. Full payment is due upon completion of the service.
          </p>
        </section>

        {/* INTELLECTUAL PROPERTY RIGHTS */}
        <section className="space-y-3">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Intellectual Property Rights</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            All content, branding, and materials on {businessInfo.websiteUrl} remain the property of&nbsp;
            {businessInfo.name}. You may not copy or use them for commercial purposes without permission.
          </p>
        </section>

        {/* LIABILITY LIMITATIONS */}
        <section className="space-y-3">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Liability Limitations</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            {businessInfo.name} is not liable for indirect, incidental, or consequential damages. While we take utmost
            care, we cannot guarantee complete elimination of defects or damage. Services are performed to the best
            industry standards.
          </p>
        </section>

        {/* TERMINATION OF SERVICE */}
        <section className="space-y-3">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Termination of Service</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            Services may be cancelled or rescheduled at any time by either party. Failure to make payment may result in
            suspension of services. Additional work requested will be quoted separately.
          </p>
        </section>

        {/* CHANGES TO TERMS */}
        <section className="space-y-3">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Changes to these Terms</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            {businessInfo.name} reserves the right to update these Terms of Service at any time. Continued use of our
            services implies acceptance of the revised terms.
          </p>
        </section>

        {/* CONTACT */}
        <section className="pt-6 border-t border-border-color">
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            For questions about these Terms of Service, please contact us at{" "}
            <a
              href={`mailto:${businessInfo.email}`}
              className="text-brand underline hover:opacity-80 transition-opacity">
              {businessInfo.email}
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
