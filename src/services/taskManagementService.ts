
// Task management service to handle reminders and tasks

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  title: string;
  time: Date;
  completed: boolean;
}

// In-memory storage for tasks and reminders
// In a production app, this would be persisted to localStorage or a backend
let tasks: Task[] = [];
let reminders: Reminder[] = [];

// Task management functions
export const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>): Task => {
  const newTask: Task = {
    id: Date.now().toString(),
    ...taskData,
    completed: false,
    createdAt: new Date()
  };
  
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null => {
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) return null;
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates
  };
  
  return tasks[taskIndex];
};

export const deleteTask = (id: string): boolean => {
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  return tasks.length !== initialLength;
};

export const getTasks = (filterCompleted?: boolean): Task[] => {
  if (filterCompleted === undefined) return tasks;
  return tasks.filter(task => task.completed === filterCompleted);
};

export const getTaskById = (id: string): Task | undefined => {
  return tasks.find(task => task.id === id);
};

// Reminder management functions
export const addReminder = (reminderData: Omit<Reminder, 'id' | 'completed'>): Reminder => {
  const newReminder: Reminder = {
    id: Date.now().toString(),
    ...reminderData,
    completed: false
  };
  
  reminders.push(newReminder);
  return newReminder;
};

export const updateReminder = (id: string, updates: Partial<Omit<Reminder, 'id'>>): Reminder | null => {
  const reminderIndex = reminders.findIndex(reminder => reminder.id === id);
  
  if (reminderIndex === -1) return null;
  
  reminders[reminderIndex] = {
    ...reminders[reminderIndex],
    ...updates
  };
  
  return reminders[reminderIndex];
};

export const deleteReminder = (id: string): boolean => {
  const initialLength = reminders.length;
  reminders = reminders.filter(reminder => reminder.id !== id);
  return reminders.length !== initialLength;
};

export const getReminders = (filterCompleted?: boolean): Reminder[] => {
  if (filterCompleted === undefined) return reminders;
  return reminders.filter(reminder => reminder.completed === filterCompleted);
};

export const getReminderById = (id: string): Reminder | undefined => {
  return reminders.find(reminder => reminder.id === id);
};

// Extract task-related information from user input
export const extractTaskFromText = (text: string): Partial<Task> | null => {
  // Simple regex-based extraction
  const priorityMatch = text.match(/\b(high|medium|low)(?:\s+priority)?\b/i);
  const dateMatch = text.match(/\b(today|tomorrow|next week|on\s+\w+)\b/i);
  
  // Try to extract the task title - everything after "add task" or "create task" or "remind me to"
  let titleMatch = text.match(/(?:add|create)\s+(?:a\s+)?task\s+(?:to\s+)?(.*?)(?:\s+with|\s+on|\s+by|\s+at|\s+priority|\s+due|\.|$)/i);
  
  if (!titleMatch) {
    titleMatch = text.match(/remind\s+me\s+to\s+(.*?)(?:\s+on|\s+at|\s+by|\.|$)/i);
  }
  
  if (!titleMatch) return null;
  
  const title = titleMatch[1].trim();
  
  // Calculate due date if present
  let dueDate: Date | undefined = undefined;
  if (dateMatch) {
    const dateStr = dateMatch[1].toLowerCase();
    const now = new Date();
    
    if (dateStr === 'today') {
      dueDate = new Date(now);
    } else if (dateStr === 'tomorrow') {
      dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 1);
    } else if (dateStr === 'next week') {
      dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 7);
    }
    // Additional date parsing logic could be added here
  }
  
  // Parse priority
  let priority: 'low' | 'medium' | 'high' = 'medium';
  if (priorityMatch) {
    const priorityStr = priorityMatch[1].toLowerCase();
    priority = priorityStr as 'low' | 'medium' | 'high';
  }
  
  return {
    title,
    priority,
    dueDate
  };
};

// Natural language processing for task commands
export const processTaskCommand = (command: string): { 
  response: string; 
  action?: 'add' | 'list' | 'update' | 'delete';
  data?: any;
} => {
  const lowerCommand = command.toLowerCase();
  
  // Add task
  if (lowerCommand.includes('add task') || 
      lowerCommand.includes('create task') || 
      lowerCommand.includes('remind me to')) {
    
    const taskData = extractTaskFromText(command);
    
    if (taskData && taskData.title) {
      const task = addTask({
        title: taskData.title,
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate,
        description: ''
      });
      
      let response = `I've added your task: "${task.title}"`;
      if (task.dueDate) {
        response += ` due on ${task.dueDate.toLocaleDateString()}`;
      }
      
      return {
        response,
        action: 'add',
        data: task
      };
    }
  }
  
  // List tasks
  if (lowerCommand.includes('list tasks') || 
      lowerCommand.includes('show tasks') || 
      lowerCommand.includes('view tasks') ||
      lowerCommand.includes('what are my tasks') ||
      lowerCommand.match(/tasks?\s+for\s+today/)) {
    
    const pendingTasks = getTasks(false).filter(t => !t.completed);
    
    if (pendingTasks.length === 0) {
      return {
        response: "You don't have any pending tasks.",
        action: 'list',
        data: []
      };
    }
    
    const taskList = pendingTasks.map(t => `• ${t.title}${t.dueDate ? ` (due ${t.dueDate.toLocaleDateString()})` : ''}`).join('\n');
    
    return {
      response: `Here are your pending tasks:\n${taskList}`,
      action: 'list',
      data: pendingTasks
    };
  }
  
  // Mark task as complete
  if (lowerCommand.includes('complete task') || 
      lowerCommand.includes('mark task') || 
      lowerCommand.includes('finish task')) {
    
    // This would need more sophisticated NLP to extract which task to complete
    return {
      response: "I'll need you to specify which task you'd like to mark as complete.",
      action: 'update'
    };
  }
  
  // Default response
  return {
    response: "I'm not sure what you want to do with your tasks. You can say things like 'add task', 'list tasks', or 'complete task'."
  };
};
