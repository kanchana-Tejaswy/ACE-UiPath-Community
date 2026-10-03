import React, { useState } from 'react';
import { Copy, Check, Info, AlertTriangle, Lightbulb, AlertOctagon, ExternalLink } from 'lucide-react';

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

  if (!content || !content.trim()) {
    return null;
  }

  // Pre-process markdown into structured sections
  const codeBlocks: { lang: string; code: string }[] = [];

  // 1. Normalize line endings
  let normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Replace code blocks with placeholders first to preserve whitespace
  normalized = normalized.replace(/```([a-zA-Z0-9_#-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: (lang || 'code').toLowerCase(), code });
    return `\n\n__CODE_BLOCK_${idx}__\n\n`;
  });

  // 3. Remove orphan `#` lines that have no title text (e.g. solitary `#` or `##` on a line)
  normalized = normalized.replace(/(^|\n)[ \t]*#+[ \t]*(\n|$)/g, '$1\n$2');

  // 4. Ensure headings with content are isolated on their own blocks
  normalized = normalized.replace(/(^|\n)(#{1,6}\s+[^\n]+)(\n|$)/g, '\n\n$2\n\n');

  // 5. Ensure callouts / blockquotes have block separation
  normalized = normalized.replace(/(^|\n)(>\s?[^\n]+(\n>[^\n]*)*)(\n|$)/g, '\n\n$2\n\n');

  // 6. Ensure horizontal rules are separated
  normalized = normalized.replace(/(^|\n)(---|---|\*\*\*|___)(\n|$)/g, '\n\n$2\n\n');

  // 7. Split content into discrete blocks
  const rawBlocks = normalized.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);

  return (
    <div className={`technical-markdown-body ${className}`} style={{ color: 'var(--text-primary, #F3F4F6)', lineHeight: 1.75, fontSize: '0.975rem' }}>
      {rawBlocks.map((block, blockIdx) => {
        // 1. Code Block Placeholder
        const codeMatch = block.match(/^__CODE_BLOCK_(\d+)__$/);
        if (codeMatch) {
          const idx = parseInt(codeMatch[1], 10);
          const blockData = codeBlocks[idx];
          if (!blockData) return null;

          const isCopied = copiedIndex === idx;
          const displayLang = blockData.lang.toUpperCase() || 'CODE';

          return (
            <div
              key={`code-${blockIdx}`}
              style={{
                background: '#0D0E12',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                margin: '1.5rem 0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
              }}
            >
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
                      color: 'var(--uipath-orange, #FA4616)',
                      letterSpacing: '0.05em',
                      marginLeft: '0.35rem'
                    }}
                  >
                    {displayLang}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(blockData.code, idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: isCopied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    color: isCopied ? '#34D399' : 'var(--text-secondary, #9CA3AF)',
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

              <pre
                style={{
                  margin: 0,
                  padding: '1.25rem',
                  fontFamily: 'var(--font-mono, "JetBrains Mono", Consolas, Menlo, monospace)',
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  color: '#E6EDF3',
                  overflowX: 'auto',
                  background: 'transparent'
                }}
              >
                <code>{blockData.code}</code>
              </pre>
            </div>
          );
        }

        // 2. Callouts: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT], > [!CAUTION]
        if (
          block.startsWith('> [!NOTE]') || 
          block.startsWith('> [!TIP]') || 
          block.startsWith('> [!WARNING]') || 
          block.startsWith('> [!IMPORTANT]') ||
          block.startsWith('> [!CAUTION]')
        ) {
          let type = 'NOTE';
          let icon = <Info size={18} style={{ color: '#60A5FA', flexShrink: 0 }} />;
          let borderCol = '#60A5FA';
          let bgCol = 'rgba(96, 165, 250, 0.08)';

          if (block.startsWith('> [!TIP]')) {
            type = 'TIP';
            icon = <Lightbulb size={18} style={{ color: '#34D399', flexShrink: 0 }} />;
            borderCol = '#34D399';
            bgCol = 'rgba(52, 211, 153, 0.08)';
          } else if (block.startsWith('> [!WARNING]')) {
            type = 'WARNING';
            icon = <AlertTriangle size={18} style={{ color: '#FBBF24', flexShrink: 0 }} />;
            borderCol = '#FBBF24';
            bgCol = 'rgba(251, 191, 36, 0.08)';
          } else if (block.startsWith('> [!IMPORTANT]')) {
            type = 'IMPORTANT';
            icon = <Info size={18} style={{ color: 'var(--uipath-orange, #FA4616)', flexShrink: 0 }} />;
            borderCol = '#FA4616';
            bgCol = 'rgba(250, 70, 22, 0.08)';
          } else if (block.startsWith('> [!CAUTION]')) {
            type = 'CAUTION';
            icon = <AlertOctagon size={18} style={{ color: '#EF4444', flexShrink: 0 }} />;
            borderCol = '#EF4444';
            bgCol = 'rgba(239, 68, 68, 0.08)';
          }

          const calloutLines = block
            .split('\n')
            .slice(1)
            .map(l => l.replace(/^>\s?/, ''))
            .join(' ');

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
                margin: '1.25rem 0'
              }}
            >
              <div style={{ marginTop: '2px' }}>{icon}</div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: borderCol, marginBottom: '0.25rem' }}>
                  {type}
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary, #D1D5DB)', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: inlineMarkdown(calloutLines) }} />
              </div>
            </div>
          );
        }

        // 3. Generic Blockquote: >
        if (block.startsWith('>')) {
          const quoteLines = block.split('\n').map(l => l.replace(/^>\s?/, '')).join(' ');
          return (
            <blockquote
              key={`quote-${blockIdx}`}
              style={{
                borderLeft: '3px solid var(--uipath-orange, #FA4616)',
                padding: '0.75rem 1.25rem',
                margin: '1.25rem 0',
                fontStyle: 'italic',
                color: 'var(--text-secondary, #D1D5DB)',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '0 0.5rem 0.5rem 0'
              }}
              dangerouslySetInnerHTML={{ __html: inlineMarkdown(quoteLines) }}
            />
          );
        }

        // 4. Table Detection
        if (block.includes('|') && block.includes('\n|') && block.includes('---')) {
          return renderTableBlock(block, blockIdx);
        }

        // 5. Headings: #, ##, ###, ####, #####, ######
        if (block.startsWith('#')) {
          const levelMatch = block.match(/^(#{1,6})\s+(.*)$/);
          if (levelMatch) {
            const level = levelMatch[1].length;
            const headingText = levelMatch[2];

            if (level === 1) {
              return (
                <h2
                  key={`h1-${blockIdx}`}
                  style={{
                    fontSize: '1.65rem',
                    fontWeight: 800,
                    color: 'var(--text-primary, #FFFFFF)',
                    marginTop: blockIdx === 0 ? '0' : '1.75rem',
                    marginBottom: '0.85rem',
                    lineHeight: 1.3
                  }}
                  dangerouslySetInnerHTML={{ __html: inlineMarkdown(headingText) }}
                />
              );
            }
            if (level === 2) {
              return (
                <h3
                  key={`h2-${blockIdx}`}
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: 'var(--text-primary, #FFFFFF)',
                    marginTop: '1.6rem',
                    marginBottom: '0.75rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingBottom: '0.4rem',
                    lineHeight: 1.35
                  }}
                  dangerouslySetInnerHTML={{ __html: inlineMarkdown(headingText) }}
                />
              );
            }
            if (level === 3) {
              return (
                <h4
                  key={`h3-${blockIdx}`}
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--uipath-orange, #FA4616)',
                    marginTop: '1.4rem',
                    marginBottom: '0.5rem',
                    lineHeight: 1.4
                  }}
                  dangerouslySetInnerHTML={{ __html: inlineMarkdown(headingText) }}
                />
              );
            }
            if (level === 4) {
              return (
                <h5
                  key={`h4-${blockIdx}`}
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: '#F3F4F6',
                    marginTop: '1.25rem',
                    marginBottom: '0.45rem',
                    lineHeight: 1.4
                  }}
                  dangerouslySetInnerHTML={{ __html: inlineMarkdown(headingText) }}
                />
              );
            }
            return (
              <h6
                key={`h5-${blockIdx}`}
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary, #D1D5DB)',
                  marginTop: '1rem',
                  marginBottom: '0.4rem',
                  lineHeight: 1.4
                }}
                dangerouslySetInnerHTML={{ __html: inlineMarkdown(headingText) }}
              />
            );
          }
        }

        // 6. Horizontal Rule
        if (block === '---' || block === '***' || block === '___') {
          return (
            <hr
              key={`hr-${blockIdx}`}
              style={{ border: 0, borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '2rem 0' }}
            />
          );
        }

        // 7. Render Mixed Content (Paragraphs, Ordered Lists, Unordered Lists) within block
        return renderMixedBlock(block, blockIdx);
      })}
    </div>
  );
};

