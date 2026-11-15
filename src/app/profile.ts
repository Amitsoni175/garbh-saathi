import { createContext, useContext } from 'react';
import { parseLocalDate } from '@/lib/pregnancy';

export interface Profile {
  motherName: string;
  babyNickname: string;
  lmp: string;
  edd: string;
  dateKind: 'lmp' | 'edd';
  /** Local date she started using the app; the content rotation counts from here. */
  startDate: string;
  createdAt: string;
  afterBirth?: boolean;
  doctorName?: string;
  doctorPhone?: string;
  hospitalName?: string;
  hospitalPhone?: string;
}

const str = (x: unknown) => (typeof x === 'string' ? x : '');

/** Returns null unless the stored value has valid dates. */
export function normaliseProfile(stored: unknown): Profile | null {
  if (!stored || typeof stored !== 'object') return null;
  const s = stored as Record<string, unknown>;
  const lmp = str(s.lmp);
  const edd = str(s.edd);
  if (!parseLocalDate(lmp) || !parseLocalDate(edd)) return null;
  const startDate = parseLocalDate(str(s.startDate)) ? str(s.startDate) : lmp;
  return {
    motherName: str(s.motherName),
    babyNickname: str(s.babyNickname),
    lmp,
    edd,
    dateKind: s.dateKind === 'edd' ? 'edd' : 'lmp',
    startDate,
    createdAt: str(s.createdAt),
    afterBirth: s.afterBirth === true,
    doctorName: str(s.doctorName),
    doctorPhone: str(s.doctorPhone),
    hospitalName: str(s.hospitalName),
    hospitalPhone: str(s.hospitalPhone),
  };
}

export interface ProfileContextValue {
  profile: Profile | null;
  ready: boolean;
  save: (profile: Profile) => Promise<void>;
  update: (patch: Partial<Profile>) => Promise<void>;
  clear: () => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  ready: false,
  save: async () => undefined,
  update: async () => undefined,
  clear: async () => undefined,
});

export function useProfile(): ProfileContextValue {
  return useContext(ProfileContext);
}
