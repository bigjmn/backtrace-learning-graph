import React, { useState } from 'react';
import { ResourceNode } from '@/types';

interface ResourceNodeFormProps {
  onSubmit: (node: Omit<ResourceNode, 'id'>) => void;
  onCancel: () => void;
  title?: string;
}

export default function ResourceNodeForm({ onSubmit, onCancel, title = "Add Resource Node" }: ResourceNodeFormProps) {
  const [name, setName] = useState('');
  const [resourceType, setResourceType] = useState<ResourceNode['resourceType']>('article');
  const [topicTag, setTopicTag] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !link.trim()) return;

    onSubmit({
      name: name.trim(),
      resourceType,
      topicTag: topicTag.trim() || null,
      link: link.trim(),
      nodeType: 'resource'
    });
    
    setName('');
    setResourceType('article');
    setTopicTag('');
    setLink('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white border rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter resource name"
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Resource Type *</label>
        <select 
          title="resource"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value as ResourceNode['resourceType'])}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="book">Book</option>
          <option value="article">Article</option>
          <option value="website">Website</option>
          <option value="other">Other</option>
        </select>
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
        <label className="block text-sm font-medium mb-1">Link *</label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com"
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Resource
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