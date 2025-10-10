import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Navigation */}
        <nav className="relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    Engaze
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative pt-6 pb-16 sm:pb-24">
          <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Create professional resumes</span>
                <span className="block text-blue-600">in minutes, not hours</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Engaze Resume Builder helps you craft impressive resumes that stand out from the crowd. 
                Choose from professionally designed templates and customize to your needs.
              </p>
              <div className="mt-8 sm:mt-10 flex justify-center space-x-4">
                <Link
                  to="/register"
                  className="rounded-md shadow px-8 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Get Started — It's Free
                </Link>
                <Link
                  to="/login"
                  className="rounded-md px-8 py-3 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="relative rounded-xl shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 rounded-xl"></div>
              <img 
                className="relative rounded-xl shadow-2xl transform hover:scale-[1.01] transition-transform duration-300" 
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Resume Dashboard Preview" 
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Engaze Resume Builder
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to create a standout resume that gets you noticed.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="relative p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="absolute top-6 right-6">
                  <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Templates</h3>
                <p className="text-gray-600">
                  Choose from a variety of expertly designed resume templates tailored for different industries and career stages.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="absolute top-6 right-6">
                  <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Easy Customization</h3>
                <p className="text-gray-600">
                  Personalize every aspect of your resume with our intuitive editor. Change colors, fonts, and layouts with ease.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                <div className="absolute top-6 right-6">
                  <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">One-Click Sharing</h3>
                <p className="text-gray-600">
                  Generate a shareable link for your resume that you can send to employers or download as a PDF with a single click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Loved by Job Seekers
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              See what our users are saying about Engaze Resume Builder.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Jane Doe</h3>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I landed my dream job at a tech startup after using Engaze to redesign my resume. The templates are modern and professional."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                  JS
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">John Smith</h3>
                  <p className="text-sm text-gray-500">Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The ability to customize every aspect of my resume helped me highlight my marketing achievements in a visually appealing way."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                  AR
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Alex Rodriguez</h3>
                  <p className="text-sm text-gray-500">Recent Graduate</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a recent graduate with limited experience, Engaze helped me create a resume that highlighted my skills and potential. Got interviews within a week!"
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to create your professional resume?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of job seekers who have successfully landed interviews with resumes built on our platform.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="px-8 py-3 border border-transparent text-lg font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white shadow-md transition-colors"
            >
              Create Your Resume Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-xl font-bold text-white">Engaze</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Making resume creation simple and effective for job seekers worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Resume Tips</a></li>
                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Cover Letter Guide</a></li>
                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Career Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Connect</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-base text-gray-400 hover:text-white transition-colors">Feedback</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Engaze Resume Builder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;