import { ErrorMessage, Field, Formik, Form } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { SubTasks, Task } from "../models/AuthModels";
import { FormEvent, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import Alert from "./Alert";

const validationSchema = Yup.object({
  title: Yup.string().min(10, "Title is too short.").required("Required"),
  description: Yup.string()
    .min(20, "Description is too short")
    .required("Required"),
  category: Yup.string().required("Required"),
  due_date: Yup.date().required("Required"),
});

const priorities = [
  { label: "HIGH", value: "High", color: "bg-pink-500" },
  { label: "MEDIUM", value: "Medium", color: "bg-blue-500" },
  { label: "LOW", value: "Low", color: "bg-green-500" },
];

const UpdateTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const [subTaskData, setSubTaskData] = useState<string>("");
  const [editTaskLoading, setEditTaskLoading] = useState<boolean>(false);
  const [subTaskEditMode, setSubTaskEditMode] = useState<{
    mode: boolean;
    updateID: string;
  }>({
    mode: false,
    updateID: "",
  });
  const [subTaskChanged, setSubTaskChanged] = useState<string>("");
  const updateRef = useRef<HTMLInputElement>(null);

  const initialValues: Task = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: task?.priority ?? "Low",
    category: task?.category ?? "Personal",
    status: task?.status ?? "Todo",
    due_date: task?.due_date ?? "",
  };

  const fetchTask = async () => {
    let { data: task, error } = await supabase
      .from("tasks")
      .select(`*, sub_tasks(*)`)
      .eq("id", id)
      .single();
    if (error) {
      console.error(error);
    } else {
      setTask(task || {});
      setSelectedPriority(task.priority || "");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleSubmit = async (values: Task) => {
    setEditTaskLoading(true);
    const prepareUpdateObject = { ...values, priority: selectedPriority };
    try {
      const { error } = await supabase
        .from("tasks")
        .update(prepareUpdateObject)
        .eq("id", id)
        .select();
      if (error) throw error;
      setAlert("success");
    } catch (error) {
      console.log(error);
      setAlert("error");
    } finally {
      setEditTaskLoading(false);
      fetchTask();
    }
  };

  const handleNewSubTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check if task is not exitst before submit the task. prevent from typescript error
    if (!task) {
      console.error("Cannot add sub-task: Task does not exist.");
      return;
    }
    if (subTaskData.trim() != "") {
      try {
        const { data, error } = await supabase
          .from("sub_tasks")
          .insert({ task_id: id, title: subTaskData })
          .select();
        if (error) throw error;
        if (!data || data.length === 0)
          throw new Error("Failed to insert sub-task.");
        setSubTaskData("");
        const newSubTaskUpdated: SubTasks[] = [
          data[0],
          ...(task?.sub_tasks ?? []),
        ];

        const newTaskAfterUpdate = {
          ...task,
          sub_tasks: newSubTaskUpdated,
        };
        setTask(newTaskAfterUpdate);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteSubTask = async (id: string) => {
    if (!task) {
      console.error("Cannot delete sub-task: Task does not exist.");
      return;
    }
    const { error } = await supabase.from("sub_tasks").delete().eq("id", id);
    if (error) {
      console.log(error);
      return;
    }
    const subTaskAfterDelete = task?.sub_tasks?.filter(
      (sTask) => sTask.id !== id
    );
    const taskAfterDelete = { ...task, sub_tasks: subTaskAfterDelete };
    setTask(taskAfterDelete);
  };

  const editMode = (subTaskId: string) => {
    setSubTaskEditMode({
      mode: true,
      updateID: `${subTaskId}`,
    });
    const getSubTaskTitle = task?.sub_tasks?.find(
      (sTask) => sTask.id === subTaskId
    );
    if (!getSubTaskTitle) return;
    setSubTaskChanged(getSubTaskTitle.title);
    setTimeout(()=>{
      if (updateRef.current) {
        updateRef.current.focus();
      }
    }, 0.01)
  };

  const handleSubmitSingleSubTask = async (
    e: FormEvent<HTMLFormElement>,
    subTaskid: string
  ) => {
    e.preventDefault();
    if (subTaskChanged.trim() != "") {
      if (!task) {
        console.error("Cannot update sub-task: Task does not exist.");
        return;
      }
      const { error } = await supabase
        .from("sub_tasks")
        .update({ title: subTaskChanged })
        .eq("id", subTaskid);

      setSubTaskEditMode({ mode: false, updateID: "" });
      if (error) return;
      const subTaskAfterTitle = task?.sub_tasks?.map((sTask) =>
        sTask.id === subTaskid ? { ...sTask, title: subTaskChanged } : sTask
      );
      const taskAfterUpdateTitle = { ...task, sub_tasks: subTaskAfterTitle };
      setTask(taskAfterUpdateTitle);
      setSubTaskChanged("");
    }
  };

  if (!task) return <></>;

  return (
    <div className="w-full">
      {alert === "success" ? (
        <Alert
          type="success"
          title="Update task successfuly"
          message="You task updated successfuly."
        />
      ) : alert === "error" ? (
        <Alert
          type="error"
          title="Update task failed"
          message="Something went wrong while updating your task."
        />
      ) : null}
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
              Update your task
            </h4>
            <div className="flex space-x-2 mt-2">
              <label
                className={`flex items-center px-4 py-1 border rounded-full cursor-pointer transition-all hover:bg-gray-100`}
              >
                <span
                  className={`w-3 h-3 rounded-full mr-2 bg-pink-500`}
                ></span>
                <span className="text-[13px] text-gray-700">
                  {task.priority}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-7 grid grid-cols-3 gap-4 ">
        <div className="lg:col-span-2 col-span-3 shadow-lg p-5 rounded-lg border bg-white">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="w-full">
                {/* Title */}
                <div className="mb-5">
                  <label
                    htmlFor="title"
                    className="block text-gray-600 font-medium mb-b"
                  >
                    Task Title *
                    <ErrorMessage
                      name="title"
                      component="span"
                      className="text-red-600 text-[10px] ml-5"
                    />
                  </label>
                  <div className="relative">
                    <Field
                      id="title"
                      type="text"
                      name="title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Title"
                    />
                  </div>
                </div>
                {/* Priority */}
                <div className="mb-5 flex justify-between">
                  <label
                    htmlFor="title"
                    className="block text-gray-600 font-medium mb-b"
                  >
                    Priority *{" "}
                    {selectedPriority.trim() === "" && (
                      <span className="text-red-600 text-[10px] ml-5">*</span>
                    )}
                  </label>
                  <div className="flex space-x-2">
                    {priorities.map((priority) => (
                      <label
                        key={priority.value}
                        className={`flex items-center px-4 py-1 border rounded-full cursor-pointer transition-all
                          ${
                            selectedPriority === priority.value
                              ? "bg-gray-200"
                              : "bg-white border-gray-300"
                          }
                          hover:bg-gray-100`}
                      >
                        <input
                          type="checkbox"
                          value={priority.value}
                          checked={selectedPriority === priority.value}
                          onChange={() => setSelectedPriority(priority.value)}
                          className="hidden"
                        />
                        <span
                          className={`w-3 h-3 rounded-full mr-2 ${priority.color}`}
                        ></span>
                        <span className="text-[13px] text-gray-700">
                          {priority.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {/* Category */}
                  <div className="mb-5">
                    <label
                      htmlFor="category"
                      className="block text-gray-600 font-medium mb-1"
                    >
                      Category *
                      <ErrorMessage
                        name="category"
                        component="span"
                        className="text-red-600 text-[10px] ml-5"
                      />
                    </label>
                    <div className="relative">
                      <Field
                        id="category"
                        as="select"
                        name="category"
                        className="w-full px-4 py-[10px] border border-gray-300 rounded-lg"
                      >
                        <option value="Personal">Personal</option>
                        <option value="Agent">Agent</option>
                        <option value="Client">Client</option>
                        <option value="Design">Design</option>
                        <option value="Research">Research</option>
                        <option value="Planning">Planning</option>
                        <option value="Content">Content</option>
                      </Field>
                    </div>
                  </div>
                  {/* Due Date */}
                  <div className="mb-5">
                    <label
                      htmlFor="due_date"
                      className="block text-gray-600 font-medium mb-1"
                    >
                      Due Date *
                      <ErrorMessage
                        name="due_date"
                        component="span"
                        className="text-red-600 text-[10px] ml-5"
                      />
                    </label>
                    <div className="relative">
                      <Field
                        id="due_date"
                        type="date"
                        name="due_date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      ></Field>
                    </div>
                  </div>
                </div>
                {/* Description */}
                <div className="mb-5">
                  <label
                    htmlFor="description"
                    className="block text-gray-600 font-medium mb-b"
                  >
                    Description *
                    <ErrorMessage
                      name="description"
                      component="span"
                      className="text-red-600 text-[10px] ml-5"
                    />
                  </label>
                  <div className="relative">
                    <Field
                      id="description"
                      type="text"
                      as="textarea"
                      name="description"
                      className="w-full h-24 px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Description"
                    ></Field>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-[140px] h-10 flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  {editTaskLoading ? (
                    <div className="w-8 h-8 animate-spin border-4 border-t-white border-r-white border-l-white border-b-blue-500 rounded-full"></div>
                  ) : (
                    "Add Task"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="lg:col-span-1 col-span-3 bg-white border p-5 shadow-lg rounded-lg">
          <form className="w-full" onSubmit={handleNewSubTask}>
            <label htmlFor="title" className="block text-gray-600 font-medium">
              Add more task:
            </label>
            <div className="relative grid grid-cols-12 gap-2">
              <input
                type="text"
                value={subTaskData}
                onChange={(e) => setSubTaskData(e.target.value)}
                className="w-full px-4 py-2 col-span-10 border border-gray-300 rounded-lg"
                placeholder="Add more task"
              />
              <button className="bg-blue-500 col-span-2 rounded-lg text-white">
                Add
              </button>
            </div>
          </form>
          <div className="flex flex-col gap-2 mt-4">
            <AnimatePresence mode={"popLayout"}>
              {task ? (
                task.sub_tasks?.map((task) => (
                  <motion.div
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    // transition={{ type: "spring" }}
                    key={task.id}
                    className="flex justify-between items-center bg-gray-100 pl-4 pr-1 py-1 rounded-md"
                  >
                    <div className="">
                      {subTaskEditMode.mode &&
                      subTaskEditMode.updateID === task.id ? (
                        <form
                          onSubmit={(e) =>
                            handleSubmitSingleSubTask(e, `${task.id}`)
                          }
                        >
                          <input
                            ref={updateRef}
                            type="text"
                            value={subTaskChanged}
                            onChange={(e) => setSubTaskChanged(e.target.value)}
                            className="border px-2 py-1 rounded-md focus:outline-blue-500"
                          />
                        </form>
                      ) : (
                        <p className="text-regular">{task.title}</p>
                      )}
                    </div>
                    <div className="">
                      <button onClick={() => editMode(`${task.id}`)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="dodgerblue"
                          className="bi bi-pencil-square"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path
                            fillRule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteSubTask(`${task.id}`)}
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
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-regular mt-3">
                  Sub Task is empty.
                </div>
              )}
            </AnimatePresence>
          </div>
          {/* <div className="flex justify-end mt-4">
            <button className="w-[140px] h-10 flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-lg">
              {true ? (
                <div className="w-8 h-8 animate-spin border-4 border-t-white border-r-white border-l-white border-b-blue-500 rounded-full"></div>
              ) : (
                "Confirm"
              )}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;
