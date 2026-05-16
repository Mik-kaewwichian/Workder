export interface SafeZoneJob {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: 'Safezone';
    posted: string;
    tags: string[];
    description: string;
    verified: boolean;
}

export const safeZoneJobs: SafeZoneJob[] = [
    {
        id: 'sz-001',
        title: "Personal Driver (VIP Family)",
        company: "Private Household",
        location: "Sukhumvit, Bangkok",
        salary: "35,000 - 50,000 THB",
        type: "Safezone",
        posted: "1 day ago",
        tags: ["Driving License", "English", "Non-smoker", "Background Check"],
        description: "Looking for a professional driver for a VIP family. Must have a clean driving record and pass a criminal background check.",
        verified: true
    },
    {
        id: 'sz-002',
        title: "Elderly Care Assistant",
        company: "Happy Home Care",
        location: "Nonthaburi",
        salary: "40,000 - 60,000 THB",
        type: "Safezone",
        posted: "5 hours ago",
        tags: ["Nursing Cert", "Patience", "Live-in", "Medical Check"],
        description: "Certified caregiver needed for an elderly patient. Accommodation provided. Must be verified by Safezone.",
        verified: true
    },
    {
        id: 'sz-003',
        title: "Private Tutor (Math & Science)",
        company: "Learning Hub",
        location: "Online / Sashorn",
        salary: "500 - 800 THB/hour",
        type: "Safezone",
        posted: "2 days ago",
        tags: ["Education Degree", "Teaching Exp", "Verified Tutor"],
        description: "Math and Science tutor for high school students. Background check required for working with minors.",
        verified: true
    },
    {
        id: 'sz-004',
        title: "Housekeeper & Cook",
        company: "Expat Family",
        location: "Chiang Mai",
        salary: "25,000 - 35,000 THB",
        type: "Safezone",
        posted: "3 days ago",
        tags: ["Cooking", "Cleaning", "Trustworthy", "Ref Required"],
        description: "Full-time housekeeper who can cook Thai and Western food. Must provide 3 references.",
        verified: true
    },
    {
        id: 'sz-005',
        title: "Nanny for Newborn",
        company: "Private Family",
        location: "Bangna, Bangkok",
        salary: "45,000 - 60,000 THB",
        type: "Safezone",
        posted: "Just now",
        tags: ["Infant Care", "First Aid", "Vaccinated", "Sleep Training"],
        description: "Experienced nanny needed for a newborn baby. Must have feedback from previous employers.",
        verified: true
    }
];
