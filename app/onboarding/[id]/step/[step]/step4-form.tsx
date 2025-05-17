"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { updateUserStepAction } from "./update-step-actions"

export function Step4Form({ submissionId, token }: { submissionId: string; token: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Remove these lines
  // Form state
  // const [coreValue, setCoreValue] = useState("")
  // const [selfDiscovery, setSelfDiscovery] = useState("")
  // const [workStyle, setWorkStyle] = useState("")
  // const [communicationPreference, setCommunicationPreference] = useState("")
  // const [feedbackStyle, setFeedbackStyle] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Update the user's step
      const result = await updateUserStepAction(submissionId, token, 4)

      if (result.success) {
        router.push(`/onboarding/${submissionId}/step/5?token=${token}`)
      } else {
        setError(result.error || "Something went wrong. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-card rounded-lg shadow-xl p-6 sm:p-8 animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Maitreya Labs</h2>
        <p className="text-muted-foreground">Step 04: Values and Self-Discovery</p>
      </div>

      <div className="space-y-8 mb-8">
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
          <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">Our Values</h3>
          <p className="text-sm text-purple-700 dark:text-purple-400">
            Below are our values, specific behaviours, and skills we care about the most. The more these sound like you
            and describe people you want to work with, the more likely you will thrive at Maitreya Labs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-md font-bold text-blue-800 dark:text-blue-300 mb-2">KINDNESS</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              We value caring for others. Helping others is a priority, even when it is not immediately related to the
              goals that you are trying to achieve. Similarly, you can rely on others for help and advice. In fact,
              you're expected to do so.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <h3 className="text-md font-bold text-green-800 dark:text-green-300 mb-2">AGGRESSIVE LEARNING</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              Our only strength and advantage over others at the moment is knowledge & skill, not money, not brand, not
              power, nothing else at all.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
            <h3 className="text-md font-bold text-amber-800 dark:text-amber-300 mb-2">TRANSPARENCY</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Be open about as many things as possible. Directness is about being transparent with each other. Be
              straightforward and kind, an uncommon cocktail of no-bullshit and no-asshole. Remember: Feedback is always
              about your work and not you as a person.
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
            <h3 className="text-md font-bold text-red-800 dark:text-red-300 mb-2">NO HIERARCHY</h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              We are trying to create an atmosphere where anybody's opinion can be challenged. Any past decisions and
              guidelines are open to questioning as long as you act in accordance with them until they are changed.
              However, while a policy or decision is still in place we all agree to commit to it.
            </p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <h3 className="text-md font-bold text-indigo-800 dark:text-indigo-300 mb-2">TEAM-WORK</h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-400">
              We are like a sports team. Like in Football - everyone runs hard to tackle opponents and in that course
              they fall, but eventually pass the ball to the striker and score the goal. In Cricket, the entire team is
              fielding and supporting with full energy while the bowler is in action. Well, our team is no less than
              these sports teams, we flourish as one.
            </p>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border border-pink-100 dark:border-pink-800">
            <h3 className="text-md font-bold text-pink-800 dark:text-pink-300 mb-2">DIVERSITY</h3>
            <p className="text-sm text-pink-700 dark:text-pink-400">
              The team consists of people from different backgrounds and opinions. So, we work together to make everyone
              feel welcome and increase the participation of the team members.
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
            <h3 className="text-md font-bold text-emerald-800 dark:text-emerald-300 mb-2">INTEGRITY</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              We operate with integrity and a sense of justice on both: The clients part and towards each other. With
              our clients, we try to do our best and produce world class results. OUR CLIENTS COME TO US BECAUSE THEY
              TRUST US, AND WE REPAY THAT TRUST WITH EXEMPLARY PERFORMANCE. WE'RE NOT VENDORS, WE'RE EXPERTS! This is
              one of the most important values we have. Integrity breaches, whether towards clients or towards each
              other are not allowed. We have a zero tolerance policy towards the same.
            </p>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-100 dark:border-cyan-800">
            <h3 className="text-md font-bold text-cyan-800 dark:text-cyan-300 mb-2">SAY THANK YOU</h3>
            <p className="text-sm text-cyan-700 dark:text-cyan-400">
              Recognise the people that helped you publicly. Demonstrating we care for people provides an effective
              framework for direct challenges and feedbacks. Give as much positive feedback as you can, and do it in a
              public way. Give negative feedback in the smallest setting possible. Disclaimer: Feedback should be early,
              straight, objective, and candid.
            </p>
          </div>

          <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-800">
            <h3 className="text-md font-bold text-violet-800 dark:text-violet-300 mb-2">SAY PLEASE</h3>
            <p className="text-sm text-violet-700 dark:text-violet-400">
              One can't say please enough. Always remind yourself of the way you would think about them in their
              presence. Remember: Always be friendly & professional, never casual & formal.
            </p>
          </div>

          <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-4 rounded-lg border border-fuchsia-100 dark:border-fuchsia-800">
            <h3 className="text-md font-bold text-fuchsia-800 dark:text-fuchsia-300 mb-2">SAY SORRY</h3>
            <p className="text-sm text-fuchsia-700 dark:text-fuchsia-400">
              If you made a mistake, apologise. Saying sorry is not a sign of weakness but one of the strengths. The
              people that do the most will likely make more mistakes.
            </p>
          </div>

          <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg border border-rose-100 dark:border-rose-800">
            <h3 className="text-md font-bold text-rose-800 dark:text-rose-300 mb-2">GET TO KNOW EACH OTHER</h3>
            <p className="text-sm text-rose-700 dark:text-rose-400">
              We use a lot of text based communication and if you know the person behind the text it will be easier to
              prevent conflicts. So, encourage people to get to know each other on a personal level, this can be done
              during tea breaks and lunch!
            </p>
          </div>

          <div className="bg-lime-50 dark:bg-lime-900/20 p-4 rounded-lg border border-lime-100 dark:border-lime-800">
            <h3 className="text-md font-bold text-lime-800 dark:text-lime-300 mb-2">NO EGO</h3>
            <p className="text-sm text-lime-700 dark:text-lime-400">
              Don't defend a point to win an argument or double-down on a mistake. You are not your work, you don't have
              to defend your point. We always need to search for the right answer together. Remember: It's not you
              against your colleague, it's you and your colleague against the problem.
            </p>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-100 dark:border-teal-800">
            <h3 className="text-md font-bold text-teal-800 dark:text-teal-300 mb-2">
              DO NOT PULL RANK OR USE AUTHORITY TO GET THINGS DONE
            </h3>
            <p className="text-sm text-teal-700 dark:text-teal-400">
              Do not use "authority" or the name of another team member to get a colleague to help you or a client to
              listen to you. Establish the context and ask for whatever is needed because the work demands it
              irrespective of hierarchy.
            </p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
            <h3 className="text-md font-bold text-orange-800 dark:text-orange-300 mb-2">ACRONYMS SERIOUSLY SUCK</h3>
            <p className="text-sm text-orange-700 dark:text-orange-400">
              Before creating or adopting an acronym, please take a moment to consider if it helps or impedes
              communication. Most acronyms are pointless, and only serve to create a class of people who bandy them
              about to prove they are "in the know." Thus, alienating others who don't know, and who feel too
              embarrassed to ask.
            </p>
          </div>

          <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-lg border border-sky-100 dark:border-sky-800">
            <h3 className="text-md font-bold text-sky-800 dark:text-sky-300 mb-2">MEASURE RESULTS NOT HOURS</h3>
            <p className="text-sm text-sky-700 dark:text-sky-400">
              We care about what you achieve; the code you shipped, the user you made happy, and the team member you
              helped. Do not compete by proclaiming how many hours you worked yesterday because we don't want someone
              who took the afternoon off to feel like they did something wrong. Instead, celebrate yours and your
              teammates achievements. You don't have to explain how you spent your day, we trust team members to do the
              right thing instead of having rigid rules.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="text-md font-bold text-blue-800 dark:text-blue-300 mb-2">BE HAPPY WHEN OTHERS SUCCEED</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              We are here to help each other achieve their true potential, which is, incidentally, much more than any of
              us think is possible.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
            <h3 className="text-md font-bold text-green-800 dark:text-green-300 mb-2">OWNERSHIP</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              We expect team members to complete tasks that they are assigned. Having a task means you are responsible
              for anticipating and solving problems. As an owner you are responsible for overcoming challenges, not
              suppliers, or other team members. Take initiatives and proactively inform stakeholders when there is
              something you might not be able to solve. Done means we can responsibly communicate done to all
              stakeholders with no stories. Either it's done and there are notes OR it's not done and there are stories.
              Essentially, there is no time for excuses. And finally, you shouldn't need someone to give you a list of
              things to do every morning, if that's happening, nobody is doing their jobs, and things need to be fixed.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
            <h3 className="text-md font-bold text-amber-800 dark:text-amber-300 mb-2">SENSE OF URGENCY</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              At an exponentially scaling startup time gained or lost has compounding effects. Try to get the results as
              fast as possible so the compounding of results can begin and we can focus on the subsequent improvements.
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
            <h3 className="text-md font-bold text-red-800 dark:text-red-300 mb-2">EXISTENTIAL ISSUES</h3>
            <p className="text-sm text-red-700 dark:text-red-400">
              Everyone hired is relatively smart and will easily get a job elsewhere. Nobody's parents are endorsing the
              decision to work here. For example, elders in Kaivalya's family wanted him to continue working at Isha
              Life. But, he believes that in order to retire early, and pursue full-time focus on one particular thing,
              one needs to build a multi-crore level business with efficient processes, systems and SOPs. And experience
              the child-like joy and thrill that comes from building the same. This business is what WE are building!
              Twelve months from now, the collective impact of our contributions will make our elders proud. However,
              some of us will transform as alumni and go on to do other things. RESPECT & UTILISE the current moments
              with peers to build memories in order to learn, teach, and influence forever.
            </p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
            <h3 className="text-md font-bold text-indigo-800 dark:text-indigo-300 mb-2">BE EARLY</h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-400">
              Don't be just on time. Remember: Early bird catches the grain. [It's a vegetarian bird]
            </p>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg border border-pink-100 dark:border-pink-800">
            <h3 className="text-md font-bold text-pink-800 dark:text-pink-300 mb-2">BORING SOLUTIONS</h3>
            <p className="text-sm text-pink-700 dark:text-pink-400">
              Use the most simple and boring solution for a problem. You can always make it more complex later if that
              is required.
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
            <h3 className="text-md font-bold text-emerald-800 dark:text-emerald-300 mb-2">RTFM</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Before asking a colleague a question, do a simple Google search and see if it's something you can do on
              your own. This not only saves time, but also respects your peers' time.
            </p>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-100 dark:border-cyan-800">
            <h3 className="text-md font-bold text-cyan-800 dark:text-cyan-300 mb-2">THERE ARE NO STUPID QUESTIONS</h3>
            <p className="text-sm text-cyan-700 dark:text-cyan-400">
              While doing your peers the courtesy of a Google search before asking them questions, please also focus on
              creating an atmosphere where no question is too stupid. which is in fact, the truth. Having people feel
              that their question is stupid will only stop them from learning, in order to not be thought of as stupid.
              It's the exact opposite of what we need.
            </p>
          </div>

          <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-800">
            <h3 className="text-md font-bold text-violet-800 dark:text-violet-300 mb-2">
              RECIPROCATE FLEXIBILITY WITH PREDICTABILITY
            </h3>
            <p className="text-sm text-violet-700 dark:text-violet-400">
              There is a lot of flexibility here, reciprocate it with predictability. Else this won't work and is unfair
              to the others.
            </p>
          </div>

          <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 p-4 rounded-lg border border-fuchsia-100 dark:border-fuchsia-800">
            <h3 className="text-md font-bold text-fuchsia-800 dark:text-fuchsia-300 mb-2">
              ZERO TOLERANCE ON HARASSMENT AND DISCRIMINATION
            </h3>
            <p className="text-sm text-fuchsia-700 dark:text-fuchsia-400">
              We have a zero tolerance policy towards harassment, exclusion, discrimination, or retaliation by/of any
              community members, including our employees.
            </p>
          </div>

          <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg border border-rose-100 dark:border-rose-800">
            <h3 className="text-md font-bold text-rose-800 dark:text-rose-300 mb-2">
              DON'T BRING RELIGION OR POLITICS TO WORK
            </h3>
            <p className="text-sm text-rose-700 dark:text-rose-400">
              We don't discuss religion or politics because it is easy to alienate people that have a minority opinion.
            </p>
          </div>

          <div className="bg-lime-50 dark:bg-lime-900/20 p-4 rounded-lg border border-lime-100 dark:border-lime-800">
            <h3 className="text-md font-bold text-lime-800 dark:text-lime-300 mb-2">QUIRKINESS</h3>
            <p className="text-sm text-lime-700 dark:text-lime-400">
              Unexpected and unconventional things make life more interesting. Celebrate and encourage quirky gifts,
              habits, behaviors, and point of views.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4">Please Note:</h3>
          <ol className="list-decimal pl-5 space-y-4">
            <li className="text-sm">
              If you want to discontinue your position at Maitreya Labs, you will have to notify us 15 days in advance.
            </li>
            <li className="text-sm">Integrity breaches will lead to the termination of our relationship.</li>
          </ol>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="mb-4">Proceed to the next step:</p>
        <form onSubmit={handleSubmit}>
          <Button type="submit" disabled={isSubmitting} className="px-8">
            {isSubmitting ? (
              <>
                <span className="mr-2">Submitting...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></div>
              </>
            ) : (
              "Proceed"
            )}
          </Button>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
        </form>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-8">Copyright 2025, Maitreya Labs</div>
    </div>
  )
}
