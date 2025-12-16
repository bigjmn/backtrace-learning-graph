import React, { useState } from 'react';
import { ResourceNode, QuestionNode } from '@/types';
import { resourceSearch, SourceResult } from '@/api/actions';
interface ResourceNodeFormProps {
  onSubmit: (node: Omit<ResourceNode, 'id'>) => void;
  onCancel: () => void;
  title?: string;
  connectedQuestion?: QuestionNode;
}

export default function ResourceNodeForm({ onSubmit, onCancel, title = "Add Resource Node", connectedQuestion }: ResourceNodeFormProps) {
  const [name, setName] = useState('');
  const [resourceType, setResourceType] = useState<ResourceNode['resourceType']>('article');
  const [topicTag, setTopicTag] = useState('');
  const [link, setLink] = useState('');
  const [searchPending, setSearchPending] = useState(false)
  const [foundResources, setFoundResources] = useState<SourceResult[]>([])

  const handleFindResource = async () => {
    if (!connectedQuestion || !connectedQuestion.question) return;
    try {
      setSearchPending(true)
      const resourceRes = await resourceSearch(connectedQuestion.question)
      if (resourceRes.length === 0){
        throw Error("no results!")
        
  
      }
      setFoundResources(resourceRes)
      // const resourceFound = resourceRes[0]
      // console.log("found resource!")
      // console.log(resourceFound)
      // setLink(resourceFound.url)
      // if (resourceFound.title){
      //   setName(resourceFound.title)
      // }
    } catch (error) {
      console.log(error)
      
    } finally {
      setSearchPending(false)
    }
    

  }
  const autoFill = (opid:string) => {
    const foundresource = foundResources.find(x => x.id === opid)
    if (!foundresource) return; 
    if (foundresource.title){
      setName(foundresource.title)
    }
    setLink(foundresource.url)
  }

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
      
      {connectedQuestion && (
        <div className="p-3 bg-pink-50 border border-pink-200 rounded-md">
          <div className="text-sm font-medium text-pink-800 mb-1">Will connect to question:</div>
          <div className="text-sm text-pink-700">{connectedQuestion.question}</div>
          {connectedQuestion.topicTag && (
            <span className="inline-block mt-1 px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded">
              {connectedQuestion.topicTag}
            </span>
          )}
        </div>
      )}
      
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
        <button
          type="button"
          onClick={handleFindResource}
          className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-gray-600"
        >
          Find Resource
        </button>
        {foundResources.length>0 && (
          <select onChange={(e) => autoFill(e.target.value)} title="resources found" name="autosources">
            {foundResources.map((fr) => (
              <option value={fr.id}>{fr.title}</option>
            ))}
          </select>
        )}
      </div>
    </form>
  );
}