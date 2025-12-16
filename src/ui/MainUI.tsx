'use client'

import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  MarkerType,
  useReactFlow,
  NodeDragHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/config/firebase";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { AppNode, ResourceNode, QuestionNode } from "@/types";
import ResourceNodeForm from "./ResourceNodeForm";
import QuestionNodeForm from "./QuestionNodeForm";
import { nodeTypes } from "./CustomNodes";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showForm, setShowForm] = useState<"resource" | "question" | null>(null);
  const [connectedNodeId, setConnectedNodeId] = useState<string | null>(null);
  const [appNodes, setAppNodes] = useState<AppNode[]>([]);
  const { getNodes } = useReactFlow();

  useEffect(() => {
    const unsubscribeNodes = onSnapshot(collection(db, "nodes"), (snapshot) => {
      console.log(nodes)
      const firebaseNodes = snapshot.docs.map((doc) => doc.data() as AppNode);
      setAppNodes(firebaseNodes);
      
      // Convert AppNodes to ReactFlow nodes
      const reactFlowNodes: Node[] = firebaseNodes.map((appNode) => {
        // Use saved position from Firebase, fallback to existing position, then random position
        const existingNode = nodes.find(n => n.id === appNode.id);
        const position = appNode.position || 
                        (existingNode ? existingNode.position : { x: Math.random() * 400, y: Math.random() * 400 });
        
        return {
          id: appNode.id,
          data: { 
            appNode,
            onAddConnectedQuestion: handleAddConnectedQuestion,
            onAddConnectedResource: handleAddConnectedResource,
            onDeleteNode: handleDeleteNode,
            onUpdateAnsweredLevel: handleUpdateAnsweredLevel,
          },
          position,
          type: appNode.nodeType,
        };
      });
      setNodes(reactFlowNodes);
    });

    const unsubscribeEdges = onSnapshot(collection(db, "edges"), (snapshot) => {
      const firebaseEdges = snapshot.docs.map((doc) => doc.data() as Edge);
      setEdges(firebaseEdges);
    });

    return () => {
      unsubscribeNodes();
      unsubscribeEdges();
    };
  }, []);

  const handleAddResourceNode = async (resourceData: Omit<ResourceNode, 'id'>) => {
    const newNode: ResourceNode = {
      id: uuidv4(),
      ...resourceData,
    };
    await setDoc(doc(db, "nodes", newNode.id), newNode);
    
    // If this is being created connected to a question node, create the edge
    if (connectedNodeId) {
      const newEdge: Edge = {
        id: uuidv4(),
        source: newNode.id,
        target: connectedNodeId,
        type: 'default',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      };
      await setDoc(doc(db, "edges", newEdge.id), newEdge);
      setConnectedNodeId(null);
    }
    
    setShowForm(null);
  };

  const handleAddQuestionNode = async (questionData: Omit<QuestionNode, 'id'>) => {
    const newNode: QuestionNode = {
      id: uuidv4(),
      ...questionData,
    };
    await setDoc(doc(db, "nodes", newNode.id), newNode);
    
    // If this is being created connected to a resource node, create the edge
    if (connectedNodeId) {
      const newEdge: Edge = {
        id: uuidv4(),
        source: connectedNodeId,
        target: newNode.id,
        type: 'default',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      };
      await setDoc(doc(db, "edges", newEdge.id), newEdge);
      setConnectedNodeId(null);
    }
    
    setShowForm(null);
  };

  const handleAddConnectedQuestion = (resourceId: string) => {
    setConnectedNodeId(resourceId);
    setShowForm("question");
  };

  const handleAddConnectedResource = (questionId: string) => {
    setConnectedNodeId(questionId);
    setShowForm("resource");
  };

  const handleDeleteNode = async (nodeId: string) => {
    // Delete the node
    await deleteDoc(doc(db, "nodes", nodeId));
    
    // Delete all edges connected to this node
    const edgesToDelete = edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
    for (const edge of edgesToDelete) {
      await deleteDoc(doc(db, "edges", edge.id));
    }
  };

  const handleUpdateAnsweredLevel = async (nodeId: string, level: number) => {
    // Find the node and update its answered level
    const nodeToUpdate = appNodes.find(node => node.id === nodeId);
    if (nodeToUpdate && nodeToUpdate.nodeType === 'question') {
      const updatedNode = { ...nodeToUpdate, answeredLevel: level };
      await setDoc(doc(db, "nodes", nodeId), updatedNode);
    }
  };

  const handleConnect = async (params: Edge | Connection) => {
    const newEdge: Edge = { 
      ...params, 
      id: uuidv4(),
      type: 'default',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
    } as Edge;
    await setDoc(doc(db, "edges", newEdge.id), newEdge);
  };

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      console.log('deletion key pressed')
      const allNodes = getNodes();
      console.log('all nodes:', allNodes.map(n => ({ id: n.id, selected: n.selected })));
      const selectedNodes = allNodes.filter(node => node.selected);
      console.log('selected nodes:', selectedNodes.length);
      if (selectedNodes.length > 0) {
        selectedNodes.forEach(node => {
          console.log('deleting node:', node.id)
          handleDeleteNode(node.id);
        });
      }
    }
  }, [getNodes, handleDeleteNode]);

  const handleNodeDragStop: NodeDragHandler = useCallback(async (_, node) => {
    // Find the corresponding AppNode and update its position in Firebase
    const appNode = appNodes.find(n => n.id === node.id);
    if (appNode) {
      const updatedNode = { 
        ...appNode, 
        position: { x: node.position.x, y: node.position.y } 
      };
      await setDoc(doc(db, "nodes", node.id), updatedNode);
    }
  }, [appNodes]);

  return (
    <div className="h-screen text-[var(--foreground)] bg-[var(--background)]">
      <div className="p-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setShowForm("resource")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Resource Node
          </button>
          <button
            type="button"
            onClick={() => setShowForm("question")}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            Add Question Node
          </button>
        </div>
        {showForm && (
          <div className="fixed inset-0 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-auto z-30">
            <div className="w-full max-w-2xl mt-10">
              {showForm === "resource" && (
                <ResourceNodeForm
                  onSubmit={handleAddResourceNode}
                  onCancel={() => {
                    setShowForm(null);
                    setConnectedNodeId(null);
                  }}
                  title={connectedNodeId ? "Add Resource (will connect to question)" : "Add Resource Node"}
                  connectedQuestion={connectedNodeId ? appNodes.find(node => node.id === connectedNodeId && node.nodeType === 'question') as QuestionNode : undefined}
                />
              )}

              {showForm === "question" && (
                <QuestionNodeForm
                  onSubmit={handleAddQuestionNode}
                  onCancel={() => {
                    setShowForm(null);
                    setConnectedNodeId(null);
                  }}
                  title={connectedNodeId ? "Add Question (will connect from resource)" : "Add Question Node"}
                />
              )}
            </div>
          </div>
        )}
        
        
      </div>
      
      <div tabIndex={0} onKeyDown={handleKeyDown} className="h-full mt-10 outline-none">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onNodeDragStop={handleNodeDragStop}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{
            type: 'default',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
          }}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function MainUI() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
}
