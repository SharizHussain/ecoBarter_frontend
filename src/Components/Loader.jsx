// components/Loader.jsx
import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center w-[100vw] h-full py-20">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
