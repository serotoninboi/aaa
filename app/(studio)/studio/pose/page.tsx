"use client";
import { useState, useCallback } from "react";
import { useAuth } from "@/components/AuthContext";
import { DropZone } from "@/components/DropZone";
import { ResultPanel } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const POSE_PRESETS = [
  { id: "standing", label: "Standing", desc: "Neutral standing pose" },
  { id: "sitting", label: "Sitting", desc: "Seated position" },
  { id: "walking", label: "Walking", desc: "Mid-stride walking" },
  { id: "arms_raised", label: "Arms Raised", desc: "Both arms raised up" },
  { id: "crossed_arms", label: "Arms Crossed", desc: "Arms folded across chest" },
  { id: "dancing", label: "Dancing", desc: "Dynamic expressive pose" },
  { id: "running", label: "Running", desc: "Full sprint, body leaning" },
  { id: "crouching", label: "Crouching", desc: "Low crouch position" },
];

export default function PoseEditorPage() {
  const { token } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customPose, setCustomPose] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFile = useCallback((file: File) => {
    setImage(file);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const clear = () => { setImage(null); setPreview(null); setResult(null); };

  const activePose = customPose.trim() || selectedPreset;

  const handleSubmit = async () => {
    if (!image || !activePose) { setError("Upload an image and select or describe a pose"); return; }
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.append("image", image);
    fd.append("pose", activePose);
    try {
      const res = await fetch("/api/pose-edit", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-8 pb-6 border-b border-border">
        <div className="flex items-baseline gap-3 mb-1">
          <h1 className="font-display text-3xl">Pose Edit</h1>
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">AnyPose</span>
        </div>
        <p className="text-sm text-muted-foreground">Transfer any pose onto a character while preserving their appearance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left */}
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Source Image</Label>
              {image && (
                <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  <X className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
            <DropZone onFile={handleFile} preview={preview} />
          </div>

          <div className="space-y-2">
            <Label>Pose Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              {POSE_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPreset(p.desc); setCustomPose(""); }}
                  className={cn(
                    "text-left px-3 py-2.5 rounded-md border transition-colors text-xs font-mono",
                    selectedPreset === p.desc && !customPose
                      ? "border-foreground bg-foreground/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                  )}
                >
                  <span className="font-semibold block">{p.label}</span>
                  <span className="text-muted-foreground text-[10px]">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Custom Pose</Label>
            <Input
              placeholder="e.g. Person jumping with one arm extended toward camera"
              value={customPose}
              onChange={e => { setCustomPose(e.target.value); setSelectedPreset(""); }}
            />
          </div>

          {error && (
            <p className="text-xs text-destructive border border-destructive/30 bg-destructive/5 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <Button onClick={handleSubmit} disabled={loading || !image} className="w-full">
            {loading ? <><span className="h-3 w-3 animate-spin rounded-full border border-white/20 border-t-primary" /> Applying pose…</> : "Apply Pose →"}
          </Button>
        </div>

        {/* Right */}
        <div className="space-y-2">
          <Label>Output</Label>
          <ResultPanel
            result={result}
            loading={loading}

            // loadingLabel="Transferring pose…"
            label="Pose result will appear here"
          />
        </div>
      </div>
    </div>
  );
}
