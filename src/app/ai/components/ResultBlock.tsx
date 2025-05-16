"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import AudioPlayer from "./AudioPlayer";
import FeedbackScore from "./FeedbackScore";

interface ResultBlockProps {
  result: {
    raw_transcription: string;
    enhanced_text: string;
    enriched_text: string;
    enhanced_audio_url: string;
    enriched_audio_url: string;
    ai_feedback?: {
      clarity: number;
      fluency: number;
      correctness: number;
      suggestion: string;
      overall_score: number;
    };
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
          src={result.enhanced_audio_url}
          label="Enhanced Audio"
          downloadName="enhanced_audio.mp3"
        />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Enriched Text:</label>
        <Textarea readOnly value={result.enriched_text} />
        <AudioPlayer
          src={result.enriched_audio_url}
          label="Enriched Audio"
          downloadName="enriched_audio.mp3"
        />
      </div>

      {/* ✅ Pronunciation Feedback Score */}
      {result.ai_feedback?.overall_score !== undefined && (
    <FeedbackScore feedback={result.ai_feedback} />
    )}
    {/* {result.feedback_score && <FeedbackScore feedback={result.feedback_score} />} */}
    </div>
  );
};

export default ResultBlock;
