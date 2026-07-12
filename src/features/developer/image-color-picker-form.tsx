'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Copy, Check, Trash2, Pipette } from 'lucide-react';

/* ─── Color Conversion Utilities ─── */

interface ColorValues {
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
  r: number;
  g: number;
  b: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()
  );
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;

  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function linearize(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  // RGB -> linear RGB
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);

  // linear RGB -> LMS (using OKLab matrix)
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  // cube root
  const l1 = Math.cbrt(l_);
  const m1 = Math.cbrt(m_);
  const s1 = Math.cbrt(s_);

  // LMS -> OKLab
  const L = 0.2104542553 * l1 + 0.7936177850 * m1 - 0.0040720468 * s1;
  const a = 1.9779984951 * l1 - 2.4285922050 * m1 + 0.4505937099 * s1;
  const bLab = 0.0259040371 * l1 + 0.7827717662 * m1 - 0.8086757660 * s1;

  // OKLab -> OKLCH
  const C = Math.sqrt(a * a + bLab * bLab);
  let H = (Math.atan2(bLab, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return {
    l: Math.round(L * 1000) / 1000,
    c: Math.round(C * 1000) / 1000,
    h: Math.round(H * 10) / 10,
  };
}

function getColorValues(r: number, g: number, b: number): ColorValues {
  const hex = rgbToHex(r, g, b);
  const { h, s, l } = rgbToHsl(r, g, b);
  const oklch = rgbToOklch(r, g, b);

  return {
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    oklch: `oklch(${oklch.l} ${oklch.c} ${oklch.h})`,
    r,
    g,
    b,
  };
}

/* ─── Dominant Color Extraction ─── */

function extractDominantColors(imageData: ImageData, count: number = 8): ColorValues[] {
  const { data, width, height } = imageData;
  const step = Math.max(1, Math.floor((width * height) / 5000)) * 4;

  // Bucket size in each RGB dimension
  const bucketSize = 32;
  const buckets: Map<string, { r: number; g: number; b: number; count: number }> = new Map();

  for (let i = 0; i < data.length; i += step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    // Skip very dark or very light (near white/black)
    const brightness = (r + g + b) / 3;
    if (brightness < 10 || brightness > 245) continue;

    const br = Math.floor(r / bucketSize);
    const bg = Math.floor(g / bucketSize);
    const bb = Math.floor(b / bucketSize);
    const key = `${br}-${bg}-${bb}`;

    const existing = buckets.get(key);
    if (existing) {
      existing.r += r;
      existing.g += g;
      existing.b += b;
      existing.count += 1;
    } else {
      buckets.set(key, { r, g, b, count: 1 });
    }
  }

  // Sort by pixel count and take top N
  const sorted = Array.from(buckets.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, count);

  // Filter out colors that are too similar
  const results: ColorValues[] = [];
  const minDistance = bucketSize * 1.5;

  for (const bucket of sorted) {
    const avgR = Math.round(bucket.r / bucket.count);
    const avgG = Math.round(bucket.g / bucket.count);
    const avgB = Math.round(bucket.b / bucket.count);

    // Check distance from already added colors
    const tooClose = results.some((existing) => {
      const dr = existing.r - avgR;
      const dg = existing.g - avgG;
      const db = existing.b - avgB;
      return Math.sqrt(dr * dr + dg * dg + db * db) < minDistance;
    });

    if (!tooClose) {
      results.push(getColorValues(avgR, avgG, avgB));
    }

    if (results.length >= count) break;
  }

  // If we didn't get enough colors (e.g., very uniform image), relax the distance
  if (results.length < 4 && sorted.length > results.length) {
    for (const bucket of sorted) {
      if (results.length >= count) break;
      const avgR = Math.round(bucket.r / bucket.count);
      const avgG = Math.round(bucket.g / bucket.count);
      const avgB = Math.round(bucket.b / bucket.count);
      const hex = rgbToHex(avgR, avgG, avgB);
      if (!results.some((c) => c.hex === hex)) {
        results.push(getColorValues(avgR, avgG, avgB));
      }
    }
  }

  return results;
}

/* ─── Copy Button ─── */

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

/* ─── Main Component ─── */

export function ImageColorPickerForm() {
  const [file, setFile] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ w: number; h: number } | null>(null);
  const [dominantColors, setDominantColors] = useState<ColorValues[]>([]);
  const [selectedColor, setSelectedColor] = useState<ColorValues | null>(null);
  const [hoverColor, setHoverColor] = useState<ColorValues | null>(null);
  const [history, setHistory] = useState<ColorValues[]>([]);
  const [imageDataRef, setImageDataRef] = useState<ImageData | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) return;
    if (f.size > 30 * 1024 * 1024) return;

    setFile(f);
    setSelectedColor(null);
    setHoverColor(null);
    setDominantColors([]);
    setImageDataRef(null);

    const img = new Image();
    const url = URL.createObjectURL(f);
    img.src = url;

    img.onload = () => {
      setImageDimensions({ w: img.naturalWidth, h: img.naturalHeight });

      // Calculate display size (max 600px wide, maintain aspect ratio)
      const maxWidth = 600;
      const maxHeight = 500;
      let displayW = img.naturalWidth;
      let displayH = img.naturalHeight;

      if (displayW > maxWidth) {
        displayH = Math.round((maxWidth / displayW) * displayH);
        displayW = maxWidth;
      }
      if (displayH > maxHeight) {
        displayW = Math.round((maxHeight / displayH) * displayW);
        displayH = maxHeight;
      }

      setCanvasSize({ w: displayW, h: displayH });

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = displayW;
      canvas.height = displayH;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, displayW, displayH);
      const imgData = ctx.getImageData(0, 0, displayW, displayH);
      setImageDataRef(imgData);

      // Extract dominant colors
      const colors = extractDominantColors(imgData);
      setDominantColors(colors);

      URL.revokeObjectURL(url);
    };
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const getPixelColor = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!imageDataRef || !canvasRef.current) return null;

      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasSize.w / rect.width;
      const scaleY = canvasSize.h / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);

      if (x < 0 || x >= canvasSize.w || y < 0 || y >= canvasSize.h) return null;

      const idx = (y * canvasSize.w + x) * 4;
      const r = imageDataRef.data[idx];
      const g = imageDataRef.data[idx + 1];
      const b = imageDataRef.data[idx + 2];

      return getColorValues(r, g, b);
    },
    [imageDataRef, canvasSize]
  );

  const handleCanvasMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const color = getPixelColor(e);
      if (color) setHoverColor(color);
    },
    [getPixelColor]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const color = getPixelColor(e);
      if (color) {
        setSelectedColor(color);
        setHistory((prev) => {
          const updated = [color, ...prev.filter((c) => c.hex !== color.hex)];
          return updated.slice(0, 10);
        });
      }
    },
    [getPixelColor]
  );

  const handleCanvasLeave = useCallback(() => {
    setHoverColor(null);
  }, []);

  const handleReset = () => {
    setFile(null);
    setImageDimensions(null);
    setDominantColors([]);
    setSelectedColor(null);
    setHoverColor(null);
    setImageDataRef(null);
    setCanvasSize({ w: 0, h: 0 });
  };

  const handleSelectFromHistory = (color: ColorValues) => {
    setSelectedColor(color);
  };

  const handleSelectDominant = (color: ColorValues) => {
    setSelectedColor(color);
    setHistory((prev) => {
      const updated = [color, ...prev.filter((c) => c.hex !== color.hex)];
      return updated.slice(0, 10);
    });
  };

  // Redraw canvas when ref changes (needed after re-render)
  useEffect(() => {
    if (!imageDataRef || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.putImageData(imageDataRef, 0, 0);
  }, [imageDataRef]);

  const displayColor = selectedColor || hoverColor;

  return (
    <div className="space-y-6">
      {/* Upload area */}
      {!file && (
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[var(--border-default)] rounded-2xl bg-[var(--bg-surface)] cursor-pointer hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <Upload className="w-8 h-8 text-[var(--text-subtle)] mb-4" />
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Drop your image here or click to browse
          </p>
          <p className="mt-1 text-xs text-[var(--text-subtle)]">
            JPG, PNG, WebP, GIF, SVG — up to 30MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      )}

      {/* Main content */}
      {file && (
        <div className="space-y-6">
          {/* Image area + color output */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Canvas section */}
            <div className="p-4 md:p-6 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
              {/* File info bar */}
              <div className="flex items-center gap-3 mb-4">
                <Pipette className="w-4 h-4 text-[var(--text-subtle)]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {file.name}
                  </p>
                  {imageDimensions && (
                    <p className="text-xs text-[var(--text-subtle)]">
                      {imageDimensions.w} x {imageDimensions.h} px
                    </p>
                  )}
                </div>
                {/* Hover preview */}
                {hoverColor && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-[var(--border-soft)]"
                      style={{ backgroundColor: hoverColor.hex }}
                    />
                    <span className="text-xs font-mono text-[var(--text-secondary)]">
                      {hoverColor.hex}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)]"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Canvas */}
              <div className="relative flex justify-center bg-[var(--bg-subtle)] rounded-xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onMouseMove={handleCanvasMove}
                  onClick={handleCanvasClick}
                  onMouseLeave={handleCanvasLeave}
                  className="max-w-full h-auto"
                  style={{ cursor: 'crosshair' }}
                />
              </div>

              <p className="mt-3 text-xs text-[var(--text-subtle)] text-center">
                Click anywhere on the image to pick a color
              </p>
            </div>

            {/* Color output panel */}
            <div className="space-y-4">
              {/* Selected color display */}
              <div className="p-4 md:p-5 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                  Selected Color
                </h3>

                {displayColor ? (
                  <div className="space-y-4">
                    {/* Large swatch */}
                    <div
                      className="w-full h-20 rounded-xl border border-[var(--border-soft)]"
                      style={{ backgroundColor: displayColor.hex }}
                    />

                    {/* Color values */}
                    <div className="space-y-2">
                      <ColorRow label="HEX" value={displayColor.hex} />
                      <ColorRow label="RGB" value={displayColor.rgb} />
                      <ColorRow label="HSL" value={displayColor.hsl} />
                      <ColorRow label="OKLCH" value={displayColor.oklch} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-20 rounded-xl border border-dashed border-[var(--border-default)] bg-[var(--bg-subtle)]">
                    <p className="text-xs text-[var(--text-subtle)]">
                      Hover or click to pick a color
                    </p>
                  </div>
                )}
              </div>

              {/* History */}
              {history.length > 0 && (
                <div className="p-4 md:p-5 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[var(--text-primary)]">
                      Picked Colors
                    </h3>
                    <button
                      onClick={() => setHistory([])}
                      className="text-xs text-[var(--text-subtle)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {history.map((color, i) => (
                      <button
                        key={`${color.hex}-${i}`}
                        onClick={() => handleSelectFromHistory(color)}
                        className={`w-8 h-8 rounded-lg border transition-all ${
                          selectedColor?.hex === color.hex
                            ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/30 scale-110'
                            : 'border-[var(--border-soft)] hover:scale-110'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.hex}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dominant colors */}
          {dominantColors.length > 0 && (
            <div className="p-4 md:p-6 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-4">
                Dominant Colors
              </h3>
              <div className="flex flex-wrap gap-3">
                {dominantColors.map((color, i) => (
                  <button
                    key={`${color.hex}-${i}`}
                    onClick={() => handleSelectDominant(color)}
                    className="group flex flex-col items-center gap-1.5"
                  >
                    <div
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border transition-all ${
                        selectedColor?.hex === color.hex
                          ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/30 scale-105'
                          : 'border-[var(--border-soft)] group-hover:scale-105 group-hover:border-[var(--border-default)]'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[10px] font-mono text-[var(--text-subtle)] group-hover:text-[var(--text-secondary)] transition-colors">
                      {color.hex}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Color Row ─── */

function ColorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-subtle)]">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] w-10 shrink-0">
        {label}
      </span>
      <span className="flex-1 text-xs font-mono text-[var(--text-primary)] truncate">
        {value}
      </span>
      <CopyButton value={value} />
    </div>
  );
}
