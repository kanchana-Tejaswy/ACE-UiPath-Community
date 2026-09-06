import React from 'react';
import { Sparkles, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { RecommendationItem } from '../lib/recommendations/recommendationEngine';

interface Props {
  recommendation?: RecommendationItem;
  onNavigate: (view: string, detailId?: string) => void;
}

export const RecommendedNextStep: React.FC<Props> = ({ recommendation, onNavigate }) => {
  if (!recommendation) return null;

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem 1.75rem',
      borderRadius: 'var(--radius-xl)',
      background: 'linear-gradient(135deg, rgba(250, 70, 22, 0.08) 0%, rgba(15, 17, 23, 0.95) 100%)',
      border: '1px solid rgba(250, 70, 22, 0.25)',
      boxShadow: '0 8px 30px rgba(250, 70, 22, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: '1 1 340px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #FA4616 0%, #BA2C07 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(250, 70, 22, 0.4)',
          flexShrink: 0
        }}>
          <Sparkles size={22} style={{ color: '#FFFFFF' }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>Recommended Next Step</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Personalized Intelligence</span>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>
            {recommendation.title}
          </h3>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontWeight: 600, color: '#FA4616' }}>Why:</span> {recommendation.reason}
          </p>
        </div>
      </div>

      <button
        onClick={() => onNavigate('learn', recommendation.detailId)}
        className="btn btn-primary"
        style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}
      >
        <BookOpen size={16} /> Open Module <ArrowRight size={14} />
      </button>
    </div>
  );
};
