import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import API from "../api/api";

const Navbar = () => {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/users/logout");
    } catch {}
    logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 border-b border-gray-900 bg-gray-900">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="text-xl font-bold text-rose-600 tracking-wider"
        >
          VideoTube
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-3 py-2 rounded bg-rose-600 text-white font-medium hover:bg-pink-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-2 rounded border border-gray-900 text-white hover:bg-gray-800 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to={`/channel/${user.username}`}
              className="flex items-center gap-2 px-2 py-1 text-white rounded hover:bg-gray-800 transition"
            >
              <img
                src={user.avatar}
                alt="avatar"
                className="rounded-full w-8 h-8 object-cover border border-gray-900"
              />
              <span className="font-semibold">{user.username}</span>
            </Link>
            <Link
              to="/dashboard"
              className="p-2 rounded hover:bg-gray-800"
              title="Dashboard"
            >
              <Cog6ToothIcon className="w-6 h-6 text-rose-600" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded hover:bg-gray-800"
              title="Logout"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6 text-rose-600" />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../store/auth";
// import {
//   ArrowLeftOnRectangleIcon,
//   Cog6ToothIcon,
// } from "@heroicons/react/24/outline";
// import API from "../api/api";

// const Navbar = () => {
//   const { user, logout, setUser } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await API.post("/users/logout");
//     } catch {}
//     logout();
//     setUser(null);
//     navigate("/login");
//   };

//   return (
//     <nav className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900">
//       <div className="flex items-center gap-3">
//         <Link to="/" className="text-xl font-bold text-blue-500 tracking-wider">
//           VideoTube
//         </Link>
//       </div>
//       <div className="flex items-center gap-3">
//         {!user ? (
//           <>
//             <Link
//               to="/login"
//               className="px-3 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               className="px-3 py-2 rounded border border-gray-700 text-white hover:bg-gray-800 transition"
//             >
//               Register
//             </Link>
//           </>
//         ) : (
//           <>
//             <Link
//               to={`/channel/${user.username}`}
//               className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-800 transition"
//             >
//               <img
//                 src={user.avatar}
//                 alt="avatar"
//                 className="rounded-full w-8 h-8 object-cover border border-gray-700"
//               />
//               <span className="font-semibold text-white">{user.username}</span>
//             </Link>
//             <Link
//               to="/dashboard"
//               className="p-2 rounded hover:bg-gray-800 transition"
//               title="Dashboard"
//             >
//               <Cog6ToothIcon className="w-6 h-6 text-blue-500" />
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="p-2 rounded hover:bg-gray-800 transition"
//               title="Logout"
//             >
//               <ArrowLeftOnRectangleIcon className="w-6 h-6 text-blue-500" />
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
