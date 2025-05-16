"use client";
import React, { useRef, useState } from "react";

const WebcamRecorder = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasStopped, setHasStopped] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(userStream);
  
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
        await videoRef.current.play().catch((err) => {
          console.error("Video play error:", err);
        });
      }
  
      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(userStream);
  
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
  
      recorder.onstop = () => {
        console.log("⛔️ Recorder stopped.");
        const fullBlob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(fullBlob);
        setHasStopped(true);
      };
  
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setHasStopped(false);
      setRecordedBlob(null);
      console.log("🎥 Recording started.");
    } catch (err) {
      console.error("getUserMedia error:", err);
      alert("Failed to access webcam/mic. Please check browser permissions.");
    }
  };
  

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      stream?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const uploadVideo = async () => {
    if (!recordedBlob) return alert("No video to upload.");
    const formData = new FormData();
    formData.append("file", recordedBlob, "recording.webm");

    const res = await fetch("/api/posture-analyze", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    console.log("🧠 AI Result:", result);
    alert("Analysis complete. Check console.");
  };

  return (
    <div className="space-y-4">
      <video ref={videoRef} width={640} height={480} muted></video>

      <div className="flex gap-4">
        {!isRecording && !hasStopped && (
          <button onClick={startRecording} className="bg-green-600 text-white px-4 py-2 rounded">
            Start Recording
          </button>
        )}

        {isRecording && (
          <button onClick={stopRecording} className="bg-red-600 text-white px-4 py-2 rounded">
            Stop Recording
          </button>
        )}

        {hasStopped && recordedBlob && (
          <button onClick={uploadVideo} className="bg-blue-600 text-white px-4 py-2 rounded">
            Upload & Analyze
          </button>
        )}
      </div>

      {recordedBlob && (
        <video controls width={640} height={480} src={URL.createObjectURL(recordedBlob)}></video>
      )}
    </div>
  );
};

export default WebcamRecorder;