// Helper: render mixed block that may contain a mix of paragraphs, numbered items, and bullet points
function renderMixedBlock(block: string, blockIdx: number) {
  const lines = block.split('\n');
  const sections: { type: 'p' | 'ul' | 'ol'; items: string[] }[] = [];

  let currentType: 'p' | 'ul' | 'ol' | null = null;
  let currentItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) continue;

    // Check line type
    if (/^[-*+]\s+/.test(trimmed)) {
      const itemContent = trimmed.replace(/^[-*+]\s+/, '');
      if (currentType === 'ul') {
        currentItems.push(itemContent);
      } else {
        if (currentType && currentItems.length > 0) {
          sections.push({ type: currentType, items: [...currentItems] });
        }
        currentType = 'ul';
        currentItems = [itemContent];
      }
    } else if (/^\d+\.\s+/.test(trimmed)) {
      const itemContent = trimmed.replace(/^\d+\.\s+/, '');
      if (currentType === 'ol') {
        currentItems.push(itemContent);
      } else {
        if (currentType && currentItems.length > 0) {
          sections.push({ type: currentType, items: [...currentItems] });
        }
        currentType = 'ol';
        currentItems = [itemContent];
      }
    } else {
      // Paragraph line
      if (currentType === 'p') {
        currentItems.push(trimmed);
      } else {
        if (currentType && currentItems.length > 0) {
          sections.push({ type: currentType, items: [...currentItems] });
        }
        currentType = 'p';
        currentItems = [trimmed];
      }
    }
  }

  if (currentType && currentItems.length > 0) {
    sections.push({ type: currentType, items: [...currentItems] });
  }

  return (
    <div key={`mixed-block-${blockIdx}`} style={{ marginBottom: '1.2rem' }}>
      {sections.map((section, sIdx) => {
        if (section.type === 'ul') {
          return (
            <ul
              key={`ul-${blockIdx}-${sIdx}`}
              style={{
                paddingLeft: '1.5rem',
                margin: '0.65rem 0 1rem 0',
                color: 'var(--text-secondary, #D1D5DB)',
                listStyleType: 'disc'
              }}
            >
              {section.items.map((item, i) => (
                <li
                  key={i}
                  style={{ marginBottom: '0.45rem', lineHeight: 1.65 }}
                  dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }}
                />
              ))}
            </ul>
          );
        }

        if (section.type === 'ol') {
          return (
            <ol
              key={`ol-${blockIdx}-${sIdx}`}
              style={{
                paddingLeft: '1.5rem',
                margin: '0.65rem 0 1rem 0',
                color: 'var(--text-secondary, #D1D5DB)'
              }}
            >
              {section.items.map((item, i) => (
                <li
                  key={i}
                  style={{ marginBottom: '0.45rem', lineHeight: 1.65 }}
                  dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }}
                />
              ))}
            </ol>
          );
        }

        // Paragraph
        return (
          <p
            key={`p-${blockIdx}-${sIdx}`}
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary, #D1D5DB)',
              lineHeight: 1.75,
              marginBottom: '0.75rem',
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={{ __html: inlineMarkdown(section.items.join(' ')) }}
          />
        );
      })}
    </div>
  );
}

