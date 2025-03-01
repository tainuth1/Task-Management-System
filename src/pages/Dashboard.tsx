import { AnimatePresence, motion } from "framer-motion";
import TasksContainer from "../components/TasksContainer";
import { useEffect, useState } from "react";
import AddTaskForm from "../components/AddTaskForm";
import Alert from "../components/Alert";
import { supabase } from "../supabaseClient";
import { Task } from "../models/AuthModels";
import { useAuth } from "../contexts/AuthProvider";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [menuModal, setMenuModal] = useState<boolean>(false);
  const [formModal, setFormModal] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const { user } = useAuth();
  const changeModalState = () => {
    setFormModal(!formModal);
  };

  const fetchTask = async () => {
    setIsLoading(true);
    let { data: tasks, error } = await supabase
      .from("tasks")
      .select(`*,sub_tasks (*)`);
    if (error) {
      console.error(error);
    } else {
      setTasks(tasks || []);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchTask();
    // Real-time listener for tasks
    const taskChannel = supabase
      .channel("personal_tasks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log("Received Real-Time Event:", payload);
          handleTaskUpdate(payload);
        }
      )
      .subscribe();

    // Real-time listener for sub_task
    const subTaskChannel = supabase
      .channel("personal_subtasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sub_tasks" },
        (payload) => {
          console.log("Subtask Updated:", payload); // log payload data
          handleSubTaskUpdate(payload);
        }
      )
      .subscribe();

    // Cleanup listeners on unmount prevent from memory leak.
    return () => {
      supabase.removeChannel(taskChannel);
      supabase.removeChannel(subTaskChannel);
    };
  }, []);

  const handleTaskUpdate = (payload: any) => {
    setTasks((prevTasks) => {
      if (payload.eventType === "INSERT") {
        return [...prevTasks, { ...payload.new, sub_tasks: [] }]; // Add new task
      }
      if (payload.eventType === "UPDATE") {
        return prevTasks.map((task) =>
          task.id === payload.new.id
            ? { ...payload.new, sub_tasks: task.sub_tasks }
            : task
        ); // Update task
      }
      if (payload.eventType === "DELETE") {
        console.log("Removing Task:", payload.old.id);
        return prevTasks.filter((task) => task.id !== payload.old.id); // Remove task
      }
      return prevTasks;
    });
  };
  const handleSubTaskUpdate = (payload: any) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === payload.new.task_id) {
          if (payload.eventType === "INSERT") {
            return {
              ...task,
              sub_tasks: [...(task.sub_tasks || []), payload.new],
            };
          }
          if (payload.eventType === "UPDATE") {
            return {
              ...task,
              sub_tasks: task.sub_tasks?.map((sub) =>
                sub.id === payload.new.id ? payload.new : sub
              ),
            };
          }
          if (payload.eventType === "DELETE") {
            return {
              ...task,
              sub_tasks: task.sub_tasks?.filter(
                (sub) => sub.id !== payload.old.id
              ),
            };
          }
        }
        return task;
      });
    });
  };

  const filterTask = (status: string) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className="w-full">
      {submitError === "success" ? (
        <Alert
          type="success"
          title="Task Created Successfully"
          message="Your task has been created. You can now proceed to complete it."
        />
      ) : submitError === "error" ? (
        <Alert
          type="error"
          title="Failed to Create Task"
          message="Something went wrong while creating the task."
        />
      ) : submitError === "warning" ? (
        <Alert
          type="warning"
          title="Something Went Wrong"
          message="Failed to create a subtask."
        />
      ) : null}
      <AnimatePresence>
        {formModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={changeModalState}
            className="fixed w-full left-0 top-0 h-[100vh] bg-[#00000030] z-10"
          >
            <div className="w-full h-full flex justify-center items-center z-20">
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-[600px] h-[650px]"
              >
                <AddTaskForm
                  setFormModal={setFormModal}
                  setSubmitError={setSubmitError}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-between items-end">
        <div className="">
          <p className="text-second text-sm mt-1">Manage your tasks with us.</p>
          <h1 className="text-3xl font-semibold text-regular mt-1">
            Task Management System
          </h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuModal(!menuModal)}
            className="w-16 py-2 border transition-all flex justify-around rounded-lg bg-gray-100 items-center hover:bg-[#F4F7FD] active:bg-gray-200"
          >
            <i className="fa-solid fa-plus text-gray-600"></i>
            <i className="fa-solid fa-caret-down text-gray-700"></i>
          </button>
          <AnimatePresence>
            {menuModal && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute w-52 bg-gray-100 -left-36 mt-2 rounded-lg border shadow-lg p-2"
              >
                <button
                  onClick={changeModalState}
                  className="w-full flex px-3 py-2 items-center gap-3 text-sm rounded-md transition-all text-regular hover:bg-gray-200"
                >
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    ></path>
                  </svg>{" "}
                  Add new task
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-5">
        <div className="lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12 ">
          <TasksContainer
            title={"TODO"}
            lineColor="bg-[#212D36]"
            tasks={filterTask("Todo")}
            isLoading={isLoading}
          >
            <AddTaskButton clickEvent={changeModalState} />
          </TasksContainer>
        </div>
        <div className="lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12 ">
          <TasksContainer
            title={"IN WORK"}
            lineColor="bg-[#4A6BBB]"
            tasks={filterTask("In Work")}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12 ">
          <TasksContainer
            title={"IN PROGRESS"}
            lineColor="bg-[#E5BF9E]"
            tasks={filterTask("In Progress")}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12 ">
          <TasksContainer
            title={"COMPLETED"}
            lineColor="bg-[#8AB476]"
            tasks={filterTask("Done")}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

type AddTaskButtonProps = {
  clickEvent: () => void;
};

const AddTaskButton = ({ clickEvent }: AddTaskButtonProps) => {
  return (
    <button
      onClick={() => clickEvent()}
      className="w-full flex justify-center items-center text-[15px] gap-1 text-regular mt-3 py-2 rounded-lg border-gray-600 border-dashed border"
    >
      <svg
        fill="#273754"
        width="18px"
        height="18px"
        viewBox="0 0 24 24"
        id="plus"
        data-name="Line Color"
        xmlns="http://www.w3.org/2000/svg"
        className="icon line-color"
      >
        <path
          id="primary"
          d="M5,12H19M12,5V19"
          style={{
            fill: "none",
            stroke: "rgb(0, 0, 0)",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
          }}
        ></path>
      </svg>
      Add New Task
    </button>
  );
};

export default Dashboard;
