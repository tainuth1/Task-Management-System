import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { RegisterValues } from "../models/AuthModels";
import { supabase } from "../supabaseClient";
import { useState } from "react";

const initialValues: RegisterValues = {
  email: "",
  password: "",
  confirm_password: "",
  username: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
  username: Yup.string().required("Username is required"),
});

const Register = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const naviagate = useNavigate();
  const onSubmit = async (
    values: RegisterValues,
    { resetForm }: FormikHelpers<RegisterValues>
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      if (error) {
        console.log("ERROR SignUp " + error);
        return;
      } else {
        const { error } = await supabase
          .from("users")
          .insert([{ id: data.user?.id, username: values.username }]);
        if (error) {
          alert("ERROR SignUp to User table(create user data false) ");
          console.log(error);
        } else {
          setLoading(false);
          naviagate("/login");
          resetForm();
        }
      }
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* <div className="flex justify-center mb-6">
          <h2 className="text-4xl text-purple-500 font-bold">Blogger.</h2>
        </div> */}

        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Sign up
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-600 font-medium mb-2"
              >
                Username
                <ErrorMessage
                  name="username"
                  component="span"
                  className="text-red-600 text-[10px] ml-5"
                />
              </label>
              <div className="relative">
                <Field
                  id="username"
                  type="text"
                  name="username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Username"
                />
              </div>
            </div>
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
                  placeholder="Email"
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
                  placeholder="Password"
                />
                <i className="bx bxs-lock-alt absolute text-xl right-3 top-2 text-gray-400"></i>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirm_password"
                className="block text-gray-600 font-medium mb-2"
              >
                Confirm Password
                <ErrorMessage
                  name="confirm_password"
                  component="span"
                  className="text-red-600 text-[10px] ml-5"
                />
              </label>
              <div className="relative">
                <Field
                  id="confirm_password"
                  type="password"
                  name="confirm_password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Confirm Password"
                />
                <i className="bx bxs-lock-alt absolute text-xl right-3 top-2 text-gray-400"></i>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 flex justify-center items-center bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              {loading ? (
                <div className="w-8 h-8 border-4 border-t-white border-r-white border-l-white border-b-purple-500 rounded-full animate-spin"></div>
              ) : (
                "Sign up"
              )}
            </button>

            <div className="mt-6 text-center text-gray-500">
              Already have account? |
              <Link to="/login" className="underline text-blue-600 ml-1">
                Login
              </Link>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="w-full bg-white text-gray-600 border border-gray-300 rounded-lg py-1 px-4 flex items-center justify-center hover:bg-gray-50 active:scale-[0.96]"
              >
                <img
                  className="w-7 h-7 object-cover mr-2"
                  src="https://imagepng.org/wp-content/uploads/2019/08/google-icon.png"
                  alt=""
                />
                Google
              </button>
              <button
                type="button"
                className="w-full bg-white border border-gray-300 rounded-lg py-1 px-4 flex items-center gap-3 justify-center hover:bg-gray-50 active:scale-[0.96] ml-2"
              >
                <i className="fa-brands text-2xl fa-github"></i>
                GitHub
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
