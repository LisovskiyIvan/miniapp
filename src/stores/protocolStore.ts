import { atom } from "jotai";

// Атом для хранения списка протоколов (или null, если не загружено)
export type ProtocolCard = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  key: string;
  path: string;
};

export const protocolAtom = atom<ProtocolCard[]>([]);