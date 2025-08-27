// import React, { useEffect, useState } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import API from "../api/api";
// import CommentSection from "../components/CommentSection";
// import LikeButton from "../components/LikeButton";
// import { useAuth } from "../store/auth";
// import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

// const VideoDetails = () => {
//   const { videoId } = useParams();
//   const { user } = useAuth();
//   const [video, setVideo] = useState(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const navigate = useNavigate();

//   const fetchVideo = async () => {
//     const res = await API.get(`/videos/${videoId}`);
//     setVideo(res.data.data);
//     // Fetch like status if needed (requires like info in backend or extra call)
//   };

//   useEffect(() => {
//     fetchVideo();
//     // eslint-disable-next-line
//   }, [videoId]);

//   const handleDelete = async () => {
//     if (window.confirm("Delete this video?")) {
//       await API.delete(`/videos/${videoId}`);
//       navigate("/");
//     }
//   };

//   const handleLike = async () => {
//     await API.post(`/likes/toogle/v/${videoId}`);
//     setIsLiked((prev) => !prev);
//     fetchVideo();
//   };

//   if (!video) return <div className="text-center mt-10">Loading...</div>;

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
//         <video
//           src={video.videoFile}
//           poster={video.thumbnail}
//           controls
//           className="w-full h-full"
//         />
//       </div>
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl text-amber-200 font-bold">{video.title}</h2>
//         {user && user._id === video.owner && (
//           <div className="flex gap-2">
//             <Link
//               to={`/dashboard?editVideo=${video._id}`}
//               className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-900 transition flex items-center gap-1 text-sm"
//             >
//               <PencilIcon className="w-4 h-4" /> Edit
//             </Link>
//             <button
//               onClick={handleDelete}
//               className="px-2 py-1 rounded bg-red-700 text-white flex items-center gap-1 text-sm"
//             >
//               <TrashIcon className="w-4 h-4" /> Delete
//             </button>
//           </div>
//         )}
//       </div>
//       <div className="text-gray-400 text-sm mt-2 mb-2">
//         {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
//       </div>
//       <div className="mb-4 text-white">{video.description}</div>
//       <div className="flex items-center gap-4 mb-6">
//         <LikeButton
//           liked={isLiked}
//           onClick={handleLike}
//           count={video.likes || 0}
//         />
//         <Link
//           to={`/channel/${video.owner?.username}`}
//           className="flex text-teal-400 items-center gap-2"
//         >
//           <img
//             src={video.owner?.avatar}
//             alt="owner"
//             className="w-8 h-8 rounded-full border border-gray-900"
//           />
//           <span className="font-semibold">{video.owner?.username}</span>
//         </Link>
//       </div>
//       <CommentSection videoId={videoId} />
//     </div>
//   );
// };

// export default VideoDetails;

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/LikeButton";
import VideoEditor from "../components/VideoEditor";
import { useAuth } from "../store/auth";
import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const VideoDetails = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // const fetchVideo = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await API.get(`/videos/${videoId}`);
  //     setVideo(res.data.data);
  //     // TODO: Fetch like status if you have a like check endpoint
  //   } catch (error) {
  //     console.error("Error fetching video:", error);
  //     toast.error("Failed to load video");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/videos/${videoId}/details`);
      setVideo(res.data.data);
      setIsLiked(res.data.data.isLiked);
      setLikes(res.data.data.likes);
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await API.delete(`/videos/${videoId}`);
      toast.success("Video deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  const handleTogglePublish = async () => {
    try {
      await API.patch(`/videos/toggle/publish/${videoId}`);
      const newStatus = !video.isPublished;
      setVideo((prev) => ({ ...prev, isPublished: newStatus }));
      toast.success(
        `Video ${newStatus ? "published" : "unpublished"} successfully!`
      );
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update publish status");
    }
  };

  const handleLike = async () => {
    try {
      await API.post(`/likes/toogle/v/${videoId}`);
      setIsLiked((prev) => !prev);
      fetchVideo(); // Refresh to get updated like count
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    }
  };

  const handleVideoUpdated = () => {
    fetchVideo(); // Refresh video data
    setShowEditor(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="aspect-video bg-gray-800 rounded-lg animate-pulse mb-4"></div>
        <div className="bg-gray-800 h-8 rounded animate-pulse mb-2"></div>
        <div className="bg-gray-800 h-4 rounded animate-pulse w-1/2"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className="text-white text-xl mb-2">Video not found</div>
        <Link to="/" className="text-rose-500 hover:text-rose-400">
          Go back to home
        </Link>
      </div>
    );
  }

  const isOwner = user && user._id === video.owner?._id;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
        <video
          src={video.videoFile}
          poster={video.thumbnail}
          controls
          className="w-full h-full"
          onError={(e) => {
            console.error("Video playback error:", e);
            toast.error("Error loading video");
          }}
        />
      </div>

      {/* Video Info Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl text-white font-bold mb-2">
            {video.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              {video.views || 0} views
            </div>
            <span>•</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            {isOwner && (
              <>
                <span>•</span>
                <div
                  className={`flex items-center gap-1 ${
                    video.isPublished ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {video.isPublished ? (
                    <EyeIcon className="w-4 h-4" />
                  ) : (
                    <EyeSlashIcon className="w-4 h-4" />
                  )}
                  {video.isPublished ? "Published" : "Unpublished"}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Owner Actions */}
        {isOwner && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowEditor(true)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={handleTogglePublish}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                video.isPublished
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {video.isPublished ? (
                <EyeSlashIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
              {video.isPublished ? "Unpublish" : "Publish"}
            </button>

            <button
              onClick={handleDelete}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Video Description */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
      </div>

      {/* Channel Info and Like Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Channel Info */}
        {video.owner && (
          <Link
            to={`/channel/${video.owner.username}`}
            className="flex items-center gap-3 text-teal-400 hover:text-teal-300 transition-colors"
          >
            <img
              src={video.owner.avatar || "/default-avatar.png"}
              alt={video.owner.username}
              className="w-10 h-10 rounded-full border-2 border-gray-700"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div>
              <div className="font-semibold">{video.owner.username}</div>
              <div className="text-xs text-gray-500">
                {video.owner.fullName}
              </div>
            </div>
          </Link>
        )}

        {/* Like Button */}
        <div className="flex items-center gap-4">
          <LikeButton liked={isLiked} onClick={handleLike} count={likes || 0} />
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection videoId={videoId} />

      {/* Video Editor Modal */}
      {showEditor && (
        <VideoEditor
          videoId={videoId}
          onClose={() => setShowEditor(false)}
          onUpdated={handleVideoUpdated}
        />
      )}
    </div>
  );
};

export default VideoDetails;
