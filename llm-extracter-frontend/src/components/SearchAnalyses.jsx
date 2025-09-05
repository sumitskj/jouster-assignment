import { useState, useEffect } from 'react';
import { searchAnalyses } from '../services/api';

const SearchAnalyses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (term = '') => {
    setLoading(true);
    setError(null);

    try {
      const results = await searchAnalyses(term || null);
      setAnalyses(results);
    } catch (err) {
      setError('Failed to search analyses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    handleSearch('');
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Search Past Analyses</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
              Search by topic or keyword:
            </label>
            <div className="flex space-x-3">
              <input
                id="search-input"
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter topic or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Analyses
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No analyses found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="space-y-3">
                  {analysis.title && (
                    <h4 className="text-lg font-medium text-gray-900">{analysis.title}</h4>
                  )}
                  
                  <p className="text-gray-700">{analysis.summary}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Sentiment:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        analysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {analysis.sentiment}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Confidence:</span>
                      <span>{(analysis.confidence * 100).toFixed(1)}%</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Created:</span>
                      <span>{new Date(analysis.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {(analysis.topics && analysis.topics.length > 0) || (analysis.keywords && analysis.keywords.length > 0) ? (
                    <div className="space-y-2">
                      {analysis.topics && analysis.topics.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Topics: </span>
                          <div className="inline-flex flex-wrap gap-1">
                            {analysis.topics.map((topic, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {analysis.keywords && analysis.keywords.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Keywords: </span>
                          <div className="inline-flex flex-wrap gap-1">
                            {analysis.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAnalyses;
