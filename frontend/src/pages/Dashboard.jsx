// import React, { useEffect, useState } from "react";
// import API from "../api/api";
// import { useAuth } from "../store/auth";
// import VideoCard from "../components/VideoCard";
// import AvatarUploader from "../components/AvatarUploader";
// import { Link } from "react-router-dom";
// import { PlusIcon } from "@heroicons/react/24/outline";
// import VideoManager from "../components/VideoManager";

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [showEditProfile, setShowEditProfile] = useState(false);

//   const fetchStats = async () => {
//     const res = await API.get("/dashboard/stats");
//     setStats(res.data.data);
//   };

//   const fetchVideos = async () => {
//     const res = await API.get("/dashboard/videos");
//     setVideos(res.data.data);
//   };

//   useEffect(() => {
//     fetchStats();
//     fetchVideos();
//   }, []);

//   if (!user)
//     return (
//       <div className="text-center mt-10">
//         <div>Please login to access your dashboard.</div>
//       </div>
//     );

//   return (
//     <div>
//       <div className="flex items-center gap-6 mb-6">
//         <AvatarUploader avatarUrl={user.avatar} />
//         <div>
//           <div className="text-2xl text-white font-bold">{user.fullName}</div>
//           <div className="text-gray-400">@{user.username}</div>
//           <div className="text-sm text-gray-400">{user.email}</div>
//         </div>
//         <div className="ml-auto">
//           <button
//             className="px-4 py-2 rounded bg-rose-600 text-white font-semibold"
//             onClick={() => setShowEditProfile((s) => !s)}
//           >
//             Edit Profile
//           </button>
//         </div>
//       </div>
//       {stats && (
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//           <div className="bg-gray-800 rounded-lg p-4 text-center">
//             <div className="text-2xl font-bold">{stats.videoCount}</div>
//             <div className="text-gray-400 text-xs">Videos</div>
//           </div>
//           <div className="bg-gray-800 rounded-lg p-4 text-center">
//             <div className="text-2xl font-bold">{stats.subscriberCount}</div>
//             <div className="text-gray-400 text-xs">Subscribers</div>
//           </div>
//           <div className="bg-gray-800 rounded-lg p-4 text-center">
//             <div className="text-2xl font-bold">{stats.totalViews}</div>
//             <div className="text-gray-400 text-xs">Total Views</div>
//           </div>
//         </div>
//       )}
//       <div className="flex items-center justify-between mb-3 mt-8">
//         <h2 className="text-xl font-bold">My Videos</h2>
//         <Link
//           to="/"
//           className="flex gap-2 px-4 py-2 rounded bg-rose-600 text-white font-semibold items-center"
//         >
//           <PlusIcon className="w-5 h-5" /> Upload New
//         </Link>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {videos.length === 0 ? (
//           <div className="col-span-full text-gray-400">
//             No videos uploaded yet.
//           </div>
//         ) : (
//           videos.map((video) => (
//             <div key={video._id} className="relative group">
//               <VideoCard video={video} />
//               <VideoManager video={video} onUpdated={fetchVideos} />
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../store/auth";
import VideoCard from "../components/VideoCard";
import AvatarUploader from "../components/AvatarUploader";
import { Link } from "react-router-dom";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import VideoManager from "../components/VideoManager";

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Edit profile form state
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchStats = async () => {
    const res = await API.get("/dashboard/stats");
    setStats(res.data.data);
  };

  const fetchVideos = async () => {
    const res = await API.get("/dashboard/videos");
    setVideos(res.data.data);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const res = await API.patch("/users/update-account", editForm);
      setUser(res.data.data); // Update user in auth context
      setShowEditProfile(false);
      // You might want to show a success message here
    } catch (error) {
      console.error("Failed to update profile:", error);
      // You might want to show an error message here
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchStats();
    fetchVideos();
  }, []);

  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (!user)
    return (
      <div className="text-center mt-10">
        <div>Please login to access your dashboard.</div>
      </div>
    );

  return (
    <div>
      <div className="flex items-center gap-6 mb-6">
        <AvatarUploader avatarUrl={user.avatar} />
        <div>
          <div className="text-2xl text-white font-bold">{user.fullName}</div>
          <div className="text-gray-400">@{user.username}</div>
          <div className="text-sm text-gray-400">{user.email}</div>
        </div>
        <div className="ml-auto">
          <button
            className="px-4 py-2 rounded bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors"
            onClick={() => setShowEditProfile((s) => !s)}
          >
            {showEditProfile ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Edit Profile Form */}
      {showEditProfile && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
            <button
              onClick={() => setShowEditProfile(false)}
              className="text-gray-400 hover:text-fuchsia-300 cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleEditProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={editForm.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{stats.videoCount}</div>
            <div className="text-gray-400 text-xs">Videos</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{stats.subscriberCount}</div>
            <div className="text-gray-400 text-xs">Subscribers</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <div className="text-gray-400 text-xs">Total Views</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3 mt-8">
        <h2 className="text-xl text-white font-bold">My Videos</h2>
        <Link
          to="/"
          className="flex gap-2 px-4 py-2 rounded bg-rose-600 text-white font-semibold items-center hover:bg-rose-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" /> Upload New
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.length === 0 ? (
          <div className="col-span-full text-gray-400">
            No videos uploaded yet.
          </div>
        ) : (
          videos.map((video) => (
            <div key={video._id} className="relative group">
              <VideoCard video={video} />
              <VideoManager video={video} onUpdated={fetchVideos} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
