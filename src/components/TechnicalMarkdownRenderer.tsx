import React, { useState } from 'react';
import { Copy, Check, Info, AlertTriangle, Lightbulb } from 'lucide-react';

interface Props {
  content: string;
  className?: string;
}

export const TechnicalMarkdownRenderer: React.FC<Props> = ({ content, className = '' }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (codeText: string, idx: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Pre-process markdown into structured sections
  const codeBlocks: { lang: string; code: string }[] = [];

  // Replace code blocks with placeholders
  let textWithPlaceholders = content.replace(/```([a-zA-Z0-9_#-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: (lang || 'code').toLowerCase(), code: code.replace(/\r\n/g, '\n') });
    return `\n\n__CODE_BLOCK_${idx}__\n\n`;
  });

  // Split content by double newlines into blocks
  const rawBlocks = textWithPlaceholders.split(/\n\s*\n/);

  return (
    <div className={`technical-markdown-body ${className}`} style={{ color: 'var(--text-primary)', lineHeight: 1.75 }}>
      {rawBlocks.map((rawBlock, blockIdx) => {
        const trimmed = rawBlock.trim();
        if (!trimmed) return null;

        // Check if block is a code block placeholder
        const codeMatch = trimmed.match(/^__CODE_BLOCK_(\d+)__$/);
        if (codeMatch) {
          const idx = parseInt(codeMatch[1], 10);
          const block = codeBlocks[idx];
          if (!block) return null;

          const isCopied = copiedIndex === idx;
          const displayLang = block.lang.toUpperCase() || 'CODE';

          return (
            <div
              key={`code-${blockIdx}`}
              style={{
                background: '#0D0E12',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                margin: '1.75rem 0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
              }}
            >
              {/* Code block header with language badge and copy button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444', opacity: 0.7 }} />
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F59E0B', opacity: 0.7 }} />
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981', opacity: 0.7 }} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#FA4616',
                      letterSpacing: '0.05em',
                      marginLeft: '0.35rem'
                    }}
                  >
                    {displayLang}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(block.code, idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: isCopied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    color: isCopied ? '#34D399' : 'var(--text-secondary)',
                    border: '1px solid ' + (isCopied ? 'rgba(52, 211, 153, 0.3)' : 'rgba(255, 255, 255, 0.1)'),
                    borderRadius: '0.375rem',
                    padding: '0.25rem 0.55rem',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Copy code snippet"
                >
                  {isCopied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Code content */}
              <pre
                style={{
                  margin: 0,
                  padding: '1.25rem 1.25rem',
                  fontFamily: 'var(--font-mono, "JetBrains Mono", Consolas, Menlo, monospace)',
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  color: '#E6EDF3',
                  overflowX: 'auto',
                  background: 'transparent'
                }}
              >
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        // Callout blocks: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT]
        if (trimmed.startsWith('> [!NOTE]') || trimmed.startsWith('> [!TIP]') || trimmed.startsWith('> [!WARNING]') || trimmed.startsWith('> [!IMPORTANT]')) {
          let type = 'NOTE';
          let icon = <Info size={18} style={{ color: '#60A5FA', flexShrink: 0 }} />;
          let borderCol = 'rgba(96, 165, 250, 0.4)';
          let bgCol = 'rgba(96, 165, 250, 0.08)';

          if (trimmed.startsWith('> [!TIP]')) {
            type = 'TIP';
            icon = <Lightbulb size={18} style={{ color: '#34D399', flexShrink: 0 }} />;
            borderCol = 'rgba(52, 211, 153, 0.4)';
            bgCol = 'rgba(52, 211, 153, 0.08)';
          } else if (trimmed.startsWith('> [!WARNING]')) {
            type = 'WARNING';
            icon = <AlertTriangle size={18} style={{ color: '#FBBF24', flexShrink: 0 }} />;
            borderCol = 'rgba(251, 191, 36, 0.4)';
            bgCol = 'rgba(251, 191, 36, 0.08)';
          } else if (trimmed.startsWith('> [!IMPORTANT]')) {
            type = 'IMPORTANT';
            icon = <Info size={18} style={{ color: '#FA4616', flexShrink: 0 }} />;
            borderCol = 'rgba(250, 70, 22, 0.4)';
            bgCol = 'rgba(250, 70, 22, 0.08)';
          }

          const calloutLines = trimmed.split('\n').slice(1).map(l => l.replace(/^>\s?/, '')).join(' ');

          return (
            <div
              key={`callout-${blockIdx}`}
              style={{
                display: 'flex',
                gap: '0.85rem',
                background: bgCol,
                borderLeft: `4px solid ${borderCol}`,
                borderRadius: '0 0.5rem 0.5rem 0',
                padding: '1rem 1.25rem',
                margin: '1.5rem 0'
              }}
            >
              <div style={{ marginTop: '2px' }}>{icon}</div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: borderCol, marginBottom: '0.25rem' }}>
                  {type}
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: inlineMarkdown(calloutLines) }} />
              </div>
            </div>
          );
        }

        // Generic blockquote: >
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed.split('\n').map(l => l.replace(/^>\s?/, '')).join(' ');
          return (
            <blockquote
              key={`quote-${blockIdx}`}
              style={{
                borderLeft: '3px solid #FA4616',
                padding: '0.75rem 1.25rem',
                margin: '1.5rem 0',
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '0 0.5rem 0.5rem 0'
              }}
              dangerouslySetInnerHTML={{ __html: inlineMarkdown(quoteLines) }}
            />
          );
        }

        // Table detection (| Header 1 | Header 2 |)
        if (trimmed.includes('|') && trimmed.includes('\n|') && trimmed.includes('---')) {
          return renderTableBlock(trimmed, blockIdx);
        }

        // Headings: #, ##, ###, ####
        if (trimmed.startsWith('#')) {
          if (trimmed.startsWith('#### ')) {
            return (
              <h5
                key={`h4-${blockIdx}`}
                style={{ fontSize: '1.05rem', fontWeight: 600, color: '#F3F4F6', marginTop: '1.75rem', marginBottom: '0.65rem' }}
                dangerouslySetInnerHTML={{ __html: inlineMarkdown(trimmed.replace(/^####\s+/, '')) }}
              />
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h4
                key={`h3-${blockIdx}`}
                style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FA4616', marginTop: '2rem', marginBottom: '0.75rem' }}
                dangerouslySetInnerHTML={{ __html: inlineMarkdown(trimmed.replace(/^###\s+/, '')) }}
              />
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3
                key={`h2-${blockIdx}`}
                style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}
                dangerouslySetInnerHTML={{ __html: inlineMarkdown(trimmed.replace(/^##\s+/, '')) }}
              />
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h2
                key={`h1-${blockIdx}`}
                style={{ fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2.5rem', marginBottom: '1.25rem' }}
                dangerouslySetInnerHTML={{ __html: inlineMarkdown(trimmed.replace(/^#\s+/, '')) }}
              />
            );
          }
        }

        // Horizontal Rule
        if (trimmed === '---' || trimmed === '***') {
          return (
            <hr
              key={`hr-${blockIdx}`}
              style={{ border: 0, borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '2.5rem 0' }}
            />
          );
        }

        // Lists (unordered and ordered)
        const lines = trimmed.split('\n');
        const isBulletList = lines.every(l => /^(\s*[-*+]\s+|\s*\d+\.\s+)/.test(l));
        if (isBulletList) {
          const isOrdered = /^\s*\d+\./.test(lines[0]);
          const items = lines.map(l => l.replace(/^(\s*[-*+]\s+|\s*\d+\.\s+)/, ''));

          if (isOrdered) {
            return (
              <ol
                key={`list-${blockIdx}`}
                style={{ paddingLeft: '1.5rem', margin: '1rem 0', color: 'var(--text-secondary)' }}
              >
                {items.map((item, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
                ))}
              </ol>
            );
          } else {
            return (
              <ul
                key={`list-${blockIdx}`}
                style={{ paddingLeft: '1.5rem', margin: '1rem 0', color: 'var(--text-secondary)', listStyleType: 'disc' }}
              >
                {items.map((item, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
                ))}
              </ul>
            );
          }
        }

        // Regular paragraph
        return (
          <p
            key={`p-${blockIdx}`}
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              marginBottom: '1.25rem',
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={{ __html: inlineMarkdown(trimmed) }}
          />
        );
      })}
    </div>
  );
};

// Helper: parse inline markdown (bold, italic, inline code, links, images)
function inlineMarkdown(text: string): string {
  if (!text) return '';

  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Images: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:0.5rem;margin:1rem 0;" />');

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#FA4616;text-decoration:underline;text-underline-offset:3px;">$1</a>');

  // Bold & Italic: ***text***
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong style="color:#FFF;"><em>$1</em></strong>');

  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#FFF;font-weight:600;">$1</strong>');

  // Italic: *text* or _text_
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Strikethrough: ~~text~~
  html = html.replace(/~~([^~]+)~~/g, '<del style="opacity:0.6;">$1</del>');

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(255, 255, 255, 0.08);color:#FDBA74;padding:2px 6px;border-radius:4px;font-size:0.88em;font-family:var(--font-mono, monospace);border:1px solid rgba(255, 255, 255, 0.1);">$1</code>');

  return html;
}

// Helper: render Markdown table block
function renderTableBlock(blockText: string, blockIdx: number) {
  const lines = blockText.split('\n').filter(l => l.trim().length > 0 && l.includes('|'));
  if (lines.length < 2) return null;

  const parseRow = (line: string) => {
    return line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(cell => cell.trim());
  };

  const headerCells = parseRow(lines[0]);
  const bodyRows = lines.slice(2).map(parseRow);

  return (
    <div
      key={`table-${blockIdx}`}
      style={{
        overflowX: 'auto',
        margin: '1.75rem 0',
        borderRadius: '0.625rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.02)'
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {headerCells.map((cell, cIdx) => (
              <th
                key={cIdx}
                style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#FFFFFF' }}
                dangerouslySetInnerHTML={{ __html: inlineMarkdown(cell) }}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rIdx) => (
            <tr
              key={rIdx}
              style={{
                borderBottom: rIdx < bodyRows.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                background: rIdx % 2 === 1 ? 'rgba(255, 255, 255, 0.015)' : 'transparent'
              }}
            >
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}
                  dangerouslySetInnerHTML={{ __html: inlineMarkdown(cell) }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
