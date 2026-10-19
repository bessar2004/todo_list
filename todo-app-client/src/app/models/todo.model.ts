
export enum TodoStatus{
Todo=0,
InProgress=1,
Completed=2
}


export enum TodoPriority{
  Low=0,
  Medium=1,
  High=2
}


// Backend'den dönen görev modeli
export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
}

// CreateTodo model interface
export interface CreateTodo {
  title: string;
  description?: string;
  dueDate?: string;
  status:TodoStatus,
  priority:TodoPriority;
}


// UpdateTodo model interface
export interface UpdateTodo {
  title: string;
  description?: string;
  status: TodoStatus; // burada status ekledim 
  priority: TodoPriority; // burada priority ekledim 
  dueDate?: string;
}











