"use client";

import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface CoverPlayerBlockProps {
  id?: string;
  src: string;
  backgroundImage: string;
  title?: string;
  artist?: string;
  label?: string;
}

export function CoverPlayerBlock({
  id,
  src,
  backgroundImage,
  title,
  artist,
  label,
}: CoverPlayerBlockProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
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

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
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

  return (
    <section
      id={id}
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden flex items-center justify-center"
    >
      {/* Blurred background */}
      <div
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(48px) brightness(0.35) saturate(1.4)",
        }}
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Player card */}
      <div className="relative z-10 w-full max-w-xs mx-auto px-4">
        <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/10 rounded-3xl px-7 pt-7 pb-8 flex flex-col items-center gap-5 shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
          {label && (
            <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase self-start">
              {label}
            </p>
          )}

          {/* Spinning vinyl */}
          <div
            className="relative w-48 h-48 rounded-full flex-shrink-0"
            style={{
              animation: "vinyl-spin 8s linear infinite",
              animationPlayState: playing ? "running" : "paused",
            }}
          >
            {/* Vinyl disc */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #181818 0%, #2c2c2c 12%, #181818 25%, #252525 38%, #181818 50%, #2a2a2a 62%, #181818 75%, #232323 88%, #181818 100%)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.06), inset 0 0 24px rgba(0,0,0,0.6), 0 24px 64px rgba(0,0,0,0.9)",
              }}
            />
            {/* Groove rings */}
            {[40, 50, 60, 70, 80, 90].map((r) => (
              <div
                key={r}
                className="absolute rounded-full border border-white/[0.025]"
                style={{
                  width: `${r}%`,
                  height: `${r}%`,
                  left: `${(100 - r) / 2}%`,
                  top: `${(100 - r) / 2}%`,
                }}
              />
            ))}
            {/* Album art */}
            <div
              className="absolute rounded-full overflow-hidden"
              style={{
                width: "40%",
                height: "40%",
                left: "30%",
                top: "30%",
              }}
            >
              <img
                src={backgroundImage}
                alt={title ?? "album art"}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Center hole */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[10%] h-[10%] rounded-full bg-zinc-900 border border-white/10" />
            </div>
          </div>

          {/* Track info */}
          <div className="text-center w-full">
            {title && (
              <p className="text-white text-base font-semibold tracking-tight leading-tight">
                {title}
              </p>
            )}
            {artist && (
              <p className="text-white/45 text-xs tracking-[0.2em] uppercase mt-1">
                {artist}
              </p>
            )}
          </div>

          {/* Progress */}
          <div className="w-full flex flex-col gap-1.5">
            <div className="relative">
              <Progress
                value={progress}
                className='gap-0 [&_[data-slot="progress-track"]]:bg-white/15 [&_[data-slot="progress-track"]]:h-[3px] [&_[data-slot="progress-indicator"]]:bg-white [&_[data-slot="progress-indicator"]]:transition-none'
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
            <div className="flex justify-between text-white/30 text-[10px] font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 w-full pt-1">
            <button
              onClick={toggleMute}
              className="w-10 h-10 flex items-center justify-center text-white/35 hover:text-white/80 transition-colors"
              aria-label={muted ? "unmute" : "mute"}
            >
              <i
                className={`fa-solid ${muted ? "fa-volume-xmark" : "fa-volume-high"} text-sm`}
              />
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black hover:bg-white/90 transition-all active:scale-95 shadow-lg"
              aria-label={playing ? "pause" : "play"}
            >
              <i
                className={`fa-solid ${playing ? "fa-pause" : "fa-play"} text-base ${!playing ? "ml-0.5" : ""}`}
              />
            </button>

            {/* Spacer */}
            <div className="w-10 h-10" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <audio ref={audioRef} src={src} preload="metadata" />
    </section>
  );
}
