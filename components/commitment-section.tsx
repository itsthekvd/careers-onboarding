export function CommitmentSection() {
  const commitments = [
    {
      title: "Time Investment",
      description: "6-7 hours daily commitment to ensure deep learning and meaningful contribution",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Consistent Engagement",
      description: "Regular, sustained participation rather than sporadic involvement",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Intellectual Rigor",
      description: "Willingness to engage in deep thinking and challenging problem-solving",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: "Growth Mindset",
      description: "Embracing continuous learning and skill development as core values",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="mobile-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">The Commitment</h2>
          <h3 className="text-xl font-medium mt-2">What It Takes to Succeed With Us</h3>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Working at Maitreya Labs is both challenging and rewarding. We set high standards because we're committed to
            excellence and continuous growth.
          </p>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Our intensive learning environment requires significant dedication—typically 6-7 hours daily—because there's
            so much to learn and master in our rapidly evolving field.
          </p>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            We don't accommodate 2-3 hour availability because meaningful progress and contribution require deeper
            engagement. This commitment enables our team members to develop extraordinary skills and deliver exceptional
            results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {commitments.map((commitment, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black">
                  {commitment.icon}
                </div>
                <h3 className="font-semibold">{commitment.title}</h3>
              </div>
              <p className="text-gray-600">{commitment.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
