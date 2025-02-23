import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubTasks } from "../models/AuthModels";

const ViewTask = () => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [subTasks, setSubTasks] = useState<SubTasks[]>([]);
  const [taskInput, setTaskInput] = useState<string>("");
  const addNewSubTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (taskInput.trim() != "") {
      const newTaskObj = {
        id: crypto.randomUUID(),
        title: taskInput,
      };
      const newSubTasks = [newTaskObj, ...subTasks];
      setSubTasks(newSubTasks);
      setTaskInput("");
    }
  };

  const removeNewSubTasks = (id: string) => {
    const newSubTasksAfterRemove = subTasks.filter((item) => item.id != id);
    setSubTasks(newSubTasksAfterRemove);
  };

  const confirmNewTasks = () => {
    console.log(subTasks);
  };

  return (
    <div className="w-full">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-4 pl-0 transition-all active:scale-[0.90]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 16 16"
          >
            <path
              fill="none"
              stroke="gray"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </button>
        <div className="ml-5">
          <div className="flex items-center gap-4">
            <h4 className="text-2xl font-semibold text-regular mt-1">
              High priority mobile app design health
            </h4>
            <div className="flex space-x-2 mt-2">
              <label
                className={`flex items-center px-4 py-1 border rounded-full cursor-pointer transition-all hover:bg-gray-100`}
              >
                <input type="checkbox" className="hidden" />
                <span
                  className={`w-3 h-3 rounded-full mr-2 bg-pink-500`}
                ></span>
                <span className="text-[13px] text-gray-700">HIGH</span>
              </label>
            </div>
          </div>
          <p className="text-second text-[15px] mt-2">
            <span className=" text-gray-600">Due Date: </span>Today at 11:59 PM
          </p>
        </div>
      </div>
      <div className="mt-7 grid grid-cols-3 gap-4 ">
        <div className="lg:col-span-2 col-span-3 shadow-lg p-5 rounded-lg border bg-white">
          <div className="">
            <p className="text-second text-[16px]">Task Description:</p>
            <h4 className="text-regular text-[19px] font-medium">
              High priority work will be done health.
            </h4>
          </div>
          <div className="flex gap-x-20 flex-wrap justify-start">
            <div className="mt-5">
              <p className="text-second text-[15px] mt-3">Due Date</p>
              <h5 className="text-regular text-[16px] font-medium">
                Today at 11:59 PM
              </h5>
            </div>
            <div className="mt-5">
              <p className="text-second text-[15px] mt-3">Progress</p>
              <h5 className="text-regular text-[16px] font-medium">6/10</h5>
            </div>
            <div className="mt-5">
              <p className="text-second text-[15px] mt-3">Task Owner</p>
              <h5 className="text-regular text-[16px] font-medium flex items-center gap-1">
                <img
                  className="w-7 h-7 rounded-full"
                  src="https://scontent.fpnh18-6.fna.fbcdn.net/v/t39.30808-1/474092135_1174259764032025_2743479778355334730_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEPxBPaza0ZNnbqIVyALau13fwCF5l-ejPd_AIXmX56MzA5YBKd9TdXdi84KwNhLFj3PtRMDJU-IehLyrPxX8PV&_nc_ohc=RVofpns7vIkQ7kNvgGe7BYg&_nc_oc=AdiXYUvzhRfrlLZDmN0fIwpsoMnIcb9ZwbG6CYeoahpXcUpkI6YCowVd9M2zwswC9Mo&_nc_zt=24&_nc_ht=scontent.fpnh18-6.fna&_nc_gid=AVGe6kkiGkZ71ah2iOvI8Qz&oh=00_AYDRmtZshBM5waH0gOQE9IiDgks1ChIb2GkXD0X7dxzpOg&oe=67BE4205"
                  alt=""
                />
                Tai Nuth
              </h5>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-second text-[16px]">All Tasks:</p>
            <div className="h-[365px] mt-2 flex flex-col gap-2 sub-task-list overflow-y-auto">
              {[1, 2, 3, 4, 5, 6, 7].map((task) => (
                <div
                  key={task}
                  className="flex justify-between items-center border bg-gray-100 pl-4 pr-1 py-1 rounded-md transition-all hover:bg-gray-50"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="myCheckbox"
                        onChange={() => {}}
                        checked={task % 2 != 0}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-regular">
                      High priority work will be done health.
                    </p>
                  </div>
                  <button className="p-3 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="red"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 col-span-3 bg-white border p-5 shadow-lg rounded-lg">
          <form className="w-full" onSubmit={addNewSubTask}>
            <label htmlFor="title" className="block text-gray-600 font-medium">
              Add new task:
            </label>
            <div className="relative grid grid-cols-12 gap-2">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="w-full px-4 py-2 col-span-10 border border-gray-300 rounded-lg"
                placeholder="Add Task"
              />
              <button className="bg-blue-500 col-span-2 rounded-lg text-white">
                Add
              </button>
            </div>
          </form>
          <div className="flex flex-col gap-2 mt-4">
            <AnimatePresence mode={"popLayout"}>
              {subTasks.length > 0 ? (
                subTasks.map((task) => (
                  <motion.div
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    // transition={{ type: "spring" }}
                    key={task.id}
                    className="flex justify-between items-center bg-gray-100 pl-4 pr-1 py-1 rounded-md"
                  >
                    <p className="text-regular">{task.title}</p>
                    <button
                      onClick={() => removeNewSubTasks(`${task.id}`)}
                      className="p-3 rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="red"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-regular mt-3">
                  Sub Task is empty.
                </div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex justify-end mt-4">
            {subTasks.length > 0 && (
              <button
                onClick={confirmNewTasks}
                className="px-4 py-2 transition-all bg-blue-500 text-white rounded-lg"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;
