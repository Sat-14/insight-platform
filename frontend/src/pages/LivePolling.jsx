import React, { useState, useEffect } from 'react';
import { Send, Users, CheckCircle, XCircle, Clock, BarChart3 } from 'lucide-react';

// Mock WebSocket for real-time updates (in production, use actual WebSocket)
const mockWebSocket = {
  on: (event, callback) => {
    // Simulate real-time response updates
    if (event === 'poll_response') {
      setInterval(() => {
        callback({
          pollId: 'current',
          totalResponses: Math.floor(Math.random() * 30) + 1
        });
      }, 3000);
    }
  }
};

const LivePollingSystem = () => {
  const [view, setView] = useState('teacher'); // 'teacher' or 'student'
  const [activePoll, setActivePoll] = useState(null);
  const [pollHistory, setPollHistory] = useState([]);
  const [liveResponses, setLiveResponses] = useState(0);
  const [hasResponded, setHasResponded] = useState(false);

  // Teacher: Create new poll
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '', '', ''],
    type: 'multiple_choice',
    correctAnswer: null // For fact-based questions
  });

  // Sample poll data
  const samplePolls = [
    {
      id: 'poll_1',
      question: 'Do you understand today\'s concept?',
      options: ['Yes, completely', 'Partially', 'No, need help', 'Not sure'],
      type: 'understanding',
      responses: [
        { option: 'Yes, completely', count: 20, percentage: 71 },
        { option: 'Partially', count: 6, percentage: 21 },
        { option: 'No, need help', count: 2, percentage: 7 },
        { option: 'Not sure', count: 0, percentage: 0 }
      ],
      totalResponses: 28,
      classSize: 28,
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ];

  useEffect(() => {
    // Initialize with sample poll
    setActivePoll(samplePolls[0]);
    
    // Mock WebSocket connection for real-time updates
    mockWebSocket.on('poll_response', (data) => {
      setLiveResponses(data.totalResponses);
    });
  }, []);

  const createPoll = () => {
    const poll = {
      id: `poll_${Date.now()}`,
      question: newPoll.question,
      options: newPoll.options.filter(o => o.trim() !== ''),
      type: newPoll.type,
      correctAnswer: newPoll.correctAnswer,
      responses: newPoll.options
        .filter(o => o.trim() !== '')
        .map(opt => ({ option: opt, count: 0, percentage: 0 })),
      totalResponses: 0,
      classSize: 28,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    setActivePoll(poll);
    setLiveResponses(0);
    
    // Reset form
    setNewPoll({
      question: '',
      options: ['', '', '', ''],
      type: 'multiple_choice',
      correctAnswer: null
    });
  };

  const closePoll = () => {
    if (activePoll) {
      setPollHistory([activePoll, ...pollHistory]);
      setActivePoll(null);
    }
  };

  const submitResponse = (option) => {
    if (!hasResponded) {
      setHasResponded(true);
      // In production, send to backend via API
      setTimeout(() => {
        setLiveResponses(prev => prev + 1);
      }, 500);
    }
  };

  // Teacher View
  const TeacherView = () => (
    <div className="space-y-6">
      {/* Create Poll Section */}
      {!activePoll && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Poll</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                value={newPoll.question}
                onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                placeholder="What would you like to ask your students?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Type
              </label>
              <select
                value={newPoll.type}
                onChange={(e) => setNewPoll({ ...newPoll, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="understanding">Understanding Check</option>
                <option value="fact_based">Fact-Based (has correct answer)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options (minimum 2)
              </label>
              <div className="space-y-2">
                {newPoll.options.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const updated = [...newPoll.options];
                        updated[idx] = e.target.value;
                        setNewPoll({ ...newPoll, options: updated });
                      }}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {newPoll.type === 'fact_based' && (
                      <button
                        onClick={() => setNewPoll({ ...newPoll, correctAnswer: option })}
                        className={`px-3 py-2 rounded ${
                          newPoll.correctAnswer === option
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={createPoll}
              disabled={!newPoll.question || newPoll.options.filter(o => o.trim()).length < 2}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Launch Poll
            </button>
          </div>
        </div>
      )}

      {/* Active Poll Display */}
      {activePoll && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-600">LIVE POLL</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{activePoll.question}</h2>
            </div>
            <button
              onClick={closePoll}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close Poll
            </button>
          </div>

          {/* Real-time Response Counter */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Responses</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {activePoll.totalResponses} / {activePoll.classSize}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Participation Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((activePoll.totalResponses / activePoll.classSize) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Results Visualization */}
          <div className="space-y-3">
            {activePoll.responses.map((response, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{response.option}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {response.count} ({response.percentage}%)
                  </span>
                </div>
                <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 flex items-center justify-end pr-2 ${
                      idx === 0 ? 'bg-green-500' :
                      idx === 1 ? 'bg-yellow-500' :
                      idx === 2 ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${response.percentage}%` }}
                  >
                    {response.percentage > 10 && (
                      <span className="text-white text-xs font-medium">
                        {response.count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          {activePoll.responses[2]?.percentage >= 7 && (
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex items-start gap-2">
                <div className="text-yellow-600 mt-1">⚠️</div>
                <div>
                  <p className="font-medium text-yellow-900">Action Recommended</p>
                  <p className="text-sm text-yellow-800">
                    {activePoll.responses[2].percentage}% of students need clarification. 
                    Consider re-explaining the concept or providing additional examples.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Poll History */}
      {pollHistory.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Polls</h3>
          <div className="space-y-3">
            {pollHistory.slice(0, 3).map((poll, idx) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg">
                <p className="font-medium text-gray-900">{poll.question}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {poll.totalResponses} responses • {new Date(poll.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Student View
  const StudentView = () => (
    <div className="space-y-6">
      {activePoll ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-600">LIVE POLL</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{activePoll.question}</h2>
            <p className="text-sm text-gray-600">
              Your response is anonymous • Select one option
            </p>
          </div>

          {!hasResponded ? (
            <div className="space-y-3">
              {activePoll.responses.map((response, idx) => (
                <button
                  key={idx}
                  onClick={() => submitResponse(response.option)}
                  className="w-full p-4 text-left border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <span className="font-medium text-gray-900">{response.option}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Response Submitted!</h3>
              <p className="text-gray-600">
                Thank you for your anonymous feedback. Your teacher will review the results.
              </p>
              
              {/* Show results after responding */}
              <div className="mt-8 space-y-3 text-left">
                <p className="text-sm font-medium text-gray-700 mb-3">Class Results (so far):</p>
                {activePoll.responses.map((response, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{response.option}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {response.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${response.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <Clock className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Poll</h3>
          <p className="text-gray-600">
            Waiting for your teacher to launch a poll. You'll be notified when one starts.
          </p>
        </div>
      )}

      {/* BR4: Anonymous Participation Message */}
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-medium text-blue-900 mb-1">100% Anonymous Participation</h4>
        <p className="text-sm text-blue-800">
          Your responses are completely anonymous. Your teacher only sees aggregated class data,
          not individual answers. This ensures everyone can participate honestly without fear of judgment.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Live Polling System</h1>
        <p className="text-gray-600">BR4: Inclusive Engagement Capture • 100% Participation</p>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('teacher')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'teacher'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Teacher View
        </button>
        <button
          onClick={() => {
            setView('student');
            setHasResponded(false);
          }}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'student'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Student View
        </button>
      </div>

      {/* Content */}
      {view === 'teacher' ? <TeacherView /> : <StudentView />}

      {/* Research Citation */}
      <div className="mt-8 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
        <p className="text-sm text-purple-900 font-medium mb-1">Research-Backed Design</p>
        <p className="text-sm text-purple-800">
          "By giving every student a chance to respond anonymously, live polling promotes inclusion 
          and provides quieter students a voice. Immediate feedback allows lecturers to gauge student 
          understanding in real-time and adjust teaching timely."
        </p>
        <p className="text-xs text-purple-700 mt-2">— Paper 8h.pdf: Impact of Live Polling Quizzes</p>
      </div>
    </div>
  );
};

export default LivePollingSystem;