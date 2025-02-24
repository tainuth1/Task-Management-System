import { ErrorMessage, Field, Formik, Form, FormikHelpers } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { SubTasks, Task } from "../models/AuthModels";
import { FormEvent, useState } from "react";
import * as Yup from "yup";
import { supabase } from "../supabaseClient";

const initialValues: Task = {
  title: "",
  description: "",
  priority: "Low",
  category: "Personal",
  status: "Todo",
  due_date: "",
};
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

type AddTaskFormType = {
  setFormModal: (bool: boolean) => void;
  setSubmitError: (value: string) => void;
};

const AddTaskForm = ({ setFormModal, setSubmitError }: AddTaskFormType) => {
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [subTasks, setSubTasks] = useState<SubTasks[]>([]);
  const [subTaskInput, setSubTaskInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (
    values: Task,
    { resetForm }: FormikHelpers<Task>
  ) => {
    setLoading(true);
    if (selectedPriority.trim() == "") return;
    // prepare task before submit
    const newData = { ...values, priority: selectedPriority };
    try {
      // insert data into table
      const { data, error } = await supabase
        .from("tasks")
        .insert([newData])
        .select();
      if (error) { // if an error stop the operation
        setSubmitError("error");
        console.error(error);
        return;
      }
      // check if any subtasks. insert into table
      if (subTasks.length > 0) {
        const subTasksForInsert = subTasks.map((task) => ({ // prepare subtask data
          task_id: data[0].id,
          title: task.title,
        }));
        //insert into sub_task table
        const { error: subTaskError } = await supabase
          .from("sub_tasks")
          .insert(subTasksForInsert)
          .select();
        if (subTaskError) {
          console.log(error);
          setSubmitError("warning");
        } else {
          setSubmitError("success");
          setSubTasks([]);
        }
      }

      resetForm();
      setFormModal(false);
      setSelectedPriority("");
    } catch (error) {
      console.error("Unexpected error : ", error);
      setSubmitError("error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubTaskForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (subTaskInput.trim() != "") {
      const subTaskObj: SubTasks = {
        id: crypto.randomUUID(),
        title: subTaskInput,
      };
      const newSubTasks = [subTaskObj, ...subTasks];
      setSubTasks(newSubTasks);
      setSubTaskInput("");
    }
  };

  const removeSubTasks = (id: string) => {
    setSubTasks((prev) => prev.filter((item) => item.id != id));
  };

  return (
    <motion.div
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      exit={{ y: -10 }}
      className="w-full h-full bg-white shadow-lg rounded-2xl p-4 relative"
    >
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
              className="w-[140px] h-10 flex justify-center items-center px-4 py-2 absolute bottom-4 right-4 bg-blue-500 text-white rounded-lg"
            >
              {loading ? (
                <div className="w-8 h-8 animate-spin border-4 border-t-white border-r-white border-l-white border-b-blue-500 rounded-full"></div>
              ) : (
                "Add Task"
              )}
            </button>
          </Form>
        )}
      </Formik>
      <div className="">
        <form className="mb-3" onSubmit={handleSubTaskForm}>
          <label htmlFor="title" className="block text-gray-600 font-medium">
            SubTask (Optional)
          </label>
          <div className="relative grid grid-cols-12 gap-2">
            <input
              value={subTaskInput}
              onChange={(e) => setSubTaskInput(e.target.value)}
              type="text"
              className="w-full px-4 py-2 col-span-10 border border-gray-300 rounded-lg"
              placeholder="Add Task"
            />
            <button className="bg-blue-500 col-span-2 rounded-lg text-white">
              Add
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-3 h-[120px] sub-task-list rounded-lg overflow-y-auto px-[4px]">
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
                    onClick={() => removeSubTasks(`${task.id}`)}
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
              <div className="text-center text-regular">Sub Task is empty.</div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AddTaskForm;
