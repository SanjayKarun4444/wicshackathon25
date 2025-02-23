'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Study = () => {
  const [topic, setTopic] = useState('');
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  // New state variables
  const [currentMode, setCurrentMode] = useState('focus');
  const [studyTime, setStudyTime] = useState(25 * 60); // 25 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [visualPath, setVisualPath] = useState(null);

  // Timer functionality
  useEffect(() => {
    let interval;
    if (isTimerActive && studyTime > 0) {
      interval = setInterval(() => {
        setStudyTime((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerActive(false);
            // Trigger break suggestion
            suggestBreak();
            return 25 * 60;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, studyTime]);

  const generateStudyPlan = async () => {
    setLoading(true);
    try {
      let pdfContent = null;
      
      // If documents exist, use their content (assuming it was extracted earlier)
      if (documents.length > 0) {
        pdfContent = documents.map(doc => doc.content).join('\n\n');
      }
  
      const response = await fetch('/api/study-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic,
          type: 'study_plan',
          pdfContent // Include document content if available
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch study plan');
  
      setStudyPlan(data);
  
    } catch (error) {
      console.error('Error in generateStudyPlan:', error);
      alert('Failed to generate study plan. Please try again.');
    }
    setLoading(false);
  };
  


  const handleModeChange = (mode) => {
    setCurrentMode(mode);
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const suggestBreak = async () => {
    try {
      const response = await fetch('/api/study-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'break_suggestion' }),
      });
      const data = await response.json();
      alert(data.content); // Or handle break suggestion in a more elegant way
    } catch (error) {
      console.error('Error getting break suggestion:', error);
    }
  };

  const handleDocumentUpload = async (event) => {
    const files = Array.from(event.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append('documents', file));
    
    try {
      const response = await fetch('/api/analyze-documents', {
        method: 'POST',
        body: formData
      });
      const analysis = await response.json();
      setDocuments(analysis);
    } catch (error) {
      console.error('Error analyzing documents:', error);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">AI Study Assistant</h1>
        <p className="text-gray-600">Enter a topic to get started with your personalized study plan</p>
      </div>

      {/* Study Modes */}
      <div className="flex space-x-4 mb-6">
        {['focus', 'review', 'quiz', 'visual'].map(mode => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`px-4 py-2 rounded-lg ${
              currentMode === mode 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="mb-8">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-4 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none"
          placeholder="Enter your study topic (e.g., 'Python Programming Basics')"
        />
        <button 
          onClick={generateStudyPlan}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          disabled={loading}
        >
          {loading ? 'Generating your study plan...' : 'Generate Study Plan'}
        </button>
      </div>

      {/* Study Timer */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Study Timer</h2>
        <div className="text-4xl font-bold text-center mb-4">
          {Math.floor(studyTime / 60)}:{(studyTime % 60).toString().padStart(2, '0')}
        </div>
        <button 
          onClick={toggleTimer}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {isTimerActive ? 'Pause' : 'Start'} Timer
        </button>
      </div>

      {/* Document Upload */}
      <div className="mb-8">
        <input
          type="file"
          multiple
          onChange={handleDocumentUpload}
          className="w-full p-4 border-2 border-blue-200 rounded-lg"
        />
      </div>

      {studyPlan && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Study Plan Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Study Plan</h2>
            <div className="prose">
              <pre className="whitespace-pre-wrap">{studyPlan.content}</pre>
            </div>
          </div>

          {/* Visual Learning Path */}
          {visualPath && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Learning Path</h2>
              <div className="prose">
                <pre className="whitespace-pre-wrap">{visualPath.content}</pre>
              </div>
            </div>
          )}

          {/* Document Analysis */}
          {documents.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Document Analysis</h2>
              {documents.map((doc, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold">{doc.title}</h3>
                  <p>{doc.summary}</p>
                </div>
              ))}
            </div>
          )}

          {/* Flashcards Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Flashcards</h2>
            {flashcards.length > 0 && (
              <div className="relative">
                <motion.div
                  className="bg-white p-6 rounded-lg border-2 border-blue-200 min-h-[200px] flex items-center justify-center cursor-pointer"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  onClick={flipCard}
                >
                  <div className={`${isFlipped ? 'hidden' : 'block'}`}>
                    <p className="text-xl">{flashcards[currentCard]?.question}</p>
                  </div>
                  <div className={`${!isFlipped ? 'hidden' : 'block'} transform rotate-180`}>
                    <p className="text-xl">{flashcards[currentCard]?.answer}</p>
                  </div>
                </motion.div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={prevCard}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    Previous
                  </button>
                  <span className="py-2">
                    {currentCard + 1} of {flashcards.length}
                  </span>
                  <button
                    onClick={nextCard}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Study;
