
export enum EntryStatus {
  VERIFIED = 'VERIFIED',
  REDUNDANT = 'REDUNDANT',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  PENDING = 'PENDING'
}

export interface DataEntry {
  id: string;
  content: string;
  source: string;
  timestamp: number;
  status: EntryStatus;
  reason?: string;
}

export interface ClassificationResult {
  status: EntryStatus;
  reason: string;
  confidence: number;
}

export interface Stats {
  total: number;
  verified: number;
  redundant: number;
  falsePositives: number;
}
