"use client";
import React from "react";
import { Download } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  label: string;
  downloadName: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, label, downloadName }) => {
  // ✅ Set the correct public Colab AI server URL
  const COLAB_AI_URL = "https://c42c-34-148-233-155.ngrok-free.app";

  // ✅ Full URL for playback and download
  const audioURL = `${COLAB_AI_URL}${src}`;

  return (
    <div className="space-y-2">
      <p className="font-medium">{label}</p>

      {/* ✅ Audio player */}
      <audio controls className="w-full rounded-md border">
        <source src={audioURL} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* ✅ Download link */}
      <a
        href={audioURL}
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
