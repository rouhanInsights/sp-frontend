"use client";
import React from "react";
import { Download } from "lucide-react";

interface AudioPlayerProps {
  src: string;             // ✅ Fully-qualified URL
  label: string;
  downloadName: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, label, downloadName }) => {
  return (
    <div className="space-y-2">
      <p className="font-medium">{label}</p>

      {/* ✅ Audio player */}
      <audio controls className="w-full rounded-md border">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* ✅ Download link */}
      <a
        href={src}
        download={downloadName}
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        <Download className="w-4 h-4" />
        Download
      </a>
    </div>
  );
};

export default AudioPlayer;
