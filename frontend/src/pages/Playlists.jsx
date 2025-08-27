import React, { useEffect, useState } from "react";
import API from "../api/api";
import PlaylistCard from "../components/PlaylistCard";
import { useAuth } from "../store/auth";
import { PlusIcon } from "@heroicons/react/24/outline";

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const fetchPlaylists = async () => {
    if (!user) return;
    setLoading(true);
    const res = await API.get(`/playlist/user/${user._id}`);
    setPlaylists(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (playlistId) => {
    if (window.confirm("Delete this playlist?")) {
      await API.delete(`/playlist/${playlistId}`);
      fetchPlaylists();
    }
  };

  useEffect(() => {
    fetchPlaylists();
    // eslint-disable-next-line
  }, [user]);

  // console.log(playlists);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) return;
    await API.post("/playlist", form);
    setForm({ name: "", description: "" });
    setShowCreate(false);
    fetchPlaylists();
  };

  if (!user)
    return (
      <div className="text-center mt-10">
        <div className="text-white">Please login to see your playlists.</div>
      </div>
    );

  // console.log(playlists);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl text-white font-bold">My Playlists</h1>
        <button
          onClick={() => setShowCreate((s) => !s)}
          className="flex gap-2 px-4 py-2 rounded bg-rose-600 text-white font-semibold items-center"
        >
          <PlusIcon className="w-5 h-5" /> New Playlist
        </button>
      </div>
      {showCreate && (
        <form
          className="bg-gray-800 rounded-lg p-4 mb-4 flex flex-col gap-2 border border-gray-900"
          onSubmit={handleCreate}
        >
          <input
            className="bg-gray-900 rounded p-2 text-white focus:outline-none"
            placeholder="Playlist Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <textarea
            className="bg-gray-900 rounded p-2 text-white focus:outline-none"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={2}
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-rose-600 text-white rounded px-4 py-2 font-semibold"
            >
              Create
            </button>
            <button
              type="button"
              className="rounded px-4 py-2 border border-gray-900 text-gray-300"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full text-gray-400">
            Loading playlists...
          </div>
        ) : playlists.length === 0 ? (
          <div className="col-span-full text-gray-400">No playlists found.</div>
        ) : (
          // playlists.map((p) => <PlaylistCard key={p._id} playlist={p} />)

          playlists.map((p) => (
            <div key={p._id} className="relative">
              <PlaylistCard playlist={p} />
              {user?._id === (p.owner?._id || p.owner) && (
                <button
                  onClick={() => handleDelete(p._id)}
                  className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-xs text-white rounded cursor-pointer"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlists;
