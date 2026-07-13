'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { trackToolUsage } from '@/lib/analytics';
import { Upload, Download, Trash2, Lock, Unlock, Image as ImageIcon } from 'lucide-react';
import gsap from 'gsap';

interface ResizeResult {
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  originalSize: number;
  newSize: number;
}

export function ResizerForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [result, setResult] = useState<ResizeResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const aspectRatio = originalWidth > 0 ? originalWidth / originalHeight : 1;

  const handleFile = useCallback((f: File) => {
    setError('');
    setResult(null);

    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File size must be under 20MB');
      return;
    }

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);

    const img = new Image();
    img.onload = () => {
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    };
    img.src = url;
  }, []);

  const handleWidthChange = (val: string) => {
    setWidth(val);
    if (lockAspect && val) {
      setHeight(String(Math.round(Number(val) / aspectRatio)));
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    if (lockAspect && val) {
      setWidth(String(Math.round(Number(val) * aspectRatio)));
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
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);

      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Resize failed'))),
          outputType,
          0.92
        );
      });

      setResult({
        blob,
        previewUrl: URL.createObjectURL(blob),
        width: w,
        height: h,
        originalSize: file.size,
        newSize: blob.size,
      });
      trackToolUsage('image-resizer');
    } catch {
      setError('Failed to resize image.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.previewUrl;
    const ext = file.type === 'image/png' ? 'png' : 'jpg';
    a.download = `resized-${result.width}x${result.height}.${ext}`;
    a.click();
  };

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview);
    if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
    setFile(null);
    setPreview('');
    setResult(null);
    setWidth('');
    setHeight('');
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
        <p className="text-sm font-medium text-[var(--text-primary)]">Drop your image here or click to browse</p>
        <p className="mt-1 text-xs text-[var(--text-subtle)]">JPEG, PNG, WebP — up to 20MB</p>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        <div className="relative w-full aspect-video bg-[var(--bg-subtle)] rounded-xl overflow-hidden mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-full object-contain" />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <ImageIcon className="w-4 h-4 text-[var(--text-subtle)]" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-[var(--text-subtle)]">{originalWidth} × {originalHeight}px</p>
          </div>
          <button onClick={handleReset} className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--text-subtle)] mb-1">Width</label>
            <input type="number" min="1" value={width} onChange={(e) => handleWidthChange(e.target.value)} className="form-input" />
          </div>
          <button
            onClick={() => setLockAspect(!lockAspect)}
            className="mt-5 p-2 rounded-lg border border-[var(--border-soft)] hover:bg-[var(--bg-subtle)] transition-colors"
            title={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
          >
            {lockAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--text-subtle)] mb-1">Height</label>
            <input type="number" min="1" value={height} onChange={(e) => handleHeightChange(e.target.value)} className="form-input" />
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-[var(--color-error)]">{error}</p>}

        <button
          type="button"
          onClick={handleResize}
          disabled={processing || !width || !height}
          className="mt-6 w-full h-12 flex items-center justify-center text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 disabled:opacity-50 transition-all"
        >
          {processing ? 'Resizing...' : 'Resize Image'}
        </button>
      </div>

      <div ref={resultRef} className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
        {!result ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[var(--text-subtle)]">Set dimensions and resize to see results</p>
          </div>
        ) : (
          <>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">Resized</span>
            <div className="mt-3 text-2xl font-bold">{result.width} × {result.height}px</div>

            <div className="mt-6 relative w-full aspect-video bg-[var(--bg-subtle)] rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.previewUrl} alt="Resized" className="w-full h-full object-contain" />
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="mt-6 w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold bg-[var(--accent-primary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Resized Image
            </button>
          </>
        )}
      </div>
    </div>
  );
}
