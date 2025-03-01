const TaskCardLoadingSkeloton = () => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        <div className="h-4 bg-gray-200 rounded-full w-16"></div>
      </div>

      <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-3"></div>

      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded-full w-full"></div>
        <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded-full w-4/6"></div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-gray-200 rounded-full w-12"></div>
        <div className="h-4 bg-gray-200 rounded-full w-24"></div>
      </div>

      <div className="flex space-x-2">
        <div className="h-4 bg-gray-200 rounded-full w-16"></div>
        <div className="h-4 bg-gray-200 rounded-full w-20"></div>
        <div className="h-4 bg-gray-200 rounded-full w-12"></div>
      </div>
    </div>
  );
};

export default TaskCardLoadingSkeloton;
