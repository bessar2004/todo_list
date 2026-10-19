import type { Translation } from 'primeng/api';
import type { AppLanguage } from './language';

// PrimeNG'in kendi düğmeleri ve tarih seçicisi de uygulamanın dilini kullanır.
const messages: Record<AppLanguage, Translation> = {
  tr: {
    today: 'Bugün', clear: 'Temizle', accept: 'Evet', reject: 'Hayır',
    cancel: 'İptal', choose: 'Seç',
    chooseDate: 'Tarih seç', chooseMonth: 'Ay seç', chooseYear: 'Yıl seç',
    prevMonth: 'Önceki ay', nextMonth: 'Sonraki ay',
    prevYear: 'Önceki yıl', nextYear: 'Sonraki yıl',
    prevDecade: 'Önceki on yıl', nextDecade: 'Sonraki on yıl',
    weekHeader: 'Hf', dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
    emptyMessage: 'Sonuç bulunamadı', emptyFilterMessage: 'Sonuç bulunamadı',
    searchMessage: '{0} sonuç mevcut', selectionMessage: '{0} öğe seçildi',
    emptySelectionMessage: 'Seçili öğe yok', emptySearchMessage: 'Sonuç bulunamadı',
    aria: { close: 'Kapat', navigation: 'Gezinme', previous: 'Önceki', next: 'Sonraki' },
  },
  en: {
    today: 'Today', clear: 'Clear', accept: 'Yes', reject: 'No',
    cancel: 'Cancel', choose: 'Choose',
    chooseDate: 'Choose date', chooseMonth: 'Choose month', chooseYear: 'Choose year',
    prevMonth: 'Previous month', nextMonth: 'Next month',
    prevYear: 'Previous year', nextYear: 'Next year',
    prevDecade: 'Previous decade', nextDecade: 'Next decade',
    weekHeader: 'Wk', dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    emptyMessage: 'No results found', emptyFilterMessage: 'No results found',
    searchMessage: '{0} results available', selectionMessage: '{0} items selected',
    emptySelectionMessage: 'No selected item', emptySearchMessage: 'No results found',
    aria: { close: 'Close', navigation: 'Navigation', previous: 'Previous', next: 'Next' },
  },
  ar: {
    today: 'اليوم', clear: 'مسح', accept: 'نعم', reject: 'لا',
    cancel: 'إلغاء', choose: 'اختر',
    chooseDate: 'اختر التاريخ', chooseMonth: 'اختر الشهر', chooseYear: 'اختر السنة',
    prevMonth: 'الشهر السابق', nextMonth: 'الشهر التالي',
    prevYear: 'السنة السابقة', nextYear: 'السنة التالية',
    prevDecade: 'العقد السابق', nextDecade: 'العقد التالي',
    weekHeader: 'أسبوع', dayNamesMin: ['أح', 'اث', 'ثل', 'أر', 'خم', 'جم', 'سب'],
    emptyMessage: 'لا توجد نتائج', emptyFilterMessage: 'لا توجد نتائج',
    searchMessage: '{0} نتائج متاحة', selectionMessage: 'تم اختيار {0} عناصر',
    emptySelectionMessage: 'لم يتم اختيار عنصر', emptySearchMessage: 'لا توجد نتائج',
    aria: { close: 'إغلاق', navigation: 'التنقل', previous: 'السابق', next: 'التالي' },
  },
};

export function getPrimeNgTranslation(
  language: AppLanguage, locale: string, dateFormat: string,
): Translation {
  const names = (kind: 'weekday' | 'month', style: 'long' | 'short') => {
    const formatter = new Intl.DateTimeFormat(locale, {
      [kind]: style, calendar: 'gregory', timeZone: 'UTC',
    });
    return Array.from({ length: kind === 'weekday' ? 7 : 12 }, (_, index) =>
      formatter.format(new Date(kind === 'weekday'
        ? Date.UTC(2024, 0, 7 + index)
        : Date.UTC(2024, index, 1))),
    );
  };

  return {
    ...messages[language], dateFormat, firstDayOfWeek: 1,
    dayNames: names('weekday', 'long'), dayNamesShort: names('weekday', 'short'),
    monthNames: names('month', 'long'), monthNamesShort: names('month', 'short'),
  };
}
