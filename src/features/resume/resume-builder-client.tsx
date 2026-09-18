'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Download, Eye, Edit3, Plus, Trash2,
  User, Briefcase, GraduationCap, Code, Award, Link2, Mail, Phone, MapPin
} from 'lucide-react';

const RESUME_KEY = 'sk-resume-data';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Project {
  id: string;
  name: string;
  tech: string;
  description: string;
  link: string;
}

interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  certifications: string[];
}

const DEFAULT_DATA: ResumeData = {
  personal: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
};

function loadResumeData(): ResumeData {
  try {
    const raw = localStorage.getItem(RESUME_KEY);
    return raw ? { ...DEFAULT_DATA, ...JSON.parse(raw) } : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

function saveResumeData(data: ResumeData) {
  localStorage.setItem(RESUME_KEY, JSON.stringify(data));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function InputField({ label, value, onChange, placeholder, icon: Icon, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; icon?: React.ElementType; type?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1 block">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-subtle)]" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors`}
        />
      </div>
    </div>
  );
}

/**
 * ResumePreview — intentionally uses fixed light-mode colors (white bg, dark text,
 * gray borders) because this is the actual print/PDF output which must be
 * professional and legible regardless of the site's current theme.
 */
function ResumePreview({ data }: { data: ResumeData }) {
  const { personal } = data;
  return (
    <div
      id="resume-preview"
      className="bg-white text-black p-8 text-[11px] leading-[1.4] min-h-[842px] w-full max-w-[595px] mx-auto"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      {/* Header */}
      <div className="text-center mb-4 pb-3 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-1">{personal.fullName || 'Your Name'}</h1>
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-1.5">Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-1.5">Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-gray-900">{exp.role}</span>
                <span className="text-[10px] text-gray-500">{exp.startDate} – {exp.endDate || 'Present'}</span>
              </div>
              <div className="text-gray-600 italic">{exp.company}</div>
              {exp.bullets.length > 0 && (
                <ul className="mt-0.5 ml-3 list-disc text-gray-700">
                  {exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-1.5">Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-1.5">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-gray-900">{edu.degree}</span>
                <span className="text-[10px] text-gray-500">{edu.startDate} – {edu.endDate || 'Present'}</span>
              </div>
              <div className="text-gray-600">{edu.institution}{edu.gpa && ` · GPA: ${edu.gpa}`}</div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-1.5">Projects</h2>
          {data.projects.map(proj => (
            <div key={proj.id} className="mb-1.5">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-gray-900">{proj.name}</span>
                {proj.tech && <span className="text-[9px] text-gray-500">({proj.tech})</span>}
              </div>
              <p className="text-gray-700">{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-1.5">Skills</h2>
          <p className="text-gray-700">{data.skills.join(' · ')}</p>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-0.5 mb-1.5">Certifications</h2>
          <ul className="ml-3 list-disc text-gray-700">
            {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ResumeBuilderClient() {
  const [data, setData] = useState<ResumeData>(DEFAULT_DATA);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [activeSection, setActiveSection] = useState('personal');
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  useEffect(() => {
    setMounted(true);
    setData(loadResumeData());
  }, []);

  const update = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setData(prev => {
      const next = updater(prev);
      saveResumeData(next);
      return next;
    });
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (!mounted) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sections = [
    { id: 'personal',    label: 'Personal',    icon: User },
    { id: 'experience',  label: 'Experience',  icon: Briefcase },
    { id: 'education',   label: 'Education',   icon: GraduationCap },
    { id: 'projects',    label: 'Projects',    icon: Code },
    { id: 'skills',      label: 'Skills',      icon: Award },
  ];

  return (
    <div className="py-8 md:py-12">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #resume-preview, #resume-preview * { visibility: visible; }
          #resume-preview { position: absolute; top: 0; left: 0; width: 100%; padding: 0.5in; }
        }
      `}</style>

      <div className="container-main max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Resume Builder</h1>
              <p className="text-xs text-[var(--text-subtle)]">ATS-friendly · Auto-saved · Print to PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab toggle */}
            <div className="flex items-center bg-[var(--bg-subtle)] rounded-sm p-0.5 border border-[var(--border-soft)]">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                  activeTab === 'edit'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]'
                    : 'text-[var(--text-subtle)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <Edit3 className="w-3 h-3 inline mr-1" />Edit
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                  activeTab === 'preview'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]'
                    : 'text-[var(--text-subtle)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <Eye className="w-3 h-3 inline mr-1" />Preview
              </button>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-[var(--accent-dark)] text-[var(--text-inverse)] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>
        </motion.div>

        {activeTab === 'preview' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-auto rounded-sm border border-[var(--border-soft)] shadow-[var(--shadow-md)]"
          >
            <ResumePreview data={data} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Section nav */}
            <div className="lg:col-span-1">
              <nav className="space-y-1 sticky top-20">
                {sections.map(s => {
                  const Icon = s.icon;
                  const isActive = activeSection === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSection(s.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[var(--accent-dark)] text-[var(--text-inverse)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {s.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Form area */}
            <div className="lg:col-span-3 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] p-6">

              {/* ── Personal ── */}
              {activeSection === 'personal' && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-[var(--text-primary)] mb-4">Personal Information</h2>
                  <InputField label="Full Name" value={data.personal.fullName} onChange={(v) => update(d => ({ ...d, personal: { ...d.personal, fullName: v } }))} placeholder="John Doe" icon={User} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Email" value={data.personal.email} onChange={(v) => update(d => ({ ...d, personal: { ...d.personal, email: v } }))} placeholder="john@email.com" icon={Mail} type="email" />
                    <InputField label="Phone" value={data.personal.phone} onChange={(v) => update(d => ({ ...d, personal: { ...d.personal, phone: v } }))} placeholder="+91 98765 43210" icon={Phone} />
                  </div>
                  <InputField label="Location" value={data.personal.location} onChange={(v) => update(d => ({ ...d, personal: { ...d.personal, location: v } }))} placeholder="Mumbai, India" icon={MapPin} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="LinkedIn" value={data.personal.linkedin} onChange={(v) => update(d => ({ ...d, personal: { ...d.personal, linkedin: v } }))} placeholder="linkedin.com/in/johndoe" icon={Link2} />
                    <InputField label="GitHub" value={data.personal.github} onChange={(v) => update(d => ({ ...d, personal: { ...d.personal, github: v } }))} placeholder="github.com/johndoe" icon={Code} />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1 block">Summary</label>
                    <textarea
                      value={data.summary}
                      onChange={(e) => update(d => ({ ...d, summary: e.target.value }))}
                      placeholder="Brief professional summary (2-3 sentences)..."
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-primary)] resize-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* ── Experience ── */}
              {activeSection === 'experience' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-[var(--text-primary)]">Experience</h2>
                    <button
                      onClick={() => update(d => ({ ...d, experience: [...d.experience, { id: generateId(), company: '', role: '', startDate: '', endDate: '', bullets: [''] }] }))}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[11px] font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-3 h-3" />Add
                    </button>
                  </div>
                  {data.experience.length === 0 && (
                    <p className="text-xs text-[var(--text-subtle)] text-center py-8">No experience added yet</p>
                  )}
                  <div className="space-y-4">
                    {data.experience.map((exp, idx) => (
                      <div key={exp.id} className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">#{idx + 1}</span>
                          <button
                            onClick={() => update(d => ({ ...d, experience: d.experience.filter(e => e.id !== exp.id) }))}
                            className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <InputField label="Company" value={exp.company} onChange={(v) => update(d => ({ ...d, experience: d.experience.map(e => e.id === exp.id ? { ...e, company: v } : e) }))} placeholder="Company name" />
                          <InputField label="Role" value={exp.role} onChange={(v) => update(d => ({ ...d, experience: d.experience.map(e => e.id === exp.id ? { ...e, role: v } : e) }))} placeholder="Software Engineer" />
                          <InputField label="Start" value={exp.startDate} onChange={(v) => update(d => ({ ...d, experience: d.experience.map(e => e.id === exp.id ? { ...e, startDate: v } : e) }))} placeholder="Jan 2024" />
                          <InputField label="End" value={exp.endDate} onChange={(v) => update(d => ({ ...d, experience: d.experience.map(e => e.id === exp.id ? { ...e, endDate: v } : e) }))} placeholder="Present" />
                        </div>
                        <label className="text-[11px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1 block">Bullet Points</label>
                        {exp.bullets.map((bullet, bi) => (
                          <div key={bi} className="flex items-center gap-2 mb-1.5">
                            <span className="text-[9px] text-[var(--text-subtle)]">•</span>
                            <input
                              value={bullet}
                              onChange={(e) => update(d => ({ ...d, experience: d.experience.map(ex => ex.id === exp.id ? { ...ex, bullets: ex.bullets.map((b, i) => i === bi ? e.target.value : b) } : ex) }))}
                              placeholder="Describe your accomplishment..."
                              className="flex-1 px-2 py-1.5 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-primary)]"
                            />
                            <button
                              onClick={() => update(d => ({ ...d, experience: d.experience.map(ex => ex.id === exp.id ? { ...ex, bullets: ex.bullets.filter((_, i) => i !== bi) } : ex) }))}
                              className="text-[var(--text-subtle)] hover:text-[var(--color-error)] transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => update(d => ({ ...d, experience: d.experience.map(ex => ex.id === exp.id ? { ...ex, bullets: [...ex.bullets, ''] } : ex) }))}
                          className="text-[10px] font-medium text-[var(--accent-dark)] hover:underline mt-1"
                        >+ Add bullet</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Education ── */}
              {activeSection === 'education' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-[var(--text-primary)]">Education</h2>
                    <button
                      onClick={() => update(d => ({ ...d, education: [...d.education, { id: generateId(), institution: '', degree: '', startDate: '', endDate: '', gpa: '' }] }))}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[11px] font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-3 h-3" />Add
                    </button>
                  </div>
                  {data.education.length === 0 && (
                    <p className="text-xs text-[var(--text-subtle)] text-center py-8">No education added yet</p>
                  )}
                  <div className="space-y-4">
                    {data.education.map((edu, idx) => (
                      <div key={edu.id} className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">#{idx + 1}</span>
                          <button
                            onClick={() => update(d => ({ ...d, education: d.education.filter(e => e.id !== edu.id) }))}
                            className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <InputField label="Institution" value={edu.institution} onChange={(v) => update(d => ({ ...d, education: d.education.map(e => e.id === edu.id ? { ...e, institution: v } : e) }))} placeholder="IIT Bombay" />
                          <InputField label="Degree" value={edu.degree} onChange={(v) => update(d => ({ ...d, education: d.education.map(e => e.id === edu.id ? { ...e, degree: v } : e) }))} placeholder="B.Tech Computer Science" />
                          <InputField label="Start" value={edu.startDate} onChange={(v) => update(d => ({ ...d, education: d.education.map(e => e.id === edu.id ? { ...e, startDate: v } : e) }))} placeholder="2020" />
                          <InputField label="End" value={edu.endDate} onChange={(v) => update(d => ({ ...d, education: d.education.map(e => e.id === edu.id ? { ...e, endDate: v } : e) }))} placeholder="2024" />
                          <InputField label="GPA" value={edu.gpa} onChange={(v) => update(d => ({ ...d, education: d.education.map(e => e.id === edu.id ? { ...e, gpa: v } : e) }))} placeholder="8.5/10" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Projects ── */}
              {activeSection === 'projects' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-[var(--text-primary)]">Projects</h2>
                    <button
                      onClick={() => update(d => ({ ...d, projects: [...d.projects, { id: generateId(), name: '', tech: '', description: '', link: '' }] }))}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[11px] font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-3 h-3" />Add
                    </button>
                  </div>
                  {data.projects.length === 0 && (
                    <p className="text-xs text-[var(--text-subtle)] text-center py-8">No projects added yet</p>
                  )}
                  <div className="space-y-4">
                    {data.projects.map((proj, idx) => (
                      <div key={proj.id} className="p-4 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-subtle)]">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase">#{idx + 1}</span>
                          <button
                            onClick={() => update(d => ({ ...d, projects: d.projects.filter(p => p.id !== proj.id) }))}
                            className="p-1 rounded-sm text-[var(--text-subtle)] hover:text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <InputField label="Project Name" value={proj.name} onChange={(v) => update(d => ({ ...d, projects: d.projects.map(p => p.id === proj.id ? { ...p, name: v } : p) }))} placeholder="StudentKit" />
                          <InputField label="Tech Stack" value={proj.tech} onChange={(v) => update(d => ({ ...d, projects: d.projects.map(p => p.id === proj.id ? { ...p, tech: v } : p) }))} placeholder="React, Next.js, Firebase" />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider mb-1 block">Description</label>
                          <textarea
                            value={proj.description}
                            onChange={(e) => update(d => ({ ...d, projects: d.projects.map(p => p.id === proj.id ? { ...p, description: e.target.value } : p) }))}
                            placeholder="Brief description of what you built and its impact..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Skills & Certifications ── */}
              {activeSection === 'skills' && (
                <div className="space-y-8">
                  {/* Skills */}
                  <div>
                    <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {data.skills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)] text-xs text-[var(--text-secondary)]">
                          {skill}
                          <button
                            onClick={() => update(d => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }))}
                            className="text-[var(--text-subtle)] hover:text-[var(--color-error)] transition-colors"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newSkill.trim()) {
                            update(d => ({ ...d, skills: [...d.skills, newSkill.trim()] }));
                            setNewSkill('');
                          }
                        }}
                        placeholder="Type a skill and press Enter..."
                        className="flex-1 px-3 py-2 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                      <button
                        onClick={() => { if (newSkill.trim()) { update(d => ({ ...d, skills: [...d.skills, newSkill.trim()] })); setNewSkill(''); } }}
                        className="px-3 py-2 rounded-sm text-xs font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
                      >Add</button>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3">Certifications</h2>
                    <div className="space-y-2 mb-3">
                      {data.certifications.map((cert, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 rounded-sm bg-[var(--bg-subtle)] border border-[var(--border-soft)]">
                          <span className="text-xs text-[var(--text-secondary)]">{cert}</span>
                          <button
                            onClick={() => update(d => ({ ...d, certifications: d.certifications.filter((_, idx) => idx !== i) }))}
                            className="text-[var(--text-subtle)] hover:text-[var(--color-error)] transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        value={newCert}
                        onChange={(e) => setNewCert(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newCert.trim()) {
                            update(d => ({ ...d, certifications: [...d.certifications, newCert.trim()] }));
                            setNewCert('');
                          }
                        }}
                        placeholder="AWS Certified Solutions Architect..."
                        className="flex-1 px-3 py-2 rounded-sm border border-[var(--border-soft)] bg-[var(--bg-surface)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                      <button
                        onClick={() => { if (newCert.trim()) { update(d => ({ ...d, certifications: [...d.certifications, newCert.trim()] })); setNewCert(''); } }}
                        className="px-3 py-2 rounded-sm text-xs font-medium bg-[var(--accent-dark)] text-[var(--text-inverse)] hover:opacity-90 transition-opacity"
                      >Add</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
