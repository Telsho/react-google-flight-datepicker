import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { SingleDatePicker } from './SingleDatePicker';
import { RangeDatePicker } from './RangeDatePicker';

describe('Multi-language Support', () => {
  it('renders French labels and placeholders automatically when locale="fr"', async () => {
    await act(async () => {
      render(<RangeDatePicker isOpen={true} locale="fr" onChange={() => {}} onCloseCalendar={() => {}} />);
    });
    
    // Check reset button and done button
    const resetButtons = screen.getAllByText('Réinitialiser');
    expect(resetButtons.length).toBeGreaterThan(0);

    const doneButton = screen.getByText('Terminé');
    expect(doneButton).toBeInTheDocument();

    // Check default input placeholders (rendered both in trigger and modal header)
    expect(screen.getAllByText('Date de début').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Date de fin').length).toBeGreaterThan(0);
  });

  it('allows overriding resetText and doneText via props', async () => {
    await act(async () => {
      render(
        <SingleDatePicker
          isOpen={true}
          locale="fr"
          resetText="Effacer"
          doneText="Valider"
          onChange={() => {}}
          onCloseCalendar={() => {}}
        />
      );
    });

    const resetButtons = screen.getAllByText('Effacer');
    expect(resetButtons.length).toBeGreaterThan(0);
    expect(screen.getByText('Valider')).toBeInTheDocument();
  });

  it('allows overriding via labels prop', async () => {
    await act(async () => {
      render(
        <RangeDatePicker
          isOpen={true}
          locale="de"
          labels={{ reset: 'Löschen', done: 'Fertigstellen', startDatePlaceholder: 'Von', endDatePlaceholder: 'Bis' }}
          onChange={() => {}}
          onCloseCalendar={() => {}}
        />
      );
    });

    expect(screen.getAllByText('Löschen').length).toBeGreaterThan(0);
    expect(screen.getByText('Fertigstellen')).toBeInTheDocument();
    expect(screen.getAllByText('Von').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bis').length).toBeGreaterThan(0);
  });
});
