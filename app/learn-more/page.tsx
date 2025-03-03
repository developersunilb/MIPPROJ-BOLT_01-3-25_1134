export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Master Your Interview Skills
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Comprehensive guide to ace your next interview
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {/* Interview Preparation */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900">Interview Preparation</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Professional Appearance</h3>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Dress code guidelines for different industries</li>
                  <li>• Grooming tips for a professional look</li>
                  <li>• Body language and posture</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Communication Skills</h3>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Effective speaking techniques</li>
                  <li>• Active listening skills</li>
                  <li>• Handling difficult questions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Interview Etiquette */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900">Interview Etiquette</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Before the Interview</h3>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Research the company thoroughly</li>
                  <li>• Prepare relevant questions</li>
                  <li>• Plan your arrival time</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">During the Interview</h3>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Making a strong first impression</li>
                  <li>• Professional conduct tips</li>
                  <li>• Follow-up questions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Soft Skills */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900">Essential Soft Skills</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Communication</h3>
                <p className="mt-4 text-gray-600">
                  Learn to articulate your thoughts clearly and professionally
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Problem Solving</h3>
                <p className="mt-4 text-gray-600">
                  Demonstrate your analytical and creative thinking abilities
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Adaptability</h3>
                <p className="mt-4 text-gray-600">
                  Show your ability to handle change and unexpected situations
                </p>
              </div>
            </div>
          </section>

          {/* Free Practice Tips */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900">Free Practice Tips</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Self-Practice Techniques</h3>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Record and review your responses</li>
                  <li>• Practice with common interview questions</li>
                  <li>• Time your responses</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Online Resources</h3>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Industry-specific interview guides</li>
                  <li>• Sample answers and templates</li>
                  <li>• Interview preparation checklists</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gray-50 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Excel?</h2>
            <p className="mt-4 text-xl text-gray-600">
              Practice with our expert interviewers and get personalized feedback to improve your skills
            </p>
            <div className="mt-8">
              <a href="/experts" className="inline-block bg-primary text-black px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Book a Session Now
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}