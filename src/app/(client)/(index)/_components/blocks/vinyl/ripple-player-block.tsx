"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface RipplePlayerBlockProps {
  id?: string;
  src: string;
  backgroundImage: string;
  title?: string;
  artist?: string;
}

interface Ripple {
  radius: number;
  maxRadius: number;
  initialOpacity: number;
}

const CIRCLE_R = 104; // px — half of 208px (w-52)
const SVG_SIZE = CIRCLE_R * 2 + 24; // 12px margin each side
const SVG_CEN = SVG_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

// Ripple trigger config
const MAX_FREQ = 300; // Hz — only analyse frequencies below this
const ENERGY_THRESHOLD = 140; // 0-255: spawn a ripple when average energy exceeds this
const RIPPLE_COOLDOWN = 200; // ms — minimum gap between two ripples

export function RipplePlayerBlock({
  id,
  src,
  backgroundImage,
  title,
  artist,
}: RipplePlayerBlockProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const connectedRef = useRef(false);
  const animFrameRef = useRef<number>(0);
  const ripplesRef = useRef<Ripple[]>([]);
  const lastRippleRef = useRef<number>(0);
  const playingRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Keep playingRef in sync for use inside the animation loop (avoids stale closure)
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

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

  // MediaSession
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title ?? "",
      artist: artist ?? "",
      artwork: [{ src: backgroundImage }],
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
  }, [title, artist, backgroundImage]);

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

  // Ripple animation loop — all mutable values via refs, no stale closures
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Spawn ripple when low-frequency energy exceeds threshold.
    // Bin count is computed from the actual AudioContext sample rate so it
    // always covers exactly 0-MAX_FREQ Hz regardless of device sample rate.
    // getByteFrequencyData returns 0-255 per bin (minDecibels→maxDecibels).
    let bassEnergy = 0;
    if (analyserRef.current && audioCtxRef.current) {
      const sampleRate = audioCtxRef.current.sampleRate;
      const binWidth = sampleRate / analyserRef.current.fftSize;
      const binCount = Math.ceil(MAX_FREQ / binWidth);

      const freq = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(freq);

      let sum = 0;
      for (let i = 0; i < binCount; i++) sum += freq[i];
      bassEnergy = sum / binCount; // 0-255 average
    }

    const now = Date.now();
    if (
      playingRef.current &&
      bassEnergy > ENERGY_THRESHOLD &&
      now - lastRippleRef.current > RIPPLE_COOLDOWN
    ) {
      lastRippleRef.current = now;
      ripplesRef.current.push({
        radius: CIRCLE_R + 6,
        maxRadius: CIRCLE_R + Math.min(W, H) * 0.38,
        initialOpacity: Math.min(0.8, 0.35 + (bassEnergy / 255) * 0.6),
      });
    }

    // Draw and advance each ripple
    // t = 0  →  at circle edge  (white, opaque)
    // t = 1  →  at max radius  (near-black, transparent)
    ripplesRef.current = ripplesRef.current.filter(
      (r) => (r.radius - CIRCLE_R) / (r.maxRadius - CIRCLE_R) < 1,
    );
    for (const ripple of ripplesRef.current) {
      const t = Math.min(
        (ripple.radius - CIRCLE_R) / (ripple.maxRadius - CIRCLE_R),
        1,
      );
      const alpha = ripple.initialOpacity * (1 - t);
      const brightness = Math.floor(255 * (1 - t * 0.95));
      ctx.beginPath();
      ctx.arc(cx, cy, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${brightness},${brightness},${brightness},${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ripple.radius += 1.5;
    }

    animFrameRef.current = requestAnimationFrame(drawFrame);
  }, []);

  useEffect(() => {
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [drawFrame]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
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

  const margin = (SVG_SIZE - CIRCLE_R * 2) / 2; // 12px

  return (
    <section
      id={id}
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden flex items-center justify-center"
    >
      {/* Background */}
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/80" />

      {/* Ripple canvas — pointer-events-none so clicks reach the buttons */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Center: SVG ring + white circle */}
      <div className="relative z-10">
        {/* SVG progress ring — extends `margin` px beyond the white circle on each side */}
        <svg
          className="absolute pointer-events-none"
          style={{
            width: SVG_SIZE,
            height: SVG_SIZE,
            top: -margin,
            left: -margin,
          }}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        >
          {/* Thin base ring — always visible */}
          <circle
            cx={SVG_CEN}
            cy={SVG_CEN}
            r={CIRCLE_R}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />
          {/* Thick progress arc — grows clockwise from 12 o'clock */}
          <circle
            cx={SVG_CEN}
            cy={SVG_CEN}
            r={CIRCLE_R}
            fill="none"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(progress / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            transform={`rotate(-90 ${SVG_CEN} ${SVG_CEN})`}
          />
        </svg>

        {/* Hollow circle */}
        <div
          className="rounded-full flex flex-col items-center justify-center gap-4"
          style={{ width: CIRCLE_R * 2, height: CIRCLE_R * 2 }}
        >
          {/* 名稱 */}
          <div className="text-center px-6">
            {title && (
              <p
                className="text-white text-sm font-semibold tracking-tight leading-tight truncate"
                style={{ maxWidth: CIRCLE_R * 1.4 }}
              >
                {title}
              </p>
            )}
            {artist && (
              <p
                className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-0.5 truncate"
                style={{ maxWidth: CIRCLE_R * 1.4 }}
              >
                {artist}
              </p>
            )}
          </div>

          {/* 播放鍵 */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:border-white/60 transition-all active:scale-95"
            aria-label={playing ? "pause" : "play"}
          >
            <i
              className={`fa-solid ${playing ? "fa-pause" : "fa-play"} text-sm ${!playing ? "ml-0.5" : ""}`}
            />
          </button>

          {/* 音量鍵 */}
          <button
            onClick={toggleMute}
            className="flex items-center justify-center text-white/35 hover:text-white/80 transition-colors"
            aria-label={muted ? "unmute" : "mute"}
          >
            <i
              className={`fa-solid ${muted ? "fa-volume-xmark" : "fa-volume-high"} text-sm`}
            />
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </section>
  );
}
