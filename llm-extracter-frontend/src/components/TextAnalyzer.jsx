import { useState } from 'react';
import { analyzeText } from '../services/api';

const TextAnalyzer = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeText(text);
      setAnalysis(result);
    } catch (err) {
      let errorMessage = 'Failed to analyze text. Please try again.';
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === 'object' && detail.error && detail.detail) {
          errorMessage = `${detail.error}: ${detail.detail}`;
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Analyze Text</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter text to analyze:
            </label>
            <textarea
              id="text-input"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Text'}
            </button>
            
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {analysis && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h3>
          
          <div className="space-y-4">
            {analysis.title && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Title:</h4>
                <p className="text-gray-900">{analysis.title}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Summary:</h4>
              <p className="text-gray-900">{analysis.summary}</p>
            </div>
            
            {analysis.topics && analysis.topics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Topics:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
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
                <h4 className="text-sm font-medium text-gray-700">Keywords:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Sentiment:</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  analysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {analysis.sentiment}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700">Confidence:</h4>
                <span className="text-gray-900">{(analysis.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Created:</h4>
              <p className="text-gray-900">{new Date(analysis.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalyzer;
