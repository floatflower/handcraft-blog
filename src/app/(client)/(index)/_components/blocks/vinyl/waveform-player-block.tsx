"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface WaveformPlayerBlockProps {
  id?: string;
  src: string;
  title?: string;
  artist?: string;
}

export function WaveformPlayerBlock({
  id,
  src,
  title,
  artist,
}: WaveformPlayerBlockProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const connectedRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function formatTime(s: number) {
    if (!isFinite(s) || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const drawStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, []);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.fftSize;
    const data = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(data);

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Downsample to a manageable number of points
    const sampleCount = 300;
    const step = Math.floor(bufferLength / sampleCount);
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < sampleCount; i++) {
      // Average over the step window for a smoother signal
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += data[i * step + j] / 128 - 1;
      }
      pts.push({
        x: (i / (sampleCount - 1)) * W,
        y: H / 2 + (sum / step) * H * 0.38,
      });
    }

    // Build a smooth path using midpoint quadratic bezier
    function buildPath(c: CanvasRenderingContext2D) {
      c.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        c.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      c.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    }

    // Fill between curve and center line
    const fillGrad = ctx.createLinearGradient(0, 0, 0, H);
    fillGrad.addColorStop(0, "rgba(255,255,255,0.06)");
    fillGrad.addColorStop(0.5, "rgba(255,255,255,0.01)");
    fillGrad.addColorStop(1, "rgba(255,255,255,0.06)");
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(pts[0].x, pts[0].y);
    buildPath(ctx);
    ctx.lineTo(W, H / 2);
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Stroke the waveform line
    ctx.beginPath();
    buildPath(ctx);
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    animFrameRef.current = requestAnimationFrame(drawFrame);
  }, []);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawStatic();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [drawStatic]);

  // Toggle animation
  useEffect(() => {
    if (playing && analyserRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(drawFrame);
    } else {
      cancelAnimationFrame(animFrameRef.current);
      drawStatic();
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [playing, drawFrame, drawStatic]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration)
        setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onLoaded = () => setDuration(audio.duration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    if (audio.readyState >= 1) setDuration(audio.duration);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  function initAudio() {
    if (connectedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    connectedRef.current = true;
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    initAudio();
    if (audioCtxRef.current?.state === "suspended") {
      await audioCtxRef.current.resume();
    }
    if (playing) {
      audio.pause();
    } else {
      await audio.play();
    }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const val = Number(e.target.value);
    audio.currentTime = (val / 100) * audio.duration;
    setProgress(val);
  }

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title ?? "",
      artist: artist ?? "",
    });
    const audio = audioRef.current;
    navigator.mediaSession.setActionHandler("play", () => audio?.play());
    navigator.mediaSession.setActionHandler("pause", () => audio?.pause());
    navigator.mediaSession.setActionHandler("seekto", (d) => {
      if (audio && d.seekTime != null) audio.currentTime = d.seekTime;
    });
    navigator.mediaSession.setActionHandler("seekbackward", (d) => {
      if (audio)
        audio.currentTime = Math.max(
          0,
          audio.currentTime - (d.seekOffset ?? 10),
        );
    });
    navigator.mediaSession.setActionHandler("seekforward", (d) => {
      if (audio)
        audio.currentTime = Math.min(
          audio.duration,
          audio.currentTime + (d.seekOffset ?? 10),
        );
    });
  }, [title, artist]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }, [playing]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !duration) return;
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: 1,
      position: currentTime,
    });
  }, [currentTime, duration]);

  return (
    <section
      id={id}
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 bg-black relative overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Waveform canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Controls */}
      <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center gap-10">
        {(title || artist) && (
          <div className="text-center">
            {title && (
              <p className="text-white/90 text-lg font-semibold tracking-tight">
                {title}
              </p>
            )}
            {artist && (
              <p className="text-white/40 text-xs tracking-[0.22em] uppercase mt-1.5">
                {artist}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-8">
          <button
            onClick={toggleMute}
            className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
            aria-label={muted ? "unmute" : "mute"}
          >
            <i
              className={`fa-solid ${muted ? "fa-volume-xmark" : "fa-volume-high"} text-sm`}
            />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/15 hover:border-white/40 transition-all active:scale-95"
            aria-label={playing ? "pause" : "play"}
          >
            <i
              className={`fa-solid ${playing ? "fa-pause" : "fa-play"} text-lg ${!playing ? "ml-0.5" : ""}`}
            />
          </button>

          {/* Spacer to keep play button centred */}
          <div className="w-10 h-10" />
        </div>

        <div className="w-full flex flex-col gap-2">
          <div className="relative">
            <Progress
              value={progress}
              className='gap-0 [&_[data-slot="progress-track"]]:bg-white/15 [&_[data-slot="progress-track"]]:h-1 [&_[data-slot="progress-indicator"]]:bg-white [&_[data-slot="progress-indicator"]]:transition-none'
            />
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-white/30 text-[11px] font-mono tracking-wider">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </section>
  );
}
