import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { WhyJoinSection } from "@/components/why-join-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { MethodologySection } from "@/components/methodology-section"
import { SkillsSection } from "@/components/skills-section"
import { CommitmentSection } from "@/components/commitment-section"
import { ApplicationForm } from "@/components/application-form"

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Stats />
      <WhyJoinSection />
      <TestimonialSection />
      <MethodologySection />
      <SkillsSection />
      <CommitmentSection />
      <ApplicationForm />
    </div>
  )
}
