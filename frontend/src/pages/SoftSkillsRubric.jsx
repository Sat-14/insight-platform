import React, { useState } from 'react';
import { Users, TrendingUp, Award, Target, MessageCircle, Calendar, CheckCircle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Mock data based on Paper 11.pdf's 4-dimensional model
const mockTeamData = {
  teamName: 'Team Alpha',
  projectTitle: 'Sustainable Energy Solutions',
  members: [
    { id: 's1', name: 'Alice Johnson', role: 'Team Leader' },
    { id: 's2', name: 'Bob Smith', role: 'Researcher' },
    { id: 's3', name: 'Carol Davis', role: 'Designer' },
    { id: 's4', name: 'David Lee', role: 'Technical Lead' }
  ],
  currentScores: {
    td: 4.2,  // Team Dynamics
    ts: 3.8,  // Team Structure
    tm: 4.5,  // Team Motivation
    te: 4.0   // Team Excellence
  },
  trendData: [
    { week: 'Week 1', td: 3.2, ts: 3.0, tm: 3.5, te: 3.3 },
    { week: 'Week 2', td: 3.8, ts: 3.2, tm: 4.0, te: 3.6 },
    { week: 'Week 3', td: 4.0, ts: 3.5, tm: 4.2, te: 3.8 },
    { week: 'Week 4', td: 4.2, ts: 3.8, tm: 4.5, te: 4.0 }
  ]
};

const SoftSkillsRubric = () => {
  const [view, setView] = useState('team'); // 'team' or 'peer-review'
  const [selectedMember, setSelectedMember] = useState(null);
  const [assessmentMode, setAssessmentMode] = useState('view'); // 'view' or 'assess'
  const [ratings, setRatings] = useState({
    // Team Dynamics
    td_communication: 0,
    td_mutual_support: 0,
    td_trust: 0,
    td_active_listening: 0,
    // Team Structure
    ts_clear_roles: 0,
    ts_task_scheduling: 0,
    ts_decision_making: 0,
    ts_conflict_resolution: 0,
    // Team Motivation
    tm_clear_purpose: 0,
    tm_smart_goals: 0,
    tm_passion: 0,
    tm_synergy: 0,
    // Team Excellence
    te_growth_mindset: 0,
    te_quality_work: 0,
    te_self_monitoring: 0,
    te_reflective_practice: 0
  });

  // Prepare radar chart data
  const radarData = [
    { dimension: 'Team Dynamics', score: mockTeamData.currentScores.td, fullMark: 5 },
    { dimension: 'Team Structure', score: mockTeamData.currentScores.ts, fullMark: 5 },
    { dimension: 'Team Motivation', score: mockTeamData.currentScores.tm, fullMark: 5 },
    { dimension: 'Team Excellence', score: mockTeamData.currentScores.te, fullMark: 5 }
  ];

  const getDimensionColor = (score) => {
    if (score >= 4.0) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDimensionBg = (score) => {
    if (score >= 4.0) return 'bg-green-50 border-green-500';
    if (score >= 3.5) return 'bg-blue-50 border-blue-500';
    if (score >= 3.0) return 'bg-yellow-50 border-yellow-500';
    return 'bg-red-50 border-red-500';
  };

  const LikertScale = ({ label, value, onChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            className={`flex-1 py-2 rounded-lg border-2 transition-all ${
              value === rating
                ? 'border-blue-500 bg-blue-50 font-bold text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>Strongly Disagree</span>
        <span>Strongly Agree</span>
      </div>
    </div>
  );

  const TeamOverview = () => (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{mockTeamData.teamName}</h2>
            <p className="text-gray-600">{mockTeamData.projectTitle}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
            <Award className="text-blue-600" size={20} />
            <span className="font-bold text-blue-900">Overall: 4.13/5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {mockTeamData.members.map((member) => (
            <div key={member.id} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg">
                {member.name.charAt(0)}
              </div>
              <p className="text-sm font-medium text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Dimensional Model Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">4-Dimensional Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" />
              <PolarRadiusAxis domain={[0, 5]} />
              <Radar name="Team Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-green-800">
              ✓ Validated framework with Cronbach α = 0.972-0.980 (high reliability)
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Dimension Breakdown</h3>
          <div className="space-y-3">
            {/* Team Dynamics */}
            <div className={`p-4 rounded-lg border-l-4 ${getDimensionBg(mockTeamData.currentScores.td)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className={getDimensionColor(mockTeamData.currentScores.td)} size={20} />
                  <h4 className="font-bold text-gray-900">Team Dynamics (TD)</h4>
                </div>
                <span className={`text-xl font-bold ${getDimensionColor(mockTeamData.currentScores.td)}`}>
                  {mockTeamData.currentScores.td}
                </span>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Communication: Open and clear</li>
                <li>• Mutual support: Strong</li>
                <li>• Trust: Well-established</li>
                <li>• Active listening: Excellent</li>
              </ul>
            </div>

            {/* Team Structure */}
            <div className={`p-4 rounded-lg border-l-4 ${getDimensionBg(mockTeamData.currentScores.ts)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className={getDimensionColor(mockTeamData.currentScores.ts)} size={20} />
                  <h4 className="font-bold text-gray-900">Team Structure (TS)</h4>
                </div>
                <span className={`text-xl font-bold ${getDimensionColor(mockTeamData.currentScores.ts)}`}>
                  {mockTeamData.currentScores.ts}
                </span>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Clear roles: Defined</li>
                <li>• Task scheduling: Improving</li>
                <li>• Decision-making: Good</li>
                <li>• Conflict resolution: Developing</li>
              </ul>
            </div>

            {/* Team Motivation */}
            <div className={`p-4 rounded-lg border-l-4 ${getDimensionBg(mockTeamData.currentScores.tm)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className={getDimensionColor(mockTeamData.currentScores.tm)} size={20} />
                  <h4 className="font-bold text-gray-900">Team Motivation (TM)</h4>
                </div>
                <span className={`text-xl font-bold ${getDimensionColor(mockTeamData.currentScores.tm)}`}>
                  {mockTeamData.currentScores.tm}
                </span>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Clear purpose: Excellent</li>
                <li>• SMART goals: Well-defined</li>
                <li>• Passion & dedication: High</li>
                <li>• Synergy: Strong</li>
              </ul>
            </div>

            {/* Team Excellence */}
            <div className={`p-4 rounded-lg border-l-4 ${getDimensionBg(mockTeamData.currentScores.te)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className={getDimensionColor(mockTeamData.currentScores.te)} size={20} />
                  <h4 className="font-bold text-gray-900">Team Excellence (TE)</h4>
                </div>
                <span className={`text-xl font-bold ${getDimensionColor(mockTeamData.currentScores.te)}`}>
                  {mockTeamData.currentScores.te}
                </span>
              </div>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Growth mindset: Strong</li>
                <li>• Quality work: High standards</li>
                <li>• Self-monitoring: Good</li>
                <li>• Reflective practice: Developing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          <Calendar className="inline mr-2" size={20} />
          Progress Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockTeamData.trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="td" stroke="#3b82f6" name="Team Dynamics" strokeWidth={2} />
            <Line type="monotone" dataKey="ts" stroke="#8b5cf6" name="Team Structure" strokeWidth={2} />
            <Line type="monotone" dataKey="tm" stroke="#10b981" name="Team Motivation" strokeWidth={2} />
            <Line type="monotone" dataKey="te" stroke="#f59e0b" name="Team Excellence" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              📈 TD: 3.2 → 4.2 (+1.0 improvement)
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              📈 TS: 3.0 → 3.8 (+0.8 improvement)
            </p>
          </div>
        </div>
      </div>

      {/* Individual Scores */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Individual Member Scores</h3>
        <div className="space-y-3">
          {[
            { name: 'Alice Johnson', skill: 'Leadership', score: 4.6 },
            { name: 'Bob Smith', skill: 'Communication', score: 4.3 },
            { name: 'Carol Davis', skill: 'Creativity', score: 3.5 },
            { name: 'David Lee', skill: 'Collaboration', score: 4.8 }
          ].map((member, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-600">{member.skill}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-48 h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-full rounded-full ${
                      member.score >= 4.0 ? 'bg-green-500' :
                      member.score >= 3.5 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(member.score / 5) * 100}%` }}
                  />
                </div>
                <span className="font-bold text-gray-900 w-12 text-right">{member.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PeerReviewForm = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Peer Review Assessment</h2>
        <p className="text-gray-600 mb-6">
          Rate your teammate on each dimension using the 5-point Likert scale.
          Your responses are confidential and will be aggregated with other peer reviews.
        </p>

        {/* Select Teammate */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Teammate to Review
          </label>
          <select
            value={selectedMember || ''}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a teammate...</option>
            {mockTeamData.members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} - {member.role}
              </option>
            ))}
          </select>
        </div>

        {selectedMember && (
          <div className="space-y-8">
            {/* Team Dynamics Section */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <MessageCircle size={20} />
                Team Dynamics (TD)
              </h3>
              <LikertScale
                label="This teammate communicates openly and clearly"
                value={ratings.td_communication}
                onChange={(val) => setRatings({ ...ratings, td_communication: val })}
              />
              <LikertScale
                label="This teammate actively listens to others' ideas"
                value={ratings.td_active_listening}
                onChange={(val) => setRatings({ ...ratings, td_active_listening: val })}
              />
              <LikertScale
                label="This teammate supports other team members"
                value={ratings.td_mutual_support}
                onChange={(val) => setRatings({ ...ratings, td_mutual_support: val })}
              />
              <LikertScale
                label="I trust this teammate to follow through on commitments"
                value={ratings.td_trust}
                onChange={(val) => setRatings({ ...ratings, td_trust: val })}
              />
            </div>

            {/* Team Structure Section */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                <Target size={20} />
                Team Structure (TS)
              </h3>
              <LikertScale
                label="This teammate completes assigned tasks on time"
                value={ratings.ts_task_scheduling}
                onChange={(val) => setRatings({ ...ratings, ts_task_scheduling: val })}
              />
              <LikertScale
                label="This teammate takes responsibility for their role"
                value={ratings.ts_clear_roles}
                onChange={(val) => setRatings({ ...ratings, ts_clear_roles: val })}
              />
              <LikertScale
                label="This teammate helps resolve conflicts constructively"
                value={ratings.ts_conflict_resolution}
                onChange={(val) => setRatings({ ...ratings, ts_conflict_resolution: val })}
              />
              <LikertScale
                label="This teammate contributes to team decisions effectively"
                value={ratings.ts_decision_making}
                onChange={(val) => setRatings({ ...ratings, ts_decision_making: val })}
              />
            </div>

            {/* Team Motivation Section */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Team Motivation (TM)
              </h3>
              <LikertScale
                label="This teammate shows enthusiasm for the project"
                value={ratings.tm_passion}
                onChange={(val) => setRatings({ ...ratings, tm_passion: val })}
              />
              <LikertScale
                label="This teammate contributes innovative ideas"
                value={ratings.tm_clear_purpose}
                onChange={(val) => setRatings({ ...ratings, tm_clear_purpose: val })}
              />
              <LikertScale
                label="This teammate stays focused on team goals"
                value={ratings.tm_smart_goals}
                onChange={(val) => setRatings({ ...ratings, tm_smart_goals: val })}
              />
              <LikertScale
                label="This teammate enhances team synergy"
                value={ratings.tm_synergy}
                onChange={(val) => setRatings({ ...ratings, tm_synergy: val })}
              />
            </div>

            {/* Team Excellence Section */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
                <Award size={20} />
                Team Excellence (TE)
              </h3>
              <LikertScale
                label="This teammate produces high-quality work"
                value={ratings.te_quality_work}
                onChange={(val) => setRatings({ ...ratings, te_quality_work: val })}
              />
              <LikertScale
                label="This teammate reflects on and improves their approach"
                value={ratings.te_reflective_practice}
                onChange={(val) => setRatings({ ...ratings, te_reflective_practice: val })}
              />
              <LikertScale
                label="This teammate demonstrates a growth mindset"
                value={ratings.te_growth_mindset}
                onChange={(val) => setRatings({ ...ratings, te_growth_mindset: val })}
              />
              <LikertScale
                label="This teammate helps the team exceed expectations"
                value={ratings.te_self_monitoring}
                onChange={(val) => setRatings({ ...ratings, te_self_monitoring: val })}
              />
            </div>

            {/* Submit Button */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
              <CheckCircle size={20} />
              Submit Peer Review
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Soft Skills Assessment</h1>
        <p className="text-gray-600">BR5: Objective Team Effectiveness Evaluation</p>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('team')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'team'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Team Dashboard
        </button>
        <button
          onClick={() => setView('peer-review')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'peer-review'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Peer Review
        </button>
      </div>

      {/* Content */}
      {view === 'team' ? <TeamOverview /> : <PeerReviewForm />}

      {/* Research Citation */}
      <div className="mt-8 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
        <p className="text-sm text-purple-900 font-medium mb-1">Validated Assessment Framework</p>
        <p className="text-sm text-purple-800 mb-2">
          This 4-dimensional model (TD, TS, TM, TE) has been validated with Cronbach α values
          ranging from 0.972 to 0.980, indicating high internal consistency and reliability.
          All dimensions are positively and significantly correlated at 95% confidence level.
        </p>
        <p className="text-xs text-purple-700">— Paper 11.pdf: Team Effectiveness in PBL Settings</p>
      </div>
    </div>
  );
};

export default SoftSkillsRubric;