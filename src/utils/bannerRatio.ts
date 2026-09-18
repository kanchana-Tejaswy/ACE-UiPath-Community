import React from 'react';
import { BannerAspectRatio } from '../types';

export function normalizeBannerAspectRatio(val?: unknown): BannerAspectRatio {
  if (val === '21/9' || val === '16/9' || val === 'auto' || val === 'default') {
    return val;
  }
  return 'default';
}

export interface AspectRatioOption {
  id: BannerAspectRatio;
  label: string;
  ratioBadge: string;
  description: string;
}

export const BANNER_ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  {
    id: 'default',
    label: 'Default',
    ratioBadge: '4:1',
    description: 'Ultra-wide banner'
  },
  {
    id: '21/9',
    label: '21:9',
    ratioBadge: '21:9',
    description: 'Wide cinematic landscape'
  },
  {
    id: '16/9',
    label: '16:9',
    ratioBadge: '16:9',
    description: 'Standard landscape'
  },
  {
    id: 'auto',
    label: 'Auto',
    ratioBadge: 'Original',
    description: 'Natural image proportions'
  }
];

export function getBannerContainerClasses(aspectRatio: BannerAspectRatio = 'default'): string {
  switch (aspectRatio) {
    case '21/9':
      return 'aspect-[21/9] w-full';
    case '16/9':
      return 'aspect-video w-full';
    case 'auto':
      return 'h-auto max-h-[420px] w-full';
    case 'default':
    default:
      return 'aspect-[4/1] min-h-[140px] w-full';
  }
}

export function getBannerImageClasses(aspectRatio: BannerAspectRatio = 'default'): string {
  if (aspectRatio === 'auto') {
    return 'w-full h-auto max-h-[420px] object-contain';
  }
  return 'w-full h-full object-cover';
}

export function getBannerContainerStyle(aspectRatio: BannerAspectRatio = 'default'): React.CSSProperties {
  switch (aspectRatio) {
    case '21/9':
      return {
        width: '100%',
        aspectRatio: '21 / 9',
        overflow: 'hidden'
      };
    case '16/9':
      return {
        width: '100%',
        aspectRatio: '16 / 9',
        overflow: 'hidden'
      };
    case 'auto':
      return {
        width: '100%',
        height: 'auto',
        maxHeight: '420px',
        overflow: 'hidden'
      };
    case 'default':
    default:
      return {
        width: '100%',
        aspectRatio: '4 / 1',
        minHeight: '140px',
        overflow: 'hidden'
      };
  }
}

export function getBannerImageStyle(aspectRatio: BannerAspectRatio = 'default'): React.CSSProperties {
  if (aspectRatio === 'auto') {
    return {
      width: '100%',
      height: 'auto',
      maxHeight: '420px',
      objectFit: 'contain',
      display: 'block',
      margin: '0 auto'
    };
  }
  return {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block'
  };
}
