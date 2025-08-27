import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useAuth } from "../store/auth";
import LikeButton from "./LikeButton";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const Comment = ({ comment, onLike, onEdit, onDelete, user }) => (
  <div className="flex items-start gap-3 py-2 border-b border-gray-900 last:border-none">
    <img
      src={comment.owner?.avatar}
      alt="avatar"
      className="w-8 h-8 rounded-full border border-gray-900"
    />
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-medium text-rose-600">
          {comment.owner?.username}
        </span>
        <span className="ml-2 text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
        {user?._id === comment.owner?._id && (
          <div className="ml-auto flex gap-1">
            <button
              title="Edit"
              className="p-1 hover:bg-gray-800 rounded"
              onClick={() => onEdit(comment)}
            >
              <PencilIcon className="w-4 h-4 text-gray-400" />
            </button>
            <button
              title="Delete"
              className="p-1 hover:bg-gray-800 rounded"
              onClick={() => onDelete(comment)}
            >
              <TrashIcon className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}
      </div>
      <div className="mt-1 text-amber-100">{comment.content}</div>
      <div className="flex items-center gap-2 mt-1">
        <LikeButton
          liked={comment.isLiked}
          count={comment.likes || 0}
          onClick={() => onLike(comment)}
        />
      </div>
    </div>
  </div>
);

const CommentSection = ({ videoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/comments/${videoId}`);
      setComments(res.data.data.comments || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) fetchComments();
    // eslint-disable-next-line
  }, [videoId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await API.post(`/comments/${videoId}`, { content });
    setContent("");
    fetchComments();
  };

  const handleEdit = (comment) => {
    setEditing(comment);
    setContent(comment.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await API.patch(`/comments/c/${editing._id}`, { content });
    setEditing(null);
    setContent("");
    fetchComments();
  };

  const handleDelete = async (comment) => {
    if (window.confirm("Delete this comment?")) {
      await API.delete(`/comments/c/${comment._id}`);
      fetchComments();
    }
  };

  const handleLike = async (comment) => {
    await API.post(`/likes/toogle/c/${comment._id}`);
    fetchComments();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-6">
      <h3 className="font-bold text-white mb-2 text-lg">Comments</h3>
      {user && (
        <form
          onSubmit={editing ? handleUpdate : handleAdd}
          className="flex items-end gap-2 mb-3"
        >
          <img
            src={user.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full border border-gray-900"
          />
          <textarea
            className="flex-1 bg-gray-900 text-white rounded p-2 resize-none h-12 focus:outline-none"
            placeholder="Leave a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={300}
          />
          <button
            type="submit"
            className="h-12 bg-rose-600 px-3 py-2 rounded text-white font-bold cursor-pointer"
          >
            {editing ? "Update" : "Post"}
          </button>
          {editing && (
            <button
              type="button"
              className="ml-1 px-2 py-2 rounded text-xs text-gray-300 hover:underline"
              onClick={() => {
                setEditing(null);
                setContent("");
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}
      <div>
        {loading ? (
          <div className="text-gray-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-gray-400">No comments yet.</div>
        ) : (
          comments.map((c) => (
            <Comment
              key={c._id}
              comment={c}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
              user={user}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
