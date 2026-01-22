import React, { useState } from 'react';
import { Search, Filter, BookOpen, FileText, Clock, Users, Star, Download, Eye, Copy } from 'lucide-react';

// Mock template data based on Paper 14.pdf and 15.pdf
const mockTemplates = [
  {
    id: 't1',
    title: 'Ecosystem Investigation Project',
    subject: 'Science',
    grade: 7,
    type: 'project_brief',
    description: 'Students investigate local ecosystems and present findings on biodiversity',
    duration: 180,
    learningObjectives: [
      'Understand ecosystem dynamics and interdependence',
      'Develop scientific observation and data collection skills',
      'Analyze environmental impact factors'
    ],
    softSkills: ['Collaboration', 'Research', 'Critical Thinking'],
    timesUsed: 45,
    avgRating: 4.6,
    createdBy: 'Dr. Sarah Chen',
    isPublic: true
  },
  {
    id: 't2',
    title: 'Climate Change Data Analysis',
    subject: 'Science',
    grade: 7,
    type: 'project_brief',
    description: 'Analyze real climate data and create presentations on global warming trends',
    duration: 240,
    learningObjectives: [
      'Interpret scientific data and graphs',
      'Understand climate change causes and effects',
      'Develop data visualization skills'
    ],
    softSkills: ['Analytical Thinking', 'Communication', 'Teamwork'],
    timesUsed: 32,
    avgRating: 4.8,
    createdBy: 'Prof. Michael Rodriguez',
    isPublic: true
  },
  {
    id: 't3',
    title: 'Statistics in Sports Analysis',
    subject: 'Math',
    grade: 8,
    type: 'project_brief',
    description: 'Use statistical methods to analyze sports performance data',
    duration: 150,
    learningObjectives: [
      'Apply statistical concepts to real-world data',
      'Calculate mean, median, mode, and standard deviation',
      'Create data visualizations and interpret trends'
    ],
    softSkills: ['Problem Solving', 'Presentation', 'Data Literacy'],
    timesUsed: 38,
    avgRating: 4.4,
    createdBy: 'Dr. Emily Watson',
    isPublic: true
  },
  {
    id: 't4',
    title: 'Geometry Architecture Challenge',
    subject: 'Math',
    grade: 8,
    type: 'project_brief',
    description: 'Design a building using geometric principles and create 3D models',
    duration: 200,
    learningObjectives: [
      'Apply geometric concepts to architectural design',
      'Calculate area, volume, and angles',
      'Understand structural engineering basics'
    ],
    softSkills: ['Creativity', 'Spatial Reasoning', 'Technical Drawing'],
    timesUsed: 29,
    avgRating: 4.7,
    createdBy: 'Mr. James Park',
    isPublic: true
  },
  {
    id: 't5',
    title: 'Journalism & Media Literacy',
    subject: 'English',
    grade: 9,
    type: 'project_brief',
    description: 'Create a news publication analyzing current events with journalistic integrity',
    duration: 210,
    learningObjectives: [
      'Develop critical media literacy skills',
      'Practice ethical journalism and fact-checking',
      'Write in multiple journalistic formats'
    ],
    softSkills: ['Writing', 'Research', 'Ethics', 'Communication'],
    timesUsed: 41,
    avgRating: 4.9,
    createdBy: 'Ms. Patricia Lee',
    isPublic: true
  },
  {
    id: 't6',
    title: 'Podcast Creation Project',
    subject: 'English',
    grade: 9,
    type: 'project_brief',
    description: 'Plan, script, record, and produce a professional podcast series',
    duration: 180,
    learningObjectives: [
      'Develop audio storytelling techniques',
      'Practice script writing and interviewing',
      'Learn audio editing and production'
    ],
    softSkills: ['Communication', 'Technical Skills', 'Creativity'],
    timesUsed: 36,
    avgRating: 4.5,
    createdBy: 'Mr. David Thompson',
    isPublic: true
  }
];

const TemplateLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Filter templates
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || template.subject === selectedSubject;
    const matchesGrade = selectedGrade === 'all' || template.grade === parseInt(selectedGrade);
    const matchesType = selectedType === 'all' || template.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesGrade && matchesType;
  });

  // Get unique values for filters
  const subjects = [...new Set(mockTemplates.map(t => t.subject))];
  const grades = [...new Set(mockTemplates.map(t => t.grade))].sort();
  const types = [...new Set(mockTemplates.map(t => t.type))];

  const TemplateCard = ({ template }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{template.title}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                {template.subject}
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                Grade {template.grade}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                {template.type.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-bold">{template.avgRating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{template.duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{template.timesUsed} uses</span>
          </div>
        </div>

        {/* Soft Skills */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Soft Skills Targeted:</p>
          <div className="flex flex-wrap gap-1">
            {template.softSkills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTemplate(template)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Eye size={16} />
            View Details
          </button>
          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Created by <span className="font-medium">{template.createdBy}</span>
        </p>
      </div>
    </div>
  );

  const TemplateDetail = ({ template }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{template.title}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                  {template.subject}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                  Grade {template.grade}
                </span>
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full">
                  <Star size={16} fill="#eab308" className="text-yellow-500" />
                  <span className="text-sm font-bold text-yellow-700">{template.avgRating}</span>
                  <span className="text-xs text-yellow-600">({template.timesUsed} uses)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{template.description}</p>
          </div>

          {/* Learning Objectives */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Learning Objectives</h3>
            <ul className="space-y-2">
              {template.learningObjectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Soft Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Soft Skills Developed</h3>
            <div className="flex flex-wrap gap-2">
              {template.softSkills.map((skill, idx) => (
                <span key={idx} className="px-3 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Template Details */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Clock size={20} />
                <p className="font-medium">Duration</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">{template.duration} min</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Users size={20} />
                <p className="font-medium">Times Used</p>
              </div>
              <p className="text-2xl font-bold text-purple-900">{template.timesUsed}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <BookOpen size={20} />
                <p className="font-medium">Type</p>
              </div>
              <p className="text-sm font-bold text-green-900">{template.type.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
              <Copy size={20} />
              Use This Template
            </button>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 flex items-center gap-2">
              <Download size={20} />
              Download
            </button>
          </div>

          {/* Creator Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Created by <span className="font-bold text-gray-900">{template.createdBy}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Template Library</h1>
        <p className="text-gray-600">BR7: Curriculum-Aligned Resources • Workload Reduction</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by title or description..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2">
              <Filter size={16} />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-700">
          <span className="font-bold">{filteredTemplates.length}</span> templates found
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredTemplates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && <TemplateDetail template={selectedTemplate} />}

      {/* Research Citation */}
      <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
        <p className="text-sm text-purple-900 font-medium mb-1">Research-Backed Workload Reduction</p>
        <p className="text-sm text-purple-800 mb-2">
          "Centrally developed unit plans would be welcomed by teachers and save them approximately 
          three hours a week. Where work plans included appropriate curriculum content, challenging 
          questions, engaging activities and resource ideas, this led to an overall reduction in 
          teacher workload around planning."
        </p>
        <p className="text-xs text-purple-700">
          — Paper 14.pdf: Workload Challenge Research Projects | Paper 15.pdf: Teacher Workload Study
        </p>
      </div>
    </div>
  );
};

export default TemplateLibrary;