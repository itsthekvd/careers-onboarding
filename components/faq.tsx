"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does the onboarding process work?",
    answer:
      "Our onboarding process consists of 5 simple steps. First, you submit your LinkedIn or portfolio URL. Then, you'll receive a personalized link to complete your profile, assess your skills, explore career paths, and receive a tailored action plan.",
  },
  {
    question: "How long does the entire process take?",
    answer:
      "The initial onboarding can be completed in about 30 minutes. After that, our team will review your information and provide personalized guidance within 48 hours.",
  },
  {
    question: "Is this service only for students?",
    answer:
      "While we specialize in helping students and recent graduates, our career acceleration services can benefit professionals at any stage of their career journey who are looking to grow or pivot.",
  },
  {
    question: "What makes your approach different?",
    answer:
      "We combine data-driven insights with personalized human guidance. Our approach isn't just about finding you a job—it's about building a sustainable career path aligned with your unique strengths and goals.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes! After completing the onboarding process, you'll have access to continued support through our mentorship program, regular check-ins, and career development resources.",
  },
]

export function FAQ() {
  return (
    <section className="mobile-section bg-background" id="faq">
      <div className="mobile-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about our career acceleration program
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
