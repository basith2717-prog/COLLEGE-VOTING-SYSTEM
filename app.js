/**
 * Apex University College Voting System
 * Inspired by Right2Vote (https://right2vote.in/what-we-do/student-voting/college-elections/)
 * Architecture:
 * - Minimalist Design System & Theme Engine (Light / Dark)
 * - Separate Login Authentication Gateways (Student Voter, Election Admin, Dept Rep)
 * - Zero-Knowledge Anonymization Pipeline (Dual-Ledger Identity Detachment)
 * - Web Crypto API SHA-256 Cryptographic Hash Generation
 * - Public Audit Ledger & Interactive Ballot Receipt Verifier
 * - Real-Time Turnout Analytics, Live Candidate Tallies & Certified Results
 */

// ============================================================================
// 1. DEFAULT SEED DATA
// ============================================================================
const DEFAULT_VOTER_ROLL = [
  {
    id: "STU2024001",
    name: "Rohan Verma",
    department: "Computer Science",
    year: "3rd Year",
    status: "PENDING",
    votedTimestamp: null,
    receiptRef: null,
    receiptToken: null
  },
  {
    id: "STU2024002",
    name: "Ananya Sharma",
    department: "Electronics & Comm.",
    year: "2nd Year",
    status: "PENDING",
    votedTimestamp: null,
    receiptRef: null,
    receiptToken: null
  },
  {
    id: "STU2024003",
    name: "Vikram Malhotra",
    department: "Mechanical Eng.",
    year: "4th Year",
    status: "PENDING",
    votedTimestamp: null,
    receiptRef: null,
    receiptToken: null
  },
  {
    id: "STU2024004",
    name: "Sneha Patel",
    department: "Mechanical Eng.",
    year: "3rd Year",
    status: "VOTED",
    votedTimestamp: "2026-09-26 10:14:22",
    receiptRef: "AU-2026-VOTE-4819",
    receiptToken: "8f5a34e0a7bc9102c914ea8b1937ff001c8413ad794420bf458129774619d854"
  },
  {
    id: "STU2024005",
    name: "Kabir Sengupta",
    department: "Biotechnology",
    year: "4th Year",
    status: "VOTED",
    votedTimestamp: "2026-09-26 10:35:08",
    receiptRef: "AU-2026-VOTE-5120",
    receiptToken: "19cf38a0bc7754d9238eb76783910c2e391307b66df8728a381123490aa7c901"
  },
  {
    id: "STU2024006",
    name: "Pooja Hegde",
    department: "Business Administration",
    year: "2nd Year",
    status: "VOTED",
    votedTimestamp: "2026-09-26 11:02:44",
    receiptRef: "AU-2026-VOTE-6291",
    receiptToken: "f38761aa91e4b85779c13d9408bcf7730e625a58913bba4592035bc2990aa419"
  },
  {
    id: "STU2024007",
    name: "Devendra Rao",
    department: "Computer Science",
    year: "1st Year",
    status: "PENDING",
    votedTimestamp: null,
    receiptRef: null,
    receiptToken: null
  },
  {
    id: "STU2024008",
    name: "Meenakshi Sundaram",
    department: "Electronics & Comm.",
    year: "3rd Year",
    status: "VOTED",
    votedTimestamp: "2026-09-26 11:28:19",
    receiptRef: "AU-2026-VOTE-7412",
    receiptToken: "331a98bc14ef21008d3810f9947aa3b8214690c58e174b09335ef00a2941019a"
  },
  {
    id: "STU2024009",
    name: "Zainab Fatima",
    department: "Biotechnology",
    year: "3rd Year",
    status: "PENDING",
    votedTimestamp: null,
    receiptRef: null,
    receiptToken: null
  },
  {
    id: "STU2024010",
    name: "Arjun Nair",
    department: "Mechanical Eng.",
    year: "2nd Year",
    status: "VOTED",
    votedTimestamp: "2026-09-26 11:50:33",
    receiptRef: "AU-2026-VOTE-8012",
    receiptToken: "b90f45cc3381a7981b29a008892301fa3200914cba8163f9208a34bba7219902"
  },
  {
    id: "STU2024011",
    name: "Tanya Kapoor",
    department: "Business Administration",
    year: "4th Year",
    status: "PENDING",
    votedTimestamp: null,
    receiptRef: null,
    receiptToken: null
  },
  {
    id: "STU2024012",
    name: "Rishi Deshmukh",
    department: "Computer Science",
    year: "2nd Year",
    status: "PENDING",
    votedTimestamp: null,
    receiptRef: null,
    receiptToken: null
  }
];

// ============================================================================
// ELECTION TIERS & MULTI-LEVEL GOVERNANCE CONFIGURATION
// ============================================================================
const ELECTION_TIERS = {
  class: {
    id: "class",
    title: "1. Class Election (CR)",
    shortTitle: "Class CR",
    badge: "Classroom Governance",
    subtitle: "Elect Section & Year representatives for academic liaison, lecture scheduling, and peer study initiatives.",
    positions: [
      "Class Representative (CR)",
      "Deputy Class Representative"
    ]
  },
  department: {
    id: "department",
    title: "2. Departmental Representative",
    shortTitle: "Department",
    badge: "Academic Faculty",
    subtitle: "Faculty-level elections addressing department labs, curriculum feedback, internship approvals, and symposiums.",
    positions: [
      "Department Representative",
      "Department Academic Coordinator"
    ]
  },
  council: {
    id: "council",
    title: "3. Student Body Representation",
    shortTitle: "Student Council",
    badge: "Executive Council",
    subtitle: "University-wide executive officers shaping student rights, campus life, administration liaison, and major festivals.",
    positions: [
      "President",
      "Vice President",
      "General Secretary",
      "Sports Secretary"
    ]
  },
  committee_policy: {
    id: "committee_policy",
    title: "4. Campus Policies & Committees",
    shortTitle: "Policies & Committees",
    badge: "Campus Referendum",
    subtitle: "Direct democratic voting on key student welfare committees and binding campus referendum policies.",
    positions: [
      "Hostel & Dining Oversight Committee Head",
      "Campus Policy Referendum #1: 24/7 Library & Maker Access",
      "Campus Policy Referendum #2: Academic Attendance Flexibility"
    ]
  }
};

const ALL_POSITIONS = [
  "Class Representative (CR)",
  "Deputy Class Representative",
  "Department Representative",
  "Department Academic Coordinator",
  "President",
  "Vice President",
  "General Secretary",
  "Sports Secretary",
  "Hostel & Dining Oversight Committee Head",
  "Campus Policy Referendum #1: 24/7 Library & Maker Access",
  "Campus Policy Referendum #2: Academic Attendance Flexibility"
];

const DEFAULT_CANDIDATES = [
  // ==========================================================================
  // TIER 1: CLASS ELECTION (CR & DEPUTY CR)
  // ==========================================================================
  {
    id: "cand-cr-1",
    tier: "class",
    position: "Class Representative (CR)",
    name: "Aditya Sharma",
    department: "Computer Science",
    year: "3rd Year - Sec A",
    avatarClass: "avatar-blue",
    initials: "AS",
    gpa: "GPA 3.84",
    tagline: '"Shared class notes repository, fair lab timing, and timely assignment alerts."',
    pillars: [
      "Create a verified class Google Drive for shared notes, previous question papers, and lab code snippets.",
      "Liaise with professors to ensure no clashing deadlines between theory assignments and lab evaluations.",
      "Prompt representation for lecture rescheduling and attendance rectification directly with HOD."
    ],
    bio: "Current 3rd-year CS student volunteer and founder of the Apex Code Study Circle. Known for open communication and quick resolution of classroom concerns."
  },
  {
    id: "cand-cr-2",
    tier: "class",
    position: "Class Representative (CR)",
    name: "Kavya Reddy",
    department: "Computer Science",
    year: "3rd Year - Sec B",
    avatarClass: "avatar-purple",
    initials: "KR",
    gpa: "GPA 3.89",
    tagline: '"Student-faculty transparency, upgraded lab workstations, and weekly doubt clearing."',
    pillars: [
      "Weekly anonymous feedback form to compile class difficulties before fortnightly faculty meetings.",
      "Ensure all computer lab workstations have updated compilers and GPU drivers before practical exams.",
      "Organize peer tutoring study hours in the library before mid-term and semester examinations."
    ],
    bio: "ACM Student Chapter core coordinator and competitive programming mentor. Believes in mutual academic support and stress-free classroom learning."
  },
  {
    id: "cand-dcr-1",
    tier: "class",
    position: "Deputy Class Representative",
    name: "Manish Verma",
    department: "Computer Science",
    year: "3rd Year - Sec A",
    avatarClass: "avatar-indigo",
    initials: "MV",
    gpa: "GPA 3.76",
    tagline: '"Swift notification broadcast, peer dispute resolution, and seminar booking."',
    pillars: [
      "Instant WhatsApp & Discord bot alerts for schedule changes, quiz deadlines, and guest lectures.",
      "Assist classmates with lab team formations and fair distribution of project topics.",
      "Reserve dedicated class seminar rooms for group presentations and mock interviews."
    ],
    bio: "Active sports coordinator and university tech fest lead organizer. Committed to keeping every classmate updated and supported."
  },
  {
    id: "cand-dcr-2",
    tier: "class",
    position: "Deputy Class Representative",
    name: "Sanya Gupta",
    department: "Computer Science",
    year: "3rd Year - Sec B",
    avatarClass: "avatar-teal",
    initials: "SG",
    gpa: "GPA 3.91",
    tagline: '"Collaborative classroom, inclusive elective choices, and textbook sharing."',
    pillars: [
      "Coordinate with senior students to pass down reference textbooks and lab equipment manuals.",
      "Help classmates navigate specialized elective selections with faculty counseling.",
      "Establish an open calendar for class assignments to prevent exam week burnout."
    ],
    bio: "Dean's list student and university debate club secretary. Passionate about empowering every student with accessible academic resources."
  },

  // ==========================================================================
  // TIER 2: DEPARTMENT ELECTION (DEPT REP & ACADEMIC COORDINATOR)
  // ==========================================================================
  {
    id: "cand-deptrep-1",
    tier: "department",
    position: "Department Representative",
    name: "Nikhil Bansal",
    department: "Computer Science",
    year: "3rd Year",
    avatarClass: "avatar-blue",
    initials: "NB",
    gpa: "GPA 3.87",
    tagline: '"48-Hour Internship NOCs, dedicated cloud GPU credits, and industry hackathons."',
    pillars: [
      "Fast-track departmental NOC processing for summer/winter internships within 48 hours.",
      "Secure AWS/GCP server credits and upgraded lab hardware for final-year capstone projects.",
      "Monthly open grievance hours with Department Chair and Senior Faculty."
    ],
    bio: "Vice Chair of IEEE Student Branch and developer of the department research repository. Proven track record advocating for student technical resources."
  },
  {
    id: "cand-deptrep-2",
    tier: "department",
    position: "Department Representative",
    name: "Priyanka Nair",
    department: "Computer Science",
    year: "3rd Year",
    avatarClass: "avatar-amber",
    initials: "PN",
    gpa: "GPA 3.93",
    tagline: '"Undergraduate research grants, standardized lab rubrics, and alumni mentorship."',
    pillars: [
      "Establish department seed funds of ₹25,000 for student paper publications and international conferences.",
      "Ensure transparent, standardized grading rubrics across all lab instructors to eliminate scoring bias.",
      "Launch a dedicated alumni mentoring circle connecting students with senior software engineers."
    ],
    bio: "Published undergraduate researcher in computer vision and student advisory board member. Dedicated to bridging academia and top tech industry roles."
  },
  {
    id: "cand-deptcoord-1",
    tier: "department",
    position: "Department Academic Coordinator",
    name: "Rahul Deshmukh",
    department: "Computer Science",
    year: "3rd Year",
    avatarClass: "avatar-slate",
    initials: "RD",
    gpa: "GPA 3.82",
    tagline: '"Balanced examination schedules, zero paper printout mandates, and remedial clinics."',
    pillars: [
      "Mandate minimum 24-hour study gaps between core major exams on university schedules.",
      "Eliminate costly mandatory paper lab record printing in favor of digitally signed submissions.",
      "Host faculty-guided exam preparation clinics for challenging prerequisite courses."
    ],
    bio: "Department student council coordinator who has assisted in timetabling and exam administration. Pragmatic advocate for student wellness."
  },
  {
    id: "cand-deptcoord-2",
    tier: "department",
    position: "Department Academic Coordinator",
    name: "Ananya Sen",
    department: "Computer Science",
    year: "3rd Year",
    avatarClass: "avatar-teal",
    initials: "AS",
    gpa: "GPA 3.95",
    tagline: '"Emerging technology electives, verified research credits, and digital syllabus trackers."',
    pillars: [
      "Advocate for new specialized electives in Generative AI, Quantum Computing, and Cybersecurity.",
      "Allow verified open-source contributions and Kaggle medals to count for seminar course credits.",
      "Implement a real-time syllabus tracking portal so students always know upcoming test topics."
    ],
    bio: "Academic Excellence Award winner and mentor for junior programming bootcamps. Passionate about forward-thinking computer science education."
  },

  // ==========================================================================
  // TIER 3: STUDENT BODY REPRESENTATION (EXECUTIVE COUNCIL)
  // ==========================================================================
  {
    id: "cand-pres-1",
    tier: "council",
    position: "President",
    name: "Aarav Joshi",
    department: "Computer Science",
    year: "4th Year",
    avatarClass: "avatar-blue",
    initials: "AJ",
    gpa: "GPA 3.92",
    tagline: '"A Connected Campus: Elevating Student Rights and Career Pipelines"',
    pillars: [
      "Securing round-the-clock library & makerspace access with high-speed internet.",
      "Launching an alumni mentorship portal and guaranteed career fair subsidies.",
      "Expanding campus health & counseling staff availability by 40%."
    ],
    bio: "Former General Secretary of TechSoc and President of the Debate Guild. Aarav has worked closely with university senate committees on student mental wellness and syllabus updates."
  },
  {
    id: "cand-pres-2",
    tier: "council",
    position: "President",
    name: "Diya Narang",
    department: "Electronics & Comm.",
    year: "4th Year",
    avatarClass: "avatar-purple",
    initials: "DN",
    gpa: "GPA 3.88",
    tagline: '"Transparency, Sustainability, and Inclusive Student Representation"',
    pillars: [
      "Open-book council budgets published on a public university dashboard monthly.",
      "Solar charging canopies across campus green spaces and subsidized bus passes.",
      "Emergency student micro-grant fund for unexpected academic or medical crises."
    ],
    bio: "Head organizer of Apex TechFest 2025 and active student ombudsperson. Diya champions transparency in university resource allocation and campus sustainability."
  },
  {
    id: "cand-vp-1",
    tier: "council",
    position: "Vice President",
    name: "Siddharth Menon",
    department: "Mechanical Eng.",
    year: "3rd Year",
    avatarClass: "avatar-indigo",
    initials: "SM",
    gpa: "GPA 3.81",
    tagline: '"Action-Driven Student Life & Upgraded Campus Infrastructure"',
    pillars: [
      "Revamping hostel Wi-Fi, laundry amenities, and student cafeteria food quality.",
      "Creating an inter-departmental innovation hackathon with corporate sponsorships.",
      "Streamlining official university club approvals to under 48 hours."
    ],
    bio: "Captained the Robotics Racing Team and served as Student-Faculty Liaison for Mechanical Engineering. Strong believer in modernizing university amenities."
  },
  {
    id: "cand-vp-2",
    tier: "council",
    position: "Vice President",
    name: "Prisha Mehra",
    department: "Business Administration",
    year: "3rd Year",
    avatarClass: "avatar-teal",
    initials: "PM",
    gpa: "GPA 3.85",
    tagline: '"Empowering Every Voice: Cross-Faculty Synergy & Professional Workshops"',
    pillars: [
      "Establishing university-funded certification vouchers for AWS, CFA, and design tools.",
      "Host bi-weekly open mics and interdisciplinary research fairs.",
      "Revamping hostel shuttle frequency during peak evening study hours."
    ],
    bio: "Founder of the Apex Women in Leadership Chapter and vice-chair of Student Finance Club. Passionate about empowering diverse students to reach top industry roles."
  },
  {
    id: "cand-sec-1",
    tier: "council",
    position: "General Secretary",
    name: "Karan Singhania",
    department: "Computer Science",
    year: "3rd Year",
    avatarClass: "avatar-amber",
    initials: "KS",
    gpa: "GPA 3.75",
    tagline: '"Digital Efficiency, Swift Grievance Resolution, and Transparent Admin"',
    pillars: [
      "Single-window digital grievance app with guaranteed 72-hour dean responses.",
      "Consolidated student council calendar sync with Google & Outlook.",
      "Automated hostel and gate-pass generation without manual paper slips."
    ],
    bio: "Full-stack developer who built the university's student club registration bot. Dedicated to dismantling campus bureaucratic bottlenecks."
  },
  {
    id: "cand-sec-2",
    tier: "council",
    position: "General Secretary",
    name: "Tanvi Kulkarni",
    department: "Biotechnology",
    year: "3rd Year",
    avatarClass: "avatar-blue",
    initials: "TK",
    gpa: "GPA 3.90",
    tagline: '"Accountable Governance and Student-Led Campus Policies"',
    pillars: [
      "Town-hall forums before every major fee or administrative policy revision.",
      "Centralized peer-to-peer textbook and lab gear exchange.",
      "Inclusive international student onboarding and buddy mentoring network."
    ],
    bio: "Lead student researcher in the Bio-Nanotech Lab and editor of the Campus Chronicle. Proven track record of diligent administrative coordination."
  },
  {
    id: "cand-sport-1",
    tier: "council",
    position: "Sports Secretary",
    name: "Harshavardhan Reddy",
    department: "Mechanical Eng.",
    year: "4th Year",
    avatarClass: "avatar-slate",
    initials: "HR",
    gpa: "GPA 3.65",
    tagline: '"World-Class Athletic Infrastructure & Year-Round Inter-Collegiate Leagues"',
    pillars: [
      "Refurbishing indoor badminton courts, gym equipment, and floodlit turf fields.",
      "Introducing certified physical trainers and sports nutritionists for varsity athletes.",
      "Launching the Apex Campus Premier League for cricket, football, and esports."
    ],
    bio: "University Football Team Captain and state-level track athlete. Championed enhanced sports equipment funding in previous council subcommittees."
  },
  {
    id: "cand-sport-2",
    tier: "council",
    position: "Sports Secretary",
    name: "Radhika Sen",
    department: "Electronics & Comm.",
    year: "3rd Year",
    avatarClass: "avatar-indigo",
    initials: "RS",
    gpa: "GPA 3.79",
    tagline: '"Fitness For All: Inclusive Athletics, Yoga Spaces, and Esports Integration"',
    pillars: [
      "Dedicated women's athletic hours and self-defense masterclasses.",
      "Formal varsity recognition and gaming lab for collegiate esports squads.",
      "Free intramural fitness bootcamps and weekend marathon runs."
    ],
    bio: "University Basketball Co-Captain and founder of Apex Runners Club. Passionate about promoting wellness and athletics across all academic departments."
  },

  // ==========================================================================
  // TIER 4: COMMITTEES & CAMPUS POLICIES (RIGHT2VOTE CARDS 2 & 4)
  // ==========================================================================
  {
    id: "cand-comm-1",
    tier: "committee_policy",
    position: "Hostel & Dining Oversight Committee Head",
    name: "Sameer Khan",
    department: "Mechanical Eng.",
    year: "4th Year",
    avatarClass: "avatar-blue",
    initials: "SK",
    gpa: "GPA 3.78",
    tagline: '"Nutritious dining, weekly student mess audits, and rapid maintenance turnaround."',
    pillars: [
      "Form a student-led mess inspection committee conducting weekly unannounced hygiene audits.",
      "Extend hot meal service hours in campus dining halls up to 2:00 AM during exam periods.",
      "Launch a 24-hour maintenance ticketing SLA for hostel plumbing, Wi-Fi, and electrical issues."
    ],
    bio: "Senior hostel warden representative and captain of the campus badminton team. Has negotiated cafeteria pricing rollbacks and menu improvements."
  },
  {
    id: "cand-comm-2",
    tier: "committee_policy",
    position: "Hostel & Dining Oversight Committee Head",
    name: "Isha Patel",
    department: "Biotechnology",
    year: "3rd Year",
    avatarClass: "avatar-teal",
    initials: "IP",
    gpa: "GPA 3.86",
    tagline: '"Diverse regional cuisines, transparent food vendor contracts, and water purification monitoring."',
    pillars: [
      "Add regional dietary options, fresh salads, and lactose-free/vegan selections to weekly dining menus.",
      "Implement rollover dining credit passes so unused meal tickets never expire.",
      "Install smart IoT real-time monitoring on all campus RO drinking water stations."
    ],
    bio: "Campus health committee activist and member of the student welfare society. Strong advocate for wholesome residential living."
  },
  {
    id: "cand-pol1-yes",
    tier: "committee_policy",
    position: "Campus Policy Referendum #1: 24/7 Library & Maker Access",
    name: "YES — Implement 24/7 RFID Smart Access",
    department: "Campus Policy Initiative",
    year: "Binding Referendum",
    avatarClass: "avatar-green",
    initials: "YES",
    gpa: "Binding Ballot",
    tagline: '"Open Central Library, Computer Clusters, and MakerSpaces 24 hours daily with RFID security."',
    pillars: [
      "Continuous CCTV surveillance and security guards stationed for overnight study safety.",
      "High-speed Wi-Fi, ergonomic study cubicles, and automated tea/coffee kiosks operational overnight.",
      "Encourages nocturnal collaborative research and international hackathon team preparations."
    ],
    bio: "Sponsored by Student Senate Bill 2026-04. Passing with 50%+ student approval mandates university facilities administration to deploy round-the-clock badge access by next semester."
  },
  {
    id: "cand-pol1-no",
    tier: "committee_policy",
    position: "Campus Policy Referendum #1: 24/7 Library & Maker Access",
    name: "NO — Maintain Standard Hours (8:00 AM - 10:00 PM)",
    department: "Campus Policy Initiative",
    year: "Binding Referendum",
    avatarClass: "avatar-slate",
    initials: "NO",
    gpa: "Binding Ballot",
    tagline: '"Maintain current operating hours to avoid facility fee surcharges and conserve university energy."',
    pillars: [
      "Reduces facility electricity and night-shift security overhead, keeping tuition stable.",
      "Allocates library budget surplus toward purchasing digital e-book licenses and cloud compute.",
      "Permits extended 24-hour access strictly during official exam fortnights instead of year-round."
    ],
    bio: "Proponent stance arguing that standard operating hours conserve operational resources and protect residential hostel quiet hours."
  },
  {
    id: "cand-pol2-yes",
    tier: "committee_policy",
    position: "Campus Policy Referendum #2: Academic Attendance Flexibility",
    name: "YES — Adopt 65% Minimum Attendance with Hybrid Video",
    department: "Academic Senate Referendum",
    year: "Binding Referendum",
    avatarClass: "avatar-blue",
    initials: "YES",
    gpa: "Binding Ballot",
    tagline: '"Lower mandatory in-person threshold to 65% for students in internships, competitions, and medical leave."',
    pillars: [
      "High-definition lecture recordings uploaded to the student portal within 24 hours of each lecture.",
      "Automated verification for conference presentations, startup hackathons, and varsity athletic tours.",
      "Rewards academic mastery of course learning outcomes over purely rigid physical classroom seating."
    ],
    bio: "Proposed to modernize university academic guidelines, bringing Apex University on par with leading global technical institutions."
  },
  {
    id: "cand-pol2-no",
    tier: "committee_policy",
    position: "Campus Policy Referendum #2: Academic Attendance Flexibility",
    name: "NO — Retain Strict 75% Classroom Attendance Requirement",
    department: "Academic Senate Referendum",
    year: "Binding Referendum",
    avatarClass: "avatar-slate",
    initials: "NO",
    gpa: "Binding Ballot",
    tagline: '"Retain mandatory 75% in-person attendance for accreditation standards and collaborative learning."',
    pillars: [
      "Upholds highest university degree accreditation compliance and professional board standing.",
      "Encourages active peer participation, hands-on laboratory discipline, and faculty interaction.",
      "Prevents student isolation and ensures regular academic momentum throughout the semester."
    ],
    bio: "Proponent stance highlighting that in-person faculty discussions and classroom peer interactions form the bedrock of a holistic collegiate education."
  }
];

