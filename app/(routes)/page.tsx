import { AICarService } from "../widgets/AICarService/AICarService"
import { ContactUsForm } from "./components/ContactUsForm"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header/Header"
import { HowDoWeWork } from "./components/HowDoWeWork"
import { HowWeCanHelpYou } from "./components/HowWeCanHelpYou"
import { NotificationBar } from "./components/NotificationBar"
import { Reviews } from "./components/Reviews"

export default function Page() {
  return (
    <main className="flex flex-col">
      <NotificationBar />
      <Header />
      <div className="flex flex-col gap-y-12 px-2 mobile:px-4 tablet:px-8 laptop:px-16 py-12 mobile:py-16 laptop:py-24">
        <section className="flex flex-col desktop:flex-row justify-between gap-6">
          <HowWeCanHelpYou />
          <ContactUsForm />
        </section>
        <AICarService />
        <Reviews />
        <HowDoWeWork />
      </div>
      <Footer />
    </main>
  )
}
