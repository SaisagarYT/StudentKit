'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Plus, X, Save, Code, Zap, ExternalLink,
  Play, FileText, Tag, Building2, CheckCircle2, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { resourceRepository, dsaProblemRepository } from '@/lib/cms/repository';
import { useAuth } from '@/lib/firebase/auth';
import { NotionEditor } from '@/components/ui/notion-editor';
import type { ResourceApproach, CodeBlock } from '@/lib/cms/types';

const DSA_CATEGORIES = [
  'arrays-hashing', 'two-pointers', 'sliding-window', 'stack',
  'binary-search', 'linked-list', 'trees', 'tries',
  'heap-priority-queue', 'backtracking', 'graphs',
  'dynamic-programming', 'greedy', 'intervals', 'math-bit-manipulation',
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#eab308' },
  { value: 'hard', label: 'Hard', color: '#ef4444' },
];

const LANGUAGES = ['python', 'java', 'cpp', 'javascript', 'typescript', 'go'];

const COMMON_COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
  'Netflix', 'Uber', 'Bloomberg', 'Adobe', 'Goldman Sachs',
  'Oracle', 'LinkedIn', 'Salesforce', 'Twitter', 'Snap',
];

type Step = 'problem' | 'editorial';

export function DsaProblemCreator() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState<Step>('problem');

  // Problem fields
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [category, setCategory] = useState('arrays-hashing');
  const [leetcodeLink, setLeetcodeLink] = useState('');
  const [videoSolution, setVideoSolution] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [companies, setCompanies] = useState<string[]>([]);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);

  // Editorial fields
  const [content, setContent] = useState('');
  const [approaches, setApproaches] = useState<ResourceApproach[]>([]);

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const toggleCompany = (c: string) => {
    setCompanies(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const addApproach = () => {
    setApproaches([...approaches, { name: '', explanation: '', code: [], timeComplexity: '', spaceComplexity: '' }]);
  };

  const updateApproach = (i: number, partial: Partial<ResourceApproach>) => {
    const next = [...approaches];
    next[i] = { ...next[i], ...partial };
    setApproaches(next);
  };

  const removeApproach = (i: number) => setApproaches(approaches.filter((_, idx) => idx !== i));

  const addCodeBlock = (ai: number) => {
    const next = [...approaches];
    next[ai].code = [...next[ai].code, { language: 'python', code: '' }];
    setApproaches(next);
  };

  const updateCodeBlock = (ai: number, ci: number, partial: Partial<CodeBlock>) => {
    const next = [...approaches];
    next[ai].code[ci] = { ...next[ai].code[ci], ...partial };
    setApproaches(next);
  };

  const removeCodeBlock = (ai: number, ci: number) => {
    const next = [...approaches];
    next[ai].code = next[ai].code.filter((_, idx) => idx !== ci);
    setApproaches(next);
  };

  const canProceedToEditorial = title.trim().length > 0;

  const handleSave = async () => {
    if (!user || !title || !slug) return;
    setSaving(true);
    try {
      // 1. Create resource (editorial)
      const resourceId = await resourceRepository.create({
        slug,
        title,
        shortDescription: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} — ${tags.slice(0, 3).join(', ')}. ${companies.length > 0 ? `Asked at ${companies.slice(0, 3).join(', ')}.` : ''}`,
        category: 'dsa',
        difficulty: difficulty === 'hard' ? 'advanced' : difficulty === 'medium' ? 'intermediate' : 'beginner',
        content,
        approaches,
        tags: [...tags, difficulty, category, 'dsa'],
        relatedProblems: [slug],
        relatedResources: [],
        relatedRoadmaps: ['dsa-roadmap'],
        prerequisites: [],
        readTime: Math.max(3, Math.ceil(content.length / 800)),
        featured: false,
        seo: { title: `${title} — DSA Editorial | StudentKit`, description: `Solution approaches for ${title} with code in Python, Java, C++. ${tags.join(', ')}.` },
      }, user.uid);
      await resourceRepository.publish(resourceId, user.uid);

      // 2. Create DSA problem entry (linked to the resource via slug)
      await dsaProblemRepository.create({
        title,
        slug,
        difficulty,
        category,
        link: leetcodeLink,
        videoSolution,
        tags,
        companies,
        editorial: slug,
        order: 0,
      }, user.uid);

      setSaved(true);
      setTimeout(() => router.push('/admin/resources'), 1500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="py-20 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Problem & Editorial Published!</h2>
        <p className="text-xs text-[var(--text-subtle)] mt-2">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/resources" className="p-2 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-subtle)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)]">New DSA Problem</h1>
            <p className="text-[10px] text-[var(--text-subtle)]">
              {step === 'problem' ? 'Step 1 — Problem details' : 'Step 2 — Editorial & approaches'}
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold ${step === 'problem' ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : 'text-[var(--text-subtle)]'}`}>
            <span className="w-4 h-4 rounded-full bg-[var(--accent-primary)] text-[var(--bg-base)] flex items-center justify-center text-[9px] font-bold">1</span>
            Problem
          </div>
          <ArrowRight className="w-3 h-3 text-[var(--text-subtle)]" />
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold ${step === 'editorial' ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' : 'text-[var(--text-subtle)]'}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${step === 'editorial' ? 'bg-[var(--accent-primary)] text-[var(--bg-base)]' : 'bg-[var(--bg-subtle)] text-[var(--text-subtle)]'}`}>2</span>
            Editorial
          </div>
        </div>
      </div>

      {/* ─── STEP 1: Problem ─── */}
      {step === 'problem' && (
        <div className="space-y-5">
          <section className="p-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Problem Details</h2>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xl font-bold text-[var(--text-primary)] bg-transparent outline-none placeholder:text-[var(--text-subtle)] placeholder:font-normal"
                  placeholder="Problem Title (e.g., Two Sum)"
                />
                {slug && (
                  <p className="text-[10px] text-[var(--text-subtle)] mt-1">
                    Slug: <span className="text-[var(--accent-primary)] font-mono">{slug}</span>
                  </p>
                )}
              </div>

              {/* Difficulty + Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-2 block">Difficulty</label>
                  <div className="flex gap-2">
                    {DIFFICULTIES.map(d => (
                      <button
                        key={d.value}
                        onClick={() => setDifficulty(d.value as any)}
                        className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                          difficulty === d.value
                            ? 'border-current shadow-sm'
                            : 'border-[rgba(255,255,255,0.06)] text-[var(--text-subtle)] hover:border-[rgba(255,255,255,0.12)]'
                        }`}
                        style={difficulty === d.value ? { color: d.color, background: `${d.color}12` } : {}}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-2 block">Topic Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-xs font-medium border border-[rgba(255,255,255,0.08)] bg-[var(--bg-subtle)] text-[var(--text-primary)] outline-none"
                  >
                    {DSA_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> LeetCode Link
                  </label>
                  <input
                    value={leetcodeLink}
                    onChange={(e) => setLeetcodeLink(e.target.value)}
                    className="input-field text-xs"
                    placeholder="https://leetcode.com/problems/two-sum/"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Play className="w-3 h-3 text-red-400" /> Video Solution
                  </label>
                  <input
                    value={videoSolution}
                    onChange={(e) => setVideoSolution(e.target.value)}
                    className="input-field text-xs"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Tags
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-medium">
                      {tag}
                      <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-400">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="input-field text-xs flex-1"
                    placeholder="array, hash-map, two-pointers..."
                  />
                  <button onClick={addTag} className="px-3 py-1.5 rounded-lg text-[10px] font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[rgba(255,255,255,0.06)] hover:text-[var(--text-primary)] transition-colors">
                    Add
                  </button>
                </div>
              </div>

              {/* Companies */}
              <div>
                <label className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Companies
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {companies.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 font-medium">
                      {c}
                      <button onClick={() => toggleCompany(c)} className="hover:text-red-400">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowCompanyPicker(!showCompanyPicker)}
                  className="text-[10px] text-[var(--accent-primary)] hover:underline font-medium"
                >
                  + Select companies
                </button>
                {showCompanyPicker && (
                  <div className="mt-2 flex flex-wrap gap-1.5 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[rgba(255,255,255,0.05)]">
                    {COMMON_COMPANIES.map(c => (
                      <button
                        key={c}
                        onClick={() => toggleCompany(c)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-medium border transition-all ${
                          companies.includes(c)
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : 'text-[var(--text-subtle)] border-[rgba(255,255,255,0.06)] hover:text-[var(--text-primary)] hover:border-[rgba(255,255,255,0.12)]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Next button */}
          <div className="flex justify-end">
            <button
              onClick={() => setStep('editorial')}
              disabled={!canProceedToEditorial}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[var(--accent-primary)] text-[var(--bg-base)] hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Next: Add Editorial
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 2: Editorial ─── */}
      {step === 'editorial' && (
        <div className="space-y-5">
          {/* Summary of problem */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-subtle)] border border-[rgba(255,255,255,0.05)]">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[var(--text-primary)] truncate">{title}</p>
              <p className="text-[10px] text-[var(--text-subtle)]">
                {difficulty} · {category.replace(/-/g, ' ')} · {tags.length} tags · {companies.length} companies
              </p>
            </div>
            <button
              onClick={() => setStep('problem')}
              className="text-[10px] text-[var(--accent-primary)] hover:underline font-medium"
            >
              Edit
            </button>
          </div>

          {/* Approaches */}
          <section className="p-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[var(--bg-surface)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-violet-400" />
                <h2 className="text-sm font-bold text-[var(--text-primary)]">Solution Approaches</h2>
              </div>
              <button
                onClick={addApproach}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-violet-400 border border-violet-400/20 hover:bg-violet-400/5 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Approach
              </button>
            </div>

            {approaches.length === 0 && (
              <div className="py-10 text-center rounded-xl border border-dashed border-[rgba(255,255,255,0.08)]">
                <Code className="w-7 h-7 text-[var(--text-subtle)] mx-auto mb-2 opacity-30" />
                <p className="text-[11px] text-[var(--text-subtle)]">Add brute force → optimal approaches with code</p>
              </div>
            )}

            <div className="space-y-4">
              {approaches.map((approach, ai) => (
                <div key={ai} className="rounded-xl border border-[rgba(255,255,255,0.06)] overflow-hidden">
                  <div className="px-4 py-3 bg-[var(--bg-subtle)] border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded">
                        #{ai + 1}
                      </span>
                      <input
                        value={approach.name}
                        onChange={(e) => updateApproach(ai, { name: e.target.value })}
                        className="text-xs font-semibold text-[var(--text-primary)] bg-transparent outline-none placeholder:text-[var(--text-subtle)]"
                        placeholder="Approach name (e.g., Brute Force)"
                      />
                    </div>
                    <button onClick={() => removeApproach(ai)} className="p-1 rounded text-[var(--text-subtle)] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <textarea
                      value={approach.explanation}
                      onChange={(e) => updateApproach(ai, { explanation: e.target.value })}
                      className="w-full text-xs text-[var(--text-primary)] bg-transparent outline-none resize-none placeholder:text-[var(--text-subtle)] leading-relaxed"
                      placeholder="Explain the intuition..."
                      rows={3}
                    />

                    <div className="flex gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-[9px] text-[var(--text-subtle)] font-semibold shrink-0">TIME</span>
                        <input
                          value={approach.timeComplexity}
                          onChange={(e) => updateApproach(ai, { timeComplexity: e.target.value })}
                          className="flex-1 px-2.5 py-1.5 rounded-md text-[11px] font-mono text-[var(--text-primary)] bg-[var(--bg-subtle)] border border-[rgba(255,255,255,0.05)] outline-none"
                          placeholder="O(n)"
                        />
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-[9px] text-[var(--text-subtle)] font-semibold shrink-0">SPACE</span>
                        <input
                          value={approach.spaceComplexity}
                          onChange={(e) => updateApproach(ai, { spaceComplexity: e.target.value })}
                          className="flex-1 px-2.5 py-1.5 rounded-md text-[11px] font-mono text-[var(--text-primary)] bg-[var(--bg-subtle)] border border-[rgba(255,255,255,0.05)] outline-none"
                          placeholder="O(1)"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      {approach.code.map((block, ci) => (
                        <div key={ci} className="rounded-lg border border-[rgba(255,255,255,0.05)] overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[rgba(0,0,0,0.2)]">
                            <select
                              value={block.language}
                              onChange={(e) => updateCodeBlock(ai, ci, { language: e.target.value })}
                              className="text-[10px] font-medium bg-transparent text-[var(--text-subtle)] outline-none"
                            >
                              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                            <button onClick={() => removeCodeBlock(ai, ci)} className="text-[var(--text-subtle)] hover:text-red-400">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <textarea
                            value={block.code}
                            onChange={(e) => updateCodeBlock(ai, ci, { code: e.target.value })}
                            className="w-full px-3 py-3 font-mono text-[11px] text-[var(--text-primary)] bg-[rgba(0,0,0,0.15)] outline-none resize-y min-h-[100px] leading-relaxed"
                            placeholder="Paste solution code..."
                            spellCheck={false}
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => addCodeBlock(ai)}
                        className="text-[10px] text-violet-400 hover:underline font-medium"
                      >
                        + Add code in another language
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Editorial Content (Notion editor) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Editorial Content</h2>
              <span className="text-[9px] text-[var(--text-subtle)] ml-2">Optional — use markdown / slash commands</span>
            </div>

            <NotionEditor
              value={content}
              onChange={setContent}
              placeholder={"Start writing your editorial...\n\nUse / for commands, Ctrl+B for bold, Ctrl+I for italic.\n\n## Problem Statement\nGiven an array of integers...\n\n## Key Insight\nThe trick is to..."}
              minHeight="300px"
            />
          </section>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep('problem')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-[var(--text-subtle)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Problem
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? 'Publishing...' : 'Publish Problem & Editorial'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
