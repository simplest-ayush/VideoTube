import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const avatarRef = useRef();
  const coverRef = useRef();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Min 6 chars")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!avatar) {
        toast.error("Avatar is required");
        setSubmitting(false);
        return;
      }
      const data = new FormData();
      Object.entries(values).forEach(([k, v]) => data.append(k, v));
      data.append("avatar", avatar);
      if (coverImage) data.append("coverImage", coverImage);

      try {
        await API.post("/users/register", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Registration successful! Please log in.");
        navigate("/login");
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
          Register on VideoTube
        </h1>
        <input
          name="fullName"
          placeholder="Full Name"
          className="bg-gray-900 rounded p-2 text-white focus:outline-none"
          onChange={formik.handleChange}
          value={formik.values.fullName}
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <div className="text-red-500 text-xs">{formik.errors.fullName}</div>
        )}
        <input
          name="username"
          placeholder="Username"
          className="bg-gray-900 rounded p-2 text-white focus:outline-none"
          onChange={formik.handleChange}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && (
          <div className="text-red-500 text-xs">{formik.errors.username}</div>
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="bg-gray-900 rounded p-2 text-white focus:outline-none"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-xs">{formik.errors.email}</div>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="bg-gray-900 rounded p-2 text-white focus:outline-none"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-xs">{formik.errors.password}</div>
        )}
        <div className="flex gap-3 flex-col sm:flex-row">
          <div>
            <button
              type="button"
              className="px-3 py-2 bg-rose-600 rounded text-white"
              onClick={() => avatarRef.current.click()}
            >
              {avatar ? "Change Avatar" : "Select Avatar"}
            </button>
            <input
              ref={avatarRef}
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
            {avatar && (
              <div className="text-xs text-gray-400 mt-1">{avatar.name}</div>
            )}
          </div>
          <div>
            <button
              type="button"
              className="px-3 py-2 bg-rose-600 rounded text-white"
              onClick={() => coverRef.current.click()}
            >
              {coverImage ? "Change Cover" : "Select Cover"}
            </button>
            <input
              ref={coverRef}
              type="file"
              name="coverImage"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
            {coverImage && (
              <div className="text-xs text-gray-400 mt-1">
                {coverImage.name}
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="bg-rose-600 text-white rounded px-4 py-2 mt-2 font-semibold"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Registering..." : "Register"}
        </button>
        <div className="text-center mt-2 text-gray-400 text-sm">
          Already have an account?{" "}
          <Link className="text-rose-600 hover:underline" to="/login">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;

// import React, { useRef, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import API from "../api/api";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const Register = () => {
//   const [avatar, setAvatar] = useState(null);
//   const [coverImage, setCoverImage] = useState(null);
//   const avatarRef = useRef();
//   const coverRef = useRef();
//   const navigate = useNavigate();

//   const formik = useFormik({
//     initialValues: {
//       fullName: "",
//       username: "",
//       email: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       fullName: Yup.string().required("Full name is required"),
//       username: Yup.string().required("Username is required"),
//       email: Yup.string().email("Invalid email").required("Email is required"),
//       password: Yup.string()
//         .min(6, "Min 6 chars")
//         .required("Password is required"),
//     }),
//     onSubmit: async (values, { setSubmitting }) => {
//       if (!avatar) {
//         toast.error("Avatar is required");
//         setSubmitting(false);
//         return;
//       }
//       const data = new FormData();
//       Object.entries(values).forEach(([k, v]) => data.append(k, v));
//       data.append("avatar", avatar);
//       if (coverImage) data.append("coverImage", coverImage);

//       try {
//         await API.post("/users/register", data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         toast.success("Registration successful! Please log in.");
//         navigate("/login");
//       } catch (e) {
//         toast.error(e.response?.data?.message || "Registration failed");
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
//           Register on VideoTube
//         </h1>

//         <input
//           name="fullName"
//           placeholder="Full Name"
//           className="bg-white border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={formik.handleChange}
//           value={formik.values.fullName}
//         />
//         {formik.touched.fullName && formik.errors.fullName && (
//           <div className="text-red-600 text-xs">{formik.errors.fullName}</div>
//         )}

//         <input
//           name="username"
//           placeholder="Username"
//           className="bg-white border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={formik.handleChange}
//           value={formik.values.username}
//         />
//         {formik.touched.username && formik.errors.username && (
//           <div className="text-red-600 text-xs">{formik.errors.username}</div>
//         )}

//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           className="bg-white border border-gray-300 rounded p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onChange={formik.handleChange}
//           value={formik.values.email}
//         />
//         {formik.touched.email && formik.errors.email && (
//           <div className="text-red-600 text-xs">{formik.errors.email}</div>
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

//         <div className="flex gap-4 flex-col sm:flex-row">
//           <div className="flex flex-col items-start">
//             <button
//               type="button"
//               className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition"
//               onClick={() => avatarRef.current.click()}
//             >
//               {avatar ? "Change Avatar" : "Select Avatar"}
//             </button>
//             <input
//               ref={avatarRef}
//               type="file"
//               name="avatar"
//               accept="image/*"
//               className="hidden"
//               onChange={(e) => setAvatar(e.target.files[0])}
//             />
//             {avatar && (
//               <div className="text-xs text-gray-600 mt-1 truncate max-w-xs">
//                 {avatar.name}
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col items-start">
//             <button
//               type="button"
//               className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition"
//               onClick={() => coverRef.current.click()}
//             >
//               {coverImage ? "Change Cover" : "Select Cover"}
//             </button>
//             <input
//               ref={coverRef}
//               type="file"
//               name="coverImage"
//               accept="image/*"
//               className="hidden"
//               onChange={(e) => setCoverImage(e.target.files[0])}
//             />
//             {coverImage && (
//               <div className="text-xs text-gray-600 mt-1 truncate max-w-xs">
//                 {coverImage.name}
//               </div>
//             )}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white rounded px-4 py-2 mt-4 font-semibold hover:bg-blue-700 transition"
//           disabled={formik.isSubmitting}
//         >
//           {formik.isSubmitting ? "Registering..." : "Register"}
//         </button>

//         <div className="text-center mt-4 text-gray-600 text-sm">
//           Already have an account?{" "}
//           <Link className="text-blue-600 hover:underline" to="/login">
//             Login
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Register;
