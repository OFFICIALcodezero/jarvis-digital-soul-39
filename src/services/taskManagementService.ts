
export interface Task {
  id: string;
  text: string;
  timestamp: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

interface TaskResponse {
  response: string;
  data?: {
    task?: string;
    dueDate?: Date;
    priority?: 'low' | 'medium' | 'high';
    action?: 'add' | 'remove' | 'complete' | 'list';
  };
}

// Persistent task storage using localStorage
export const getTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem('jarvis_tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    return [];
  }
};

const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem('jarvis_tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

// Add task function to export
export const addTask = (text: string, priority: 'low' | 'medium' | 'high' = 'medium', dueDate?: Date): Task => {
  const newTask: Task = {
    id: Date.now().toString(),
    text,
    timestamp: new Date(),
    completed: false,
    priority,
    dueDate
  };
  
  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  
  return newTask;
};

// Update task function to export
export const updateTask = (id: string, updates: Partial<Task>): Task => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    saveTasks(tasks);
    return tasks[taskIndex];
  }
  
  throw new Error(`Task with ID ${id} not found`);
};

// Remove task function to export
export const removeTask = (id: string): void => {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => task.id !== id);
  saveTasks(updatedTasks);
};

// Extract task details from a voice/text command
export const parseTaskFromText = (text: string): { 
  taskText: string; 
  dueDate?: Date; 
  priority: 'low' | 'medium' | 'high';
} => {
  const lowerText = text.toLowerCase();
  
  // Try to extract task text
  let taskText = text;
  
  // Remove common prefixes
  taskText = taskText.replace(/(add|create|set|make|new)\s+(a\s+)?(task|reminder|to-do|todo)(\s+to)?(:|\s+for)?/i, '').trim();
  taskText = taskText.replace(/remind\s+me\s+to/i, '').trim();
  
  // Extract priority
  let priority: 'low' | 'medium' | 'high' = 'medium';
  
  if (lowerText.includes('urgent') || lowerText.includes('important') || lowerText.includes('high priority')) {
    priority = 'high';
  } else if (lowerText.includes('low priority') || lowerText.includes('when you can') || lowerText.includes('not important')) {
    priority = 'low';
  }
  
  // Extract due date
  let dueDate: Date | undefined = undefined;
  
  // Check for date patterns
  const todayPattern = /(today|tonight|this evening)/i;
  const tomorrowPattern = /(tomorrow|next day)/i;
  const weekdayPattern = /(on|this|next)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i;
  const datePattern = /(on|by)\s+(\d{1,2})(st|nd|rd|th)?\s+(of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)/i;
  
  if (todayPattern.test(lowerText)) {
    dueDate = new Date();
  } else if (tomorrowPattern.test(lowerText)) {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
  } else if (weekdayPattern.test(lowerText)) {
    const match = lowerText.match(weekdayPattern);
    if (match) {
      const weekdayStr = match[2].toLowerCase();
      const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = weekdays.indexOf(weekdayStr);
      
      if (targetDay !== -1) {
        const today = new Date();
        const currentDay = today.getDay();
        let daysToAdd = targetDay - currentDay;
        
        // If the day has already passed this week or it's "next", add days to get to next week
        if (daysToAdd <= 0 || match[1].toLowerCase() === 'next') {
          daysToAdd += 7;
        }
        
        dueDate = new Date();
        dueDate.setDate(today.getDate() + daysToAdd);
      }
    }
  }
  
  return {
    taskText,
    dueDate,
    priority
  };
};

