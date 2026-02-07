import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useEvents } from '../../contexts/EventContext';
import { Event, User } from '../../types/interfaces';
import { EventType } from '../../types/enums';
import { dataService } from '../../services/dataService';
import './UserJourney.css';

const UserJourney: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { events } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, events]);

  const loadUserData = () => {
    if (!userId) return;

    // Find user
    const allUsers = dataService.getAllUsers();
    const foundUser = allUsers.find(u => u.id === userId);
    setUser(foundUser || null);

    // Get user's events
    const filteredEvents = events.filter(e => e.userId === userId);
    const sortedEvents = filteredEvents.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    setUserEvents(sortedEvents);

    // Generate nodes and edges
    generateFlowElements(sortedEvents);
  };

  const generateFlowElements = (eventList: Event[]) => {
    if (eventList.length === 0) return;

    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];

    const verticalSpacing = 120;
    const horizontalSpacing = 300;
    let currentY = 50;

    eventList.forEach((event, index) => {
      const nodeColor = getNodeColor(event.eventType);
      const x = (index % 2 === 0) ? 100 : 100 + horizontalSpacing;

      flowNodes.push({
        id: event.id,
        type: 'default',
        position: { x, y: currentY },
        data: {
          label: (
            <div className="flow-node-content">
              <div className="flow-node-icon">{getEventIcon(event.eventType)}</div>
              <div className="flow-node-title">
                {event.eventType.replace(/_/g, ' ')}
              </div>
              <div className="flow-node-time">
                {new Date(event.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ),
        },
        style: {
          background: nodeColor,
          color: 'white',
          border: '2px solid #fff',
          borderRadius: '12px',
          padding: '15px',
          minWidth: '200px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      });

      if (index > 0) {
        flowEdges.push({
          id: `edge-${eventList[index - 1].id}-${event.id}`,
          source: eventList[index - 1].id,
          target: event.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#4facfe', strokeWidth: 3 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#4facfe',
          },
        });
      }

      currentY += verticalSpacing;
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  };

  const getNodeColor = (eventType: EventType): string => {
    const colors: Record<string, string> = {
      [EventType.LOGIN]: '#28a745',
      [EventType.LOGOUT]: '#6c757d',
      [EventType.BROWSE_PRODUCTS]: '#4facfe',
      [EventType.VIEW_PRODUCT_DETAILS]: '#667eea',
      [EventType.ADD_TO_CART]: '#f093fb',
      [EventType.REMOVE_FROM_CART]: '#dc3545',
      [EventType.PROCEED_TO_CHECKOUT]: '#ffc107',
      [EventType.COMPLETE_PURCHASE]: '#28a745',
      [EventType.CREATE_PRODUCT]: '#17a2b8',
      [EventType.EDIT_PRODUCT]: '#ffc107',
      [EventType.DELETE_PRODUCT]: '#dc3545',
      [EventType.VIEW_SELLER_DASHBOARD]: '#f5576c',
      [EventType.VIEW_ADMIN_DASHBOARD]: '#4facfe',
      [EventType.VIEW_USER_JOURNEY]: '#667eea',
    };
    return colors[eventType] || '#6c757d';
  };

  const getEventIcon = (eventType: EventType): string => {
    const icons: Record<string, string> = {
      [EventType.LOGIN]: '🔐',
      [EventType.LOGOUT]: '🚪',
      [EventType.BROWSE_PRODUCTS]: '👀',
      [EventType.VIEW_PRODUCT_DETAILS]: '🔍',
      [EventType.ADD_TO_CART]: '🛒',
      [EventType.REMOVE_FROM_CART]: '❌',
      [EventType.PROCEED_TO_CHECKOUT]: '💳',
      [EventType.COMPLETE_PURCHASE]: '✅',
      [EventType.CREATE_PRODUCT]: '➕',
      [EventType.EDIT_PRODUCT]: '✏️',
      [EventType.DELETE_PRODUCT]: '🗑️',
      [EventType.VIEW_SELLER_DASHBOARD]: '📦',
      [EventType.VIEW_ADMIN_DASHBOARD]: '📊',
      [EventType.VIEW_USER_JOURNEY]: '🗺️',
    };
    return icons[eventType] || '📌';
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const clickedEvent = userEvents.find(e => e.id === node.id);
    setSelectedEvent(clickedEvent || null);
  }, [userEvents]);

  if (!user) {
    return (
      <div className="journey-container">
        <div className="journey-error">User not found</div>
      </div>
    );
  }

  return (
    <div className="journey-container">
      <div className="journey-header">
        <button onClick={() => navigate('/admin')} className="back-button">
          ← Back to Admin Dashboard
        </button>
        <div className="journey-user-info">
          <h1>User Journey: {user.name}</h1>
          <p className="journey-subtitle">
            {user.email} • {user.role} • {userEvents.length} events tracked
          </p>
        </div>
      </div>

      <div className="journey-content">
        {userEvents.length === 0 ? (
          <div className="no-journey">
            <div className="no-journey-icon">🗺️</div>
            <h2>No Journey Data</h2>
            <p>This user hasn't performed any tracked actions yet.</p>
          </div>
        ) : (
          <div className="flow-wrapper">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              fitView
              attributionPosition="bottom-left"
            >
              <Background color="#aaa" gap={16} />
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  const event = userEvents.find(e => e.id === node.id);
                  return event ? getNodeColor(event.eventType) : '#666';
                }}
                maskColor="rgba(0, 0, 0, 0.1)"
              />
            </ReactFlow>
          </div>
        )}

        {selectedEvent && (
          <div className="event-detail-panel">
            <div className="panel-header">
              <h3>Event Details</h3>
              <button onClick={() => setSelectedEvent(null)} className="close-btn">
                ✕
              </button>
            </div>
            <div className="panel-content">
              <div className="detail-row">
                <span className="detail-label">Event Type:</span>
                <span className="detail-value">
                  {selectedEvent.eventType.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Timestamp:</span>
                <span className="detail-value">
                  {new Date(selectedEvent.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">User:</span>
                <span className="detail-value">{selectedEvent.userName}</span>
              </div>
              {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Metadata:</span>
                  <pre className="metadata-pre">
                    {JSON.stringify(selectedEvent.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserJourney;
