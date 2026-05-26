import api from '../../../lib/api';

export type BankAccount = {
    id: number;
    bankCode: string;
    bankName: string;
    accountNumber: string; // masked by the API
    accountName: string;
    isDefault: boolean;
};

export type Withdrawal = {
    id: number;
    amount: number; // satang
    amountThb: number;
    feeAmount: number;
    bankName: string;
    accountNumber: string; // masked
    status: 'REQUESTED' | 'PAID' | 'REJECTED' | 'APPROVED';
    createdAt: string;
};

export const listBankAccounts = async (): Promise<BankAccount[]> =>
    (await api.get<BankAccount[]>('/wallet/bank-accounts')).data;

export const addBankAccount = async (input: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
}): Promise<BankAccount> =>
    (await api.post<BankAccount>('/wallet/bank-accounts', input)).data;

export const deleteBankAccount = (id: number) =>
    api.delete(`/wallet/bank-accounts/${id}`).then((r) => r.data);

export const listWithdrawals = async (): Promise<Withdrawal[]> =>
    (await api.get<Withdrawal[]>('/wallet/withdrawals')).data;

export const requestWithdrawal = async (
    amount: number,
    bankAccountId: number,
): Promise<Withdrawal> =>
    (await api.post<Withdrawal>('/wallet/withdrawals', { amount, bankAccountId })).data;
