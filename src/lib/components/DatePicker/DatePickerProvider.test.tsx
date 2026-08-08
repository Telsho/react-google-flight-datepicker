import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { DatePickerProvider, useDisplayCustomization } from './DatePickerProvider';

const TestComponent = () => {
  const display = useDisplayCustomization();
  return (
    <div>
      <span data-testid="reset-text">{display.resetText}</span>
      <span data-testid="done-text">{display.doneText}</span>
    </div>
  );
};

describe('DatePickerProvider', () => {
  it('provides resetText and doneText via useDisplayCustomization', async () => {
    const dummyDateState: any = {};
    const dummyConfig: any = { locale: 'fr' };
    const dummyUIState: any = {};
    const dummyDisplay: any = {
      resetText: 'Réinitialiser',
      doneText: 'Terminé',
      startDatePlaceholder: 'Date de début',
      hideDialogHeader: false,
      hideDialogFooter: false,
      hideDialogAfterSelectEndDate: false,
    };

    await act(async () => {
      render(
        <DatePickerProvider
          dateState={dummyDateState}
          config={dummyConfig}
          uiState={dummyUIState}
          display={dummyDisplay}
          locale="fr"
        >
          <TestComponent />
        </DatePickerProvider>
      );
    });

    expect(screen.getByTestId('reset-text').textContent).toBe('Réinitialiser');
    expect(screen.getByTestId('done-text').textContent).toBe('Terminé');
  });
});
