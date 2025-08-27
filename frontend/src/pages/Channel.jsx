import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import VideoCard from "../components/VideoCard";
import PlaylistCard from "../components/PlaylistCard";
import SubscriptionButton from "../components/SubscriptionButton";
import { useAuth } from "../store/auth";

const Channel = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [videos, setVideos] = useState([]);

  const fetchChannel = async () => {
    const res = await API.get(`/users/c/${username}`);
    setChannel(res.data.data);

    // userId for playlists and videos
    const uid = res.data.data._id;
    const playRes = await API.get(`/playlist/user/${uid}`);
    setPlaylists(playRes.data.data);

    setVideos(res.data.data.videos || []);
  };

  useEffect(() => {
    fetchChannel();
    // eslint-disable-next-line
  }, [username]);

  if (!channel) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div>
      <div
        className="rounded-lg overflow-hidden mb-6"
        style={{
          background: channel.coverImage
            ? `url(${channel.coverImage}) center/cover`
            : "#222",
          minHeight: "180px",
        }}
      ></div>
      <div className="flex items-center gap-6 mb-3">
        <img
          src={channel.avatar}
          alt="avatar"
          className="w-16 h-16 rounded-full border-2 border-rose-600"
        />
        <div>
          <div className="text-2xl text-white font-bold">{channel.fullName}</div>
          <div className="text-gray-400">@{channel.username}</div>
          <div className="text-sm text-gray-400">
            {channel.subscribersCount} subscribers
          </div>
        </div>
        <div className="ml-auto">
          <SubscriptionButton
            channelId={channel._id}
            isSubscribed={channel.isSubscribed}
          />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-white font-bold text-lg mb-2">Playlists</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {playlists.length === 0 ? (
            <div className="text-gray-400 col-span-full">
              No playlists found.
            </div>
          ) : (
            playlists.map((p) => <PlaylistCard key={p._id} playlist={p} />)
          )}
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-white font-bold text-lg mb-2">Videos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.length === 0 ? (
            <div className="col-span-full text-gray-400">
              No videos uploaded yet.
            </div>
          ) : (
            videos.map((v) => <VideoCard key={v._id} video={v} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;
