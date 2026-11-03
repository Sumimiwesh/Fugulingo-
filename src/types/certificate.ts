export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  sectionId: string;
  sectionTitle: string;
  certificateNumber: string; // e.g. "FUGU-CERT-2026-0042"
  issuedAt: string; // ISO date string
  scorePercent: number;
  totalStepsCompleted: number;
  badgeType: 'gold' | 'silver' | 'bronze';
  signatureName: string;
  signatureTitle: string;
}