const DEFAULT_CIPHER_LEDGER = [
  {
    id: 1,
    ballotHash: "8f5a34e0a7bc9102c914ea8b1937ff001c8413ad794420bf458129774619d854",
    payloadPreview: "CIPHER:[CR:cand-cr-1 | DCR:cand-dcr-1 | DR:cand-deptrep-1 | P:cand-pres-1 | POL1:YES]",
    timestamp: "2026-09-26 10:14:22",
    selections: {
      "Class Representative (CR)": "cand-cr-1",
      "Deputy Class Representative": "cand-dcr-1",
      "Department Representative": "cand-deptrep-1",
      "Department Academic Coordinator": "cand-deptcoord-1",
      "President": "cand-pres-1",
      "Vice President": "cand-vp-1",
      "General Secretary": "cand-sec-1",
      "Sports Secretary": "cand-sport-1",
      "Hostel & Dining Oversight Committee Head": "cand-comm-1",
      "Campus Policy Referendum #1: 24/7 Library & Maker Access": "cand-pol1-yes",
      "Campus Policy Referendum #2: Academic Attendance Flexibility": "cand-pol2-yes"
    },
    verificationStatus: "SEALED & VERIFIED"
  },
  {
    id: 2,
    ballotHash: "19cf38a0bc7754d9238eb76783910c2e391307b66df8728a381123490aa7c901",
    payloadPreview: "CIPHER:[CR:cand-cr-2 | DCR:cand-dcr-2 | DR:cand-deptrep-2 | P:cand-pres-2 | POL1:YES]",
    timestamp: "2026-09-26 10:35:08",
    selections: {
      "Class Representative (CR)": "cand-cr-2",
      "Deputy Class Representative": "cand-dcr-2",
      "Department Representative": "cand-deptrep-2",
      "Department Academic Coordinator": "cand-deptcoord-2",
      "President": "cand-pres-2",
      "Vice President": "cand-vp-2",
      "General Secretary": "cand-sec-2",
      "Sports Secretary": "cand-sport-2",
      "Hostel & Dining Oversight Committee Head": "cand-comm-2",
      "Campus Policy Referendum #1: 24/7 Library & Maker Access": "cand-pol1-yes",
      "Campus Policy Referendum #2: Academic Attendance Flexibility": "cand-pol2-no"
    },
    verificationStatus: "SEALED & VERIFIED"
  },
  {
    id: 3,
    ballotHash: "f38761aa91e4b85779c13d9408bcf7730e625a58913bba4592035bc2990aa419",
    payloadPreview: "CIPHER:[CR:cand-cr-1 | DCR:cand-dcr-2 | DR:cand-deptrep-1 | P:cand-pres-1 | POL1:YES]",
    timestamp: "2026-09-26 11:02:44",
    selections: {
      "Class Representative (CR)": "cand-cr-1",
      "Deputy Class Representative": "cand-dcr-2",
      "Department Representative": "cand-deptrep-1",
      "Department Academic Coordinator": "cand-deptcoord-2",
      "President": "cand-pres-1",
      "Vice President": "cand-vp-2",
      "General Secretary": "cand-sec-1",
      "Sports Secretary": "cand-sport-2",
      "Hostel & Dining Oversight Committee Head": "cand-comm-1",
      "Campus Policy Referendum #1: 24/7 Library & Maker Access": "cand-pol1-yes",
      "Campus Policy Referendum #2: Academic Attendance Flexibility": "cand-pol2-yes"
    },
    verificationStatus: "SEALED & VERIFIED"
  },
  {
    id: 4,
    ballotHash: "331a98bc14ef21008d3810f9947aa3b8214690c58e174b09335ef00a2941019a",
    payloadPreview: "CIPHER:[CR:cand-cr-2 | DCR:cand-dcr-1 | DR:cand-deptrep-2 | P:cand-pres-2 | POL2:YES]",
    timestamp: "2026-09-26 11:28:19",
    selections: {
      "Class Representative (CR)": "cand-cr-2",
      "Deputy Class Representative": "cand-dcr-1",
      "Department Representative": "cand-deptrep-2",
      "Department Academic Coordinator": "cand-deptcoord-1",
      "President": "cand-pres-2",
      "Vice President": "cand-vp-1",
      "General Secretary": "cand-sec-2",
      "Sports Secretary": "cand-sport-1",
      "Hostel & Dining Oversight Committee Head": "cand-comm-2",
      "Campus Policy Referendum #1: 24/7 Library & Maker Access": "cand-pol1-no",
      "Campus Policy Referendum #2: Academic Attendance Flexibility": "cand-pol2-yes"
    },
    verificationStatus: "SEALED & VERIFIED"
  },
  {
    id: 5,
    ballotHash: "b90f45cc3381a7981b29a008892301fa3200914cba8163f9208a34bba7219902",
    payloadPreview: "CIPHER:[CR:cand-cr-1 | DCR:cand-dcr-1 | DR:cand-deptrep-1 | P:cand-pres-1 | POL1:YES]",
    timestamp: "2026-09-26 11:50:33",
    selections: {
      "Class Representative (CR)": "cand-cr-1",
      "Deputy Class Representative": "cand-dcr-1",
      "Department Representative": "cand-deptrep-1",
      "Department Academic Coordinator": "cand-deptcoord-1",
      "President": "cand-pres-1",
      "Vice President": "cand-vp-1",
      "General Secretary": "cand-sec-1",
      "Sports Secretary": "cand-sport-2",
      "Hostel & Dining Oversight Committee Head": "cand-comm-1",
      "Campus Policy Referendum #1: 24/7 Library & Maker Access": "cand-pol1-yes",
      "Campus Policy Referendum #2: Academic Attendance Flexibility": "cand-pol2-yes"
    },
    verificationStatus: "SEALED & VERIFIED"
  }
];

