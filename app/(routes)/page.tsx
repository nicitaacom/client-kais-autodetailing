import { ContactUsForm } from "@/widgets/ContactUsForm/ContactUsForm"
import { AICarService } from "../widgets/AICarService/AICarService"
import { CanvasBackground } from "./components/CanvasBackground"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header/Header"
import { HowDoWeWork } from "./components/HowDoWeWork"
import { HowWeCanHelpYou } from "./components/HowWeCanHelpYou"
import { NotificationBar } from "./components/NotificationBar"
import { Reviews } from "./components/Reviews"
import { WorkExamples } from "./components/WorkExamples"

export default function Page() {
  return (
    <CanvasBackground imgSrc="/red-lambo.jpg" imageOpacity={90}>
      <main className="flex flex-col">
        <NotificationBar />
        <Header />
        <div className="flex flex-col gap-y-12 px-2 mobile:px-4 tablet:px-8 laptop:px-16 py-12 mobile:py-16 laptop:py-24">
          <section className="flex flex-col desktop:flex-row desktop:items-start justify-between gap-6">
            <HowWeCanHelpYou />
            <ContactUsForm />
          </section>
          <AICarService />
          <Reviews />
          <WorkExamples />
          <HowDoWeWork />
        </div>
        <Footer />
      </main>
    </CanvasBackground>
  )
}
