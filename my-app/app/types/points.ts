export interface Voucher {
  id: string;
  code: string;
  amount: number;
  isUsed: boolean;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  userId: string;
  checkoutId: string | null;
}

export interface PointTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
  userId: string;
  checkoutId: string | null;
}