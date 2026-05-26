import api from '../../../lib/api';

export type EscrowStatus =
    | 'HELD'
    | 'PENDING_CONFIRMATION'
    | 'RELEASED'
    | 'REFUNDED'
    | 'DISPUTED';

export type Escrow = {
    id: number;
    jobId: number;
    applicationId: number;
    employerId: number;
    workerId: number;
    amount: number; // satang held
    feeAmount: number; // satang (deducted from worker payout)
    status: EscrowStatus;
    createdAt: string;
    releasedAt: string | null;
    workerMarkedDoneAt: string | null;
    autoReleaseAt: string | null;
    disputedAt: string | null;
    disputeReason: string | null;
    proofPhotos: string | null; // JSON array of base64/URL strings
    job: { id: number; title: string; payAmount: number };
};

export const listEscrows = async (): Promise<Escrow[]> => {
    const { data } = await api.get<Escrow[]>('/escrow/me');
    return data;
};

export const markWorkDone = (id: number, proofPhotos: string[]) =>
    api.post(`/escrow/${id}/work-done`, { proofPhotos }).then((r) => r.data);

export const confirmEscrow = (id: number) =>
    api.post(`/escrow/${id}/confirm`).then((r) => r.data);

export const disputeEscrow = (id: number, reason: string) =>
    api.post(`/escrow/${id}/dispute`, { reason }).then((r) => r.data);

export const cancelEscrow = (id: number) =>
    api.post(`/escrow/${id}/cancel`).then((r) => r.data);
