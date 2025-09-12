import Link from "next/link"
import { businessInfo } from "@/consts/businessInfo"

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 tablet:p-6 space-y-6 tablet:space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl mobile:text-4xl tablet:text-5xl font-secondary font-bold text-title">Privacy Policy</h1>
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

      {/* Privacy Sections */}
      <div className="space-y-8 tablet:space-y-10">
        {/* INTRODUCTION */}
        <section className="space-y-1">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Introduction</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            {businessInfo.name} respects your privacy and is committed to protecting your personal data. This policy
            explains what information we collect, how we use it, and your rights.
          </p>
        </section>

        {/* INFORMATION WE COLLECT */}
        <section className="space-y-1">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Information We Collect</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            We may collect your name, phone number, email address, and booking details when you use our "Contact us"
            form or AI assistant or appointment booking system.
          </p>
        </section>

        {/* USE OF INFORMATION */}
        <section className="space-y-1">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">How We Use Your Information</h2>
          <ul className="text-subTitle leading-relaxed text-sm tablet:text-base list-disc pl-6 space-y-2">
            <li>Process bookings and provide mobile valeting services</li>
            <li>Personalise recommendations through our AI assistant</li>
            <li>Communicate about appointments or service updates</li>
            <li>Improve our website and customer experience</li>
          </ul>
        </section>

        {/* SHARING INFO */}
        <section className="space-y-1">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Sharing of Information</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            We do not sell or rent your data. Information may be shared with trusted providers such as our booking
            system and hosting services, solely to deliver our services.
          </p>
        </section>

        {/* SECURITY */}
        <section className="space-y-1">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Data Security</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            We use industry-standard measures to protect your information.
          </p>
        </section>

        {/* YOUR RIGHTS */}
        <section className="space-y-1">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Your Rights</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            You may request access, correction, or deletion of your personal data. Please email us at&nbsp;
            <a
              href={`mailto:${businessInfo.email}`}
              className="text-brand underline hover:opacity-80 transition-opacity">
              {businessInfo.email}
            </a>
            .
          </p>
        </section>

        {/* COOKIES */}
        <section className="space-y-1">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Cookies</h2>
          <p className="text-subTitle leading-relaxed text-sm tablet:text-base">
            Our site use only required cookies. You can disable cookies in your browser settings.
          </p>
        </section>

        {/* CONTACT */}
        <section className="pt-6 border-t border-border-color space-y-3">
          <h2 className="text-xl tablet:text-2xl font-bold text-title">Contact Us</h2>
          <div className="text-subTitle leading-relaxed text-sm tablet:text-base space-y-2">
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <div className="space-y-1">
              <p className="font-medium">{businessInfo.name}</p>
              <p>
                {businessInfo.address.street}, {businessInfo.address.city}, {businessInfo.address.postalCode},{" "}
                {businessInfo.address.country}
              </p>
              <p>
                Email:&nbsp;
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="text-brand underline hover:opacity-80 transition-opacity">
                  {businessInfo.email}
                </a>
              </p>
              <p>
                Phone:&nbsp;
                <a
                  href={`tel:${businessInfo.phone}`}
                  className="text-brand underline hover:opacity-80 transition-opacity">
                  {businessInfo.phone}
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