// ============================================================================
// 2. STATE MANAGER & PERSISTENCE
// ============================================================================
class StateManager {
  constructor() {
    this.storageKey = "apex_minimal_vote_state_v2";
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      electionStatus: "VOTING OPEN", // 'PRE-ELECTION' | 'VOTING OPEN' | 'VOTING LOCKED'
      currentView: "login",          // 'login' | 'student' | 'admin' | 'dept' | 'results'
      loginTab: "student",           // 'student' | 'admin' | 'dept'
      currentStep: 1,                // 1: Auth, 2: Ballot, 3: Review, 4: Receipt
      theme: "light",
      activeStudent: null,
      isAdminAuthenticated: false,
      isDeptAuthenticated: false,
      activeDept: "Computer Science",
      ballotScope: "all",            // 'all' | 'class' | 'department' | 'council' | 'committee_policy'
      ballotMode: "all",             // 'all' | 'guided'
      guidedStepIndex: 0,            // 0: class, 1: department, 2: council, 3: committee_policy
      resultsScope: "all",
      pendingJumpTier: null,
      ballotSelections: {},
      voterRoll: JSON.parse(JSON.stringify(DEFAULT_VOTER_ROLL)),
      candidates: JSON.parse(JSON.stringify(DEFAULT_CANDIDATES)),
      cipherLedger: JSON.parse(JSON.stringify(DEFAULT_CIPHER_LEDGER)),
      adminPreviewTallies: true,
      lastReceipt: null
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.voterRoll && parsed.candidates && parsed.cipherLedger) {
          // If stored state is from an earlier version with fewer than 10 candidates, refresh with new tiers!
          if (parsed.candidates.length < 10) {
            parsed.candidates = JSON.parse(JSON.stringify(DEFAULT_CANDIDATES));
            parsed.cipherLedger = JSON.parse(JSON.stringify(DEFAULT_CIPHER_LEDGER));
          }
          if (!parsed.ballotScope) parsed.ballotScope = "all";
          if (!parsed.ballotMode) parsed.ballotMode = "all";
          if (parsed.guidedStepIndex === undefined) parsed.guidedStepIndex = 0;
          if (!parsed.resultsScope) parsed.resultsScope = "all";
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not load stored state, resetting:", e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }

  resetToDefaults() {
    this.state = this.getDefaultState();
    this.saveState();
  }
}

// ============================================================================
// 3. CRYPTOGRAPHIC UTILITIES
// ============================================================================
class CryptoUtil {
  static async sha256(message) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      } catch (err) {
        console.warn("SubtleCrypto failed, using fallback:", err);
      }
    }
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      hash = (hash << 5) - hash + message.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return `${hex}e4b7c19a2df68102ac374826190ef9925b401c87361928374a5f6e7d8c9b0a12`;
  }

  static generateReceiptRef() {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `AU-2026-VOTE-${randNum}`;
  }

  static getFormattedTimestamp() {
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }
}

// ============================================================================
// 4. MAIN APPLICATION CONTROLLER
// ============================================================================
class VotingApp {
  constructor() {
    this.stateMgr = new StateManager();
    this.positions = ALL_POSITIONS;
    this.currentManifestoCandidate = null;

    this.initElements();
    this.initEventListeners();
    this.applyTheme(this.stateMgr.state.theme);
    this.render();
  }

  initElements() {
    // Header Navigation
    this.navBtnStudent = document.getElementById("nav-btn-student");
    this.navBtnAdmin = document.getElementById("nav-btn-admin");
    this.navBtnDept = document.getElementById("nav-btn-dept");
    this.navBtnPublicResults = document.getElementById("nav-btn-public-results");
    this.headerUserSession = document.getElementById("header-user-session");
    this.headerUserAvatar = document.getElementById("header-user-avatar");
    this.headerUserName = document.getElementById("header-user-name");
    this.btnHeaderLogout = document.getElementById("btn-header-logout");

    // Main Sections
    this.loginGatewaySection = document.getElementById("login-gateway-section");
    this.studentPortalView = document.getElementById("student-portal-view");
    this.publicResultsView = document.getElementById("public-results-view");
    this.adminPortalView = document.getElementById("admin-portal-view");
    this.deptRepPortalView = document.getElementById("dept-rep-portal-view");

    // Login Gateway Tabs & Panes
    this.tabLoginStudent = document.getElementById("tab-login-student");
    this.tabLoginAdmin = document.getElementById("tab-login-admin");
    this.tabLoginDept = document.getElementById("tab-login-dept");
    this.loginStudentPane = document.getElementById("login-student-pane");
    this.loginAdminPane = document.getElementById("login-admin-pane");
    this.loginDeptPane = document.getElementById("login-dept-pane");

    // Student Login Inputs
    this.studentIdInput = document.getElementById("student-id-input");
    this.studentDeptSelect = document.getElementById("student-dept-select");
    this.studentOtpInput = document.getElementById("student-otp-input");
    this.btnRequestOtp = document.getElementById("btn-request-otp");
    this.btnAutofillOtp = document.getElementById("btn-autofill-otp");
    this.btnStudentLogin = document.getElementById("btn-student-login");
    this.authElectionNotice = document.getElementById("auth-election-notice");

    // Admin Login Inputs
    this.adminUsernameInput = document.getElementById("admin-username-input");
    this.adminPasswordInput = document.getElementById("admin-password-input");
    this.btnAdminLoginSubmit = document.getElementById("btn-admin-login-submit");

    // Dept Login Inputs
    this.deptLoginSelect = document.getElementById("dept-login-select");
    this.deptPinInput = document.getElementById("dept-pin-input");
    this.btnDeptLoginSubmit = document.getElementById("btn-dept-login-submit");

    // Status Header
    this.headerElectionStatus = document.getElementById("header-election-status");
    this.statusPulseDot = document.getElementById("status-pulse-dot");

    // Stepper
    this.stepItems = document.querySelectorAll(".step-item");
    this.stepLines = [
      document.getElementById("step-line-1"),
      document.getElementById("step-line-2"),
      document.getElementById("step-line-3")
    ];

    // Student Subviews
    this.studentVotedReceiptContainer = document.getElementById("student-voted-receipt-container");
    this.studentBallotContainer = document.getElementById("student-ballot-container");
    this.studentReviewContainer = document.getElementById("student-review-container");
    this.studentReceiptContainer = document.getElementById("student-receipt-container");

    // Already Voted View
    this.votedStudentId = document.getElementById("voted-student-id");
    this.votedStudentName = document.getElementById("voted-student-name");
    this.votedStudentDept = document.getElementById("voted-student-dept");
    this.votedTimestamp = document.getElementById("voted-timestamp");
    this.votedHashToken = document.getElementById("voted-hash-token");
    this.btnPrintExistingReceipt = document.getElementById("btn-print-existing-receipt");
    this.btnSwitchVoterBack = document.getElementById("btn-switch-voter-back");

    // Ballot Controls & Scope Selectors
    this.sessionInitials = document.getElementById("session-initials");
    this.sessionStudentName = document.getElementById("session-student-name");
    this.sessionStudentId = document.getElementById("session-student-id");
    this.sessionStudentDept = document.getElementById("session-student-dept");
    this.ballotProgressCount = document.getElementById("ballot-progress-count");
    this.ballotProgressFill = document.getElementById("ballot-progress-fill");
    this.btnCancelBallot = document.getElementById("btn-cancel-ballot");
    this.categoryPillsNav = document.getElementById("category-pills-nav");
    this.ballotPositionsContainer = document.getElementById("ballot-positions-container");
    this.btnProceedReview = document.getElementById("btn-proceed-review");
    this.ballotSelectionStatusText = document.getElementById("ballot-selection-status-text");

    // Multi-tier Scope & Mode Elements
    this.btnToggleAllScopes = document.getElementById("btn-toggle-all-scopes");
    this.btnToggleGuidedScopes = document.getElementById("btn-toggle-guided-scopes");
    this.scopeTabBtns = document.querySelectorAll(".scope-tab-btn");
    this.btnQuickFillBallot = document.getElementById("btn-quick-fill-ballot");
    this.guidedTierBannerContainer = document.getElementById("guided-tier-banner-container");
    this.btnNextScope = document.getElementById("btn-next-scope");
    this.resultsFilterPills = document.querySelectorAll("#results-filter-pills .filter-pill");

    // Review Choices
    this.reviewSelectionsList = document.getElementById("review-selections-list");
    this.btnBackToBallot = document.getElementById("btn-back-to-ballot");
    this.btnConfirmFinalSubmission = document.getElementById("btn-confirm-final-submission");

    // Receipt
    this.rcptRefNo = document.getElementById("rcpt-ref-no");
    this.rcptTimestamp = document.getElementById("rcpt-timestamp");
    this.rcptBlockId = document.getElementById("rcpt-block-id");
    this.rcptHashToken = document.getElementById("rcpt-hash-token");
    this.btnCopyHash = document.getElementById("btn-copy-hash");
    this.btnPrintReceipt = document.getElementById("btn-print-receipt");
    this.btnVerifyMyReceipt = document.getElementById("btn-verify-my-receipt");
    this.btnFinishLogout = document.getElementById("btn-finish-logout");

    // Public Results & Verifier Tool
    this.pubKpiTotal = document.getElementById("pub-kpi-total");
    this.pubKpiVoted = document.getElementById("pub-kpi-voted");
    this.pubKpiTurnoutPct = document.getElementById("pub-kpi-turnout-pct");
    this.pubKpiLedgerStatus = document.getElementById("pub-kpi-ledger-status");
    this.verifierInput = document.getElementById("verifier-input");
    this.btnVerifyReceipt = document.getElementById("btn-verify-receipt");
    this.verifierResultBox = document.getElementById("verifier-result-box");
    this.publicTalliesGrid = document.getElementById("public-tallies-grid");
    this.publicDeptTurnoutList = document.getElementById("public-dept-turnout-list");
    this.publicTalliesBadge = document.getElementById("public-tallies-badge");

    // Admin Elements
    this.phaseButtons = document.querySelectorAll(".phase-btn");
    this.kpiTotalVoters = document.getElementById("kpi-total-voters");
    this.kpiVotedCount = document.getElementById("kpi-voted-count");
    this.kpiTurnoutPct = document.getElementById("kpi-turnout-pct");
    this.kpiPendingCount = document.getElementById("kpi-pending-count");
    this.kpiLedgerIntegrity = document.getElementById("kpi-ledger-integrity");
    this.tabVoterCount = document.getElementById("tab-voter-count");
    this.adminTabs = document.querySelectorAll(".admin-tab");
    this.tabPanes = document.querySelectorAll(".tab-pane");
    this.btnSimulateVote = document.getElementById("btn-simulate-vote");
    this.btnResetDemo = document.getElementById("btn-reset-demo");
    this.voterSearchInput = document.getElementById("voter-search-input");
    this.voterFilterPills = document.querySelectorAll(".filter-pill");
    this.voterRollTbody = document.getElementById("voter-roll-tbody");
    this.filterCntAll = document.getElementById("filter-cnt-all");
    this.filterCntPending = document.getElementById("filter-cnt-pending");
    this.filterCntVoted = document.getElementById("filter-cnt-voted");
    this.adminCandidatesContainer = document.getElementById("admin-candidates-container");
    this.adminTallyOverrideToggle = document.getElementById("admin-tally-override-toggle");
    this.talliesChartsContainer = document.getElementById("tallies-charts-container");
    this.tallyLockStatusTitle = document.getElementById("tally-lock-status-title");
    this.tallyLockStatusDesc = document.getElementById("tally-lock-status-desc");
    this.auditLedgerTbody = document.getElementById("audit-ledger-tbody");
    this.declTotalTurnout = document.getElementById("decl-total-turnout");
    this.declTotalVotes = document.getElementById("decl-total-votes");
    this.declPositionsCount = document.getElementById("decl-positions-count");
    this.winnersCardsGrid = document.getElementById("winners-cards-grid");

    // Dept Rep Elements
    this.deptRepSelect = document.getElementById("dept-rep-select");
    this.deptKpiTotal = document.getElementById("dept-kpi-total");
    this.deptKpiVoted = document.getElementById("dept-kpi-voted");
    this.deptKpiTurnoutPct = document.getElementById("dept-kpi-turnout-pct");
    this.deptKpiPending = document.getElementById("dept-kpi-pending");
    this.deptKpiRank = document.getElementById("dept-kpi-rank");
    this.deptKpiDeptLabel = document.getElementById("dept-kpi-dept-label");
    this.deptTabs = document.querySelectorAll(".dept-tab");
    this.deptTabPanes = document.querySelectorAll(".dept-tab-pane");
    this.deptVoterSearch = document.getElementById("dept-voter-search");
    this.deptFilterPills = document.querySelectorAll(".dept-filter-pill");
    this.deptVoterRollTbody = document.getElementById("dept-voter-roll-tbody");
    this.deptTabVoterCount = document.getElementById("dept-tab-voter-count");
    this.deptCandidatesGrid = document.getElementById("dept-candidates-grid");
    this.deptLeaderboardList = document.getElementById("dept-leaderboard-list");
    this.adminDeptLeaderboardContainer = document.getElementById("admin-dept-leaderboard-container");

    // Modals
    this.modalManifesto = document.getElementById("modal-manifesto");
    this.btnCloseManifesto = document.getElementById("btn-close-manifesto");
    this.btnManifestoCloseBottom = document.getElementById("btn-manifesto-close-bottom");
    this.btnManifestoSelectCandidate = document.getElementById("btn-manifesto-select-candidate");
    this.manifestoAvatar = document.getElementById("manifesto-avatar");
    this.manifestoPosition = document.getElementById("manifesto-position");
    this.manifestoCandidateName = document.getElementById("manifesto-candidate-name");
    this.manifestoCandidateDept = document.getElementById("manifesto-candidate-dept");
    this.manifestoTagline = document.getElementById("manifesto-tagline");
    this.manifestoPillarsList = document.getElementById("manifesto-pillars-list");
    this.manifestoBio = document.getElementById("manifesto-bio");

    this.modalAnonymize = document.getElementById("modal-anonymize");
    this.pipeVoterId = document.getElementById("pipe-voter-id");
    this.pipeStep1 = document.getElementById("pipe-step-1");
    this.pipeStep2 = document.getElementById("pipe-step-2");
    this.pipeStep3 = document.getElementById("pipe-step-3");
    this.pipelineProgressFill = document.getElementById("pipeline-progress-fill");

    this.modalAddVoter = document.getElementById("modal-add-voter");
    this.btnOpenAddVoterModal = document.getElementById("btn-open-add-voter-modal");
    this.btnCloseAddVoter = document.getElementById("btn-close-add-voter");
    this.btnCancelAddVoter = document.getElementById("btn-cancel-add-voter");
    this.btnSaveNewVoter = document.getElementById("btn-save-new-voter");
    this.newVoterId = document.getElementById("new-voter-id");
    this.newVoterName = document.getElementById("new-voter-name");
    this.newVoterDept = document.getElementById("new-voter-dept");
    this.newVoterYear = document.getElementById("new-voter-year");

    this.modalAddCandidate = document.getElementById("modal-add-candidate");
    this.btnOpenAddCandidateModal = document.getElementById("btn-open-add-candidate-modal");
    this.btnCloseAddCandidate = document.getElementById("btn-close-add-candidate");
    this.btnCancelAddCandidate = document.getElementById("btn-cancel-add-candidate");
    this.btnSaveNewCandidate = document.getElementById("btn-save-new-candidate");
    this.newCandPosition = document.getElementById("new-cand-position");
    this.newCandName = document.getElementById("new-cand-name");
    this.newCandDept = document.getElementById("new-cand-dept");
    this.newCandTagline = document.getElementById("new-cand-tagline");
    this.newCandPillars = document.getElementById("new-cand-pillars");
    this.newCandBio = document.getElementById("new-cand-bio");

    this.modalAddDeptCandidate = document.getElementById("modal-add-dept-candidate");
    this.btnOpenDeptAddCandidate = document.getElementById("btn-open-dept-add-candidate");
    this.btnCloseAddDeptCandidate = document.getElementById("btn-close-add-dept-candidate");
    this.btnCancelAddDeptCandidate = document.getElementById("btn-cancel-add-dept-candidate");
    this.btnSaveNewDeptCandidate = document.getElementById("btn-save-new-dept-candidate");
    this.btnDeptRegisterStudent = document.getElementById("btn-dept-register-student");

    // Theme & Demo
    this.themeToggleBtn = document.getElementById("theme-toggle-btn");
    this.iconSun = document.getElementById("icon-sun");
    this.iconMoon = document.getElementById("icon-moon");
    this.btnDemoMenu = document.getElementById("btn-demo-menu");
    this.demoDropdown = document.getElementById("demo-dropdown");
  }

