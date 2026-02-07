import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, EventContextType } from '../types/interfaces';
import { EventType } from '../types/enums';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: React.ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      // Convert timestamp strings back to Date objects
      const eventsWithDates = parsedEvents.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      }));
      setEvents(eventsWithDates);
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  const trackEvent = (eventType: EventType, metadata?: Record<string, any>) => {
    if (!user) return;

    const newEvent: Event = {
      id: uuidv4(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      eventType,
      timestamp: new Date(),
      metadata,
    };

    setEvents(prev => [...prev, newEvent]);
    console.log('Event tracked:', newEvent);
  };

  const getUserEvents = (userId: string): Event[] => {
    return events.filter(event => event.userId === userId);
  };

  const clearEvents = () => {
    setEvents([]);
    localStorage.removeItem('events');
  };

  const value: EventContextType = {
    events,
    trackEvent,
    getUserEvents,
    clearEvents,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
