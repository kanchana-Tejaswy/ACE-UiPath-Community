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
    label: 'Standard',
    ratioBadge: '16:9',
    description: 'Perfect for blog covers & technical articles'
  },
  {
    id: '16/9',
    label: '16:9',
    ratioBadge: '16:9',
    description: 'Standard widescreen landscape'
  },
  {
    id: '21/9',
    label: 'Cinematic',
    ratioBadge: '21:9',
    description: 'Ultra-wide panoramic header'
  },
  {
    id: 'auto',
    label: 'Natural Fit',
    ratioBadge: 'Original',
    description: 'Displays full uncropped image with subtle backdrop'
  }
];

export function getBannerContainerClasses(aspectRatio: BannerAspectRatio = 'default'): string {
  switch (aspectRatio) {
    case '21/9':
      return 'aspect-[21/9] w-full';
    case '16/9':
    case 'default':
      return 'aspect-video w-full min-h-[220px]';
    case 'auto':
      return 'h-auto max-h-[480px] w-full';
    default:
      return 'aspect-video w-full min-h-[220px]';
  }
}

export function getBannerImageClasses(aspectRatio: BannerAspectRatio = 'default'): string {
  if (aspectRatio === 'auto') {
    return 'w-full h-auto max-h-[480px] object-contain';
  }
  return 'w-full h-full object-cover object-center';
}

export function getBannerContainerStyle(aspectRatio: BannerAspectRatio = 'default'): React.CSSProperties {
  switch (aspectRatio) {
    case '21/9':
      return {
        width: '100%',
        aspectRatio: '21 / 9',
        overflow: 'hidden',
        background: '#0D0F14'
      };
    case '16/9':
    case 'default':
      return {
        width: '100%',
        aspectRatio: '16 / 9',
        minHeight: '220px',
        overflow: 'hidden',
        background: '#0D0F14'
      };
    case 'auto':
      return {
        width: '100%',
        height: 'auto',
        maxHeight: '480px',
        overflow: 'hidden',
        background: '#0D0F14'
      };
    default:
      return {
        width: '100%',
        aspectRatio: '16 / 9',
        minHeight: '220px',
        overflow: 'hidden',
        background: '#0D0F14'
      };
  }
}

export function getBannerImageStyle(aspectRatio: BannerAspectRatio = 'default'): React.CSSProperties {
  if (aspectRatio === 'auto') {
    return {
      width: '100%',
      height: 'auto',
      maxHeight: '480px',
      objectFit: 'contain',
      objectPosition: 'center',
      display: 'block',
      margin: '0 auto'
    };
  }
  return {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block'
  };
}

