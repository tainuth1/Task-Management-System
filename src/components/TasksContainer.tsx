import { ReactNode, useState } from "react";
import { Task } from "../models/AuthModels";
import TaskCard from "./TaskCard";
import Alert from "./Alert";
import TaskCardLoadingSkeloton from "./skeloton/TaskCardLoadingSkeloton";

type TasksContainerProps = {
  title: string;
  lineColor: string;
  tasks: Task[];
  children?: ReactNode;
  isLoading: boolean;
};

const TasksContainer = ({
  title,
  lineColor,
  tasks,
  children,
  isLoading = false,
}: TasksContainerProps) => {
  const [deleteError, setDeleteError] = useState<string>("");
  return (
    <div className="w-full active:cursor-grab cursor-pointer">
      {deleteError === "success" ? (
        <Alert
          type="success"
          title="Delete Task Successfully"
          message="Your task has been deleted"
        />
      ) : deleteError === "error" ? (
        <Alert
          type="error"
          title="Failed to Delete Task"
          message="Something went wrong while delete the task."
        />
      ) : deleteError === "warning" ? (
        <Alert
          type="warning"
          title="Something Went Wrong"
          message="Failed to delete a subtask."
        />
      ) : null}
      <div className="w-full">
        <div className="">
          <h2 className="text-regular font-semibold flex items-center gap-3">
            {title.toUpperCase()}
            <span className="text-sm font-normal text-second px-3 border-2 border-gray-300 rounded-full">
              {tasks.length}
            </span>
          </h2>
        </div>
        <div className={`w-full h-1 ${lineColor} rounded-full mt-3`}></div>
      </div>
      {/* Tasks Container */}
      <div className="w-full flex flex-col gap-3 max-h-[566px] sub-task-list overflow-y-auto mt-3">
        {isLoading ? (
          // Show skeleton placeholders while loading
          Array.from({ length: 1 }).map((_, index) => (
            <TaskCardLoadingSkeloton key={index} />
          ))
        ) : tasks.length > 0 ? (  
          tasks.map((task) => (
            <TaskCard
              setDeleteError={setDeleteError}
              key={task.id}
              task={task}
            />
          ))
        ) : (
          null
        )}
        {children}
      </div>
    </div>
  );
};

export default TasksContainer;
