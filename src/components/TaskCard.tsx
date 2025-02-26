import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Task } from "../models/AuthModels";
import { supabase } from "../supabaseClient";
import completedIcon from "./../assets/icons/completed-icons.svg";

interface TaskCardProps {
  task: Task;
  setDeleteError: (type: string) => void;
}
const categoryColors = {
  Personal: "bg-blue-500",
  Agent: "bg-green-500",
  Client: "bg-red-500",
  Design: "bg-yellow-500",
  Research: "bg-purple-500",
  Planning: "bg-teal-500",
  Content: "bg-pink-500",
};

const TaskCard = ({ task, setDeleteError }: TaskCardProps) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [taskModal, setTaskModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const completedSubTasks =
    task.sub_tasks?.filter((sTask) => sTask.status == true) ?? [];
  const totalSubTasks = task.sub_tasks?.length ?? 0;
  const completedCount = completedSubTasks.length;
  const progressPercentage =
    totalSubTasks > 0 ? (completedCount / totalSubTasks) * 100 : 0;

  const updateTaskStatus = async (taskStatus: string) => {
    if (!taskStatus) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: taskStatus })
        .eq("id", task.id)
        .select();
      if (error) {
        console.log(error);
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) {
        throw error;
      }
      setDeleteError("success");
    } catch (error) {
      setDeleteError("error");
      console.log(error);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed left-0 top-0 w-full h-full bg-[#00000032] z-10 "
          >
            <div
              onClick={() => setConfirmDelete(!confirmDelete)}
              className="w-full h-full flex justify-center items-center"
            >
              <div onClick={(e) => e.stopPropagation()} className="">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-red-100 rounded-full p-3">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-center mb-2">
                    Delete Task
                  </h2>
                  <p className="text-center text-gray-600 mb-6">
                    Are you sure you want to delete this task? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setConfirmDelete(!confirmDelete)}
                      className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteTask(`${task.id}`)}
                      className="w-[100px] h-10 flex justify-center items-center px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                      {loading ? (
                        <div className="w-7 h-7 animate-spin border-4 border-t-white border-r-white border-l-white border-b-red-600 rounded-full"></div>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className={`w-full p-3 rounded-lg border transition-all ${
          loading ? "bg-slate-50" : "bg-white"
        }`}
        style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
      >
        <div className="flex justify-between items-center mb-3">
          <span
            className={`px-3 py-1 text-sm ${
              categoryColors[task.category] || "bg-gray-500"
            } text-white rounded-full`}
          >
            {task.category}
          </span>
          <div className="relative">
            <button onClick={() => setTaskModal(!taskModal)} className="">
              <i className="fa-solid fa-ellipsis text-lg text-regular"></i>
            </button>
            <AnimatePresence>
              {taskModal && (
                <motion.div className="absolute w-40 bg-gray-100 right-0 rounded-lg border shadow-lg">
                  <button className="w-full flex px-3 py-2 text-[12px] items-center gap-2 text-sm rounded-md text-regular hover:bg-gray-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(!confirmDelete)}
                    className="w-full flex px-3 py-2 text-[12px] items-center gap-2 text-sm rounded-md text-regular hover:bg-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>  
        </div>
        <Link to={`/task/${task.id}`} className="text-regular font-semibold">
          {task.title}
        </Link>
        <p className="text-second text-[13px] mt-2">{task.description}</p>
        {/* progress */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-regular text-[14px] font-medium flex gap-2 items-center">
              <span>Progress</span>
              {completedCount === totalSubTasks && (
                <img className="w-6" src={completedIcon} alt="" />
              )}
            </span>
            <span className="text-regular text-[13px]">
              {completedCount}/{totalSubTasks}
            </span>
          </div>
          <div className="w-full h-[6px] mt-2 bg-[#F4F7FD] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
              className="h-full rounded-full bg-[#EC6443]"
            ></motion.div>
          </div>
        </div>
        <div className="w-full mt-4">
          <div className="flex justify-between items-center">
            {/* priority */}
            <span className="px-4 py-1 text-[12px] border bg-[#fce3dee1] text-[#C4745F] rounded-full">
              {task.priority}
            </span>
            <p className="text-[14px] font-semibold text-gray-600">
              Due: <span className="font-normal">{task.due_date}</span>
            </p>
          </div>
          {/* status */}
          <div className="flex items-center flex-wrap justify-end gap-2 mt-4">
            <button
              onClick={() => updateTaskStatus("Todo")}
              className={`${
                task.status === "Todo" && "hidden"
              } px-4 py-1 cursor-pointer text-[10px] border bg-[#2660f496] text-white rounded-full`}
            >
              TODO
            </button>
            <button
              onClick={() => updateTaskStatus("In Work")}
              className={`${
                task.status === "In Work" && "hidden"
              } px-4 py-1 cursor-pointer text-[10px] border bg-[#8ab47650] text-gray-500 rounded-full`}
            >
              IN WORK
            </button>
            <button
              onClick={() => updateTaskStatus("In Progress")}
              className={`${
                task.status === "In Progress" && "hidden"
              } px-4 py-1 cursor-pointer text-[10px] border bg-[#e5bf9e83] text-gray-500 rounded-full`}
            >
              PROGRESS
            </button>
            <button
              onClick={() => updateTaskStatus("Done")}
              className={`${
                task.status === "Done" && "hidden"
              } px-4 py-1 cursor-pointer text-[10px] border bg-[#fce3dee1] text-[#C4745F] rounded-full`}
            >
              DONE
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
