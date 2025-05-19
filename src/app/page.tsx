"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glowDots, setGlowDots] = useState<any[]>([]);

  useEffect(() => {
    // Prepare glow dots only once (for hydration-safe rendering)
    const dots = Array.from({ length: 20 }, () => ({
      width: Math.random() * 8 + 3,
      height: Math.random() * 8 + 3,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.5,
    }));
    setGlowDots(dots);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawBackground();
    };

    const drawBackground = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(40, 50, 120, 0.9)');
      gradient.addColorStop(1, 'rgba(20, 30, 80, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Flowing lines
      const lineCount = 15;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;

      for (let i = 0; i < lineCount; i++) {
        const startX = (canvas.width * 0.3) * (i / lineCount);
        const startY = (canvas.height * 0.3) * (i / lineCount);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(
          startX + canvas.width * 0.2,
          startY + canvas.height * 0.3,
          canvas.width * 0.5 - canvas.width * 0.1,
          canvas.height * 0.7,
          canvas.width * 0.5,
          canvas.height * 0.9
        );
        ctx.stroke();
      }

      for (let i = 0; i < lineCount; i++) {
        const startX = canvas.width - (canvas.width * 0.3) * (i / lineCount);
        const startY = (canvas.height * 0.3) * (i / lineCount);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(
          startX - canvas.width * 0.2,
          startY + canvas.height * 0.3,
          canvas.width * 0.5 + canvas.width * 0.1,
          canvas.height * 0.7,
          canvas.width * 0.5,
          canvas.height * 0.9
        );
        ctx.stroke();
      }

      // Accent lines
      const accentCount = 30;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < accentCount; i++) {
        const opacity = 0.1 + Math.random() * 0.1;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        const y = canvas.height * (i / accentCount);
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < canvas.width; x += canvas.width / 20) {
          const wave = 5 + Math.sin(i) * 15;
          const offset = Math.sin(x / (canvas.width / 6)) * wave;
          ctx.lineTo(x, y + offset);
        }
        ctx.stroke();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    const animate = () => {
      drawBackground();
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      <main className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full py-4 px-6 md:px-10 flex items-center justify-between">
          <span className="text-2xl font-bold text-white">SpeechFix</span>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-200 hover:text-white">Features</a>
            <a href="#pricing" className="text-gray-200 hover:text-white">Pricing</a>
            <a href="#about" className="text-gray-200 hover:text-white">About</a>
            <a href="#contact" className="text-gray-200 hover:text-white">Contact</a>
            <a href="#help" className="text-gray-200 hover:text-white">Help</a>
          </nav>
          <Button variant="secondary" className="bg-white text-indigo-900 hover:bg-gray-100" onClick={() => router.push("/login")}>
            Login
          </Button>
        </header>

        <section className="flex-1 flex flex-col justify-center items-center text-center px-6 md:px-10 py-20">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {glowDots.map((dot, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${dot.width}px`,
                  height: `${dot.height}px`,
                  left: `${dot.left}%`,
                  top: `${dot.top}%`,
                  animation: `pulse ${dot.duration}s infinite`,
                  opacity: dot.opacity
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Your AI Assistant for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                Better Speech Clarity
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Fix audio, enhance speech, and get clear transcriptions in seconds.
              Powered by advanced AI to make your voice heard perfectly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 backdrop-blur-sm bg-opacity-80" onClick={() => router.push("/speech")}>
                Try the Demo
              </Button>
              <Button size="lg" className="bg-white hover:bg-gray-100 text-indigo-900 px-8" variant="outline" onClick={() => router.push("/speech")}>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-6 md:px-10 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 text-white">
              Transform Your Audio Experience
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              {["Speech Enhancement", "Accurate Transcription", "Real-time Processing"].map((title, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all shadow-lg">
                  <div className="w-12 h-12 bg-indigo-500/30 rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl text-indigo-300">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
                  <p className="text-gray-300">
                    {index === 0 && "Remove background noise and enhance voice clarity for crystal clear audio."}
                    {index === 1 && "Convert speech to text with remarkable accuracy, even in challenging environments."}
                    {index === 2 && "Process audio in seconds with our powerful AI engine optimized for speed."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-8 px-6 md:px-10 bg-black/40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 SpeechFix. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#terms" className="text-gray-400 hover:text-white text-sm">Terms</a>
              <a href="#privacy" className="text-gray-400 hover:text-white text-sm">Privacy</a>
              <a href="#contact" className="text-gray-400 hover:text-white text-sm">Contact</a>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
