
import { toast } from '@/components/ui/use-toast';

export interface CalendarEvent {
  title: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
}

export interface TimeZoneInfo {
  city: string;
  timezone: string;
  currentTime: string;
  offset: string;
}

// Mock calendar events
const mockCalendarEvents: CalendarEvent[] = [
  {
    title: "Team Meeting",
    date: new Date().toLocaleDateString(),
    time: "10:00 AM",
    location: "Conference Room A",
    description: "Weekly team sync meeting"
  },
  {
    title: "Project Deadline",
    date: new Date().toLocaleDateString(),
    time: "5:00 PM",
    description: "Submit final version of the Jarvis project"
  },
  {
    title: "Lunch with Alex",
    date: new Date(Date.now() + 86400000).toLocaleDateString(), // Tomorrow
    time: "12:30 PM",
    location: "Bistro on Main",
    description: "Discuss collaboration opportunities"
  }
];

// Function to get current time
export const getCurrentTime = (timezone?: string): string => {
  try {
    const options: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true
    };
    
    if (timezone) {
      options.timeZone = timezone;
    }
    
    return new Date().toLocaleTimeString('en-US', options);
  } catch (error) {
    console.error('Error getting current time:', error);
    return new Date().toLocaleTimeString('en-US');
  }
};

// Function to get current date
export const getCurrentDate = (): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date().toLocaleDateString('en-US', options);
};

// Function to get time in a specific city
export const getTimeInCity = (city: string): TimeZoneInfo => {
  // Map of cities to timezones
  const cityTimezoneMap: {[key: string]: string} = {
    'new york': 'America/New_York',
    'los angeles': 'America/Los_Angeles',
    'chicago': 'America/Chicago',
    'london': 'Europe/London',
    'paris': 'Europe/Paris',
    'tokyo': 'Asia/Tokyo',
    'sydney': 'Australia/Sydney',
    'beijing': 'Asia/Shanghai',
    'dubai': 'Asia/Dubai',
    'moscow': 'Europe/Moscow'
  };
  
  const lowerCity = city.toLowerCase();
  const timezone = cityTimezoneMap[lowerCity] || 'UTC';
  
  try {
    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true,
      timeZone: timezone
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'long'
    });
    
    const parts = formatter.formatToParts(now);
    const timezonePart = parts.find(part => part.type === 'timeZoneName')?.value || timezone;
    
    // Calculate offset from UTC
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / 3600000;
    const offsetStr = `UTC${offset >= 0 ? '+' : ''}${offset}`;
    
    return {
      city: city.charAt(0).toUpperCase() + city.slice(1),
      timezone: timezonePart,
      currentTime: now.toLocaleTimeString('en-US', timeOptions),
      offset: offsetStr
    };
  } catch (error) {
    console.error(`Error getting time in ${city}:`, error);
    return {
      city: city,
      timezone: 'Unknown',
      currentTime: 'N/A',
      offset: 'N/A'
    };
  }
};

// Function to get calendar events
export const getCalendarEvents = async (date?: string): Promise<CalendarEvent[]> => {
  // In a real app, you would fetch from a calendar API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (date) {
        const formattedDate = new Date(date).toLocaleDateString();
        const filteredEvents = mockCalendarEvents.filter(event => event.date === formattedDate);
        resolve(filteredEvents);
      } else {
        // Default to today's events
        const today = new Date().toLocaleDateString();
        const todaysEvents = mockCalendarEvents.filter(event => event.date === today);
        resolve(todaysEvents);
      }
    }, 500);
  });
};

export const parseTimeQuery = (query: string): { city?: string, date?: string } => {
  const result: { city?: string, date?: string } = {};
  
  // Check for city in time queries
  const cityMatches = query.match(/(?:in|at)\s+([a-zA-Z\s]+)(?:\?|$)/i);
  if (cityMatches && cityMatches[1]) {
    result.city = cityMatches[1].trim();
  }
  
  // Check for date in calendar queries
  if (query.includes("tomorrow")) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    result.date = tomorrow.toISOString();
  } else if (query.includes("today") || query.includes("schedule")) {
    result.date = new Date().toISOString();
  }
  
  return result;
};

export const getTimeCalendarResponse = async (query: string): Promise<{text: string, data?: any}> => {
  try {
    const parsedQuery = parseTimeQuery(query);
    let responseText = "";
    let data = null;
    
    // Handle time queries
    if (query.toLowerCase().includes("time")) {
      if (parsedQuery.city) {
        const timeInfo = getTimeInCity(parsedQuery.city);
        responseText = `The current time in ${timeInfo.city} is ${timeInfo.currentTime} (${timeInfo.timezone}, ${timeInfo.offset}).`;
        data = timeInfo;
      } else {
        const currentTime = getCurrentTime();
        responseText = `The current time is ${currentTime}.`;
        data = { currentTime };
      }
    } 
    // Handle date queries
    else if (query.toLowerCase().includes("date") || query.toLowerCase().includes("today")) {
      const currentDate = getCurrentDate();
      responseText = `Today is ${currentDate}.`;
      data = { currentDate };
    } 
    // Handle calendar/schedule queries
    else if (query.toLowerCase().includes("schedule") || query.toLowerCase().includes("calendar") || query.toLowerCase().includes("events")) {
      const events = await getCalendarEvents(parsedQuery.date);
      
      if (events.length === 0) {
        responseText = parsedQuery.date && parsedQuery.date !== new Date().toISOString() 
          ? "You have no events scheduled for that day." 
          : "You have no events scheduled for today.";
      } else {
        responseText = parsedQuery.date && parsedQuery.date !== new Date().toISOString()
          ? `Here are your scheduled events for that day: `
          : `Here are your scheduled events for today: `;
          
        events.forEach((event, index) => {
          responseText += `${index + 1}. ${event.title} at ${event.time}`;
          if (event.location) responseText += ` at ${event.location}`;
          responseText += ". ";
        });
      }
      
      data = { events };
    }
    
    return { text: responseText, data };
  } catch (error) {
    console.error('Error processing time/calendar query:', error);
    return { 
      text: "I'm sorry, I couldn't process that request at this time.", 
    };
  }
};
