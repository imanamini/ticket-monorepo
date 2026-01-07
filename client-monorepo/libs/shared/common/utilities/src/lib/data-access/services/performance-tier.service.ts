import { inject, Injectable, signal } from '@angular/core';
import { PerformanceLevel } from '../models/performance-level.interface';
import { EventManagementService } from '@client-monorepo/common/event-management';

@Injectable({
  providedIn: 'root',
})
export class PerformanceTierService {
  tier = signal<PerformanceLevel>('medium');
  eventManagementService = inject(EventManagementService);

  async setOrGetTier(): Promise<PerformanceLevel> {
    const cached = sessionStorage.getItem('perf-tier');
    if (cached) {
      this.tier.set(cached as PerformanceLevel);
      return Promise.resolve(cached as PerformanceLevel);
    }

    return this.detectPerformance();
  }

  private async detectPerformance(): Promise<PerformanceLevel> {
    try {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const cores = isIOS ? 6 : (navigator.hardwareConcurrency ?? 2); // Clamped to 4 on recent iOS; fallback conservatively otherwise
      const memory = (navigator as any).deviceMemory || (isIOS ? 6 : 2); // Unsupported on iOS; assume 6GB+ for modern iPhones
      let hasWebGL = false;
      const canvas = document.createElement('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) hasWebGL = true;
      }
      if (!hasWebGL) return Promise.resolve('low');

      let totalDuration = 0;
      for (let run = 0; run < 3; run++) {
        const start = performance.now();
        let x = 0;
        for (let i = 0; i < 1e7; i++) x += Math.sqrt(i);
        totalDuration += performance.now() - start;
      }
      const duration = totalDuration / 3;

      let score = 0;

      if (duration < 30) score += 40;
      else if (duration < 60) score += 20;
      else if (duration > 200) score -= 40;
      else if (duration >= 100) score -= 20;

      if (hasWebGL) score += 30;

      if (cores >= 8) score += 15;
      else if (cores >= 4) score += 7.5;

      if (memory >= 4) score += 15;
      else if (memory >= 2) score += 7.5;

      let tier: PerformanceLevel;
      if (score < 40) tier = 'low';
      else if (score > 80) tier = 'high';
      else tier = 'medium';

      const event = {
        score,
        duration,
        tier,
        memory,
        cores,
        hasWebGL,
      };
      this.eventManagementService.triggerEvent({
        eventType: 'custom',
        data: {
          key: 'performance-tier',
          value: JSON.stringify(event),
        },
      });

      this.tier.set(tier);
      sessionStorage.setItem('perf-tier', tier);
      return Promise.resolve(tier);
    } catch {
      return Promise.resolve('low');
    }
  }
}
