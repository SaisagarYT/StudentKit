'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb } from 'lucide-react';
import * as Icons from 'lucide-react';
import { interviewSections, companyPatterns, starMethod, resumeTips } from '@/config/placement/interview';

function toPascalCase(str: string) {
  return str.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
}

function getIcon(name: string, className?: string) {
  const key = toPascalCase(name);
  const Icon = Icons[key as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className || 'w-5 h-5'} /> : null;
}

export function InterviewPrepView() {
  const [activeTab, setActiveTab] = useState<'questions' | 'companies' | 'star' | 'resume'>('questions');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  return (
    <div className="interview-view">
      <style>{`
        .interview-view { position: relative; }

        .iv-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 28px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .iv-tab {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid var(--border-soft);
          background: transparent;
          color: var(--text-subtle);
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .iv-tab:hover { color: var(--text-primary); border-color: var(--border-default); }
        .iv-tab.active { background: var(--accent-dark); color: var(--accent-primary); border-color: var(--accent-dark); }

        .iv-section {
          border: 1px solid var(--border-soft);
          border-radius: 12px;
          margin-bottom: 12px;
          overflow: hidden;
          background: var(--bg-surface);
        }

        .iv-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          cursor: pointer;
          transition: background 0.1s;
        }

        .iv-section-header:hover { background: var(--bg-subtle); }

        .iv-section-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .iv-section-info { flex: 1; }
        .iv-section-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
        .iv-section-desc { font-size: 11px; color: var(--text-subtle); margin-top: 2px; }

        .iv-section-count { font-size: 11px; color: var(--text-subtle); flex-shrink: 0; }

        .iv-questions { border-top: 1px solid var(--border-soft); }

        .iv-question {
          border-bottom: 1px solid var(--border-soft);
          cursor: pointer;
        }

        .iv-question:last-child { border-bottom: none; }

        .iv-question-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          transition: background 0.1s;
        }

        .iv-question-header:hover { background: var(--bg-subtle); }

        .iv-question-text { flex: 1; font-size: 13px; color: var(--text-primary); font-weight: 500; }

        .iv-question-cat {
          font-size: 9px;
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          flex-shrink: 0;
        }

        .iv-tips {
          padding: 12px 18px 16px 42px;
          background: var(--bg-subtle);
          border-top: 1px solid var(--border-soft);
        }

        .iv-tips-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-subtle);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .iv-tip {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 4px;
          padding-left: 12px;
          position: relative;
        }

        .iv-tip::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--accent-primary);
        }

        .iv-sample {
          margin-top: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          border-left: 3px solid var(--accent-primary);
          background: var(--bg-surface);
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.6;
          font-style: italic;
        }

        /* Company cards */
        .iv-company-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
        }

        .iv-company-card {
          padding: 18px;
          border-radius: 12px;
          border: 1px solid var(--border-soft);
          background: var(--bg-surface);
        }

        .iv-company-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .iv-company-logo { font-size: 24px; }
        .iv-company-name { font-size: 15px; font-weight: 700; color: var(--text-primary); }

        .iv-company-diff {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
          margin-left: auto;
        }

        .iv-company-rounds {
          margin-bottom: 10px;
        }

        .iv-company-rounds-label {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-subtle);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .iv-company-round {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 3px;
        }

        .iv-company-round::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-primary);
          flex-shrink: 0;
        }

        .iv-company-tips { margin-top: 10px; }

        .iv-company-tip {
          font-size: 11px;
          color: var(--text-subtle);
          line-height: 1.5;
          margin-bottom: 2px;
          padding-left: 12px;
          position: relative;
        }

        .iv-company-tip::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--text-subtle);
        }

        /* STAR method */
        .iv-star-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .iv-star-card {
          padding: 20px;
          border-radius: 12px;
          border: 1px solid var(--border-soft);
          background: var(--bg-surface);
        }

        .iv-star-step {
          font-size: 20px;
          font-weight: 800;
          color: var(--accent-primary);
          margin-bottom: 4px;
        }

        .iv-star-desc {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 10px;
        }

        .iv-star-example {
          font-size: 11px;
          color: var(--text-subtle);
          padding: 8px 12px;
          border-radius: 6px;
          background: var(--bg-subtle);
          font-style: italic;
          line-height: 1.5;
        }

        /* Resume tips */
        .iv-resume-section {
          margin-bottom: 16px;
        }

        .iv-resume-category {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--border-soft);
        }

        .iv-resume-tip {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 4px;
          padding-left: 14px;
          position: relative;
        }

        .iv-resume-tip::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #22c55e;
          font-size: 11px;
        }
      `}</style>

      {/* Tabs */}
      <div className="iv-tabs">
        <button className={`iv-tab ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>Questions</button>
        <button className={`iv-tab ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>Companies</button>
        <button className={`iv-tab ${activeTab === 'star' ? 'active' : ''}`} onClick={() => setActiveTab('star')}>STAR Method</button>
        <button className={`iv-tab ${activeTab === 'resume' ? 'active' : ''}`} onClick={() => setActiveTab('resume')}>Resume Tips</button>
      </div>

      {/* Questions tab */}
      {activeTab === 'questions' && (
        <>
          {interviewSections.map(section => {
            const isExpanded = expandedSection === section.id;
            return (
              <div key={section.id} className="iv-section">
                <div
                  className="iv-section-header"
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                >
                  <div className="iv-section-icon" style={{ background: `${section.color}15` }}>
                    {getIcon(section.icon, 'w-4 h-4')}
                  </div>
                  <div className="iv-section-info">
                    <div className="iv-section-title">{section.title}</div>
                    <div className="iv-section-desc">{section.description}</div>
                  </div>
                  <span className="iv-section-count">{section.questions.length} Q&apos;s</span>
                  {isExpanded
                    ? <ChevronDown className="w-4 h-4 text-[var(--text-subtle)]" />
                    : <ChevronRight className="w-4 h-4 text-[var(--text-subtle)]" />
                  }
                </div>

                {isExpanded && (
                  <div className="iv-questions">
                    {section.questions.map(q => {
                      const isQExpanded = expandedQuestion === q.id;
                      return (
                        <div key={q.id} className="iv-question" onClick={() => setExpandedQuestion(isQExpanded ? null : q.id)}>
                          <div className="iv-question-header">
                            <span className="iv-question-text">{q.question}</span>
                          </div>
                          {isQExpanded && (
                            <div className="iv-tips">
                              <div className="iv-tips-label">
                                <Lightbulb className="w-3 h-3" />
                                Tips for answering
                              </div>
                              {q.tips.map((tip, i) => (
                                <div key={i} className="iv-tip">{tip}</div>
                              ))}
                              {q.sampleAnswer && (
                                <div className="iv-sample">
                                  <strong>Example:</strong> {q.sampleAnswer}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {/* Companies tab */}
      {activeTab === 'companies' && (
        <div className="iv-company-grid">
          {companyPatterns.map(company => {
            const diffColor = company.difficulty === 'very-hard' ? '#ef4444' : company.difficulty === 'hard' ? '#f59e0b' : '#22c55e';
            return (
              <div key={company.company} className="iv-company-card">
                <div className="iv-company-header">
                  <span className="iv-company-logo">{company.logo}</span>
                  <span className="iv-company-name">{company.company}</span>
                  <span className="iv-company-diff" style={{ background: `${diffColor}15`, color: diffColor }}>
                    {company.difficulty}
                  </span>
                </div>
                <div className="iv-company-rounds">
                  <div className="iv-company-rounds-label">Interview Rounds</div>
                  {company.rounds.map((round, i) => (
                    <div key={i} className="iv-company-round">{round}</div>
                  ))}
                </div>
                <div className="iv-company-tips">
                  {company.tips.map((tip, i) => (
                    <div key={i} className="iv-company-tip">{tip}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STAR Method tab */}
      {activeTab === 'star' && (
        <>
          <div className="iv-star-grid">
            {starMethod.map(item => (
              <div key={item.step} className="iv-star-card">
                <div className="iv-star-step">{item.step}</div>
                <div className="iv-star-desc">{item.description}</div>
                <div className="iv-star-example">{item.example}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Resume Tips tab */}
      {activeTab === 'resume' && (
        <>
          {resumeTips.map(section => (
            <div key={section.category} className="iv-resume-section">
              <div className="iv-resume-category">{section.category}</div>
              {section.tips.map((tip, i) => (
                <div key={i} className="iv-resume-tip">{tip}</div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
