import { getLabels, translations } from './index';

describe('translations', () => {
  it('should return English default labels when no locale or custom labels provided', () => {
    const labels = getLabels('en');
    expect(labels.reset).toBe('Reset');
    expect(labels.done).toBe('Done');
    expect(labels.startDatePlaceholder).toBe('Start date');
    expect(labels.endDatePlaceholder).toBe('End date');
    expect(labels.singleDatePlaceholder).toBe('Date');
  });

  it('should return French translations when locale is "fr"', () => {
    const labels = getLabels('fr');
    expect(labels.reset).toBe('Réinitialiser');
    expect(labels.done).toBe('Terminé');
  });

  it('should handle region-specific locale fallback like "es-ES" to "es"', () => {
    const labels = getLabels('es-ES');
    expect(labels.reset).toBe('Restablecer');
    expect(labels.done).toBe('Listo');
  });

  it('should allow custom label overrides', () => {
    const labels = getLabels('en', { reset: 'Clear', done: 'Apply' });
    expect(labels.reset).toBe('Clear');
    expect(labels.done).toBe('Apply');
  });

  it('should prioritize explicit resetText and doneText arguments', () => {
    const labels = getLabels('fr', { reset: 'Custom Reset' }, 'Override Reset', 'Override Done');
    expect(labels.reset).toBe('Override Reset');
    expect(labels.done).toBe('Override Done');
  });
});
