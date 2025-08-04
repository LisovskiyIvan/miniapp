import { atom } from "jotai";

export interface User {
  id: number;
  tgId: number;
  firstname: string;
  username: string;
  language_code?: string;
  free_trial_used?: boolean;
  free_trial_expires_at?: string;
}

export const userAtom = atom<User | null>(null);
