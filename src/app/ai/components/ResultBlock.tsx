"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import AudioPlayer from "./AudioPlayer";

interface ResultBlockProps {
  result: {
    raw_transcription: string;
    enhanced_text: string;
    enriched_text: string;
    enhanced_audio_url: string;
    enriched_audio_url: string;
  };
}

const ResultBlock: React.FC<ResultBlockProps> = ({ result }) => {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <label className="font-semibold">Raw Transcription:</label>
        <Textarea readOnly value={result.raw_transcription} />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Enhanced Text:</label>
        <Textarea readOnly value={result.enhanced_text} />
        <AudioPlayer
          src={`http://localhost:8000${result.enhanced_audio_url}`}
          label="Enhanced Audio"
          downloadName="enhanced_audio.mp3"
        />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Enriched Text:</label>
        <Textarea readOnly value={result.enriched_text} />
        <AudioPlayer
          src={`http://localhost:8000${result.enriched_audio_url}`}
          label="Enriched Audio"
          downloadName="enriched_audio.mp3"
        />
      </div>
    </div>
  );
};

export default ResultBlock;