// Helper: parse inline markdown (bold, italic, inline code, links, images, strikethrough, highlights)
function inlineMarkdown(text: string): string {
  if (!text) return '';

  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Images: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:0.5rem;margin:1rem 0;display:block;" />');

  // Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--uipath-orange, #FA4616);text-decoration:underline;text-underline-offset:3px;font-weight:600;display:inline-flex;align-items:center;gap:3px;">$1</a>');

  // Bold & Italic: ***text*** or ___text___
  html = html.replace(/(\*\*\*|___)([^*_]+)\1/g, '<strong style="color:#FFF;"><em>$2</em></strong>');

  // Bold: **text** or __text__
  html = html.replace(/(\*\*|__)([^*_]+)\1/g, '<strong style="color:#FFFFFF;font-weight:700;">$2</strong>');

  // Highlights: ==text==
  html = html.replace(/==([^=]+)==/g, '<mark style="background:rgba(250,70,22,0.22);color:#FED7AA;padding:2px 6px;border-radius:4px;border:1px solid rgba(250,70,22,0.3);font-weight:600;">$1</mark>');

  // Italic: *text* or _text_
  html = html.replace(/(\*|_)([^*_]+)\1/g, '<em>$2</em>');

  // Strikethrough: ~~text~~
  html = html.replace(/~~([^~]+)~~/g, '<del style="opacity:0.65;">$1</del>');

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(255, 255, 255, 0.08);color:#FED7AA;padding:2px 6px;border-radius:4px;font-size:0.88em;font-family:var(--font-mono, monospace);border:1px solid rgba(255, 255, 255, 0.1);">$1</code>');

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
        margin: '1.5rem 0',
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
                style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#FFFFFF' }}
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
                  style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary, #D1D5DB)' }}
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
