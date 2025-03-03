export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            About MockMaster
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Empowering job seekers with professional interview preparation
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-4 text-lg text-gray-600">
                We believe that everyone deserves the opportunity to present their best self in job interviews. Our platform connects job seekers with industry experts for personalized mock interviews and feedback.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Why Choose Us</h2>
              <ul className="mt-4 space-y-4 text-lg text-gray-600">
                <li>• Expert interviewers from top companies</li>
                <li>• Personalized feedback and coaching</li>
                <li>• Flexible scheduling options</li>
                <li>• Video recordings for self-review</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Our Process</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="text-lg font-medium text-gray-900">Book</h3>
                <p className="mt-2 text-gray-600">
                  Schedule a mock interview with an expert in your field
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="text-lg font-medium text-gray-900">Practice</h3>
                <p className="mt-2 text-gray-600">
                  Participate in a realistic interview simulation
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="text-lg font-medium text-gray-900">Improve</h3>
                <p className="mt-2 text-gray-600">
                  Receive detailed feedback and actionable insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}