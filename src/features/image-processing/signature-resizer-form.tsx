'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { trackToolUsage } from '@/lib/analytics';
import { Upload, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import gsap from 'gsap';

const PRESETS = [
  { label: 'UPSC (140×60px)', width: 140, height: 60 },
  { label: 'SSC (140×60px)', width: 140, height: 60 },
  { label: 'Bank PO (140×60px)', width: 140, height: 60 },
  { label: 'GATE (160×60px)', width: 160, height: 60 },
  { label: 'Custom', width: 0, height: 0 },
];

export function SignatureResizerForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [width, setWidth] = useState('140');
  const [height, setHeight] = useState('60');
  const [activePreset, setActivePreset] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; previewUrl: string; width: number; height: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback((f: File) => {
    setError('');
    setResult(null);
    if (!f.type.startsWith('image/')) { setError('Please upload an image file'); return; }
    if (f.size > 10 * 1024 * 1024) { setError('File must be under 10MB'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const handlePreset = (index: number) => {
    setActivePreset(index);
    const p = PRESETS[index];
    if (p.width > 0) {
      setWidth(String(p.width));
      setHeight(String(p.height));
    }
  };

  const handleResize = async () => {
    if (!file || !width || !height) return;
    setProcessing(true);
    setError('');

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise<void>((resolve) => { img.onload = () => resolve(); });

      const w = parseInt(width);
      const h = parseInt(height);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fit image within bounds
      const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const offsetX = (w - drawW) / 2;
      const offsetY = (h - drawH) / 2;
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed'))), 'image/jpeg', 0.9);
      });

      setResult({ blob, previewUrl: URL.createObjectURL(blob), width: w, height: h });
      trackToolUsage('signature-resizer');
    } catch {
      setError('Failed to resize signature.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.previewUrl;
    a.download = `signature-${result.width}x${result.height}.jpg`;
    a.click();
  };

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview);
    if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
    setFile(null);
    setPreview('');
    setResult(null);
  };

  useEffect(() => {
    if (!result || !resultRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    gsap.fromTo(resultRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  }, [result]);

  if (!file) {
    return (
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[var(--border-default)] rounded-2xl bg-[var(--bg-surface)] cursor-pointer hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] transition-colors"
      >
        <Upload className="w-8 h-8 text-[var(--text-subtle)] mb-4" />
        <p className="text-sm font-medium text-[var(--text-primary)]">Upload your signature image</p>
        <p className="mt-1 text-xs text-[var(--text-subtle)]">JPEG, PNG — up to 10MB</p>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="relative w-full h-32 bg-[var(--bg-subtle)] rounded-xl overflow-hidden mb-6 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Signature preview" className="max-w-full max-h-full object-contain" />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <ImageIcon className="w-4 h-4 text-[var(--text-subtle)]" />
          <p className="text-sm font-medium truncate flex-1">{file.name}</p>
          <button onClick={handleReset} className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Presets */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Size Preset</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePreset(i)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  activePreset === i
                    ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)] border-[var(--accent-dark)]'
                    : 'border-[var(--border-soft)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-xs font-medium text-[var(--text-subtle)] mb-1">Width (px)</label>
            <input type="number" min="1" value={width} onChange={(e) => setWidth(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-subtle)] mb-1">Height (px)</label>
            <input type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)} className="form-input" />
          </div>
        </div>

        {error && <p className="text-xs text-[var(--color-error)] mb-3">{error}</p>}

        <button
          type="button"
          onClick={handleResize}
          disabled={processing}
          className="w-full h-12 flex items-center justify-center text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 disabled:opacity-50 transition-all"
        >
          {processing ? 'Resizing...' : 'Resize Signature'}
        </button>
      </div>

      <div ref={resultRef} className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        {!result ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[var(--text-subtle)]">Select a preset or enter dimensions to resize</p>
          </div>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">Resized Signature</span>
            <div className="mt-3 text-lg font-semibold">{result.width} × {result.height}px</div>

            <div className="mt-6 p-4 bg-[var(--bg-subtle)] rounded-xl flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.previewUrl} alt="Resized signature" className="max-w-full border border-[var(--border-soft)]" />
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="mt-6 w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold bg-[var(--accent-primary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Signature
            </button>

            <p className="mt-4 text-xs text-[var(--text-subtle)] text-center">
              White background applied. Processed in your browser.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
