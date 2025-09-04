import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4">
                Think<span className="text-blue-600">r</span>
              </h1>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Generate Beautiful
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Quote Posters
              </span>
              <br />
              in Minutes
            </h2>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Pick or upload a background, switch between Urdu and English text, 
              style it your way, and download your creation instantly.
            </p>

            {/* CTA Button */}
            <div className="mb-16">
              <Link href="/generate">
                <Button 
                  size="lg" 
                  className="text-lg px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Creating →
                </Button>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                No signup required • Free to use
              </p>
            </div>

            {/* Preview Image/Demo */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Sample Quote Cards */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                    <div className="h-32 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                      <p className="text-white font-bold text-center px-4">
                        "Success is not final, failure is not fatal"
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">English Quote</div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transform rotate-[1deg] hover:rotate-0 transition-transform duration-300">
                    <div className="h-32 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg mb-4 flex items-center justify-center">
                      <p className="text-white font-bold text-center px-4" style={{fontFamily: 'serif'}}>
                        کامیابی ایک سفر ہے منزل نہیں
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Urdu Quote</div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transform rotate-[2deg] hover:rotate-0 transition-transform duration-300">
                    <div className="h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
                      <p className="text-white font-bold text-center px-4">
                        "Be yourself; everyone else is taken"
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Motivational</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-10 w-12 h-12 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Create
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features that make quote poster creation simple and beautiful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Background Images</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Upload your own or search from Unsplash's vast collection</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dual Language</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Full support for English and Urdu with beautiful fonts</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Custom Styling</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Adjust colors, fonts, sizes, and image filters</p>
            </div>

            {/* Feature 4 */}
            <div className="text-center group">
              <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Download</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Export in PNG or JPG format for any platform</p>
            </div>
          </div>

          {/* CTA in features section */}
          <div className="text-center mt-16">
            <Link href="/generate">
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300"
              >
                Try It Now →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Think<span className="text-blue-600">r</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create beautiful quote posters in minutes
            </p>
            <div className="space-y-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">Created by</div>
              <div className="text-sm font-semibold text-gray-800 dark:text-white">Psycho Coder</div>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://github.com/itspsychocoder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://hussnainahmad.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}