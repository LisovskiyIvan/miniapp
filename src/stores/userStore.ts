
import { atom } from "jotai";

export interface User {
  id: number;
  first_name: string;
  username: string;
  language_code?: string;
}

export const userAtom = atom<User | null>(null);
