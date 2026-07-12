'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import gsap from 'gsap';

interface CompressedResult {
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
  blob: Blob;
  previewUrl: string;
}

export function CompressorForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [quality, setQuality] = useState(80);
  const [result, setResult] = useState<CompressedResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const dropRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setError('');
    setResult(null);

    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WebP)');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File size must be under 20MB');
      return;
    }

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Compression failed'))),
          outputType,
          quality / 100
        );
      });

      const previewUrl = URL.createObjectURL(blob);
      const reductionPercent = ((file.size - blob.size) / file.size) * 100;

      setResult({
        originalSize: file.size,
        compressedSize: blob.size,
        reductionPercent: Math.max(reductionPercent, 0),
        blob,
        previewUrl,
      });
    } catch {
      setError('Failed to compress image. Try a different file.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.previewUrl;
    const ext = file.type === 'image/png' ? 'png' : 'jpg';
    a.download = `compressed-${file.name.split('.')[0]}.${ext}`;
    a.click();
  };

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview);
    if (result?.previewUrl) URL.revokeObjectURL(result.previewUrl);
    setFile(null);
    setPreview('');
    setResult(null);
    setError('');
  };

  useEffect(() => {
    if (!result || !resultRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    gsap.fromTo(resultRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Upload area */}
      {!file && (
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[var(--border-default)] rounded-2xl bg-[var(--bg-surface)] cursor-pointer hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <Upload className="w-8 h-8 text-[var(--text-subtle)] mb-4" />
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Drop your image here or click to browse
          </p>
          <p className="mt-1 text-xs text-[var(--text-subtle)]">
            JPEG, PNG, WebP — up to 20MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      )}

      {/* Controls + preview */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
            {/* Preview */}
            <div className="relative w-full aspect-video bg-[var(--bg-subtle)] rounded-xl overflow-hidden mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>

            {/* File info */}
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-4 h-4 text-[var(--text-subtle)]" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{file.name}</p>
                <p className="text-xs text-[var(--text-subtle)]">{formatFileSize(file.size)}</p>
              </div>
              <button onClick={handleReset} className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)]">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quality slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[var(--text-primary)]">Quality</label>
                <span className="text-sm font-mono text-[var(--text-subtle)]">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-[var(--bg-subtle)] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-dark)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--bg-surface)] [&::-webkit-slider-thumb]:shadow-md"
              />
              <div className="flex justify-between mt-1 text-xs text-[var(--text-subtle)]">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompress}
              disabled={processing}
              className="mt-6 w-full h-12 flex items-center justify-center text-sm font-semibold bg-[var(--accent-dark)] text-[var(--text-inverse)] rounded-xl hover:bg-[var(--accent-dark)]/90 disabled:opacity-60 transition-all"
            >
              {processing ? 'Compressing...' : 'Compress Image'}
            </button>
          </div>

          {/* Result */}
          <div ref={resultRef} className="p-6 md:p-8 border border-[var(--border-soft)] rounded-2xl bg-[var(--bg-surface)]">
            {!result ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-[var(--text-subtle)]">
                  Adjust quality and compress to see results
                </p>
              </div>
            ) : (
              <>
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-subtle)]">
                  Compression Result
                </span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tighter text-[var(--color-success)]">
                    {result.reductionPercent.toFixed(0)}%
                  </span>
                  <span className="text-sm text-[var(--text-subtle)]">smaller</span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[var(--bg-subtle)] rounded-xl">
                    <span className="text-xs text-[var(--text-subtle)]">Original</span>
                    <div className="mt-1 text-sm font-semibold">{formatFileSize(result.originalSize)}</div>
                  </div>
                  <div className="p-3 bg-[var(--color-success)]/10 rounded-xl">
                    <span className="text-xs text-[var(--text-subtle)]">Compressed</span>
                    <div className="mt-1 text-sm font-semibold text-[var(--color-success)]">
                      {formatFileSize(result.compressedSize)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-6 w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold bg-[var(--accent-primary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--accent-primary-hover)] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Compressed Image
                </button>

                <p className="mt-4 text-xs text-[var(--text-subtle)] text-center">
                  Processed entirely in your browser — nothing uploaded.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
