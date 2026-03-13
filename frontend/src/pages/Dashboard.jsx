import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BookMarked, User as UserIcon, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [bookmarksRes, recsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/v1/resources/user/bookmarks', config),
          axios.get('http://localhost:5000/api/v1/resources/recommendations/me', config)
        ]);
        
        setBookmarks(bookmarksRes.data.data);
        setRecommendations(recsRes.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const removeBookmark = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/v1/resources/${id}/bookmark`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(bookmarks.filter(b => b._id !== id));
    } catch (error) {
      console.error('Error removing bookmark');
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-10">
        <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-md">
          <UserIcon className="h-12 w-12 text-primary-600" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
            <BookOpen className="w-5 h-5 text-primary-400" />
            Studying: <span className="font-semibold text-gray-700">{user?.course || 'No course selected'}</span>
          </p>
        </div>
        <Link 
          to="/discover" 
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
        >
          Discover Resources
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Bookmarks Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <BookMarked className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-100 pb-1">Your Bookmarks</h2>
          </div>
          
          <div className="space-y-4">
            {bookmarks.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-500">
                You haven't bookmarked any resources yet.<br/>
                <Link to="/discover" className="text-primary-600 font-medium hover:underline mt-2 inline-block">Explore catalog</Link>
              </div>
            ) : (
              bookmarks.map(resource => (
                <div key={resource._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 pr-10">{resource.title}</h3>
                    <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg shadow-sm">
                      {resource.resourceType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{resource.author} • {resource.publicationYear}</p>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 group-hover:underline"
                    >
                      View Resource
                    </a>
                    <button 
                      onClick={() => removeBookmark(resource._id)}
                      className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recommendations Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-purple-100 pb-1">Recommended for You</h2>
          </div>
          
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-500">
                No recommendations found for your course yet.<br/>
                Try searching for specific topics.
              </div>
            ) : (
              recommendations.map(resource => (
                <div key={resource._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{resource.title}</h3>
                    <span className="text-xs font-medium px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg shadow-sm border border-purple-100">
                      {resource.difficultyLevel}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 font-light leading-relaxed">{resource.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                      {resource.subject}
                    </span>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline"
                    >
                      Read Content →
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
