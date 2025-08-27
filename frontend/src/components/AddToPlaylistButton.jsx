import React, { useState, useEffect } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ReactDOM from "react-dom";
import API from "../api/api";
import { useAuth } from "../store/auth";

// Modal component rendered via portal
function AddToPlaylistModal({ show, onClose, playlists, addingTo, handleAdd }) {
  if (!show) return null;
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border border-black relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-black">
          <h2 className="text-lg font-semibold text-white">Add to Playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-fuchsia-400 transition-colors"
            tabIndex={0}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Content */}
        <div className="p-4">
          {playlists.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">No playlists found</div>
              <div className="text-sm text-gray-500">
                Create a playlist first to add videos
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => handleAdd(playlist._id)}
                  disabled={addingTo === playlist._id}
                  className="w-full text-left p-3 rounded-lg bg-blue-950 hover:bg-blue-900 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-white font-medium">
                        {playlist.name}
                      </div>
                      {playlist.description && (
                        <div className="text-sm text-gray-400 truncate">
                          {playlist.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {playlist.totalVideos || 0} videos
                      </div>
                    </div>
                    {addingTo === playlist._id && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-vt-accent border-t-transparent ml-2"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body // Portal target
  );
}

const AddToPlaylistButton = ({ videoId, onAdded }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [show, setShow] = useState(false);
  const [addingTo, setAddingTo] = useState(null);

  useEffect(() => {
    if (show && user) {
      fetchPlaylists();
    }
    // eslint-disable-next-line
  }, [show, user]);

  const fetchPlaylists = async () => {
    try {
      const res = await API.get(`/playlist/user/${user._id}`);
      setPlaylists(res.data.data || []);
    } catch {
      setPlaylists([]);
    }
  };

  const handleAdd = async (playlistId) => {
    setAddingTo(playlistId);
    try {
      await API.patch(`/playlist/add/${videoId}/${playlistId}`);
      setShow(false);
      if (onAdded) onAdded();
    } catch {}
    setAddingTo(null);
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShow(true);
        }}
        className="flex items-center gap-2 bg-vt-accent hover:bg-vt-darker text-white px-3 py-2 rounded-md transition shadow font-medium bg-blue-950 cursor-pointer"
        title="Add to playlist"
        type="button"
      >
        <PlusIcon className="w-4 h-4" />
        Add to Playlist
      </button>
      <AddToPlaylistModal
        show={show}
        onClose={() => setShow(false)}
        playlists={playlists}
        addingTo={addingTo}
        handleAdd={handleAdd}
      />
    </>
  );
};

export default AddToPlaylistButton;
