import { ProfileInput } from '../types';

export const thikaProfileData: ProfileInput = {
    personal: {
        fullName: "Dr Alban Gj. THIKA",
        dob: "1978-01-01"
    },
    educationHistory: [
        { degree: "DBA (Doctor of Business Administration)", institution: "University of South Australia", location: "Australia" },
        { degree: "MBA (Master of Business Administration)", institution: "University of Adelaide", location: "Australia" },
        { degree: "Graduate Diploma in International Relations", institution: "University of Adelaide", location: "Australia" },
        { degree: "Certificate in Disruptive Strategy", institution: "Harvard Business School", location: "USA" }
    ],
    workHistory: [
        { role: "Founder & CEO", organization: "NOVARIC® Sh.A.", location: "Albania", reasonForExit: "" },
        { role: "Founder & CEO", organization: "NOVALTHI", location: "Albania", reasonForExit: "Partners' disagreements" },
        { role: "Team Leader", organization: "EU Funded Project", location: "Albania", reasonForExit: "Project conclusion" },
        { role: "Business Intelligence Analyst", organization: "Government of Malta", location: "Malta", reasonForExit: "" }
    ],
    politicalHistory: [
        { role: "Mayoral Candidate (Independent)", party: "Independent", period: "2012" },
        { role: "Political Activist/Commentator", party: "N/A", period: "2020-Present" }
    ],
    keyLifeEvents: [
        { year: 1997, event: "Emigrated to Italy" },
        { year: 2001, event: "Emigrated to Australia" },
        { year: 2013, event: "Emigrated to Malta" },
        { year: 2016, event: "Returned to Albania" }
    ]
};
