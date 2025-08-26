import { Handle, Position } from 'reactflow';
import { AppNode, ResourceNode, QuestionNode } from '@/types';
import React, { useState } from 'react';

interface CustomNodeProps {
  data: {
    appNode: AppNode;
    onAddConnectedQuestion?: (resourceId: string) => void;
    onAddConnectedResource?: (questionId: string) => void;
    onDeleteNode?: (nodeId: string) => void;
    onUpdateAnsweredLevel?: (nodeId: string, level: number) => void;
  };
  selected?: boolean;
}

export function ResourceNodeComponent({ data, selected }: CustomNodeProps) {
  const node = data.appNode as ResourceNode;
  
  return (
    <div className={`bg-blue-50 border-2 rounded-lg p-3 min-w-[200px] max-w-[300px] ${selected ? 'border-blue-700 ring-2 ring-blue-300' : 'border-blue-500'}`}>
      <Handle type="target" position={Position.Left} />
      
      <div className="text-sm font-semibold text-blue-800 mb-1">{node.name}</div>
      <div className="text-xs text-gray-600 mb-1">
        <span className="bg-blue-100 px-2 py-1 rounded">{node.resourceType}</span>
        {node.topicTag && (
          <span className="bg-gray-100 px-2 py-1 rounded ml-1">{node.topicTag}</span>
        )}
      </div>
      <div className="text-xs text-blue-600 truncate mb-2">
        <a href={node.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {node.link}
        </a>
      </div>
      
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => data.onAddConnectedQuestion?.(node.id)}
          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          title="Add question that this resource requires"
        >
          + Question
        </button>
        <button
          type="button"
          onClick={() => data.onDeleteNode?.(node.id)}
          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          title="Delete this resource"
        >
          Delete
        </button>
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export function QuestionNodeComponent({ data, selected }: CustomNodeProps) {
  const node = data.appNode as QuestionNode;
  const [isEditingLevel, setIsEditingLevel] = useState(false);
  const [tempLevel, setTempLevel] = useState(node.answeredLevel);
  
  const getAnsweredLevelColor = (level: number) => {
    if (level === 0) return 'bg-red-100 text-red-800';
    if (level < 0.5) return 'bg-yellow-100 text-yellow-800';
    if (level < 1) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  const handleLevelClick = () => {
    setTempLevel(node.answeredLevel);
    setIsEditingLevel(true);
  };

  const handleLevelSave = () => {
    data.onUpdateAnsweredLevel?.(node.id, tempLevel);
    setIsEditingLevel(false);
  };

  const handleLevelCancel = () => {
    setTempLevel(node.answeredLevel);
    setIsEditingLevel(false);
  };
  
  return (
    <div className={`bg-pink-50 border-2 rounded-lg p-3 min-w-[200px] max-w-[300px] ${selected ? 'border-pink-700 ring-2 ring-pink-300' : 'border-pink-500'}`}>
      <Handle type="target" position={Position.Left} />
      
      <div className="text-sm font-semibold text-pink-800 mb-2">{node.question}</div>
      
      <div className="text-xs mb-2">
        {node.topicTag && (
          <span className="bg-gray-100 px-2 py-1 rounded mr-1">{node.topicTag}</span>
        )}
        
        {isEditingLevel ? (
          <div className="mb-2">
            <div className="flex items-center gap-1 mb-1">
              <input 
                title=""
                placeholder='0'
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={tempLevel}
                onChange={(e) => setTempLevel(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs">{(tempLevel * 100).toFixed(0)}%</span>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleLevelSave}
                className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleLevelCancel}
                className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLevelClick}
            className={`px-2 py-1 rounded hover:opacity-80 ${getAnsweredLevelColor(node.answeredLevel)}`}
            title="Click to edit understanding level"
          >
            {(node.answeredLevel * 100).toFixed(0)}% understood
          </button>
        )}
      </div>
      
      {node.note && (
        <div className="text-xs text-gray-600 mb-2 italic border-t pt-2">
          {node.note.length > 100 ? `${node.note.substring(0, 100)}...` : node.note}
        </div>
      )}
      
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => data.onAddConnectedResource?.(node.id)}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          title="Add resource that answers this question"
        >
          + Resource
        </button>
        <button
          type="button"
          onClick={() => data.onDeleteNode?.(node.id)}
          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          title="Delete this question"
        >
          Delete
        </button>
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export const nodeTypes = {
  resource: ResourceNodeComponent,
  question: QuestionNodeComponent,
};