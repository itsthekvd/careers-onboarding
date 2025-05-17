export function Stats() {
  const stats = [
    { value: "500+", label: "Applicants" },
    { value: "20+", label: "Skills Taught" },
    { value: "6-7", label: "Hours/Day" },
    { value: "100%", label: "Commitment" },
  ]

  return (
    <section className="bg-white py-8">
      <div className="mobile-container">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white shadow-lg border border-gray-100 p-6 md:p-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-black">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
