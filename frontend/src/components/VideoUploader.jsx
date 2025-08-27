import React, { useRef, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

const VideoUploader = ({ onUploaded }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });
  const [uploading, setUploading] = useState(false);
  const fileVideoRef = useRef();
  const fileThumbRef = useRef();

  const handleChange = (e) => {
    if (e.target.name === "videoFile" || e.target.name === "thumbnail") {
      setForm((f) => ({ ...f, [e.target.name]: e.target.files[0] }));
    } else {
      setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.description ||
      !form.videoFile ||
      !form.thumbnail
    ) {
      toast.error("All fields are required!");
      return;
    }
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("videoFile", form.videoFile);
    data.append("thumbnail", form.thumbnail);

    setUploading(true);
    try {
      await API.post("/videos", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Video uploaded!");
      setForm({
        title: "",
        description: "",
        videoFile: null,
        thumbnail: null,
      });
      if (onUploaded) onUploaded();
    } catch (err) {}
    setUploading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 rounded-lg p-4 flex flex-col gap-3 border border-gray-900 mb-4"
    >
      <h2 className="font-bold text-fuchsia-600 text-lg mb-2">Upload Video</h2>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Video Title"
        className="bg-gray-900 rounded p-2 text-white focus:outline-none"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Video Description"
        className="bg-gray-900 rounded p-2 text-white focus:outline-none"
        rows={2}
        required
      />
      <div className="flex gap-4">
        <div>
          <button
            type="button"
            className="px-3 py-2 bg-rose-600 rounded text-white cursor-pointer"
            onClick={() => fileVideoRef.current.click()}
          >
            {form.videoFile ? "Change Video" : "Select Video"}
          </button>
          <input
            ref={fileVideoRef}
            type="file"
            name="videoFile"
            accept="video/*"
            className="hidden"
            onChange={handleChange}
          />
          {form.videoFile && (
            <div className="text-xs text-gray-400 mt-1">
              {form.videoFile.name}
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            className="px-3 py-2 bg-rose-600 rounded text-white cursor-pointer"
            onClick={() => fileThumbRef.current.click()}
          >
            {form.thumbnail ? "Change Thumbnail" : "Select Thumbnail"}
          </button>
          <input
            ref={fileThumbRef}
            type="file"
            name="thumbnail"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
          {form.thumbnail && (
            <div className="text-xs text-gray-400 mt-1">
              {form.thumbnail.name}
            </div>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="px-4 py-2 rounded bg-rose-600 text-white font-bold mt-2 cursor-pointer"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};

export default VideoUploader;
