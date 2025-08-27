import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { formatDistanceToNow } from "date-fns";
import LikeButton from "./LikeButton";

const TweetCard = ({ tweet, onLike, onDelete }) => {
  const { user } = useAuth();
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-3 flex flex-col gap-2 border border-gray-900">
      <div className="flex items-center gap-2">
        <Link to={`/channel/${tweet.owner?.username}`}>
          <img
            src={tweet.owner?.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full border border-gray-900"
          />
        </Link>
        <div>
          <Link
            to={`/channel/${tweet.owner?.username}`}
            className="font-medium text-fuchsia-500"
          >
            {tweet.owner?.username}
          </Link>
          <span className="ml-2 text-xs text-gray-400">
            {formatDistanceToNow(new Date(tweet.createdAt))} ago
          </span>
        </div>
        {user?._id === tweet.owner?._id && onDelete && (
          <button
            onClick={onDelete}
            className="ml-auto px-2 py-1 text-xs text-red-500 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
      <div className="text-base text-teal-500 mt-1">{tweet.content}</div>
      <div className="flex items-center gap-3 mt-1">
        {onLike && <LikeButton liked={tweet.isLiked} onClick={onLike} />}
      </div>
    </div>
  );
};

export default TweetCard;
