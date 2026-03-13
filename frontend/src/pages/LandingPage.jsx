import { Link } from 'react-router-dom';
import { BookOpen, Search, BookMarked, GraduationCap, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-100 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100 blur-3xl opacity-50 pointer-events-none" />

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl w-full space-y-12 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-sm font-medium text-gray-600 mb-4 animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
              Welcome to ScholarSync
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Supercharge your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-400">
                Academic Research
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed font-light">
              Discover, organize, and summarize the best resources tailored for your courses. 
              Find papers, books, and lectures instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/auth" 
              className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-primary-500/30 flex items-center justify-center gap-2 group"
            >
              Start Discovering
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-full font-semibold text-lg transition-all shadow-sm"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div id="features" className="bg-white py-24 relative z-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to succeed</h2>
            <p className="mt-4 text-lg text-gray-600">Built specifically for modern students and researchers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="w-8 h-8 text-primary-500" />}
              title="Smart Discovery"
              description="Instantly find relevant research papers, books, and lecture materials curated for your specific course."
            />
            <FeatureCard 
              icon={<BookMarked className="w-8 h-8 text-blue-500" />}
              title="Organized Bookmarks"
              description="Save your favorite resources in one place. Never lose track of an important paper again."
            />
            <FeatureCard 
              icon={<GraduationCap className="w-8 h-8 text-indigo-500" />}
              title="Personalized"
              description="Get recommendations based on your major and current topics of study."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all group">
    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed font-light">{description}</p>
  </div>
);

export default LandingPage;
