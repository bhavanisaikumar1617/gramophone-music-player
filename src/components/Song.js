import React from "react";

const Song = ({ song, onSongClick }) => {
  const handleClick = () => {
    onSongClick(song); // Trigger when a song is clicked
  };

  return (
    <div
      onClick={handleClick}
      className="p-2 border rounded-md cursor-pointer hover:bg-gray-100"
    >
      <h3 className="text-lg font-semibold">{song.title}</h3>
      <p className="text-sm text-gray-600">{song.artist}</p>
    </div>
  );
};

export default Song;
