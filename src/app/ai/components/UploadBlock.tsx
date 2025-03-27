"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

interface UploadBlockProps {
  loading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProcess: () => void;
  errorMsg: string;
}

const UploadBlock: React.FC<UploadBlockProps> = ({
  loading,
  onFileChange,
  onProcess,
  errorMsg,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      const file = new File([audioBlob], "recorded_audio.webm", {
        type: "audio/webm",
      });
      const syntheticEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileChange(syntheticEvent);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
    const id = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    setIntervalId(id);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (intervalId) clearInterval(intervalId);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <motion.div
      className="w-full space-y-6 border rounded-xl p-6 bg-white shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 🎙️ Recording Box */}
      <div className="flex flex-col items-center justify-center border border-dashed rounded-xl p-6 bg-muted/30 space-y-4">
        <div className="text-center">
          <div className="text-xl font-semibold">Live Audio Recording</div>
          <div className="text-sm text-muted-foreground">Click the mic to start or stop</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
            size="icon"
            className="h-16 w-16 rounded-full"
          >
            {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
          <div className="text-sm font-mono mt-1">{formatTime(recordingTime)}</div>
        </div>
      </div>

      {/* 📂 Upload Section */}
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <label className="text-sm font-medium text-muted-foreground">Or upload an audio file instead</label>
        <Input
          type="file"
          accept="audio/*"
          onChange={onFileChange}
          className="max-w-xs text-center"
        />
      </div>

      {/* 🚀 Process Button */}
      <div className="text-center">
        <Button
          onClick={onProcess}
          disabled={loading}
          className="w-full max-w-sm"
        >
          {loading ? "Processing..." : "Process Audio"}
        </Button>
      </div>

      {errorMsg && <p className="text-red-500 text-sm text-center mt-2">{errorMsg}</p>}
    </motion.div>
  );
};

export default UploadBlock;
