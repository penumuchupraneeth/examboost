import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, BookMarked, Check, SlidersHorizontal, ExternalLink, User as UserIcon } from 'lucide-react';

const ResourceDiscovery = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    resourceType: '',
    difficultyLevel: '',
  });
  const [loading, setLoading] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let queryParam = `?search=${searchTerm}`;
      if (filters.resourceType) queryParam += `&resourceType=${filters.resourceType}`;
      if (filters.difficultyLevel) queryParam += `&difficultyLevel=${filters.difficultyLevel}`;

      const res = await axios.get(`http://localhost:5000/api/v1/resources${queryParam}`);
      setResources(res.data.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/v1/resources/user/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarkedIds(res.data.data.map(b => b._id));
    } catch (error) {
      console.error('Error fetching bookmarks', error);
    }
  };

  useEffect(() => {
    fetchResources();
    fetchBookmarks();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleBookmark = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/v1/resources/${id}/bookmark`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarkedIds([...bookmarkedIds, id]);
    } catch (error) {
      console.error('Error bookmarking:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="mb-10 text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Resource Discovery</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">Find exactly what you need for your research and studies from our vast catalog of papers, books, and courses.</p>
      </div>

      {/* Search and Filters box */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-10 relative z-20">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 relative">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400 focus:outline-none transition-xl font-medium shadow-sm transition-shadow hover:shadow-md"
              placeholder="Search by title, topic, subject or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-4 border border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-2xl font-medium flex items-center gap-2 transition-colors focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button
              type="submit"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-colors shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 outline-none"
            >
              Search
            </button>
          </div>
        </form>

        {/* Expandable filters */}
        {showFilters && (
          <div className="pt-6 mt-6 border-t border-gray-100 grid md:grid-cols-2 gap-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Type</label>
              <select
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 bg-gray-50 focus:bg-white text-gray-700 outline-none font-medium"
                value={filters.resourceType}
                onChange={(e) => setFilters({...filters, resourceType: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="Research Paper">Research Paper</option>
                <option value="Book">Book</option>
                <option value="Lecture Video">Lecture Video</option>
                <option value="Open Course Material">Open Course Material</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
              <select
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 bg-gray-50 focus:bg-white text-gray-700 outline-none font-medium"
                value={filters.difficultyLevel}
                onChange={(e) => setFilters({...filters, difficultyLevel: e.target.value})}
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-3xl border border-dashed border-gray-300">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-medium">No resources found.</p>
              <p className="mt-1">Try adjusting your search terms or filters.</p>
            </div>
          ) : (
            resources.map(resource => (
              <div key={resource._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1">
                <div className="p-6 flex-grow flex flex-col">
                  {/* Badges */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-lg border border-primary-100 uppercase tracking-wide">
                      {resource.resourceType}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg uppercase tracking-wide">
                      {resource.difficultyLevel}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 font-medium flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    {resource.author} • {resource.publicationYear}
                  </p>
                  
                  <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3 font-light leading-relaxed">
                    {resource.description}
                  </p>
                  
                  {/* Footer actions */}
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group/link"
                    >
                      Access Material
                      <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                    
                    {bookmarkedIds.includes(resource._id) ? (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium border border-green-100 cursor-default">
                        <Check className="w-4 h-4" />
                        Saved
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBookmark(resource._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg text-sm font-medium transition-colors"
                        title="Bookmark"
                      >
                        <BookMarked className="w-5 h-5" />
                        Save
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceDiscovery;
