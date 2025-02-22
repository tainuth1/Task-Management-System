import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";

type TasksContainerProps = {
  title: string;
  lineColor: string;
  children?: ReactNode;
};

const TasksContainer = ({
  title,
  lineColor,
  children,
}: TasksContainerProps) => {
  const [taskModal, setTaskModal] = useState<boolean>(false);

  return (
    <div className="w-full active:cursor-grab cursor-pointer">
      <div className="w-full">
        <div className="">
          <h2 className="text-regular font-semibold flex items-center gap-3">
            {title.toUpperCase()}
            <span className="text-sm font-normal text-second px-3 border-2 border-gray-300 rounded-full">
              9
            </span>
          </h2>
        </div>
        <div className={`w-full h-1 ${lineColor} rounded-full mt-3`}></div>
      </div>
      {/* Tasks Container */}
      <div className="w-full mt-3">
        <div
          className="w-full mt-2 p-3 rounded-lg border"
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
        >
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 text-sm bg-[#2662F4] text-white rounded-full">
              Design
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
                    <button className="w-full flex px-3 py-2 text-[12px] items-center gap-2 text-sm rounded-md text-regular hover:bg-gray-200">
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
          <h3 className="mt-3 text-regular font-semibold">
            High priority mobile app design health
          </h3>
          <p className="text-second text-[13px] mt-2">
            High priority work will be done health.
          </p>
          {/* progress */}
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <span className="text-regular text-[14px] font-medium">
                Progress
              </span>
              <span className="text-regular text-[13px]">6/10</span>
            </div>
            <div className="w-full h-[6px] mt-2 bg-[#F4F7FD] rounded-full overflow-hidden">
              <div className="w-3/5 h-full rounded-full bg-[#EC6443]"></div>
            </div>
          </div>
          <div className="w-full mt-4">
            <div className="flex justify-between items-center">
              {/* priority */}
              <span className="px-4 py-1 text-[12px] border bg-[#fce3dee1] text-[#C4745F] rounded-full">
                High
              </span>
              <p className="text-[14px] font-semibold text-gray-600">
                Due: <span className="font-normal">23-Feb</span>
              </p>
            </div>
            {/* status */}
            <div className="flex items-center flex-wrap justify-end gap-2 mt-4">
              <button className="px-4 py-1 cursor-pointer text-[10px] border bg-[#2660f496] text-white rounded-full">
                TODO
              </button>
              <button className="px-4 py-1 cursor-pointer text-[10px] border bg-[#e5bf9e83] text-gray-500 rounded-full">
                PROGRESS
              </button>
              <button className="px-4 py-1 cursor-pointer text-[10px] border bg-[#fce3dee1] text-[#C4745F] rounded-full">
                DONE
              </button>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default TasksContainer;
