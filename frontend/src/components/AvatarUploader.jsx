import React, { useRef, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";

const AvatarUploader = ({ avatarUrl, onUpload }) => {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);
    try {
      const res = await API.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data.data);
      toast.success("Avatar updated!");
      if (onUpload) onUpload(res.data.data.avatar);
    } catch (err) {
      toast.error("Failed to upload avatar");
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={avatarUrl}
        alt="avatar"
        className="w-20 h-20 rounded-full border-2 border-rose-600 object-cover"
      />
      <button
        className="px-3 py-1 rounded bg-rose-600 text-white font-semibold text-sm cursor-pointer"
        onClick={() => fileRef.current.click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Change Avatar"}
      </button>
      <input
        type="file"
        ref={fileRef}
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default AvatarUploader;