export const processTaskCommand = (command: string): TaskResponse => {
  const lowerCommand = command.toLowerCase();
  
  try {
    // Handle listing tasks
    if (lowerCommand.includes('show tasks') || 
        lowerCommand.includes('list tasks') || 
        lowerCommand.includes('show to do') || 
        lowerCommand.includes('what are my tasks')) {
      
      const tasks = getTasks();
      
      if (tasks.length === 0) {
        return {
          response: "You don't have any tasks at the moment.",
          data: { action: 'list' }
        };
      }
      
      const incompleteTasks = tasks.filter(task => !task.completed);
      
      if (incompleteTasks.length === 0) {
        return {
          response: "All your tasks are completed. Great job!",
          data: { action: 'list' }
        };
      }
      
      let response = "Here are your current tasks:\n";
      
      incompleteTasks.forEach((task, index) => {
        response += `${index + 1}. ${task.text}`;
        
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          response += ` (due ${dueDate.toLocaleDateString()})`;
        }
        
        if (task.priority === 'high') {
          response += " (High priority)";
        }
        
        response += "\n";
      });
      
      return {
        response,
        data: { action: 'list' }
      };
    }
    
    // Handle completing tasks
    if (lowerCommand.includes('complete task') || 
        lowerCommand.includes('mark task as complete') || 
        lowerCommand.includes('finished task')) {
      
      // Try to extract task number or name
      let taskIdentifier;
      
      const numberMatch = command.match(/task\s+(\d+)/i);
      if (numberMatch) {
        const taskNumber = parseInt(numberMatch[1]) - 1;
        const tasks = getTasks();
        
        if (taskNumber >= 0 && taskNumber < tasks.length) {
          tasks[taskNumber].completed = true;
          saveTasks(tasks);
          
          return {
            response: `Task "${tasks[taskNumber].text}" marked as completed.`,
            data: { 
              action: 'complete',
              task: tasks[taskNumber].text
            }
          };
        }
      }
      
      // If no number found, try to match by task text
      const textMatch = command.match(/task\s+(.*)/i);
      if (textMatch) {
        const taskText = textMatch[1];
        const tasks = getTasks();
        
        const taskIndex = tasks.findIndex(task => 
          task.text.toLowerCase().includes(taskText.toLowerCase())
        );
        
        if (taskIndex !== -1) {
          tasks[taskIndex].completed = true;
          saveTasks(tasks);
          
          return {
            response: `Task "${tasks[taskIndex].text}" marked as completed.`,
            data: { 
              action: 'complete',
              task: tasks[taskIndex].text
            }
          };
        }
      }
      
      return {
        response: "I couldn't find the task you're referring to.",
        data: { action: 'complete' }
      };
    }
    
    // Handle removing tasks
    if (lowerCommand.includes('remove task') || 
        lowerCommand.includes('delete task')) {
      
      // Try to extract task number or name
      let taskIdentifier;
      
      const numberMatch = command.match(/task\s+(\d+)/i);
      if (numberMatch) {
        const taskNumber = parseInt(numberMatch[1]) - 1;
        const tasks = getTasks();
        
        if (taskNumber >= 0 && taskNumber < tasks.length) {
          const removedTask = tasks[taskNumber];
          tasks.splice(taskNumber, 1);
          saveTasks(tasks);
          
          return {
            response: `Task "${removedTask.text}" has been removed.`,
            data: { 
              action: 'remove',
              task: removedTask.text
            }
          };
        }
      }
      
      // If no number found, try to match by task text
      const textMatch = command.match(/task\s+(.*)/i);
      if (textMatch) {
        const taskText = textMatch[1];
        const tasks = getTasks();
        
        const taskIndex = tasks.findIndex(task => 
          task.text.toLowerCase().includes(taskText.toLowerCase())
        );
        
        if (taskIndex !== -1) {
          const removedTask = tasks[taskIndex];
          tasks.splice(taskIndex, 1);
          saveTasks(tasks);
          
          return {
            response: `Task "${removedTask.text}" has been removed.`,
            data: { 
              action: 'remove',
              task: removedTask.text
            }
          };
        }
      }
      
      return {
        response: "I couldn't find the task you're referring to.",
        data: { action: 'remove' }
      };
    }
    
    // Default: Add a new task
    const { taskText, dueDate, priority } = parseTaskFromText(command);
    
    if (taskText) {
      const tasks = getTasks();
      
      const newTask: Task = {
        id: Date.now().toString(),
        text: taskText,
        timestamp: new Date(),
        completed: false,
        priority,
        dueDate
      };
      
      tasks.push(newTask);
      saveTasks(tasks);
      
      let response = `I've added "${taskText}" to your task list.`;
      
      if (dueDate) {
        response += ` It's due on ${dueDate.toLocaleDateString()}.`;
      }
      
      if (priority === 'high') {
        response += " I've marked it as high priority.";
      } else if (priority === 'low') {
        response += " I've marked it as low priority.";
      }
      
      return {
        response,
        data: {
          action: 'add',
          task: taskText,
          dueDate,
          priority
        }
      };
    }
    
    return {
      response: "I couldn't understand what task to add. Please try again."
    };
    
  } catch (error) {
    console.error('Error processing task command:', error);
    return {
      response: "Sorry, I encountered an error processing your task request."
    };
  }
};
