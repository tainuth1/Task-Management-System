export interface RegisterValues {
  email: string;
  password: string;
  confirm_password: string;
  username: string;
}

export interface LoginValues {
  email: string;
  password: string;
}

type Category =
  | "Personal"
  | "Agent"
  | "Client"
  | "Design"
  | "Research"
  | "Planning"
  | "Content";

export type Task = {
  id?: string;
  user_id?: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  category: Category;
  status?: "Todo" | "In Work" | "In Progress" | "Done";
  attachment?: string;
  due_date: string;
  sub_tasks?: SubTasks[];
};

export interface SubTasks {
  id?: string;
  task_id?: string;
  title: string;
  status?: boolean;
}

export interface Comments {
  id?: string;
  task_id: string;
  user_id: string;
  content: string;
  created: string;
}
