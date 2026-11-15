import { getRagas, type Raga, type RagaSlot } from './content';
import { rotate } from './plan';
import { ragaSlotForHour } from './season';

/** The raga for this moment: chosen by the clock (or the plan's slot), alternating by day. */
export function ragaForMoment(
  hour: number,
  dayNumber: number,
  slotOverride: RagaSlot | null = null,
): Raga | undefined {
  const slot = slotOverride ?? ragaSlotForHour(hour);
  const ragas = getRagas();
  const inSlot = ragas.filter((r) => r.slot === slot);
  return rotate(inSlot.length ? inSlot : ragas, dayNumber);
}
