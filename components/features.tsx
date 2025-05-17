import Link from "next/link"
import { Zap, Target, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: <Zap className="h-10 w-10" />,
    title: "Personalized Guidance",
    description: "Get tailored career advice based on your unique skills, interests, and goals.",
    link: "#personalized",
  },
  {
    icon: <Target className="h-10 w-10" />,
    title: "Industry Insights",
    description: "Access up-to-date information about job markets, salary trends, and in-demand skills.",
    link: "#insights",
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Networking Opportunities",
    description: "Connect with professionals and peers in your field to expand your career network.",
    link: "#networking",
  },
  {
    icon: <TrendingUp className="h-10 w-10" />,
    title: "Growth Tracking",
    description: "Monitor your progress and celebrate milestones on your career journey.",
    link: "#growth",
  },
]

export function Features() {
  return (
    <section className="mobile-section bg-secondary/50" id="features">
      <div className="mobile-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How We Help You Succeed</h2>
          <p className="mt-4 text-lg text-muted-foreground">Our comprehensive approach to career development</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="interactive-card rounded-lg border bg-card p-6 text-card-foreground">
              <div className="mb-4 text-primary">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href={feature.link}>Learn more</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="#contact">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
