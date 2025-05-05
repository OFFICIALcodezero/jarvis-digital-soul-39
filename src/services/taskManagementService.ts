
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  dueDate?: Date;
  createdAt: Date;
}

// In-memory storage for tasks
let tasks: Task[] = [
  {
    id: uuidv4(),
    text: "Check system updates",
    completed: false,
    priority: 'medium',
    category: 'system',
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    text: "Update security protocols",
    completed: true,
    priority: 'high',
    category: 'security',
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  }
];

// Basic CRUD operations
export const getTasks = (): Task[] => {
  return [...tasks];
};

export const getTask = (id: string): Task | undefined => {
  return tasks.find(task => task.id === id);
};

export const addTask = (text: string, options?: Partial<Omit<Task, 'id' | 'text' | 'createdAt'>>): Task => {
  const newTask: Task = {
    id: uuidv4(),
    text,
    completed: false,
    priority: options?.priority || 'medium',
    category: options?.category,
    dueDate: options?.dueDate,
    createdAt: new Date()
  };
  
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task => {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    throw new Error(`Task with id ${id} not found`);
  }
  
  tasks[index] = {
    ...tasks[index],
    ...updates
  };
  
  return tasks[index];
};

export const removeTask = (id: string): void => {
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
};

// Process command to extract task information
export const processTaskCommand = (command: string): { response: string; data?: any } => {
  const lowerCommand = command.toLowerCase();
  
  // Extract priority
  let priority: 'high' | 'medium' | 'low' = 'medium';
  if (lowerCommand.includes('urgent') || lowerCommand.includes('important') || lowerCommand.includes('high priority')) {
    priority = 'high';
  } else if (lowerCommand.includes('low priority') || lowerCommand.includes('not urgent')) {
    priority = 'low';
  }
  
  // Extract category
  let category: string | undefined = undefined;
  const categoryMatches = command.match(/category[:\s]+(\w+)/i);
  if (categoryMatches && categoryMatches[1]) {
    category = categoryMatches[1];
  }
  
  // Extract due date (simple patterns)
  let dueDate: Date | undefined = undefined;
  if (lowerCommand.includes('today')) {
    dueDate = new Date();
  } else if (lowerCommand.includes('tomorrow')) {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
  } else if (lowerCommand.includes('next week')) {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
  }
  
  // Add task
  if (lowerCommand.includes('add task') || lowerCommand.includes('create task') || lowerCommand.includes('new task')) {
    // Extract task text - simple approach
    let taskText = command.replace(/add task|create task|new task/i, '').trim();
    
    // Remove priority and category indicators
    taskText = taskText.replace(/(high|low) priority/i, '').trim();
    taskText = taskText.replace(/category[:\s]+\w+/i, '').trim();
    
    // Create the task
    const task = addTask(taskText, { priority, category, dueDate });
    
    return {
      response: `Task "${taskText}" has been added ${priority === 'high' ? 'with high priority' : ''}.`,
      data: task
    };
  }
  
  // List tasks
  else if (lowerCommand.includes('list tasks') || lowerCommand.includes('show tasks') || lowerCommand.includes('my tasks')) {
    const allTasks = getTasks();
    
    if (allTasks.length === 0) {
      return {
        response: "You don't have any tasks at the moment.",
        data: { tasks: [] }
      };
    }
    
    const pendingTasks = allTasks.filter(task => !task.completed);
    const completedTasks = allTasks.filter(task => task.completed);
    
    const response = `You have ${pendingTasks.length} pending tasks and ${completedTasks.length} completed tasks.`;
    
    return {
      response,
      data: { tasks: allTasks }
    };
  }
  
  // Mark task as completed
  else if (lowerCommand.includes('complete task') || lowerCommand.includes('mark task') || lowerCommand.includes('finish task')) {
    // For simplicity, we'll just complete the most recent task
    // In a real application, you would identify the task more precisely
    const pendingTasks = getTasks().filter(task => !task.completed);
    
    if (pendingTasks.length === 0) {
      return {
        response: "You don't have any pending tasks to complete."
      };
    }
    
    // Sort by created date, most recent first
    pendingTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const task = updateTask(pendingTasks[0].id, { completed: true });
    
    return {
      response: `I've marked the task "${task.text}" as completed.`,
      data: task
    };
  }
  
  // Delete task
  else if (lowerCommand.includes('delete task') || lowerCommand.includes('remove task')) {
    const allTasks = getTasks();
    
    if (allTasks.length === 0) {
      return {
        response: "You don't have any tasks to delete."
      };
    }
    
    // For simplicity, delete the most recent task
    allTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const taskToDelete = allTasks[0];
    removeTask(taskToDelete.id);
    
    return {
      response: `I've deleted the task "${taskToDelete.text}".`,
      data: { deletedTask: taskToDelete }
    };
  }
  
  // Fallback
  return {
    response: "I'm not sure what you want to do with your tasks. You can add, list, complete, or delete tasks."
  };
};

// Parse natural language to extract task information
export const parseTaskFromText = (text: string): { text: string; priority: 'high' | 'medium' | 'low'; category?: string; dueDate?: Date } => {
  const lowerText = text.toLowerCase();
  
  // Extract priority
  let priority: 'high' | 'medium' | 'low' = 'medium';
  if (lowerText.includes('urgent') || lowerText.includes('important') || lowerText.includes('high priority')) {
    priority = 'high';
  } else if (lowerText.includes('low priority') || lowerText.includes('not urgent')) {
    priority = 'low';
  }
  
  // Extract category
  let category: string | undefined = undefined;
  const categoryMatches = text.match(/category[:\s]+(\w+)/i);
  if (categoryMatches && categoryMatches[1]) {
    category = categoryMatches[1];
  }
  
  // Extract due date (simple patterns)
  let dueDate: Date | undefined = undefined;
  if (lowerText.includes('today')) {
    dueDate = new Date();
  } else if (lowerText.includes('tomorrow')) {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
  } else if (lowerText.includes('next week')) {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
  }
  
  // Clean up the text
  let taskText = text
    .replace(/(urgent|important|high priority|low priority|not urgent)/i, '')
    .replace(/category[:\s]+\w+/i, '')
    .replace(/(today|tomorrow|next week)/i, '')
    .trim();
  
  return {
    text: taskText,
    priority,
    category,
    dueDate
  };
};
