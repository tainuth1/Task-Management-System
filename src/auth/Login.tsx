import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthProvider";
import { LoginValues } from "../models/AuthModels";
import { useState } from "react";

// Validation schema with Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { login, loading } = useAuth();
  console.log(loading);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleSubmit = async (
    values: LoginValues,
    { resetForm, setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    try {
      await login(values);
      navigate("/");
    } catch (error) {
      setError(true);
      console.error("Login failed:", error);
    } finally {
      setSubmitting(false);
      resetForm();
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* <div className="flex justify-center mb-6">
          <h2 className="text-4xl text-purple-500 font-bold">Blogger.</h2>
        </div> */}

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Sign in to your account
        </h2>

        {error && (
          <p className="text-center text-red-500 mb-6 border py-1 rounded-md border-red-300">
            Account not available.
          </p>
        )}

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 font-medium mb-2"
              >
                Email address
                <ErrorMessage
                  name="email"
                  component="span"
                  className="text-red-600 text-[10px] ml-5"
                />
              </label>
              <div className="relative">
                <Field
                  id="email"
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter your email"
                />
                <i className="bx bxs-envelope absolute text-xl right-3 top-2 text-gray-400"></i>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-600 font-medium mb-2"
              >
                Password
                <ErrorMessage
                  name="password"
                  component="span"
                  className="text-red-600 text-[10px] ml-5"
                />
              </label>
              <div className="relative">
                <Field
                  id="password"
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter your password"
                />
                <i className="bx bxs-lock-alt absolute text-xl right-3 top-2 text-gray-400"></i>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-purple-500"
                  />
                  <span className="ml-2 text-gray-700">Remember me</span>
                </label>
              </div>
              <a href="#" className="text-purple-500 text-sm hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full h-11 flex justify-center items-center bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              {loading ? (
                <div className="w-8 h-8 border-4 border-t-white border-r-white border-l-white border-b-purple-500 rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>

            <div className="mt-6 text-center text-gray-500">
              Don't have an Account? |{" "}
              <Link to="/register" className="underline text-blue-600">
                Register
              </Link>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
