import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { ProgressRing } from './ProgressRing';
import { Toggle } from './Toggle';

function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>open</button>
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Day details"
        closeLabel="Close"
      >
        <p>Inside</p>
      </BottomSheet>
    </>
  );
}

describe('UI components', () => {
  it('BottomSheet opens as a dialog and closes with Escape and the ✕', async () => {
    render(<SheetDemo />);
    fireEvent.click(screen.getByText('open'));
    expect(screen.getByRole('dialog', { name: 'Day details' })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    fireEvent.click(screen.getByText('open'));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('Toggle is a switch that reports its state', () => {
    const onChange = vi.fn();
    render(<Toggle label="Sounds" checked={false} onChange={onChange} />);
    const sw = screen.getByRole('switch', { name: /Sounds/ });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('ProgressRing clamps its value', () => {
    render(<ProgressRing percent={140} label="Journey" />);
    expect(screen.getByRole('progressbar', { name: 'Journey' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
  });
});
