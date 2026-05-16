export const JOBS_STORAGE_KEY = 'workder_employer_jobs';

export type JobPost = {
    id: string;
    title: string;
    category: string;
    location: string;
    wage: string;
    description: string;
    status: 'เปิดรับ' | 'ปิดรับ';
    createdAt: string;
    applicants: number;
};

export const getJobs = (): JobPost[] => {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(JOBS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const saveJob = (job: Omit<JobPost, 'id' | 'createdAt' | 'applicants' | 'status'>): JobPost => {
    const jobs = getJobs();
    const newJob: JobPost = {
        ...job,
        id: `job_${Date.now()}`,
        createdAt: new Date().toISOString(),
        applicants: 0,
        status: 'เปิดรับ',
    };
    jobs.unshift(newJob);
    window.localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    return newJob;
};

export const updateJobStatus = (id: string, status: JobPost['status']) => {
    const jobs = getJobs();
    const updated = jobs.map((j) => (j.id === id ? { ...j, status } : j));
    window.localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updated));
};
