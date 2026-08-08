export interface DatePickerLabels {
  reset?: string;
  done?: string;
  startDatePlaceholder?: string;
  endDatePlaceholder?: string;
  singleDatePlaceholder?: string;
}

export const translations: Record<string, Required<DatePickerLabels>> = {
  en: { reset: "Reset", done: "Done", startDatePlaceholder: "Start date", endDatePlaceholder: "End date", singleDatePlaceholder: "Date" },
  fr: { reset: "Réinitialiser", done: "Terminé", startDatePlaceholder: "Date de début", endDatePlaceholder: "Date de fin", singleDatePlaceholder: "Date" },
  de: { reset: "Zurücksetzen", done: "Fertig", startDatePlaceholder: "Startdatum", endDatePlaceholder: "Enddatum", singleDatePlaceholder: "Datum" },
  es: { reset: "Restablecer", done: "Listo", startDatePlaceholder: "Fecha de inicio", endDatePlaceholder: "Fecha de fin", singleDatePlaceholder: "Fecha" },
  it: { reset: "Ripristina", done: "Fatto", startDatePlaceholder: "Data di inizio", endDatePlaceholder: "Data di fine", singleDatePlaceholder: "Data" },
  pt: { reset: "Redefinir", done: "Concluído", startDatePlaceholder: "Data de início", endDatePlaceholder: "Data de término", singleDatePlaceholder: "Data" },
  nl: { reset: "Resetten", done: "Klaar", startDatePlaceholder: "Begindatum", endDatePlaceholder: "Einddatum", singleDatePlaceholder: "Datum" },
  pl: { reset: "Resetuj", done: "Gotowe", startDatePlaceholder: "Data początkowa", endDatePlaceholder: "Data końcowa", singleDatePlaceholder: "Data" },
  ru: { reset: "Сбросить", done: "Готово", startDatePlaceholder: "Дата начала", endDatePlaceholder: "Дата окончания", singleDatePlaceholder: "Дата" },
  uk: { reset: "Скинути", done: "Готово", startDatePlaceholder: "Дата початку", endDatePlaceholder: "Дата завершення", singleDatePlaceholder: "Дата" },
  tr: { reset: "Sıfırla", done: "Bitti", startDatePlaceholder: "Başlangıç tarihi", endDatePlaceholder: "Bitiş tarihi", singleDatePlaceholder: "Tarih" },
  sv: { reset: "Återställ", done: "Klar", startDatePlaceholder: "Startdatum", endDatePlaceholder: "Slutdatum", singleDatePlaceholder: "Datum" },
  da: { reset: "Nulstil", done: "Færdig", startDatePlaceholder: "Startdato", endDatePlaceholder: "Slutdato", singleDatePlaceholder: "Dato" },
  no: { reset: "Nullstill", done: "Ferdig", startDatePlaceholder: "Startdato", endDatePlaceholder: "Slutdato", singleDatePlaceholder: "Dato" },
  nb: { reset: "Nullstill", done: "Ferdig", startDatePlaceholder: "Startdato", endDatePlaceholder: "Slutdato", singleDatePlaceholder: "Dato" },
  nn: { reset: "Nullstill", done: "Ferdig", startDatePlaceholder: "Startdato", endDatePlaceholder: "Slutdato", singleDatePlaceholder: "Dato" },
  fi: { reset: "Nollaa", done: "Valmis", startDatePlaceholder: "Alkupäivämäärä", endDatePlaceholder: "Loppupäivämäärä", singleDatePlaceholder: "Päivämäärä" },
  cs: { reset: "Obnovit", done: "Hotovo", startDatePlaceholder: "Datum zahájení", endDatePlaceholder: "Datum ukončení", singleDatePlaceholder: "Datum" },
  sk: { reset: "Obnoviť", done: "Hotovo", startDatePlaceholder: "Dátum začiatku", endDatePlaceholder: "Dátum konca", singleDatePlaceholder: "Dátum" },
  hu: { reset: "Visszaállítás", done: "Kész", startDatePlaceholder: "Kezdő dátum", endDatePlaceholder: "Záró dátum", singleDatePlaceholder: "Dátum" },
  ro: { reset: "Resetare", done: "Gata", startDatePlaceholder: "Data de început", endDatePlaceholder: "Data de sfârșit", singleDatePlaceholder: "Dată" },
  bg: { reset: "Нулиране", done: "Готово", startDatePlaceholder: "Начална дата", endDatePlaceholder: "Крайна дата", singleDatePlaceholder: "Дата" },
  el: { reset: "Επαναφορά", done: "Ολοκλήρωση", startDatePlaceholder: "Ημερομηνία έναρξης", endDatePlaceholder: "Ημερομηνία λήξης", singleDatePlaceholder: "Ημερομηνία" },
  hr: { reset: "Poništi", done: "Gotovo", startDatePlaceholder: "Početni datum", endDatePlaceholder: "Završni datum", singleDatePlaceholder: "Datum" },
  sr: { reset: "Ресетуј", done: "Готово", startDatePlaceholder: "Датум почетка", endDatePlaceholder: "Датум завршетка", singleDatePlaceholder: "Датум" },
  sl: { reset: "Ponastavi", done: "Končano", startDatePlaceholder: "Začetni datum", endDatePlaceholder: "Končni datum", singleDatePlaceholder: "Datum" },
  lt: { reset: "Iš naujo", done: "Atlikta", startDatePlaceholder: "Pradžios data", endDatePlaceholder: "Pabaigos data", singleDatePlaceholder: "Data" },
  lv: { reset: "Atstatīt", done: "Gatavs", startDatePlaceholder: "Sākuma datums", endDatePlaceholder: "Beigu datums", singleDatePlaceholder: "Datums" },
  et: { reset: "Lähtesta", done: "Valmis", startDatePlaceholder: "Alguskuupäev", endDatePlaceholder: "Lõpukuupäev", singleDatePlaceholder: "Kuupäev" },
  ga: { reset: "Athshocraigh", done: "Déanta", startDatePlaceholder: "Dáta tosaithe", endDatePlaceholder: "Dáta críochnaithe", singleDatePlaceholder: "Dáta" },
  mt: { reset: "Irrestawra", done: "Lest", startDatePlaceholder: "Data tal-bidu", endDatePlaceholder: "Data tat-tmiem", singleDatePlaceholder: "Data" },
  sq: { reset: "Rilidh", done: "U krye", startDatePlaceholder: "Data e fillimit", endDatePlaceholder: "Data e përfundimit", singleDatePlaceholder: "Data" },
  mk: { reset: "Ресетирај", done: "Готово", startDatePlaceholder: "Почетен датум", endDatePlaceholder: "Краен датум", singleDatePlaceholder: "Датум" },
  is: { reset: "Endurstilla", done: "Lokið", startDatePlaceholder: "Upphafsdagur", endDatePlaceholder: "Lokadagur", singleDatePlaceholder: "Dagsetning" },
};

export function getLabels(
  locale: string = "en",
  customLabels?: DatePickerLabels,
  resetText?: string,
  doneText?: string
): Required<DatePickerLabels> {
  const normLocale = (locale || "en").toLowerCase();
  const baseLocale = normLocale.split("-")[0];
  const dict = translations[normLocale] || translations[baseLocale] || translations.en;

  return {
    reset: resetText || customLabels?.reset || dict.reset,
    done: doneText || customLabels?.done || dict.done,
    startDatePlaceholder: customLabels?.startDatePlaceholder || dict.startDatePlaceholder,
    endDatePlaceholder: customLabels?.endDatePlaceholder || dict.endDatePlaceholder,
    singleDatePlaceholder: customLabels?.singleDatePlaceholder || dict.singleDatePlaceholder,
  };
}
