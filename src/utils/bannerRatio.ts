import React from 'react';
import { BannerAspectRatio } from '../types';

export function normalizeBannerAspectRatio(val?: unknown): BannerAspectRatio {
  if (val === '21/9' || val === '16/9' || val === '4/3' || val === '1/1' || val === 'auto' || val === 'default') {
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
    description: 'Balanced 16:9 widescreen landscape'
  },
  {
    id: '21/9',
    label: 'Cinematic',
    ratioBadge: '21:9',
    description: 'Ultra-wide panoramic header'
  },
  {
    id: '4/3',
    label: 'Classic',
    ratioBadge: '4:3',
    description: 'Traditional standard 4:3 format'
  },
  {
    id: '1/1',
    label: 'Square',
    ratioBadge: '1:1',
    description: 'Square 1:1 image proportion'
  },
  {
    id: 'auto',
    label: 'Natural Fit',
    ratioBadge: 'Original',
    description: 'Displays full uncropped image with seamless dark backdrop'
  }
];

export function getBannerContainerClasses(aspectRatio: BannerAspectRatio = 'default'): string {
  switch (aspectRatio) {
    case '21/9':
      return 'aspect-[21/9] w-full';
    case '16/9':
    case 'default':
      return 'aspect-video w-full min-h-[220px]';
    case '4/3':
      return 'aspect-[4/3] w-full max-h-[520px]';
    case '1/1':
      return 'aspect-square w-full max-w-[480px] mx-auto';
    case 'auto':
      return 'h-auto max-h-[540px] w-full';
    default:
      return 'aspect-video w-full min-h-[220px]';
  }
}

export function getBannerImageClasses(aspectRatio: BannerAspectRatio = 'default'): string {
  if (aspectRatio === 'auto') {
    return 'w-full h-auto max-h-[540px] object-contain object-center';
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
    case '4/3':
      return {
        width: '100%',
        aspectRatio: '4 / 3',
        maxHeight: '520px',
        overflow: 'hidden',
        background: '#0D0F14'
      };
    case '1/1':
      return {
        width: '100%',
        aspectRatio: '1 / 1',
        maxWidth: '480px',
        margin: '0 auto',
        overflow: 'hidden',
        background: '#0D0F14'
      };
    case 'auto':
      return {
        width: '100%',
        height: 'auto',
        maxHeight: '540px',
        overflow: 'hidden',
        background: '#0D0F14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
      maxHeight: '540px',
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
