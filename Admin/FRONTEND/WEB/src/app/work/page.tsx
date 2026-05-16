'use client';

// Fix: using relative path to avoid alias issues
import JobsListContainer from '../../features/jobs/components/JobsListContainer';

export default function WorkPage() {
    return <JobsListContainer />;
}