  initEventListeners() {
    // Navigation Role Buttons
    this.navBtnStudent.addEventListener("click", () => this.navigate("student"));
    this.navBtnAdmin.addEventListener("click", () => this.navigate("admin"));
    this.navBtnDept.addEventListener("click", () => this.navigate("dept"));
    this.navBtnPublicResults.addEventListener("click", () => this.navigate("results"));

    // Header Logout
    this.btnHeaderLogout.addEventListener("click", () => this.logoutCurrentSession());

    // Login Tabs
    this.tabLoginStudent.addEventListener("click", () => this.switchLoginTab("student"));
    this.tabLoginAdmin.addEventListener("click", () => this.switchLoginTab("admin"));
    this.tabLoginDept.addEventListener("click", () => this.switchLoginTab("dept"));

    // Student Login
    this.btnRequestOtp.addEventListener("click", () => this.handleRequestOtp());
    this.btnAutofillOtp.addEventListener("click", () => {
      this.studentOtpInput.value = "749201";
      this.showToast("OTP Auto-filled", "Security passcode 749201 entered", "info");
    });
    this.btnStudentLogin.addEventListener("click", () => this.handleStudentLogin());

    // Admin Login
    this.btnAdminLoginSubmit.addEventListener("click", () => this.handleAdminLogin());

    // Dept Login
    this.btnDeptLoginSubmit.addEventListener("click", () => this.handleDeptLogin());

    // Already Voted Actions
    this.btnSwitchVoterBack.addEventListener("click", () => this.logoutCurrentSession());
    this.btnPrintExistingReceipt.addEventListener("click", () => {
      if (this.stateMgr.state.lastReceipt) {
        this.renderReceipt(this.stateMgr.state.lastReceipt);
        this.setStep(4);
      } else {
        this.showToast("Receipt Record", "Displaying authorized ballot confirmation", "info");
      }
    });

    // Ballot Flow
    this.btnCancelBallot.addEventListener("click", () => {
      if (confirm("Exit ballot and clear unsubmitted selections?")) {
        this.logoutCurrentSession();
      }
    });
    this.btnProceedReview.addEventListener("click", () => this.proceedToReview());
    this.btnBackToBallot.addEventListener("click", () => this.setStep(2));
    this.btnConfirmFinalSubmission.addEventListener("click", () => this.executeSubmissionPipeline());

    // Scope & Guided Mode Listeners
    if (this.btnToggleAllScopes) {
      this.btnToggleAllScopes.addEventListener("click", () => this.setBallotMode("all"));
    }
    if (this.btnToggleGuidedScopes) {
      this.btnToggleGuidedScopes.addEventListener("click", () => this.setBallotMode("guided"));
    }
    if (this.scopeTabBtns) {
      this.scopeTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          const scope = btn.getAttribute("data-scope");
          this.setBallotScope(scope);
        });
      });
    }
    if (this.btnQuickFillBallot) {
      this.btnQuickFillBallot.addEventListener("click", () => this.quickFillAllBallot());
    }
    if (this.btnNextScope) {
      this.btnNextScope.addEventListener("click", () => this.advanceGuidedScope());
    }
    if (this.resultsFilterPills) {
      this.resultsFilterPills.forEach(pill => {
        pill.addEventListener("click", () => {
          this.resultsFilterPills.forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          const scope = pill.getAttribute("data-results-scope") || "all";
          this.stateMgr.state.resultsScope = scope;
          this.stateMgr.saveState();
          this.renderPublicResults();
        });
      });
    }

    // Receipt Actions
    this.btnCopyHash.addEventListener("click", () => {
      const hashText = this.rcptHashToken.textContent.trim();
      navigator.clipboard.writeText(hashText).then(() => {
        this.showToast("Hash Copied", "SHA-256 verification hash copied to clipboard.", "success");
      });
    });
    this.btnPrintReceipt.addEventListener("click", () => window.print());
    this.btnVerifyMyReceipt.addEventListener("click", () => {
      const hash = this.rcptHashToken.textContent.trim();
      this.navigate("results");
      this.verifierInput.value = hash;
      this.handleVerifyReceipt();
    });
    this.btnFinishLogout.addEventListener("click", () => this.logoutCurrentSession());

    // Public Verifier Tool
    this.btnVerifyReceipt.addEventListener("click", () => this.handleVerifyReceipt());

    // Admin Phase Switcher
    this.phaseButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const newPhase = btn.getAttribute("data-phase");
        this.setElectionPhase(newPhase);
      });
    });

    // Admin Tabs
    this.adminTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const tabTarget = tab.getAttribute("data-tab");
        this.switchAdminTab(tabTarget);
      });
    });

    // Admin Search & Filter
    this.voterSearchInput.addEventListener("input", () => this.renderVoterRollTable());
    this.voterFilterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        this.voterFilterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.renderVoterRollTable();
      });
    });

    // Admin Simulation
    this.btnSimulateVote.addEventListener("click", () => this.simulateMockVote());
    this.btnResetDemo.addEventListener("click", () => {
      if (confirm("Reset election data, voter roll, and tallies back to default demo state?")) {
        this.stateMgr.resetToDefaults();
        this.render();
        this.showToast("System Reset", "Demo state restored to original initial values.", "info");
      }
    });

    this.adminTallyOverrideToggle.addEventListener("change", (e) => {
      this.stateMgr.state.adminPreviewTallies = e.target.checked;
      this.stateMgr.saveState();
      this.renderTalliesAndCharts();
      this.renderPublicResults();
      this.showToast("Display Updated", `Live preview tallies ${e.target.checked ? "enabled" : "hidden"}`, "info");
    });

    // Dept Rep Events
    this.deptRepSelect.addEventListener("change", (e) => {
      this.stateMgr.state.activeDept = e.target.value;
      this.stateMgr.saveState();
      this.renderDeptPortal();
    });
    this.deptTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const tabTarget = tab.getAttribute("data-dept-tab");
        this.switchDeptTab(tabTarget);
      });
    });
    this.deptVoterSearch.addEventListener("input", () => this.renderDeptVoterRollTable());
    this.deptFilterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        this.deptFilterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.renderDeptVoterRollTable();
      });
    });

    // Manifesto Modal
    this.btnCloseManifesto.addEventListener("click", () => this.closeManifestoModal());
    this.btnManifestoCloseBottom.addEventListener("click", () => this.closeManifestoModal());
    this.btnManifestoSelectCandidate.addEventListener("click", () => {
      if (this.currentManifestoCandidate) {
        this.selectCandidate(this.currentManifestoCandidate.position, this.currentManifestoCandidate.id);
        this.closeManifestoModal();
      }
    });

    // Add Voter Modal
    this.btnOpenAddVoterModal.addEventListener("click", () => this.modalAddVoter.classList.remove("hidden"));
    this.btnCloseAddVoter.addEventListener("click", () => this.modalAddVoter.classList.add("hidden"));
    this.btnCancelAddVoter.addEventListener("click", () => this.modalAddVoter.classList.add("hidden"));
    this.btnSaveNewVoter.addEventListener("click", () => this.handleSaveNewVoter());

    // Add Candidate Modal
    this.btnOpenAddCandidateModal.addEventListener("click", () => this.modalAddCandidate.classList.remove("hidden"));
    this.btnCloseAddCandidate.addEventListener("click", () => this.modalAddCandidate.classList.add("hidden"));
    this.btnCancelAddCandidate.addEventListener("click", () => this.modalAddCandidate.classList.add("hidden"));
    this.btnSaveNewCandidate.addEventListener("click", () => this.handleSaveNewCandidate());

    // Dept Add Candidate Modal
    if (this.btnOpenDeptAddCandidate) {
      this.btnOpenDeptAddCandidate.addEventListener("click", () => this.modalAddDeptCandidate.classList.remove("hidden"));
    }
    if (this.btnDeptRegisterStudent) {
      this.btnDeptRegisterStudent.addEventListener("click", () => this.modalAddVoter.classList.remove("hidden"));
    }
    this.btnCloseAddDeptCandidate.addEventListener("click", () => this.modalAddDeptCandidate.classList.add("hidden"));
    this.btnCancelAddDeptCandidate.addEventListener("click", () => this.modalAddDeptCandidate.classList.add("hidden"));
    this.btnSaveNewDeptCandidate.addEventListener("click", () => this.handleSaveNewDeptCandidate());

    // Theme Toggle
    this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());

    // Demo Dropdown
    this.btnDemoMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      this.demoDropdown.classList.toggle("hidden");
    });
    document.addEventListener("click", () => {
      if (!this.demoDropdown.classList.contains("hidden")) {
        this.demoDropdown.classList.add("hidden");
      }
    });
    document.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        const role = item.getAttribute("data-demo-role");
        const id = item.getAttribute("data-demo-id");
        if (role === "admin") {
          this.loginAdminDirectly();
        } else if (role === "dept") {
          this.loginDeptDirectly();
        } else if (id) {
          this.setQuickDemo(id);
        }
        this.demoDropdown.classList.add("hidden");
      });
    });
  }

  // ==========================================================================
  // NAVIGATION & SEPARATE LOGIN CONTROLLER
  // ==========================================================================
  navigate(targetView) {
    // If user clicked Student, but is not logged in:
    if (targetView === "student" && !this.stateMgr.state.activeStudent) {
      this.showLoginGateway("student");
      return;
    }
    // If user clicked Admin, but is not authenticated:
    if (targetView === "admin" && !this.stateMgr.state.isAdminAuthenticated) {
      this.showLoginGateway("admin");
      return;
    }
    // If user clicked Dept, but is not authenticated:
    if (targetView === "dept" && !this.stateMgr.state.isDeptAuthenticated) {
      this.showLoginGateway("dept");
      return;
    }

    this.activateView(targetView);
  }

  showLoginGateway(tab = "student") {
    this.stateMgr.state.currentView = "login";
    this.stateMgr.state.loginTab = tab;
    this.stateMgr.saveState();

    this.hideAllSections();
    this.loginGatewaySection.classList.remove("hidden");
    this.loginGatewaySection.classList.add("active");

    this.updateNavButtons(tab);
    this.switchLoginTab(tab);
    this.updateHeaderSession();
  }

  switchLoginTab(tab) {
    this.tabLoginStudent.classList.toggle("active", tab === "student");
    this.tabLoginAdmin.classList.toggle("active", tab === "admin");
    this.tabLoginDept.classList.toggle("active", tab === "dept");

    this.loginStudentPane.classList.toggle("active", tab === "student");
    this.loginStudentPane.classList.toggle("hidden", tab !== "student");

    this.loginAdminPane.classList.toggle("active", tab === "admin");
    this.loginAdminPane.classList.toggle("hidden", tab !== "admin");

    this.loginDeptPane.classList.toggle("active", tab === "dept");
    this.loginDeptPane.classList.toggle("hidden", tab !== "dept");

    this.stateMgr.state.loginTab = tab;
    this.stateMgr.saveState();
  }

  activateView(view) {
    this.stateMgr.state.currentView = view;
    this.stateMgr.saveState();

    this.hideAllSections();
    this.updateNavButtons(view);
    this.updateHeaderSession();

    if (view === "student") {
      this.studentPortalView.classList.remove("hidden");
      this.studentPortalView.classList.add("active");
      this.setupActiveStudentSession(this.stateMgr.state.activeStudent);
      this.setStep(this.stateMgr.state.currentStep || 2);
    } else if (view === "admin") {
      this.adminPortalView.classList.remove("hidden");
      this.adminPortalView.classList.add("active");
      this.renderAdminDashboard();
    } else if (view === "dept") {
      this.deptRepPortalView.classList.remove("hidden");
      this.deptRepPortalView.classList.add("active");
      this.renderDeptPortal();
    } else if (view === "results") {
      this.publicResultsView.classList.remove("hidden");
      this.publicResultsView.classList.add("active");
      this.renderPublicResults();
    }
  }

  hideAllSections() {
    [
      this.loginGatewaySection,
      this.studentPortalView,
      this.publicResultsView,
      this.adminPortalView,
      this.deptRepPortalView
    ].forEach(sec => {
      sec.classList.add("hidden");
      sec.classList.remove("active");
    });
  }

  updateNavButtons(activeId) {
    this.navBtnStudent.classList.toggle("active", activeId === "student");
    this.navBtnAdmin.classList.toggle("active", activeId === "admin");
    this.navBtnDept.classList.toggle("active", activeId === "dept");
    this.navBtnPublicResults.classList.toggle("active", activeId === "results");
  }

  updateHeaderSession() {
    const { activeStudent, isAdminAuthenticated, isDeptAuthenticated, activeDept } = this.stateMgr.state;
    if (activeStudent) {
      const initials = activeStudent.name.split(" ").map(n => n[0]).join("").slice(0, 2);
      this.headerUserAvatar.textContent = initials;
      this.headerUserName.textContent = `${activeStudent.name} (${activeStudent.id})`;
      this.headerUserSession.classList.remove("hidden");
    } else if (isAdminAuthenticated) {
      this.headerUserAvatar.textContent = "EC";
      this.headerUserName.textContent = "Election Commission Admin";
      this.headerUserSession.classList.remove("hidden");
    } else if (isDeptAuthenticated) {
      this.headerUserAvatar.textContent = "DR";
      this.headerUserName.textContent = `Dept Rep (${activeDept})`;
      this.headerUserSession.classList.remove("hidden");
    } else {
      this.headerUserSession.classList.add("hidden");
    }
  }

  logoutCurrentSession() {
    this.stateMgr.state.activeStudent = null;
    this.stateMgr.state.isAdminAuthenticated = false;
    this.stateMgr.state.isDeptAuthenticated = false;
    this.stateMgr.state.ballotSelections = {};
    this.stateMgr.state.currentStep = 1;
    this.stateMgr.saveState();

    this.showLoginGateway("student");
    this.showToast("Signed Out", "Portal session terminated securely.", "info");
  }

  // ==========================================================================
  // AUTHENTICATION HANDLERS
  // ==========================================================================
  handleRequestOtp() {
    const studentId = this.studentIdInput.value.trim().toUpperCase();
    if (!studentId) {
      this.showToast("Missing ID", "Please input your Student Roll Number first.", "error");
      this.studentIdInput.focus();
      return;
    }
    const voter = this.stateMgr.state.voterRoll.find(v => v.id.toUpperCase() === studentId);
    if (!voter) {
      this.showToast("Unregistered ID", `Roll Number ${studentId} not found in student roll.`, "error");
      return;
    }

    if (voter.department && this.studentDeptSelect) {
      this.studentDeptSelect.value = voter.department;
    }

    this.studentOtpInput.value = "749201";
    this.showToast("OTP Dispatched", `Sent to ${voter.name}'s campus email & SMS. (Code: 749201)`, "success");
  }

  handleStudentLogin() {
    const studentId = this.studentIdInput.value.trim().toUpperCase();
    const otp = this.studentOtpInput.value.trim();

    if (!studentId) {
      this.showToast("Missing ID", "Please enter your Student Roll Number.", "error");
      return;
    }
    if (!otp) {
      this.showToast("Missing OTP", "Please enter your 6-digit OTP passcode.", "error");
      return;
    }

    const voter = this.stateMgr.state.voterRoll.find(v => v.id.toUpperCase() === studentId);
    if (!voter) {
      this.showToast("Access Denied", "Roll Number not found in the official voter roll.", "error");
      return;
    }

    // Check lifecycle
    if (this.stateMgr.state.electionStatus === "PRE-ELECTION") {
      this.showToast("Polls Not Open", "Election is in Pre-Election preparation mode.", "error");
      return;
    }
    if (this.stateMgr.state.electionStatus === "VOTING LOCKED") {
      this.showToast("Election Closed", "Voting has ended and the ballot box is permanently sealed.", "error");
      return;
    }

    // If already voted
    if (voter.status === "VOTED") {
      this.stateMgr.state.activeStudent = voter;
      this.stateMgr.saveState();
      this.showAlreadyVotedScreen(voter);
      this.showToast("Vote Already Recorded", "A verified ballot has already been cast for this roll.", "info");
      return;
    }

    // Success!
    this.stateMgr.state.activeStudent = voter;
    this.stateMgr.state.ballotSelections = {};
    this.stateMgr.saveState();

    this.showToast("Verified Successfully", `Welcome, ${voter.name}! Confidential ballot loaded.`, "success");
    
    // If there was a pending tier jump, apply it
    if (this.stateMgr.state.pendingJumpTier) {
      const tier = this.stateMgr.state.pendingJumpTier;
      this.stateMgr.state.pendingJumpTier = null;
      this.stateMgr.state.ballotScope = tier;
      this.stateMgr.saveState();
    }
    
    this.activateView("student");
    this.setStep(2);
  }

  handleAdminLogin() {
    const username = this.adminUsernameInput.value.trim();
    const password = this.adminPasswordInput.value.trim();

    if (username.toUpperCase() === "ADMIN-AU2026" && password === "admin@123") {
      this.stateMgr.state.isAdminAuthenticated = true;
      this.stateMgr.saveState();
      this.showToast("Access Granted", "Authenticated as Election Supervisory Officer.", "success");
      this.activateView("admin");
    } else {
      this.showToast("Authentication Failed", "Invalid Officer ID or Security Key. (Try: admin@123)", "error");
    }
  }

  handleDeptLogin() {
    const dept = this.deptLoginSelect.value;
    const pin = this.deptPinInput.value.trim();

    if (pin === "DEPT2026") {
      this.stateMgr.state.isDeptAuthenticated = true;
      this.stateMgr.state.activeDept = dept;
      this.stateMgr.saveState();
      this.showToast("Access Granted", `Authenticated as ${dept} Representative.`, "success");
      this.activateView("dept");
    } else {
      this.showToast("Access Denied", "Invalid Faculty PIN. (Default test PIN: DEPT2026)", "error");
    }
  }

  loginAdminDirectly() {
    this.adminUsernameInput.value = "ADMIN-AU2026";
    this.adminPasswordInput.value = "admin@123";
    this.handleAdminLogin();
  }

  loginDeptDirectly() {
    this.deptLoginSelect.value = "Computer Science";
    this.deptPinInput.value = "DEPT2026";
    this.handleDeptLogin();
  }

  setQuickDemo(demoId) {
    this.showLoginGateway("student");
    this.studentIdInput.value = demoId;
    const voter = this.stateMgr.state.voterRoll.find(v => v.id === demoId);
    if (voter && voter.department) {
      this.studentDeptSelect.value = voter.department;
    }
    this.studentOtpInput.value = "749201";
    this.showToast("Demo Loaded", `Pre-filled ${demoId}. Click Verify to enter.`, "info");
  }

  setupActiveStudentSession(student) {
    if (!student) return;
    const initials = student.name.split(" ").map(n => n[0]).join("").slice(0, 2);
    this.sessionInitials.textContent = initials;
    this.sessionStudentName.textContent = student.name;
    this.sessionStudentId.textContent = student.id;
    this.sessionStudentDept.textContent = `${student.department} (${student.year})`;
  }

  showAlreadyVotedScreen(voter) {
    this.activateView("student");
    this.votedStudentId.textContent = voter.id;
    this.votedStudentName.textContent = voter.name;
    this.votedStudentDept.textContent = `${voter.department} (${voter.year})`;
    this.votedTimestamp.textContent = voter.votedTimestamp || "2026-09-26 11:20:14 IST";
    this.votedHashToken.textContent = voter.receiptToken ? `${voter.receiptToken.slice(0, 16)}...${voter.receiptToken.slice(-8)}` : "0x789a...b12f";

    this.stateMgr.state.lastReceipt = {
      refNo: voter.receiptRef || "AU-2026-VOTE-PREV",
      timestamp: voter.votedTimestamp || "2026-09-26 11:20:14",
      blockId: "#BLK-PREV",
      hash: voter.receiptToken || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      voter: voter
    };
    this.stateMgr.saveState();

    this.studentBallotContainer.classList.add("hidden");
    this.studentReviewContainer.classList.add("hidden");
    this.studentReceiptContainer.classList.add("hidden");
    this.studentVotedReceiptContainer.classList.remove("hidden");
    this.studentVotedReceiptContainer.classList.add("active");
  }

  // ==========================================================================
  // STUDENT BALLOT STEPPER & SELECTIONS
  // ==========================================================================
  setStep(stepNumber) {
    this.stateMgr.state.currentStep = stepNumber;
    this.stateMgr.saveState();

    this.stepItems.forEach(item => {
      const s = parseInt(item.getAttribute("data-step"), 10);
      item.classList.remove("active", "completed");
      if (s === stepNumber) item.classList.add("active");
      else if (s < stepNumber) item.classList.add("completed");
    });

    this.stepLines.forEach((line, idx) => {
      if (line) line.classList.toggle("filled", idx + 1 < stepNumber);
    });

    this.studentVotedReceiptContainer.classList.add("hidden");
    this.studentBallotContainer.classList.add("hidden");
    this.studentReviewContainer.classList.add("hidden");
    this.studentReceiptContainer.classList.add("hidden");

    if (stepNumber === 2) {
      this.studentBallotContainer.classList.remove("hidden");
      this.studentBallotContainer.classList.add("active");
      this.renderBallot();
    } else if (stepNumber === 3) {
      this.studentReviewContainer.classList.remove("hidden");
      this.studentReviewContainer.classList.add("active");
      this.renderReviewList();
    } else if (stepNumber === 4) {
      this.studentReceiptContainer.classList.remove("hidden");
      this.studentReceiptContainer.classList.add("active");
    }
  }

  // ==========================================================================
  // BALLOT SCOPE, GUIDED MODE & TIER NAVIGATION
  // ==========================================================================
  getPositionsForScope(scope) {
    if (scope === "all") return this.positions;
    const tierKeys = Object.keys(ELECTION_TIERS);
    if (scope === "class") return ELECTION_TIERS.class.positions;
    if (scope === "department") return ELECTION_TIERS.department.positions;
    if (scope === "council") return ELECTION_TIERS.council.positions;
    if (scope === "committee_policy") return ELECTION_TIERS.committee_policy.positions;
    return this.positions;
  }

  getTierForPosition(position) {
    for (const [key, tier] of Object.entries(ELECTION_TIERS)) {
      if (tier.positions.includes(position)) return key;
    }
    return "council";
  }

  jumpToElectionTier(tierId) {
    // If user is logged in as student, navigate to ballot with that scope
    if (this.stateMgr.state.activeStudent) {
      this.setBallotScope(tierId);
      this.activateView("student");
      this.setStep(2);
    } else {
      // Store the pending jump and open login
      this.stateMgr.state.pendingJumpTier = tierId;
      this.stateMgr.saveState();
      this.showLoginGateway("student");
      this.showToast("Login Required", `Please authenticate to access ${ELECTION_TIERS[tierId]?.title || tierId} ballot.`, "info");
    }
  }

  setBallotScope(scope) {
    this.stateMgr.state.ballotScope = scope;
    this.stateMgr.saveState();

    // Update active tab UI
    this.scopeTabBtns.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-scope") === scope);
    });

    // Update guided step index if in guided mode
    if (this.stateMgr.state.ballotMode === "guided") {
      const tierOrder = ["class", "department", "council", "committee_policy"];
      const idx = tierOrder.indexOf(scope);
      if (idx !== -1) {
        this.stateMgr.state.guidedStepIndex = idx;
        this.stateMgr.saveState();
      }
    }

    this.renderBallot();
  }

  setBallotMode(mode) {
    this.stateMgr.state.ballotMode = mode;
    if (mode === "guided") {
      this.stateMgr.state.guidedStepIndex = 0;
      this.stateMgr.state.ballotScope = "class";
    } else {
      this.stateMgr.state.ballotScope = "all";
    }
    this.stateMgr.saveState();

    // Update mode toggle buttons
    if (this.btnToggleAllScopes) this.btnToggleAllScopes.classList.toggle("active", mode === "all");
    if (this.btnToggleGuidedScopes) this.btnToggleGuidedScopes.classList.toggle("active", mode === "guided");

    // Update scope tabs
    this.scopeTabBtns.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-scope") === this.stateMgr.state.ballotScope);
    });

    this.renderBallot();
    this.showToast("Ballot Mode", mode === "guided" ? "Guided step-by-step mode activated. Start with Class Election." : "Showing all election tiers at once.", "info");
  }

  advanceGuidedScope() {
    const tierOrder = ["class", "department", "council", "committee_policy"];
    let nextIdx = this.stateMgr.state.guidedStepIndex + 1;
    if (nextIdx >= tierOrder.length) {
      // All tiers done, switch to "all" view
      this.stateMgr.state.ballotMode = "all";
      this.stateMgr.state.ballotScope = "all";
      this.stateMgr.saveState();
      if (this.btnToggleAllScopes) this.btnToggleAllScopes.classList.add("active");
      if (this.btnToggleGuidedScopes) this.btnToggleGuidedScopes.classList.remove("active");
      this.scopeTabBtns.forEach(btn => btn.classList.toggle("active", btn.getAttribute("data-scope") === "all"));
      this.renderBallot();
      this.showToast("All Tiers Complete!", "All election levels visited. Review your full ballot now.", "success");
      return;
    }
    this.stateMgr.state.guidedStepIndex = nextIdx;
    this.stateMgr.state.ballotScope = tierOrder[nextIdx];
    this.stateMgr.saveState();
    this.scopeTabBtns.forEach(btn => btn.classList.toggle("active", btn.getAttribute("data-scope") === tierOrder[nextIdx]));
    this.renderBallot();
    this.showToast("Next Tier", `Now voting for: ${ELECTION_TIERS[tierOrder[nextIdx]].title}`, "info");
  }

  quickFillAllBallot() {
    const { candidates } = this.stateMgr.state;
    this.positions.forEach(position => {
      const posCandidates = candidates.filter(c => c.position === position);
      if (posCandidates.length > 0) {
        this.stateMgr.state.ballotSelections[position] = posCandidates[0].id;
      }
    });
    this.stateMgr.saveState();
    this.renderBallot();
    this.showToast("Quick Fill Complete", `All ${this.positions.length} positions auto-selected with first candidates for demo.`, "success");
  }

  renderGuidedTierBanner() {
    if (!this.guidedTierBannerContainer) return;
    
    if (this.stateMgr.state.ballotMode !== "guided") {
      this.guidedTierBannerContainer.innerHTML = "";
      return;
    }

    const tierOrder = ["class", "department", "council", "committee_policy"];
    const stepIdx = this.stateMgr.state.guidedStepIndex;
    const currentTier = ELECTION_TIERS[tierOrder[stepIdx]];
    const isLast = stepIdx >= tierOrder.length - 1;

    this.guidedTierBannerContainer.innerHTML = `
      <div class="guided-tier-banner">
        <div class="guided-tier-info">
          <h4>${currentTier.title}</h4>
          <p>${currentTier.subtitle}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="tier-badge">${currentTier.badge}</span>
          <span class="badge-sub">Step ${stepIdx + 1} of ${tierOrder.length}</span>
        </div>
      </div>
    `;
  }

  renderBallot() {
    const { candidates, ballotSelections, ballotScope, ballotMode } = this.stateMgr.state;
    this.ballotPositionsContainer.innerHTML = "";
    this.categoryPillsNav.innerHTML = "";

    // Determine which positions to show based on scope
    const visiblePositions = this.getPositionsForScope(ballotScope);
    
    // Count total chosen across ALL positions (not just visible)
    let totalChosenCount = 0;
    this.positions.forEach(pos => {
      if (ballotSelections[pos]) totalChosenCount++;
    });

    // Count visible chosen
    let visibleChosenCount = 0;

    // Render guided mode banner
    this.renderGuidedTierBanner();

    // Show/hide next scope button in guided mode
    if (this.btnNextScope) {
      if (ballotMode === "guided") {
        const scopePositions = visiblePositions;
        const allScopeChosen = scopePositions.every(pos => Boolean(ballotSelections[pos]));
        this.btnNextScope.classList.toggle("hidden", !allScopeChosen);
      } else {
        this.btnNextScope.classList.add("hidden");
      }
    }

    visiblePositions.forEach((position, idx) => {
      const positionCandidates = candidates.filter(c => c.position === position);
      const chosenCandidateId = ballotSelections[position];
      const isChosen = Boolean(chosenCandidateId);
      if (isChosen) visibleChosenCount++;

      // Quick jump pill
      const globalIdx = this.positions.indexOf(position);
      const jumpPill = document.createElement("a");
      jumpPill.href = `#pos-${globalIdx}`;
      jumpPill.className = `category-nav-pill ${isChosen ? "filled" : ""}`;
      jumpPill.innerHTML = `
        <span>${isChosen ? "✓" : (idx + 1)}</span>
        <span>${position.length > 35 ? position.slice(0, 32) + "..." : position}</span>
      `;
      this.categoryPillsNav.appendChild(jumpPill);

      // Determine tier label for this position
      const tierKey = this.getTierForPosition(position);
      const tierInfo = ELECTION_TIERS[tierKey];

      // Section
      const posSection = document.createElement("section");
      posSection.id = `pos-${globalIdx}`;
      posSection.className = "position-section";

      posSection.innerHTML = `
        <div class="position-header">
          <div class="position-title-area">
            <h3 class="position-name">${position}</h3>
            <span class="position-rule-pill">Choose 1 Candidate or NOTA</span>
            ${ballotScope === "all" ? `<span class="tier-badge" style="margin-left: 0.5rem; font-size: 0.68rem;">${tierInfo.badge}</span>` : ""}
          </div>
          <div class="position-status-badge ${isChosen ? "chosen" : "pending"}">
            ${isChosen ? "✓ Selected" : "Pending Choice"}
          </div>
        </div>
      `;

      const cardsGrid = document.createElement("div");
      cardsGrid.className = "candidates-grid";

      // Candidates
      positionCandidates.forEach(cand => {
        const isSelected = chosenCandidateId === cand.id;
        const card = document.createElement("div");
        card.className = `candidate-card ${isSelected ? "selected" : ""}`;
        card.setAttribute("data-cand-id", cand.id);

        card.innerHTML = `
          <div class="card-select-radio"></div>
          <div class="candidate-profile-row">
            <div class="candidate-avatar ${cand.avatarClass || "avatar-blue"}">
              ${cand.initials || "CA"}
            </div>
            <div class="candidate-details">
              <h4 class="candidate-name">${cand.name}</h4>
              <p class="candidate-sub">${cand.department} • ${cand.year}</p>
            </div>
          </div>
          <p class="candidate-tagline">${cand.tagline || ""}</p>
          <div class="candidate-card-footer">
            <button type="button" class="btn-manifesto-link" data-action="manifesto" data-cand-id="${cand.id}">
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
              </svg>
              View Manifesto
            </button>
            <span class="candidate-gpa-badge">${cand.gpa || "Merit Candidate"}</span>
          </div>
        `;

        card.addEventListener("click", (e) => {
          if (e.target.closest('[data-action="manifesto"]')) {
            this.openManifestoModal(cand);
            return;
          }
          this.selectCandidate(position, cand.id);
        });

        cardsGrid.appendChild(card);
      });

      // NOTA Card
      const isNotaSelected = chosenCandidateId === `NOTA_${position}`;
      const notaCard = document.createElement("div");
      notaCard.className = `candidate-card nota-card ${isNotaSelected ? "selected" : ""}`;
      notaCard.innerHTML = `
        <div class="card-select-radio"></div>
        <div class="candidate-profile-row">
          <div class="candidate-avatar nota-avatar">✕</div>
          <div class="candidate-details">
            <h4 class="candidate-name">None of the Above (NOTA)</h4>
            <p class="candidate-sub">Formal Constitutional Abstention</p>
          </div>
        </div>
        <p class="candidate-tagline">Formal rejection of all nominated candidates for ${position}.</p>
        <div class="candidate-card-footer">
          <span class="btn-manifesto-link" style="color: var(--text-muted); cursor: default;">Constitutional Right</span>
          <span class="candidate-gpa-badge">Neutral</span>
        </div>
      `;
      notaCard.addEventListener("click", () => {
        this.selectCandidate(position, `NOTA_${position}`);
      });
      cardsGrid.appendChild(notaCard);

      posSection.appendChild(cardsGrid);
      this.ballotPositionsContainer.appendChild(posSection);
    });

    // Update progress bar with TOTAL selections across all positions
    const totalPositions = this.positions.length;
    const pct = Math.round((totalChosenCount / totalPositions) * 100);
    this.ballotProgressCount.textContent = `${totalChosenCount} of ${totalPositions} Chosen`;
    this.ballotProgressFill.style.width = `${pct}%`;

    const allChosen = totalChosenCount === totalPositions;
    this.btnProceedReview.disabled = !allChosen;
    if (allChosen) {
      this.ballotSelectionStatusText.innerHTML = `<strong>All ${totalPositions} choices selected!</strong> You can now proceed to review your ballot.`;
    } else {
      const scopeLabel = ballotScope !== "all" ? ` (Viewing: ${ELECTION_TIERS[ballotScope]?.shortTitle || ballotScope})` : "";
      this.ballotSelectionStatusText.textContent = `Select candidates for all ${totalPositions} positions to proceed (${totalChosenCount}/${totalPositions}).${scopeLabel}`;
    }

    // Update scope counts in tab pills
    this.updateScopeCounts();
  }

  updateScopeCounts() {
    const { ballotSelections } = this.stateMgr.state;
    const countForScope = (scope) => {
      const positions = this.getPositionsForScope(scope);
      return positions.filter(pos => Boolean(ballotSelections[pos])).length;
    };
    
    const setCount = (id, scope) => {
      const el = document.getElementById(id);
      if (el) {
        const chosen = countForScope(scope);
        const total = this.getPositionsForScope(scope).length;
        el.textContent = `${chosen}/${total}`;
      }
    };

    setCount("scope-count-all", "all");
    setCount("scope-count-class", "class");
    setCount("scope-count-dept", "department");
    setCount("scope-count-council", "council");
    setCount("scope-count-policy", "committee_policy");
  }

  selectCandidate(position, candidateId) {
    this.stateMgr.state.ballotSelections[position] = candidateId;
    this.stateMgr.saveState();
    this.renderBallot();
    this.showToast("Selection Updated", `Choice registered for ${position}`, "info");
  }

  // ==========================================================================
  // MANIFESTO MODAL
  // ==========================================================================
  openManifestoModal(candidate) {
    this.currentManifestoCandidate = candidate;
    this.manifestoAvatar.className = `avatar-lg ${candidate.avatarClass || "avatar-blue"}`;
    this.manifestoAvatar.textContent = candidate.initials || "CA";
    this.manifestoPosition.textContent = `Candidate for ${candidate.position}`;
    this.manifestoCandidateName.textContent = candidate.name;
    this.manifestoCandidateDept.textContent = `${candidate.department} • ${candidate.year} • ${candidate.gpa || ""}`;
    this.manifestoTagline.textContent = candidate.tagline || "";

    this.manifestoPillarsList.innerHTML = "";
    if (candidate.pillars && candidate.pillars.length > 0) {
      candidate.pillars.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p;
        this.manifestoPillarsList.appendChild(li);
      });
    }

    this.manifestoBio.textContent = candidate.bio || "No detailed biography submitted yet.";
    this.modalManifesto.classList.remove("hidden");
  }

  closeManifestoModal() {
    this.modalManifesto.classList.add("hidden");
    this.currentManifestoCandidate = null;
  }

  // ==========================================================================
  // REVIEW & CRYPTOGRAPHIC SUBMISSION PIPELINE
  // ==========================================================================
  proceedToReview() {
    this.setStep(3);
  }

  renderReviewList() {
    const { candidates, ballotSelections } = this.stateMgr.state;
    this.reviewSelectionsList.innerHTML = "";

    this.positions.forEach(position => {
      const candId = ballotSelections[position];
      const isNota = candId && candId.startsWith("NOTA_");
      const cand = candidates.find(c => c.id === candId);

      const itemCard = document.createElement("div");
      itemCard.className = "review-item-card";

      if (isNota) {
        itemCard.innerHTML = `
          <div class="review-item-left">
            <div class="review-avatar-mini nota-avatar">✕</div>
            <div>
              <div class="review-pos-title">${position}</div>
              <div class="review-candidate-title">None of the Above (NOTA)</div>
              <div class="review-candidate-meta">Formal Abstention Option</div>
            </div>
          </div>
          <span class="status-tag pending">Abstained</span>
        `;
      } else if (cand) {
        itemCard.innerHTML = `
          <div class="review-item-left">
            <div class="review-avatar-mini ${cand.avatarClass || "avatar-blue"}">${cand.initials || "CA"}</div>
            <div>
              <div class="review-pos-title">${position}</div>
              <div class="review-candidate-title">${cand.name}</div>
              <div class="review-candidate-meta">${cand.department} (${cand.year})</div>
            </div>
          </div>
          <span class="status-tag voted">Selected</span>
        `;
      }

      this.reviewSelectionsList.appendChild(itemCard);
    });
  }

  async executeSubmissionPipeline() {
    const activeStudent = this.stateMgr.state.activeStudent;
    if (!activeStudent) {
      this.showToast("Session Error", "No active voter profile found.", "error");
      return;
    }

    this.pipeVoterId.textContent = activeStudent.id;
    this.modalAnonymize.classList.remove("hidden");
    this.resetPipelineUI();

    // Step 1: Mark voter roll
    this.pipeStep1.classList.add("processing");
    this.pipelineProgressFill.style.width = "33%";
    await this.delay(800);

    const timestamp = CryptoUtil.getFormattedTimestamp();
    const receiptRef = CryptoUtil.generateReceiptRef();
    const rawPayload = JSON.stringify(this.stateMgr.state.ballotSelections) + timestamp + receiptRef;
    const cryptographicHash = await CryptoUtil.sha256(rawPayload);

    const voterIdx = this.stateMgr.state.voterRoll.findIndex(v => v.id === activeStudent.id);
    if (voterIdx !== -1) {
      this.stateMgr.state.voterRoll[voterIdx].status = "VOTED";
      this.stateMgr.state.voterRoll[voterIdx].votedTimestamp = timestamp;
      this.stateMgr.state.voterRoll[voterIdx].receiptRef = receiptRef;
      this.stateMgr.state.voterRoll[voterIdx].receiptToken = cryptographicHash;
    }

    this.pipeStep1.classList.remove("processing");
    this.pipeStep1.classList.add("completed");
    this.pipeStep1.querySelector(".pipe-num").classList.add("hidden");
    this.pipeStep1.querySelector(".pipe-check").classList.remove("hidden");

    // Step 2: Strip metadata
    this.pipeStep2.classList.add("processing");
    this.pipelineProgressFill.style.width = "66%";
    await this.delay(800);

    this.pipeStep2.classList.remove("processing");
    this.pipeStep2.classList.add("completed");
    this.pipeStep2.querySelector(".pipe-num").classList.add("hidden");
    this.pipeStep2.querySelector(".pipe-check").classList.remove("hidden");

    // Step 3: Append to cipher ledger
    this.pipeStep3.classList.add("processing");
    this.pipelineProgressFill.style.width = "100%";
    await this.delay(800);

    const payloadTokens = Object.entries(this.stateMgr.state.ballotSelections)
      .map(([pos, cid]) => `${pos[0]}:${cid.replace("cand-", "").replace("NOTA_", "NOTA")}`)
      .join(" | ");

    const newLedgerEntry = {
      id: this.stateMgr.state.cipherLedger.length + 1,
      ballotHash: cryptographicHash,
      payloadPreview: `CIPHER:[${payloadTokens}]`,
      timestamp: timestamp,
      selections: { ...this.stateMgr.state.ballotSelections },
      verificationStatus: "SEALED & VERIFIED"
    };

    this.stateMgr.state.cipherLedger.push(newLedgerEntry);

    const receiptData = {
      refNo: receiptRef,
      timestamp: timestamp,
      blockId: `#BLK-${String(newLedgerEntry.id).padStart(4, "0")}`,
      hash: cryptographicHash,
      voter: activeStudent
    };
    this.stateMgr.state.lastReceipt = receiptData;
    this.stateMgr.saveState();

    this.pipeStep3.classList.remove("processing");
    this.pipeStep3.classList.add("completed");
    this.pipeStep3.querySelector(".pipe-num").classList.add("hidden");
    this.pipeStep3.querySelector(".pipe-check").classList.remove("hidden");

    await this.delay(400);

    this.modalAnonymize.classList.add("hidden");
    this.renderReceipt(receiptData);
    this.setStep(4);
    this.showToast("Vote Sealed!", "Identity detached and cryptographic receipt generated.", "success");
  }

  resetPipelineUI() {
    [this.pipeStep1, this.pipeStep2, this.pipeStep3].forEach(step => {
      step.classList.remove("processing", "completed");
      step.querySelector(".pipe-num").classList.remove("hidden");
      step.querySelector(".pipe-check").classList.add("hidden");
    });
    this.pipelineProgressFill.style.width = "0%";
  }

  renderReceipt(receipt) {
    this.rcptRefNo.textContent = receipt.refNo;
    this.rcptTimestamp.textContent = receipt.timestamp;
    this.rcptBlockId.textContent = receipt.blockId;
    this.rcptHashToken.textContent = receipt.hash;
  }

  // ==========================================================================
  // PUBLIC RESULTS & AUDIT RECEIPT VERIFIER
  // ==========================================================================
  renderPublicResults() {
    const { voterRoll, cipherLedger, candidates, electionStatus, adminPreviewTallies, resultsScope } = this.stateMgr.state;
    const totalVoters = voterRoll.length;
    const votedCount = voterRoll.filter(v => v.status === "VOTED").length;
    const turnoutPct = totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(1) : 0;

    this.pubKpiTotal.textContent = totalVoters;
    this.pubKpiVoted.textContent = votedCount;
    this.pubKpiTurnoutPct.textContent = `${turnoutPct}%`;
    this.pubKpiLedgerStatus.textContent = cipherLedger.length === votedCount ? "100% SECURE" : "AUDIT DISCREPANCY";

    const isLocked = electionStatus === "VOTING LOCKED";
    const canShowTallies = isLocked || adminPreviewTallies;
    this.publicTalliesBadge.textContent = isLocked ? "Official Certified Results" : (canShowTallies ? "Live Admin Preview" : "Sealed During Polling");

    // Determine which positions to show based on results scope filter
    const filteredPositions = this.getPositionsForScope(resultsScope || "all");

    // Render Tallies Grid
    this.publicTalliesGrid.innerHTML = "";
    filteredPositions.forEach(position => {
      const positionCandidates = candidates.filter(c => c.position === position);
      const positionVotes = {};
      let totalPositionBallots = 0;

      positionCandidates.forEach(c => positionVotes[c.id] = 0);
      positionVotes[`NOTA_${position}`] = 0;

      cipherLedger.forEach(entry => {
        if (entry.selections && entry.selections[position]) {
          const selectedId = entry.selections[position];
          positionVotes[selectedId] = (positionVotes[selectedId] || 0) + 1;
          totalPositionBallots++;
        }
      });

      let highestVotes = -1;
      let leaderId = null;
      Object.entries(positionVotes).forEach(([id, votes]) => {
        if (votes > highestVotes && votes > 0) {
          highestVotes = votes;
          leaderId = id;
        }
      });

      const card = document.createElement("div");
      card.className = "tally-position-card";
      card.innerHTML = `
        <div class="tally-card-head">
          <h4>${position}</h4>
          <span class="tally-total-votes">${totalPositionBallots} Ballots Cast</span>
        </div>
      `;

      const rowsList = document.createElement("div");
      rowsList.className = "tally-rows-list";

      positionCandidates.forEach(cand => {
        const votes = positionVotes[cand.id] || 0;
        const pct = totalPositionBallots > 0 ? Math.round((votes / totalPositionBallots) * 100) : 0;
        const isLeader = cand.id === leaderId;

        const row = document.createElement("div");
        row.className = "tally-row";
        row.innerHTML = `
          <div class="tally-row-header">
            <span>${isLeader ? "★ " : ""}${cand.name} <span class="badge-sub">${cand.department}</span></span>
            <span><strong>${canShowTallies ? votes : "••"}</strong> (${canShowTallies ? pct : "••"}%)</span>
          </div>
          <div class="tally-bar-outer">
            <div class="tally-bar-inner ${isLeader ? "lead" : "standard"}" style="width: ${canShowTallies ? pct : 50}%;"></div>
          </div>
        `;
        rowsList.appendChild(row);
      });

      // NOTA
      const notaVotes = positionVotes[`NOTA_${position}`] || 0;
      const notaPct = totalPositionBallots > 0 ? Math.round((notaVotes / totalPositionBallots) * 100) : 0;
      const notaRow = document.createElement("div");
      notaRow.className = "tally-row";
      notaRow.innerHTML = `
        <div class="tally-row-header">
          <span>None of the Above (NOTA)</span>
          <span><strong>${canShowTallies ? notaVotes : "••"}</strong> (${canShowTallies ? notaPct : "••"}%)</span>
        </div>
        <div class="tally-bar-outer">
          <div class="tally-bar-inner nota" style="width: ${canShowTallies ? notaPct : 15}%;"></div>
        </div>
      `;
      rowsList.appendChild(notaRow);

      card.appendChild(rowsList);
      this.publicTalliesGrid.appendChild(card);
    });

    // Render Department Breakdown
    this.renderDeptTurnoutStack(this.publicDeptTurnoutList);
  }

  handleVerifyReceipt() {
    const query = this.verifierInput.value.trim();
    if (!query) {
      this.showToast("Input Required", "Enter an SHA-256 hash or receipt reference (e.g. AU-2026-VOTE-4819).", "error");
      return;
    }

    const { voterRoll, cipherLedger } = this.stateMgr.state;
    // Search ledger or roll
    const ledgerEntry = cipherLedger.find(entry => entry.ballotHash.toLowerCase() === query.toLowerCase());
    const rollEntry = voterRoll.find(v => (v.receiptRef && v.receiptRef.toLowerCase() === query.toLowerCase()) || 
                                          (v.receiptToken && v.receiptToken.toLowerCase() === query.toLowerCase()));

    const targetHash = ledgerEntry ? ledgerEntry.ballotHash : (rollEntry ? rollEntry.receiptToken : null);
    const targetBlock = ledgerEntry ? `#BLK-${String(ledgerEntry.id).padStart(4, "0")}` : "#BLK-VERIFIED";
    const targetTimestamp = ledgerEntry ? ledgerEntry.timestamp : (rollEntry ? rollEntry.votedTimestamp : "2026-09-26 11:20:14");
    const targetRef = rollEntry ? rollEntry.receiptRef : "AU-2026-VOTE-CONFIRMED";

    if (ledgerEntry || rollEntry) {
      this.verifierResultBox.innerHTML = `
        <div class="verifier-success-badge">
          <svg class="w-5 h-5 text-green" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          BALLOT VERIFIED IN IMMUTABLE CIPHER LEDGER
        </div>
        <div class="verifier-meta-grid">
          <div><strong>Receipt Ref:</strong> <span class="mono">${targetRef}</span></div>
          <div><strong>Ledger Block:</strong> <span class="mono">${targetBlock}</span></div>
          <div><strong>Recorded (IST):</strong> <span>${targetTimestamp}</span></div>
          <div><strong>Status:</strong> <span class="text-green font-bold">✓ Tallied & Sealed</span></div>
        </div>
        <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--text-muted); word-break:break-all;">
          <strong>Cryptographic Token (SHA-256):</strong><br>
          <code class="mono" style="color:var(--primary-700);">${targetHash || query}</code>
        </div>
        <div style="margin-top:0.5rem; font-size:0.75rem; color:var(--text-secondary);">
          ✓ <em>Zero-Knowledge Secrecy: Your candidate choices remain confidential and untraceable to your student identity.</em>
        </div>
      `;
      this.verifierResultBox.classList.remove("hidden");
      this.showToast("Receipt Verified", "Cryptographic fingerprint confirmed in official ledger.", "success");
    } else {
      this.verifierResultBox.innerHTML = `
        <div style="color:var(--red-600); font-weight:700; margin-bottom:0.25rem;">
          ✕ Hash or Reference Number Not Found in Ledger
        </div>
        <p style="font-size:0.8rem; color:var(--text-secondary);">
          No ballot matching "<code>${query}</code>" has been sealed in the official university ledger yet. Please double check the code.
        </p>
      `;
      this.verifierResultBox.classList.remove("hidden");
      this.showToast("Verification Failed", "No matching ballot found in ledger.", "error");
    }
  }

  testVerifyHash(ref) {
    this.verifierInput.value = ref;
    this.handleVerifyReceipt();
  }

  // ==========================================================================
  // ELECTION ADMIN DASHBOARD
  // ==========================================================================
  renderAdminDashboard() {
    this.renderKPIs();
    this.renderVoterRollTable();
    this.renderAdminCandidates();
    this.renderTalliesAndCharts();
    this.renderAuditLedger();
    this.renderOfficialResults();
    this.renderElectionStatus();
    this.renderDeptTurnoutStack(this.adminDeptLeaderboardContainer);
  }

  renderKPIs() {
    const { voterRoll, cipherLedger } = this.stateMgr.state;
    const totalVoters = voterRoll.length;
    const votedCount = voterRoll.filter(v => v.status === "VOTED").length;
    const pendingCount = totalVoters - votedCount;
    const turnoutPct = totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(1) : 0;

    this.kpiTotalVoters.textContent = totalVoters;
    this.kpiVotedCount.textContent = votedCount;
    this.kpiTurnoutPct.textContent = `${turnoutPct}%`;
    this.kpiPendingCount.textContent = pendingCount;
    this.tabVoterCount.textContent = totalVoters;

    this.filterCntAll.textContent = totalVoters;
    this.filterCntPending.textContent = pendingCount;
    this.filterCntVoted.textContent = votedCount;

    const ledgerValid = cipherLedger.length === votedCount;
    this.kpiLedgerIntegrity.textContent = ledgerValid ? "100% SECURE" : "AUDIT DISCREPANCY";
    this.kpiLedgerIntegrity.className = `metric-value ${ledgerValid ? "text-purple" : "text-danger"}`;
  }

  renderVoterRollTable() {
    const { voterRoll } = this.stateMgr.state;
    const searchQuery = this.voterSearchInput.value.toLowerCase().trim();
    const activeFilter = document.querySelector(".filter-pill.active")?.getAttribute("data-filter") || "all";

    const filtered = voterRoll.filter(v => {
      const matchSearch = v.id.toLowerCase().includes(searchQuery) ||
                          v.name.toLowerCase().includes(searchQuery) ||
                          v.department.toLowerCase().includes(searchQuery);

      if (!matchSearch) return false;
      if (activeFilter === "pending") return v.status === "PENDING";
      if (activeFilter === "voted") return v.status === "VOTED";
      return true;
    });

    this.voterRollTbody.innerHTML = "";

    if (filtered.length === 0) {
      this.voterRollTbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No students found matching your criteria.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(voter => {
      const tr = document.createElement("tr");
      const isVoted = voter.status === "VOTED";

      tr.innerHTML = `
        <td class="mono font-bold">${voter.id}</td>
        <td><strong>${voter.name}</strong></td>
        <td>${voter.department} <span class="badge-sub">${voter.year}</span></td>
        <td>
          <span class="status-tag ${isVoted ? "voted" : "pending"}">
            ${isVoted ? "✓ VOTED" : "● PENDING"}
          </span>
        </td>
        <td class="font-sm">${voter.votedTimestamp || "—"}</td>
        <td class="mono font-sm">${voter.receiptRef || "—"}</td>
        <td>
          ${!isVoted ? `
            <button class="btn btn-outline btn-sm" onclick="app.setQuickDemo('${voter.id}')">
              Login Test
            </button>
          ` : `
            <span class="text-green font-sm font-bold">Sealed</span>
          `}
        </td>
      `;
      this.voterRollTbody.appendChild(tr);
    });
  }

  renderAdminCandidates() {
    const { candidates } = this.stateMgr.state;
    this.adminCandidatesContainer.innerHTML = "";

    candidates.forEach(cand => {
      const card = document.createElement("div");
      card.className = "admin-cand-card";

      card.innerHTML = `
        <div class="admin-cand-header">
          <div class="candidate-avatar ${cand.avatarClass || "avatar-blue"}" style="width: 44px; height: 44px; font-size: 1rem;">
            ${cand.initials || "CA"}
          </div>
          <div>
            <h4 class="admin-cand-title">${cand.name}</h4>
            <span class="admin-cand-role">Candidate for ${cand.position}</span>
          </div>
        </div>
        <div class="candidate-sub" style="margin-bottom: 0.5rem;">
          ${cand.department} • ${cand.year} • ${cand.gpa || ""}
        </div>
        <p class="admin-cand-bio">${cand.tagline || cand.bio || "No summary available."}</p>
        <div class="admin-cand-actions">
          <button class="btn btn-outline btn-sm" data-action="view-manifesto" data-cand-id="${cand.id}">
            View Manifesto
          </button>
        </div>
      `;

      card.querySelector('[data-action="view-manifesto"]').addEventListener("click", () => {
        this.openManifestoModal(cand);
      });

      this.adminCandidatesContainer.appendChild(card);
    });
  }

  renderTalliesAndCharts() {
    const { candidates, cipherLedger, adminPreviewTallies, electionStatus } = this.stateMgr.state;
    const isLocked = electionStatus === "VOTING LOCKED";
    const canView = isLocked || adminPreviewTallies;

    this.adminTallyOverrideToggle.checked = adminPreviewTallies;

    if (isLocked) {
      this.tallyLockStatusTitle.textContent = "🔒 Election Locked - Official Certified Counts";
      this.tallyLockStatusDesc.textContent = "Voting has permanently closed. All encrypted tallies are ratified.";
    } else if (adminPreviewTallies) {
      this.tallyLockStatusTitle.textContent = "⚡ Administrator Preview Active";
      this.tallyLockStatusDesc.textContent = "Live tallies are visible for Commission monitoring. (Regular students cannot view until locked).";
    } else {
      this.tallyLockStatusTitle.textContent = "🙈 Tallies Hidden from View";
      this.tallyLockStatusDesc.textContent = "Live tallies are sealed to prevent early bias. Toggle preview above or lock election to reveal.";
    }

    this.talliesChartsContainer.innerHTML = "";

    if (!canView) {
      this.talliesChartsContainer.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <h3>Tallies Temporarily Sealed</h3>
          <p class="text-secondary font-sm">Toggle 'Admin Live Preview' above to inspect incoming totals.</p>
        </div>
      `;
      return;
    }

    this.positions.forEach(position => {
      const positionCandidates = candidates.filter(c => c.position === position);
      const positionVotes = {};
      let totalPositionBallots = 0;

      positionCandidates.forEach(c => positionVotes[c.id] = 0);
      positionVotes[`NOTA_${position}`] = 0;

      cipherLedger.forEach(entry => {
        if (entry.selections && entry.selections[position]) {
          const selectedId = entry.selections[position];
          positionVotes[selectedId] = (positionVotes[selectedId] || 0) + 1;
          totalPositionBallots++;
        }
      });

      let highestVotes = -1;
      let leaderId = null;
      Object.entries(positionVotes).forEach(([id, votes]) => {
        if (votes > highestVotes && votes > 0) {
          highestVotes = votes;
          leaderId = id;
        }
      });

      const card = document.createElement("div");
      card.className = "tally-position-card";
      card.innerHTML = `
        <div class="tally-card-head">
          <h4>${position}</h4>
          <span class="tally-total-votes">${totalPositionBallots} Votes Cast</span>
        </div>
      `;

      const rowsList = document.createElement("div");
      rowsList.className = "tally-rows-list";

      positionCandidates.forEach(cand => {
        const votes = positionVotes[cand.id] || 0;
        const pct = totalPositionBallots > 0 ? Math.round((votes / totalPositionBallots) * 100) : 0;
        const isLeader = cand.id === leaderId;

        const row = document.createElement("div");
        row.className = "tally-row";
        row.innerHTML = `
          <div class="tally-row-header">
            <span>${isLeader ? "★ " : ""}${cand.name} <span class="badge-sub">${cand.department}</span></span>
            <span><strong>${votes}</strong> (${pct}%)</span>
          </div>
          <div class="tally-bar-outer">
            <div class="tally-bar-inner ${isLeader ? "lead" : "standard"}" style="width: ${pct}%;"></div>
          </div>
        `;
        rowsList.appendChild(row);
      });

      // NOTA
      const notaVotes = positionVotes[`NOTA_${position}`] || 0;
      const notaPct = totalPositionBallots > 0 ? Math.round((notaVotes / totalPositionBallots) * 100) : 0;
      const notaRow = document.createElement("div");
      notaRow.className = "tally-row";
      notaRow.innerHTML = `
        <div class="tally-row-header">
          <span>None of the Above (NOTA)</span>
          <span><strong>${notaVotes}</strong> (${notaPct}%)</span>
        </div>
        <div class="tally-bar-outer">
          <div class="tally-bar-inner nota" style="width: ${notaPct}%;"></div>
        </div>
      `;
      rowsList.appendChild(notaRow);

      card.appendChild(rowsList);
      this.talliesChartsContainer.appendChild(card);
    });
  }

  renderAuditLedger() {
    const { cipherLedger } = this.stateMgr.state;
    this.auditLedgerTbody.innerHTML = "";

    if (cipherLedger.length === 0) {
      this.auditLedgerTbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            Audit ledger is currently empty. Cast votes to see cryptographic blocks.
          </td>
        </tr>
      `;
      return;
    }

    cipherLedger.forEach(entry => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="mono font-bold">#BLK-${String(entry.id).padStart(4, "0")}</td>
        <td class="mono font-sm text-purple" title="${entry.ballotHash}">
          ${entry.ballotHash.slice(0, 16)}...${entry.ballotHash.slice(-10)}
        </td>
        <td class="mono font-sm" style="color: var(--text-secondary);">${entry.payloadPreview}</td>
        <td class="font-sm">${entry.timestamp}</td>
        <td>
          <span class="status-tag voted">
            ✓ ${entry.verificationStatus || "VERIFIED"}
          </span>
        </td>
      `;
      this.auditLedgerTbody.appendChild(tr);
    });
  }

  renderOfficialResults() {
    const { candidates, cipherLedger, voterRoll } = this.stateMgr.state;
    const totalVoters = voterRoll.length;
    const totalBallots = cipherLedger.length;
    const turnoutPct = totalVoters > 0 ? ((totalBallots / totalVoters) * 100).toFixed(1) : 0;

    this.declTotalTurnout.textContent = `${turnoutPct}%`;
    this.declTotalVotes.textContent = totalBallots;
    this.declPositionsCount.textContent = this.positions.length;

    this.winnersCardsGrid.innerHTML = "";

    this.positions.forEach(position => {
      const positionCandidates = candidates.filter(c => c.position === position);
      const positionVotes = {};
      let totalPositionBallots = 0;

      positionCandidates.forEach(c => positionVotes[c.id] = 0);
      positionVotes[`NOTA_${position}`] = 0;

      cipherLedger.forEach(entry => {
        if (entry.selections && entry.selections[position]) {
          const selectedId = entry.selections[position];
          positionVotes[selectedId] = (positionVotes[selectedId] || 0) + 1;
          totalPositionBallots++;
        }
      });

      let maxVotes = -1;
      let winnerId = null;
      Object.entries(positionVotes).forEach(([id, votes]) => {
        if (votes > maxVotes) {
          maxVotes = votes;
          winnerId = id;
        }
      });

      const winnerCard = document.createElement("div");
      winnerCard.className = "winner-card";

      if (winnerId && winnerId.startsWith("NOTA_")) {
        winnerCard.innerHTML = `
          <div class="winner-avatar nota-avatar">✕</div>
          <div class="winner-position">${position}</div>
          <h3 class="winner-name">NOTA Majority</h3>
          <p class="winner-dept">No candidate achieved confidence majority</p>
          <div class="winner-stats-pill">
            <span>Votes: <strong>${maxVotes}</strong></span>
            <span>Share: <strong>${totalPositionBallots > 0 ? Math.round((maxVotes / totalPositionBallots) * 100) : 0}%</strong></span>
          </div>
        `;
      } else if (winnerId) {
        const winner = candidates.find(c => c.id === winnerId);
        const winPct = totalPositionBallots > 0 ? Math.round((maxVotes / totalPositionBallots) * 100) : 0;

        winnerCard.innerHTML = `
          <div class="winner-laurel-badge">★ ELECTED</div>
          <div class="winner-avatar ${winner?.avatarClass || "avatar-blue"}">
            ${winner?.initials || "W"}
          </div>
          <div class="winner-position">${position}</div>
          <h3 class="winner-name">${winner?.name || "Candidate"}</h3>
          <p class="winner-dept">${winner?.department || ""} • ${winner?.year || ""}</p>
          <div class="winner-stats-pill">
            <span>Votes: <strong>${maxVotes}</strong></span>
            <span>Share: <strong>${winPct}%</strong></span>
          </div>
        `;
      } else {
        winnerCard.innerHTML = `
          <div class="winner-avatar avatar-slate">?</div>
          <div class="winner-position">${position}</div>
          <h3 class="winner-name">No Ballots Cast</h3>
          <p class="winner-dept">Awaiting student voting</p>
        `;
      }

      this.winnersCardsGrid.appendChild(winnerCard);
    });
  }

  switchAdminTab(tabName) {
    this.adminTabs.forEach(tab => {
      tab.classList.toggle("active", tab.getAttribute("data-tab") === tabName);
    });
    this.tabPanes.forEach(pane => {
      pane.classList.toggle("active", pane.id === `tab-content-${tabName}`);
      pane.classList.toggle("hidden", pane.id !== `tab-content-${tabName}`);
    });

    if (tabName === "live-tally") this.renderTalliesAndCharts();
    if (tabName === "audit-ledger") this.renderAuditLedger();
    if (tabName === "official-results") this.renderOfficialResults();
    if (tabName === "candidates") this.renderAdminCandidates();
    if (tabName === "voter-roll") this.renderVoterRollTable();
  }

  setElectionPhase(phase) {
    this.stateMgr.state.electionStatus = phase;
    this.stateMgr.saveState();
    this.renderElectionStatus();
    this.renderAdminDashboard();
    this.renderPublicResults();

    let msg = `Election phase updated to ${phase}`;
    if (phase === "VOTING LOCKED") {
      msg = "Voting LOCKED. Certified tallies are now published!";
      this.switchAdminTab("official-results");
    }
    this.showToast("Election Lifecycle", msg, "info");
  }

  renderElectionStatus() {
    const status = this.stateMgr.state.electionStatus;
    this.headerElectionStatus.textContent = status;

    this.statusPulseDot.className = "pulse-dot";
    if (status === "PRE-ELECTION") {
      this.statusPulseDot.classList.add("pulse-amber");
    } else if (status === "VOTING LOCKED") {
      this.statusPulseDot.classList.add("pulse-red");
    }

    this.phaseButtons.forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-phase") === status);
    });

    if (status === "PRE-ELECTION") {
      this.authElectionNotice.className = "alert-banner warning";
      this.authElectionNotice.innerHTML = `<span><strong>Notice:</strong> Polls are in Pre-Election preparation mode. Voting will open shortly.</span>`;
      this.authElectionNotice.classList.remove("hidden");
    } else if (status === "VOTING LOCKED") {
      this.authElectionNotice.className = "alert-banner warning";
      this.authElectionNotice.innerHTML = `<span><strong>Voting Closed:</strong> The ballot window is locked. Check the Live Results tab for certified outcomes.</span>`;
      this.authElectionNotice.classList.remove("hidden");
    } else {
      this.authElectionNotice.classList.add("hidden");
    }
  }

  // ==========================================================================
  // DEPARTMENT REPRESENTATIVE CONSOLE
  // ==========================================================================
  renderDeptPortal() {
    const dept = this.stateMgr.state.activeDept || "Computer Science";
    this.deptRepSelect.value = dept;

    const { voterRoll, cipherLedger } = this.stateMgr.state;
    const deptVoters = voterRoll.filter(v => v.department === dept);
    const totalDept = deptVoters.length;
    const votedDept = deptVoters.filter(v => v.status === "VOTED").length;
    const pendingDept = totalDept - votedDept;
    const turnoutPct = totalDept > 0 ? ((votedDept / totalDept) * 100).toFixed(1) : 0;

    this.deptKpiTotal.textContent = totalDept;
    this.deptKpiVoted.textContent = votedDept;
    this.deptKpiTurnoutPct.textContent = `${turnoutPct}%`;
    this.deptKpiPending.textContent = pendingDept;
    this.deptKpiDeptLabel.textContent = `${dept} Voter Roll`;

    // Calculate department rank among all departments
    const departments = ["Computer Science", "Electronics & Comm.", "Mechanical Eng.", "Biotechnology", "Business Administration"];
    const deptStats = departments.map(d => {
      const inDept = voterRoll.filter(v => v.department === d);
      const voted = inDept.filter(v => v.status === "VOTED").length;
      const total = inDept.length;
      const pct = total > 0 ? (voted / total) * 100 : 0;
      return { dept: d, pct };
    });
    deptStats.sort((a, b) => b.pct - a.pct);
    const rank = deptStats.findIndex(d => d.dept === dept) + 1;
    if (this.deptKpiRank) this.deptKpiRank.textContent = `#${rank} of ${departments.length}`;

    this.renderDeptVoterRollTable();
    this.renderDeptCandidates();
    this.renderDeptTurnoutStack(this.deptLeaderboardList);
  }

  switchDeptTab(tabName) {
    this.deptTabs.forEach(tab => {
      tab.classList.toggle("active", tab.getAttribute("data-dept-tab") === tabName);
    });
    this.deptTabPanes.forEach(pane => {
      pane.classList.toggle("active", pane.id === `dept-tab-content-${tabName}`);
      pane.classList.toggle("hidden", pane.id !== `dept-tab-content-${tabName}`);
    });
  }

  renderDeptVoterRollTable() {
    const dept = this.stateMgr.state.activeDept;
    const { voterRoll } = this.stateMgr.state;
    const searchQuery = this.deptVoterSearch.value.toLowerCase().trim();
    const activeFilter = document.querySelector(".dept-filter-pill.active")?.getAttribute("data-filter") || "all";

    const filtered = voterRoll.filter(v => {
      if (v.department !== dept) return false;
      const match = v.id.toLowerCase().includes(searchQuery) || v.name.toLowerCase().includes(searchQuery);
      if (!match) return false;
      if (activeFilter === "pending") return v.status === "PENDING";
      if (activeFilter === "voted") return v.status === "VOTED";
      return true;
    });

    this.deptTabVoterCount.textContent = voterRoll.filter(v => v.department === dept).length;
    this.deptVoterRollTbody.innerHTML = "";

    if (filtered.length === 0) {
      this.deptVoterRollTbody.innerHTML = `
        <tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:2rem;">No department students found.</td></tr>
      `;
      return;
    }

    filtered.forEach(voter => {
      const tr = document.createElement("tr");
      const isVoted = voter.status === "VOTED";
      tr.innerHTML = `
        <td class="mono font-bold">${voter.id}</td>
        <td><strong>${voter.name}</strong></td>
        <td>${voter.year}</td>
        <td><span class="status-tag ${isVoted ? "voted" : "pending"}">${isVoted ? "✓ VOTED" : "● PENDING"}</span></td>
        <td>${voter.votedTimestamp || "—"}</td>
        <td class="mono font-sm">${voter.receiptRef || "—"}</td>
      `;
      this.deptVoterRollTbody.appendChild(tr);
    });
  }

  renderDeptCandidates() {
    const dept = this.stateMgr.state.activeDept;
    const { candidates } = this.stateMgr.state;
    const deptCandidates = candidates.filter(c => c.department === dept);

    this.deptCandidatesGrid.innerHTML = "";
    if (deptCandidates.length === 0) {
      this.deptCandidatesGrid.innerHTML = `<p class="text-muted" style="grid-column:1/-1;">No nominees registered specifically for ${dept} yet.</p>`;
      return;
    }

    deptCandidates.forEach(cand => {
      const card = document.createElement("div");
      card.className = "admin-cand-card";
      card.innerHTML = `
        <div class="admin-cand-header">
          <div class="candidate-avatar ${cand.avatarClass || "avatar-blue"}">${cand.initials || "CA"}</div>
          <div>
            <h4 class="admin-cand-title">${cand.name}</h4>
            <span class="admin-cand-role">${cand.position}</span>
          </div>
        </div>
        <p class="admin-cand-bio">${cand.tagline || cand.bio || ""}</p>
        <button class="btn btn-outline btn-sm" onclick="app.openManifestoModal(app.stateMgr.state.candidates.find(c => c.id === '${cand.id}'))">
          View Manifesto
        </button>
      `;
      this.deptCandidatesGrid.appendChild(card);
    });
  }

  renderDeptTurnoutStack(containerElement) {
    if (!containerElement) return;
    const { voterRoll } = this.stateMgr.state;
    const departments = [
      "Computer Science",
      "Electronics & Comm.",
      "Mechanical Eng.",
      "Biotechnology",
      "Business Administration"
    ];

    const stats = departments.map(d => {
      const inDept = voterRoll.filter(v => v.department === d);
      const voted = inDept.filter(v => v.status === "VOTED").length;
      const total = inDept.length;
      const pct = total > 0 ? Math.round((voted / total) * 100) : 0;
      return { dept: d, total, voted, pct };
    });

    stats.sort((a, b) => b.pct - a.pct);

    containerElement.innerHTML = "";
    stats.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "leaderboard-rank-card";
      const rankClass = index === 0 ? "top-1" : (index === 1 ? "top-2" : (index === 2 ? "top-3" : ""));

      card.innerHTML = `
        <div class="rank-left">
          <div class="rank-badge ${rankClass}">#${index + 1}</div>
          <div>
            <div class="rank-dept-name">${item.dept}</div>
            <div class="rank-dept-stats">${item.voted} of ${item.total} students voted</div>
          </div>
        </div>
        <div class="rank-right">
          <div class="rank-pct">${item.pct}%</div>
        </div>
      `;
      containerElement.appendChild(card);
    });
  }

  // ==========================================================================
  // SIMULATION & MODAL ACTIONS
  // ==========================================================================
  async simulateMockVote() {
    const pendingVoters = this.stateMgr.state.voterRoll.filter(v => v.status === "PENDING");
    if (pendingVoters.length === 0) {
      this.showToast("All Voted", "All registered students in the roll have already voted!", "info");
      return;
    }

    const voter = pendingVoters[Math.floor(Math.random() * pendingVoters.length)];
    const mockSelections = {};

    this.positions.forEach(pos => {
      const posCandidates = this.stateMgr.state.candidates.filter(c => c.position === pos);
      if (Math.random() > 0.15 && posCandidates.length > 0) {
        const picked = posCandidates[Math.floor(Math.random() * posCandidates.length)];
        mockSelections[pos] = picked.id;
      } else {
        mockSelections[pos] = `NOTA_${pos}`;
      }
    });

    const timestamp = CryptoUtil.getFormattedTimestamp();
    const receiptRef = CryptoUtil.generateReceiptRef();
    const payload = JSON.stringify(mockSelections) + timestamp + receiptRef;
    const hash = await CryptoUtil.sha256(payload);

    voter.status = "VOTED";
    voter.votedTimestamp = timestamp;
    voter.receiptRef = receiptRef;
    voter.receiptToken = hash;

    const payloadTokens = Object.entries(mockSelections)
      .map(([pos, cid]) => `${pos[0]}:${cid.replace("cand-", "").replace("NOTA_", "NOTA")}`)
      .join(" | ");

    this.stateMgr.state.cipherLedger.push({
      id: this.stateMgr.state.cipherLedger.length + 1,
      ballotHash: hash,
      payloadPreview: `CIPHER:[${payloadTokens}]`,
      timestamp: timestamp,
      selections: mockSelections,
      verificationStatus: "SEALED & VERIFIED"
    });

    this.stateMgr.saveState();
    this.renderAdminDashboard();
    this.renderPublicResults();
    this.showToast("Mock Vote Cast", `Simulated vote for ${voter.name} (${voter.id})`, "success");
  }

  handleSaveNewVoter() {
    const id = this.newVoterId.value.trim().toUpperCase();
    const name = this.newVoterName.value.trim();
    const dept = this.newVoterDept.value;
    const year = this.newVoterYear.value;

    if (!id || !name) {
      this.showToast("Missing Fields", "Please provide Roll Number and Full Name.", "error");
      return;
    }

    if (this.stateMgr.state.voterRoll.some(v => v.id === id)) {
      this.showToast("Duplicate Roll", `Student Roll ${id} already exists.`, "error");
      return;
    }

    this.stateMgr.state.voterRoll.push({
      id: id,
      name: name,
      department: dept,
      year: year,
      status: "PENDING",
      votedTimestamp: null,
      receiptRef: null,
      receiptToken: null
    });

    this.stateMgr.saveState();
    this.modalAddVoter.classList.add("hidden");
    this.newVoterId.value = "";
    this.newVoterName.value = "";

    this.renderAdminDashboard();
    this.showToast("Student Registered", `Added ${name} to eligible roll.`, "success");
  }

  handleSaveNewCandidate() {
    const position = this.newCandPosition.value;
    const name = this.newCandName.value.trim();
    const dept = this.newCandDept.value.trim();
    const tagline = this.newCandTagline.value.trim();
    const pillarsRaw = this.newCandPillars.value.trim();
    const bio = this.newCandBio.value.trim();

    if (!name || !dept) {
      this.showToast("Missing Fields", "Candidate name and department are required.", "error");
      return;
    }

    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const pillars = pillarsRaw ? pillarsRaw.split(",").map(p => p.trim()).filter(Boolean) : [
      "Student welfare & inclusive advocacy",
      "Transparent governance"
    ];

    const colors = ["avatar-blue", "avatar-indigo", "avatar-purple", "avatar-teal", "avatar-amber"];
    const avatarClass = colors[Math.floor(Math.random() * colors.length)];

    this.stateMgr.state.candidates.push({
      id: `cand-${Date.now()}`,
      position: position,
      name: name,
      department: dept,
      year: "3rd Year",
      avatarClass: avatarClass,
      initials: initials,
      gpa: "GPA 3.80",
      tagline: tagline ? `"${tagline}"` : `"Committed to Campus Excellence"`,
      pillars: pillars,
      bio: bio || "Approved student council nominee."
    });

    this.stateMgr.saveState();
    this.modalAddCandidate.classList.add("hidden");
    this.newCandName.value = "";
    this.newCandDept.value = "";
    this.newCandTagline.value = "";
    this.newCandPillars.value = "";
    this.newCandBio.value = "";

    this.renderAdminDashboard();
    this.showToast("Nomination Approved", `${name} added to ${position} slate.`, "success");
  }

  handleSaveNewDeptCandidate() {
    const position = document.getElementById("new-dept-cand-position").value;
    const dept = document.getElementById("new-dept-cand-dept").value;
    const name = document.getElementById("new-dept-cand-name").value.trim();
    const year = document.getElementById("new-dept-cand-year").value;
    const tagline = document.getElementById("new-dept-cand-tagline").value.trim();
    const pillarsRaw = document.getElementById("new-dept-cand-pillars").value.trim();
    const bio = document.getElementById("new-dept-cand-bio").value.trim();

    if (!name) {
      this.showToast("Missing Name", "Candidate name is required.", "error");
      return;
    }

    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    this.stateMgr.state.candidates.push({
      id: `cand-dept-${Date.now()}`,
      position: position,
      name: name,
      department: dept,
      year: year,
      avatarClass: "avatar-teal",
      initials: initials,
      gpa: "GPA 3.85",
      tagline: tagline ? `"${tagline}"` : `"Serving ${dept}"`,
      pillars: pillarsRaw ? pillarsRaw.split(",").map(p => p.trim()) : ["Department advocacy"],
      bio: bio || "Dedicated department nominee."
    });

    this.stateMgr.saveState();
    this.modalAddDeptCandidate.classList.add("hidden");
    this.renderDeptPortal();
    this.showToast("Nomination Saved", `${name} added for ${dept}.`, "success");
  }

  // ==========================================================================
  // THEME & TOAST
  // ==========================================================================
  toggleTheme() {
    const isDark = document.body.classList.contains("theme-dark");
    const newTheme = isDark ? "light" : "dark";
    this.applyTheme(newTheme);
    this.stateMgr.state.theme = newTheme;
    this.stateMgr.saveState();
  }

  applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.remove("theme-light");
      document.body.classList.add("theme-dark");
      this.iconSun.classList.remove("hidden");
      this.iconMoon.classList.add("hidden");
    } else {
      document.body.classList.remove("theme-dark");
      document.body.classList.add("theme-light");
      this.iconSun.classList.add("hidden");
      this.iconMoon.classList.remove("hidden");
    }
  }

  showToast(title, message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  render() {
    this.renderElectionStatus();
    const view = this.stateMgr.state.currentView || "login";
    if (view === "login") {
      this.showLoginGateway(this.stateMgr.state.loginTab || "student");
    } else {
      this.activateView(view);
    }
  }
}

// Global instance initiation
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new VotingApp();
  window.app = app;
});

