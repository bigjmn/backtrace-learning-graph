import React, { useState } from 'react';
import { QuestionNode } from '@/types';

interface QuestionNodeFormProps {
  onSubmit: (node: Omit<QuestionNode, 'id'>) => void;
  onCancel: () => void;
  title?: string;
}

export default function QuestionNodeForm({ onSubmit, onCancel, title = "Add Question Node" }: QuestionNodeFormProps) {
  const [question, setQuestion] = useState('');
  const [topicTag, setTopicTag] = useState('');
  const [answeredLevel, setAnsweredLevel] = useState(0);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    onSubmit({
      question: question.trim(),
      topicTag: topicTag.trim() || null,
      answeredLevel,
      note: note.trim() || null,
      nodeType: 'question'
    });
    
    setQuestion('');
    setTopicTag('');
    setAnsweredLevel(0);
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white border rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Question *</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          className="w-full p-2 border rounded-md"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Topic Tag</label>
        <input
          type="text"
          value={topicTag}
          onChange={(e) => setTopicTag(e.target.value)}
          placeholder="e.g., Topology, Number Theory"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Answered Level: {answeredLevel.toFixed(2)} 
          <span className="text-gray-500 ml-1">
            (0 = No idea, 1 = Completely understand)
          </span>
        </label>
        <input 
          title="answeredleve"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={answeredLevel}
          onChange={(e) => setAnsweredLevel(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>No idea</span>
          <span>Completely understand</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Explain what you know or what's tripping you up"
          className="w-full p-2 border rounded-md"
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
        >
          Add Question
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}