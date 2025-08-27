import React from "react";
import { HandThumbUpIcon as SolidLike } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineLike } from "@heroicons/react/24/outline";

const LikeButton = ({ liked, onClick, count }) => (
  <button
    className={`flex items-center gap-1 px-2 py-1 rounded transition 
      ${
        liked
          ? "bg-rose-600 text-white"
          : "bg-gray-900 text-gray-300 hover:bg-gray-800"
      }`}
    onClick={onClick}
    type="button"
  >
    {liked ? (
      <SolidLike className="w-5 h-5" />
    ) : (
      <OutlineLike className="w-5 h-5" />
    )}
    {typeof count === "number" ? <span>{count}</span> : null}
  </button>
);

export default LikeButton;
