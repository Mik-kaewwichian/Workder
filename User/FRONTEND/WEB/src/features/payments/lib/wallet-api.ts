import api from '../../../lib/api';

/** All amounts from the API are integer satang (1 THB = 100 satang). */

export type WalletTransaction = {
    id: number;
    type: string;
    amount: number; // signed satang
    balanceAfter: number;
    refType?: string | null;
    refId?: number | null;
    description?: string | null;
    createdAt: string;
};

export type WalletSummary = {
    balance: number; // satang
    balanceThb: number;
    recentTransactions: WalletTransaction[];
};

export type TopUp = {
    topUpId: number;
    amount: number; // satang
    amountThb: number;
    qrPayload: string | null;
    status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
    paidAt?: string | null;
};

export const formatThb = (satang: number) =>
    `฿${(satang / 100).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const getWalletSummary = async (): Promise<WalletSummary> => {
    const { data } = await api.get<WalletSummary>('/wallet/me');
    return data;
};

export const getTransactions = async (cursor?: number) => {
    const { data } = await api.get<{ items: WalletTransaction[]; nextCursor: number | null }>(
        '/wallet/transactions',
        { params: cursor ? { cursor } : {} },
    );
    return data;
};

export const createTopUp = async (amountThb: number): Promise<TopUp> => {
    const { data } = await api.post<TopUp>('/wallet/topups', { amount: amountThb });
    return data;
};

export const getTopUp = async (topUpId: number): Promise<TopUp> => {
    const { data } = await api.get<TopUp>(`/wallet/topups/${topUpId}`);
    return data;
};

/** Dev only: simulate paying the mock PromptPay QR (PAYMENT_PROVIDER=mock). */
export const mockCompleteTopUp = async (topUpId: number) => {
    const { data } = await api.post<{ topUpId: number; credited: boolean }>(
        `/payments/mock/complete/${topUpId}`,
    );
    return data;
};
