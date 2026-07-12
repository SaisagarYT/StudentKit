'use client';

import { useState, useMemo, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

// ─── Color Math Utilities ────────────────────────────────────────────────────

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    default:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
      .toUpperCase()
  );
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sNorm = s / 100;
  const lNorm = l / 100;

  if (sNorm === 0) {
    const val = Math.round(lNorm * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    let tNorm = t;
    if (tNorm < 0) tNorm += 1;
    if (tNorm > 1) tNorm -= 1;
    if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
    if (tNorm < 1 / 2) return q;
    if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
    return p;
  };

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;
  const hNorm = h / 360;

  return {
    r: Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hNorm) * 255),
    b: Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255),
  };
}

// ─── Harmony Generators ──────────────────────────────────────────────────────

type HarmonyMode =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic';

interface PaletteColor {
  hex: string;
  h: number;
  s: number;
  l: number;
  r: number;
  g: number;
  b: number;
}

function generatePalette(baseHex: string, mode: HarmonyMode): PaletteColor[] {
  const { h, s, l } = hexToHsl(baseHex);

  const makeColor = (hue: number, sat: number, lit: number): PaletteColor => {
    const normalizedHue = ((hue % 360) + 360) % 360;
    const hex = hslToHex(normalizedHue, sat, lit);
    const { r, g, b } = hslToRgb(normalizedHue, sat, lit);
    return { hex, h: normalizedHue, s: sat, l: lit, r, g, b };
  };

  switch (mode) {
    case 'complementary':
      return [makeColor(h, s, l), makeColor(h + 180, s, l)];

    case 'analogous':
      return [
        makeColor(h - 60, s, l),
        makeColor(h - 30, s, l),
        makeColor(h, s, l),
        makeColor(h + 30, s, l),
        makeColor(h + 60, s, l),
      ];

    case 'triadic':
      return [makeColor(h, s, l), makeColor(h + 120, s, l), makeColor(h + 240, s, l)];

    case 'split-complementary':
      return [makeColor(h, s, l), makeColor(h + 150, s, l), makeColor(h + 210, s, l)];

    case 'tetradic':
      return [
        makeColor(h, s, l),
        makeColor(h + 90, s, l),
        makeColor(h + 180, s, l),
        makeColor(h + 270, s, l),
      ];

    case 'monochromatic':
      return [
        makeColor(h, s, 20),
        makeColor(h, s, 35),
        makeColor(h, s, 50),
        makeColor(h, s, 65),
        makeColor(h, s, 80),
      ];

    default:
      return [makeColor(h, s, l)];
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getContrastColor(hex: string): string {
  const { r, g, b } = hslToRgb(...Object.values(hexToHsl(hex)) as [number, number, number]);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#000000' : '#FFFFFF';
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

// ─── Constants ───────────────────────────────────────────────────────────────

const HARMONY_MODES: { value: HarmonyMode; label: string; count: number }[] = [
  { value: 'complementary', label: 'Complementary', count: 2 },
  { value: 'analogous', label: 'Analogous', count: 5 },
  { value: 'triadic', label: 'Triadic', count: 3 },
  { value: 'split-complementary', label: 'Split Comp.', count: 3 },
  { value: 'tetradic', label: 'Tetradic', count: 4 },
  { value: 'monochromatic', label: 'Monochromatic', count: 5 },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function ColorPaletteForm() {
  const [baseColor, setBaseColor] = useState('#6366F1');
  const [hexInput, setHexInput] = useState('#6366F1');
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('analogous');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedExport, setCopiedExport] = useState<string | null>(null);

  const hsl = useMemo(() => hexToHsl(baseColor), [baseColor]);

  const palette = useMemo(() => generatePalette(baseColor, harmonyMode), [baseColor, harmonyMode]);

  const handleColorPickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setBaseColor(value);
    setHexInput(value);
  }, []);

  const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('#')) {
      value = '#' + value;
    }
    setHexInput(value.toUpperCase());
    if (isValidHex(value)) {
      setBaseColor(value.toUpperCase());
    }
  }, []);

  const handleHueSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHue = parseInt(e.target.value);
      const newHex = hslToHex(newHue, hsl.s, hsl.l);
      setBaseColor(newHex);
      setHexInput(newHex);
    },
    [hsl.s, hsl.l]
  );

  const copyToClipboard = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }, []);

  const copyExport = useCallback(async (type: 'css' | 'tailwind') => {
    let text: string;
    if (type === 'css') {
      text = palette
        .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
        .join('\n');
      text = `:root {\n${text}\n}`;
    } else {
      text = `colors: [${palette.map((c) => `'${c.hex}'`).join(', ')}]`;
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedExport(type);
    setTimeout(() => setCopiedExport(null), 2000);
  }, [palette]);

  return (
    <div className="space-y-8">
      {/* Top Controls */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8">
          {/* Color Picker Section */}
          <div className="space-y-5">
            <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
              Base Color
            </label>

            {/* Color picker + swatch */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="color"
                  value={baseColor}
                  onChange={handleColorPickerChange}
                  className="w-20 h-20 rounded-2xl cursor-pointer border-2 border-[var(--border-soft)] appearance-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-xl [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-xl [&::-moz-color-swatch]:border-none"
                />
              </div>
              <div
                className="w-20 h-20 rounded-2xl border border-[var(--border-soft)] shadow-sm"
                style={{ backgroundColor: baseColor }}
              />
            </div>

            {/* HEX Input */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
                HEX Value
              </label>
              <input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                placeholder="#6366F1"
                maxLength={7}
                className="form-input font-mono w-full max-w-[160px]"
              />
            </div>

            {/* Hue Slider */}
            <div>
              <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-1.5">
                Hue ({hsl.h}&deg;)
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={hsl.h}
                onChange={handleHueSliderChange}
                className="w-full h-3 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--border-strong)] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--border-strong)] [&::-moz-range-thumb]:shadow-md"
                style={{
                  background:
                    'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))',
                }}
              />
            </div>
          </div>

          {/* Harmony Mode Selector */}
          <div className="space-y-4">
            <label className="block text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
              Harmony Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {HARMONY_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setHarmonyMode(mode.value)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-xl border transition-all text-left ${
                    harmonyMode === mode.value
                      ? 'border-[var(--accent-dark)] bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                      : 'border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--border-default)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <span className="block">{mode.label}</span>
                  <span className="block text-xs opacity-70 mt-0.5">{mode.count} colors</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Palette Swatches */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
            Generated Palette
          </h2>
          <span className="text-xs text-[var(--text-subtle)]">
            Click a swatch to copy HEX
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {palette.map((color, index) => (
            <button
              key={index}
              type="button"
              onClick={() => copyToClipboard(color.hex, index)}
              className="group relative flex-1 min-w-[80px] h-24 md:h-28 rounded-xl border border-[var(--border-soft)] shadow-sm transition-all hover:scale-105 hover:shadow-md cursor-pointer"
              style={{ backgroundColor: color.hex }}
              title={`Copy ${color.hex}`}
            >
              <span
                className="absolute inset-x-0 bottom-2 text-center text-xs font-mono font-medium"
                style={{ color: getContrastColor(color.hex) }}
              >
                {copiedIndex === index ? 'Copied!' : color.hex}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Values Table */}
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <h2 className="text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider mb-5">
          Color Values
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-soft)]">
                <th className="text-left py-2 pr-3 text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
                  Color
                </th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
                  HEX
                </th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
                  RGB
                </th>
                <th className="text-left py-2 pr-3 text-xs font-medium text-[var(--text-subtle)] uppercase tracking-wider">
                  HSL
                </th>
                <th className="py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {palette.map((color, index) => (
                <ColorRow
                  key={index}
                  color={color}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => copyExport('css')}
          className="flex-1 h-12 flex items-center justify-center gap-2 text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 transition-all"
        >
          {copiedExport === 'css' ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy as CSS Variables
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => copyExport('tailwind')}
          className="flex-1 h-12 flex items-center justify-center gap-2 text-sm font-semibold border border-[var(--border-default)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-subtle)] transition-all"
        >
          {copiedExport === 'tailwind' ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy as Tailwind
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Sub-component ───────────────────────────────────────────────────────────

function ColorRow({ color, index }: { color: PaletteColor; index: number }) {
  const [copied, setCopied] = useState(false);

  const allValues = `${color.hex} | rgb(${color.r}, ${color.g}, ${color.b}) | hsl(${color.h}, ${color.s}%, ${color.l}%)`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(allValues);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = allValues;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <tr className="border-b border-[var(--border-soft)] last:border-b-0">
      <td className="py-3 pr-3">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border border-[var(--border-soft)] shrink-0"
            style={{ backgroundColor: color.hex }}
          />
          <span className="text-xs text-[var(--text-subtle)]">#{index + 1}</span>
        </div>
      </td>
      <td className="py-3 pr-3 font-mono text-xs text-[var(--text-primary)]">
        {color.hex}
      </td>
      <td className="py-3 pr-3 font-mono text-xs text-[var(--text-secondary)]">
        rgb({color.r}, {color.g}, {color.b})
      </td>
      <td className="py-3 pr-3 font-mono text-xs text-[var(--text-secondary)]">
        hsl({color.h}, {color.s}%, {color.l}%)
      </td>
      <td className="py-3">
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
          title="Copy all values"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
          )}
        </button>
      </td>
    </tr>
  );
}
