import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageSquare, Send, X, Bot, ArrowRight, ShieldCheck, HelpCircle, Layers, ExternalLink } from 'lucide-react';
import { Activity, LearningPath, ProjectShowcase, Challenge, CommunityResource } from '../types';
import { aiService, AIResponse, AISource } from '../lib/ai/aiService';

interface Props {
  activities: Activity[];
  learningPaths: LearningPath[];
  projects: ProjectShowcase[];
  challenges: Challenge[];
  resources: CommunityResource[];
  onNavigate: (view: string, detailId?: string) => void;
  onRecordAnalytics?: (event: { eventType: any; entityType?: string; entityId?: string; metadata?: any }) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: AISource[];
  timestamp: string;
}

export const CommunityAssistant: React.FC<Props> = ({
  activities,
  learningPaths,
  projects,
  challenges,
  resources,
  onNavigate,
  onRecordAnalytics
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_msg',
      sender: 'assistant',
      text: '👋 Hello! I am the **ACE Community Assistant**.\nAsk me anything about UiPath courses, REFramework, bot showcases, hackathons, or downloadable resources!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (onRecordAnalytics) {
        onRecordAnalytics({ eventType: 'AI_ASSISTANT_OPENED' });
      }
    }
  }, [isOpen, messages]);

  const suggestedQuestions = [
    'Where should I start learning UiPath?',
    'Show REFramework resources',
    'What hackathons are available?',
    'Which student bots use REFramework?'
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || inputQuestion).trim();
    if (!textToSend || isThinking) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsThinking(true);

    if (onRecordAnalytics) {
      onRecordAnalytics({ eventType: 'AI_QUESTION_ASKED', metadata: { question: textToSend } });
    }

    try {
      const response: AIResponse = await aiService.askQuestion(textToSend, {
        activities,
        learningPaths,
        projects,
        challenges,
        resources
      });

      const assistantMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        sender: 'assistant',
        text: response.answer,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (response.sources.length === 0 && onRecordAnalytics) {
        onRecordAnalytics({ eventType: 'AI_NO_ANSWER', metadata: { question: textToSend } });
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          text: 'Sorry, I encountered an issue retrieving context. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSourceClick = (source: AISource) => {
    if (onRecordAnalytics) {
      onRecordAnalytics({ eventType: 'AI_SOURCE_OPENED', entityType: source.type, entityId: source.id });
    }

    if (source.type === 'activity') {
      onNavigate('activity_detail', source.id);
    } else if (source.type === 'module') {
      onNavigate('learn');
    } else if (source.type === 'project') {
      onNavigate('projects');
    } else if (source.type === 'challenge') {
      onNavigate('challenges');
    } else if (source.type === 'resource') {
      onNavigate('resources');
    }

    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Ambient Assistance Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Community Q&A Guide"
          className="ask-guide-floating-btn"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 50,
            background: 'rgba(12, 12, 12, 0.85)',
            color: '#E5E7EB',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            padding: '0.625rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '0.8125rem',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 12px rgba(250, 70, 22, 0.15)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(250, 70, 22, 0.45)';
            e.currentTarget.style.boxShadow = '0 10px 35px rgba(0, 0, 0, 0.75), 0 0 24px rgba(250, 70, 22, 0.35)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 12px rgba(250, 70, 22, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.color = '#E5E7EB';
          }}
        >
          <HelpCircle size={16} style={{ color: '#FA4616' }} />
          <span>Ask Guide</span>
        </button>
      )}

      {/* Floating Drawer Modal */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '90vw',
            maxWidth: '420px',
            height: '580px',
            maxHeight: '80vh',
            zIndex: 100,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #FA4616 0%, #BA2C07 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(250, 70, 22, 0.4)'
              }}>
                <Bot size={18} style={{ color: '#FFF' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  ACE Community Assistant
                </div>
                <div style={{ fontSize: '0.65rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                  Local Knowledge Mode (Read-Only)
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div style={{
                  background: msg.sender === 'user' ? 'var(--uipath-orange)' : 'var(--bg-tertiary)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                  padding: '0.85rem 1rem',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {msg.text}
                </div>

                {/* Sources Cards */}
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Sources from ACE Community:
                    </span>
                    {msg.sources.map((src) => (
                      <button
                        key={src.id}
                        onClick={() => handleSourceClick(src)}
                        style={{
                          background: 'rgba(250, 70, 22, 0.08)',
                          border: '1px solid rgba(250, 70, 22, 0.25)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.45rem 0.65rem',
                          fontSize: '0.75rem',
                          color: '#FA4616',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                          {src.title}
                        </span>
                        <ExternalLink size={12} />
                      </button>
                    ))}
                  </div>
                )}

                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isThinking && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '16px 16px 16px 4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Analyzing community knowledge...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length < 3 && (
            <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.35rem', overflowX: 'auto', background: 'var(--bg-primary)' }}>
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div style={{
            padding: '0.85rem 1rem',
            background: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              placeholder="Ask about REFramework, courses..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuestion.trim() || isThinking}
              className="btn btn-primary"
              style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)', opacity: inputQuestion.trim() ? 1 : 0.5 }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
