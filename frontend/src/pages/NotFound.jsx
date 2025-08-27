import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-5xl font-bold text-rose-600 mb-2">404</h1>
    <div className="text-2xl text-white font-semibold mb-4">Page Not Found</div>
    <Link to="/" className="text-rose-600 underline hover:text-pink-400">
      Go Home
    </Link>
  </div>
);

export default NotFound;
