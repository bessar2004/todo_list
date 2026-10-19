import { TestBed } from '@angular/core/testing';
import { PrimeNG } from 'primeng/config';
import { LanguageService } from './language';

describe('LanguageService component translations', () => {
  let savedLanguage: string | null;
  let originalLang: string;
  let originalDir: string;

  beforeEach(() => {
    savedLanguage = localStorage.getItem('language');
    originalLang = document.documentElement.lang;
    originalDir = document.documentElement.dir;
    localStorage.removeItem('language');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    if (savedLanguage === null) localStorage.removeItem('language');
    else localStorage.setItem('language', savedLanguage);
    document.documentElement.lang = originalLang;
    document.documentElement.dir = originalDir;
  });

  it('updates PrimeNG dates and button labels when switching TR, AR and EN', () => {
    const language = TestBed.inject(LanguageService);
    const primeNG = TestBed.inject(PrimeNG);

    for (const [code, today, october, direction] of [
      ['tr', 'Bugün', 'Ekim', 'ltr'],
      ['ar', 'اليوم', 'أكتوبر', 'rtl'],
      ['en', 'Today', 'October', 'ltr'],
    ] as const) {
      language.setLanguage(code);
      expect(primeNG.getTranslation('today')).toBe(today);
      expect(primeNG.getTranslation('monthNames')[9]).toBe(october);
      expect(primeNG.getTranslation('dayNames')).toHaveLength(7);
      expect(primeNG.getTranslation('firstDayOfWeek')).toBe(1);
      expect(primeNG.getTranslation('dateFormat')).toBe(language.datePickerFormat);
      expect(document.documentElement.dir).toBe(direction);
    }
  });

  it('applies the stored language on startup and preserves other aria labels', () => {
    localStorage.setItem('language', 'ar');
    const primeNG = TestBed.inject(PrimeNG);
    const originalZoomIn = primeNG.getTranslation('aria').zoomIn;
    TestBed.inject(LanguageService);

    expect(primeNG.getTranslation('clear')).toBe('مسح');
    expect(primeNG.getTranslation('aria').close).toBe('إغلاق');
    expect(primeNG.getTranslation('aria').zoomIn).toBe(originalZoomIn);
  });
});
