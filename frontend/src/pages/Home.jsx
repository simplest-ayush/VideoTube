import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import API from "../api/api";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import VideoUploader from "../components/VideoUploader";
import { useAuth } from "../store/auth";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const { user } = useAuth();

  const fetchVideos = async () => {
    const res = await API.get(
      "/videos?sortBy=createdAt&sortType=desc&limit=24"
    );
    setVideos(res.data.data.videos);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl text-white font-bold">Latest Videos</h1>
        {user && (
          <button
            onClick={() => setShowUploader((s) => !s)}
            className="flex gap-2 px-4 py-2 rounded bg-rose-600 text-white font-semibold items-center cursor-pointer"
          >
            <PlusIcon className="w-5 h-5" /> Upload
          </button>
        )}
      </div>
      {showUploader && (
        <VideoUploader
          onUploaded={() => {
            setShowUploader(false);
            fetchVideos();
          }}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {videos.length === 0 ? (
          <div className="col-span-full text-gray-400">
            No videos found. Try Logging First
          </div>
        ) : (
          videos.map((video) => <VideoCard key={video._id} video={video} />)
        )}
      </div>
    </div>
  );
};

export default Home;
