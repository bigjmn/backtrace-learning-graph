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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg text-[var(--foreground)]"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Question *</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Topic Tag</label>
        <input
          type="text"
          value={topicTag}
          onChange={(e) => setTopicTag(e.target.value)}
          placeholder="e.g., Topology, Number Theory"
          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Answered Level: {answeredLevel.toFixed(2)}
          <span className="text-gray-500 dark:text-gray-400 ml-1">
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
        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Notes</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Explain what you know or what's tripping you up"
          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
          className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-md hover:bg-gray-600 dark:hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}