import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AlertType = "success" | "info" | "warning" | "error";

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
}

const Alert = ({ type, title, message }: AlertProps) => {
  const [visible, setVisible] = useState(true);

  const alertStyles = {
    success: {
      border: "border-l-[8px] border-green-500",
      icon: "✅",
      textColor: "text-green-700",
      bgColor: "bg-green-100",
    },
    info: {
      border: "border-l-[8px] border-blue-500",
      icon: "ℹ️",
      textColor: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    warning: {
      border: "border-l-[8px] border-yellow-500",
      icon: "⚠️",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-100",
    },
    error: {
      border: "border-l-[8px] border-red-500",
      icon: "❌",
      textColor: "text-red-700",
      bgColor: "bg-red-100",
    },
  };

  const { border, icon, textColor, bgColor } = alertStyles[type] || {};

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: "spring" }}
          className={`w-[450px] flex items-center px-3 py-2 shadow-md rounded-lg fixed top-3 right-3 z-50 ${border} ${bgColor}`}
        >
          <span className="text-xl">{icon}</span>
          <div className="ml-3">
            <p className={`font-bold text-[15px] ${textColor}`}>{title}</p>
            <p className="text-gray-600 text-[13px]">{message}</p>
          </div>
          <button
            className="ml-auto text-gray-400 hover:text-gray-600"
            onClick={() => setVisible(false)}
            aria-label="Close alert"
          >
            ✖️
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
