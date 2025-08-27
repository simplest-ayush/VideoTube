import React, { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import API from "../api/api";
import TweetCard from "../components/TweetCard";

const Tweets = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTweets = async () => {
    setLoading(true);
    if (!user) {
      setTweets([]);
      setLoading(false);
      return;
    }
    const res = await API.get(`/tweets/user/${user._id}`);
    setTweets(res.data.data.tweets);
    setLoading(false);
  };

  useEffect(() => {
    fetchTweets();
    // eslint-disable-next-line
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await API.post("/tweets", { content });
    setContent("");
    fetchTweets();
  };

  const handleDelete = async (tweet) => {
    if (window.confirm("Delete this tweet?")) {
      await API.delete(`/tweets/${tweet._id}`);
      fetchTweets();
    }
  };

  const handleLike = async (tweet) => {
    await API.post(`/likes/toogle/t/${tweet._id}`);
    fetchTweets();
  };

  if (!user)
    return (
      <div className="text-center mt-10">
        <div className="text-white">Please login to see your tweets.</div>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl text-white font-bold mb-3">My Tweets</h1>
      <form
        className="bg-gray-800 rounded-lg p-4 mb-4 flex flex-col gap-2 border border-gray-900"
        onSubmit={handleCreate}
      >
        <textarea
          className="bg-gray-900 rounded p-2 text-white focus:outline-none resize-none"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          rows={2}
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-rose-600 text-white rounded px-4 py-2 font-semibold"
            disabled={loading || !content.trim()}
          >
            Tweet
          </button>
        </div>
      </form>
      <div>
        {console.log(tweets)}
        {loading ? (
          <div className="text-gray-400">Loading tweets...</div>
        ) : tweets.length === 0 ? (
          <div className="text-gray-400">No tweets yet.</div>
        ) : (
          tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              onLike={() => handleLike(tweet)}
              onDelete={() => handleDelete(tweet)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Tweets;
