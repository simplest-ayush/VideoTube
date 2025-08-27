import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/api";
import { useAuth } from "../store/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { setUser, setTokens } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username or Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await API.post("/users/login", values);
        setTokens({
          accessToken: res.data.data.accessToken,
          refreshToken: res.data.data.refreshToken,
        });
        setUser(res.data.data.user);
        toast.success("Login successful!");
        navigate("/");
      } catch (e) {}
      setSubmitting(false);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <form
        className="bg-gray-800 border border-gray-900 rounded-lg p-8 w-full max-w-md flex flex-col gap-3"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-2">
          Sign in to VideoTube
        </h1>
        <input
          name="username"
          placeholder="Username or Email"
          className="border border-black rounded p-2 text-black focus:outline-none"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && (
          <div className="text-red-500 text-xs">{formik.errors.username}</div>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border border-black rounded p-2 text-black focus:outline-none"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-xs">{formik.errors.password}</div>
        )}
        <button
          type="submit"
          className="bg-rose-600 border border-black text-black rounded px-4 py-2 mt-2 font-semibold cursor-pointer"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Signing in..." : "Sign In"}
        </button>
        <div className="text-center mt-2 text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link className="text-rose-600 hover:underline" to="/register">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

// import React from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import API from "../api/api";
// import { useAuth } from "../store/auth";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const Login = () => {
//   const { setUser, setTokens } = useAuth();
//   const navigate = useNavigate();

//   const formik = useFormik({
//     initialValues: {
//       username: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       username: Yup.string().required("Username or Email is required"),
//       password: Yup.string().required("Password is required"),
//     }),
//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         const res = await API.post("/users/login", values);
//         setTokens({
//           accessToken: res.data.data.accessToken,
//           refreshToken: res.data.data.refreshToken,
//         });
//         setUser(res.data.data.user);
//         toast.success("Login successful!");
//         navigate("/");
//       } catch (e) {
//         toast.error(e.response?.data?.message || "Login failed");
//       }
//       setSubmitting(false);
//     },
//   });

//   return (
//     <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-100 py-8 px-4">
//       <form
//         className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-md flex flex-col gap-4 shadow"
//         onSubmit={formik.handleSubmit}
//       >
//         <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
//           Sign in to VideoTube
//         </h1>

//         <input
//           name="username"
//           placeholder="Username or Email"
//           className="bg-white border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={formik.handleChange}
//           value={formik.values.username}
//         />
//         {formik.touched.username && formik.errors.username && (
//           <div className="text-red-600 text-xs">{formik.errors.username}</div>
//         )}

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="bg-white border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={formik.handleChange}
//           value={formik.values.password}
//         />
//         {formik.touched.password && formik.errors.password && (
//           <div className="text-red-600 text-xs">{formik.errors.password}</div>
//         )}

//         <button
//           type="submit"
//           className="bg-blue-600 text-white rounded px-4 py-2 mt-4 font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={formik.isSubmitting}
//         >
//           {formik.isSubmitting ? "Signing in..." : "Sign In"}
//         </button>

//         <div className="text-center mt-4 text-gray-600 text-sm">
//           Don't have an account?{" "}
//           <Link className="text-blue-600 hover:underline" to="/register">
//             Register
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;
