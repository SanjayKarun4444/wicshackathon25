import React, { useState } from 'react';
import { PenLine, Book, Brain, Timer } from 'lucide-react';

const Study = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds

  const generateFlashcards = () => {
    // Simulate AI processing
    const newFlashcards = [
      { question: "What is the main concept from your notes?", answer: "Based on your notes..." },
      { question: "Can you explain the relationship between...?", answer: "According to your notes..." }
    ];
    setFlashcards(newFlashcards);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Brain className="w-6 h-6" />
              AI Study Buddy
            </div>
          </div>
          
          <div className="p-6">
            {/* Navigation */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  activeTab === 'notes' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                <PenLine className="w-4 h-4" /> Notes
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  activeTab === 'flashcards' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                <Book className="w-4 h-4" /> Flashcards
              </button>
              <button
                onClick={() => setActiveTab('timer')}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  activeTab === 'timer' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                <Timer className="w-4 h-4" /> Focus Timer
              </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg p-4">
              {activeTab === 'notes' && (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Start taking notes... AI will help organize and generate study materials."
                    className="w-full h-64 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={generateFlashcards}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Generate Flashcards
                  </button>
                </div>
              )}

              {activeTab === 'flashcards' && (
                <div className="space-y-4">
                  {flashcards.map((card, index) => (
                    <div key={index} className="border rounded-lg p-4 shadow-sm">
                      <h3 className="font-bold mb-2">Question {index + 1}:</h3>
                      <p className="mb-4">{card.question}</p>
                      <h3 className="font-bold mb-2">Answer:</h3>
                      <p>{card.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'timer' && (
                <div className="text-center">
                  <div className="text-6xl font-bold mb-6">
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className={`px-6 py-3 rounded ${
                      timerActive ? 'bg-red-500' : 'bg-green-500'
                    } text-white transition-colors`}
                  >
                    {timerActive ? 'Stop' : 'Start'} Timer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Study;