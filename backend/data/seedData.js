// CaseIQ Rich Indian Legal Knowledge Seed Database
// Contains complete Acts, Sections, Landmark Judgments, Precedent Graphs, and Reform Mappings

const users = [
  {
    id: 'user-1',
    numericId: 1,
    name: 'Adv. Aarav Sharma',
    email: 'aarav.sharma@caseiq.legal',
    password: '$2b$10$e2QTRoLOQ4//25wPgRD5duTRAsyyLbZLdDQ6gsqu06zUzw1RHSBIG', // hashed 'password123'
    role: 'Lawyer',
    organization: 'Supreme Court Bar Association, New Delhi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bookmarks: ['sec-bns-305', 'case-puttaswamy', 'map-1', 'sec-bns-103', 'case-kesavananda'],
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'user-2',
    numericId: 2,
    name: 'Priya Narayanan',
    email: 'priya.law@nludelhi.ac.in',
    password: '$2b$10$e2QTRoLOQ4//25wPgRD5duTRAsyyLbZLdDQ6gsqu06zUzw1RHSBIG',
    role: 'Student',
    organization: 'National Law University, Delhi (5th Year B.A. LL.B)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bookmarks: ['case-maneka', 'sec-coi-21', 'case-shreya'],
    createdAt: '2026-02-01T14:30:00Z'
  },
  {
    id: 'user-3',
    numericId: 3,
    name: 'Dr. Vikramaditya Sen',
    email: 'vikram.sen@legalresearch.org',
    password: '$2b$10$e2QTRoLOQ4//25wPgRD5duTRAsyyLbZLdDQ6gsqu06zUzw1RHSBIG',
    role: 'Researcher',
    organization: 'Centre for Policy & Judicial Reform Studies',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bookmarks: ['map-2', 'sec-bsa-63', 'case-jacob-mathew'],
    createdAt: '2026-02-10T09:15:00Z'
  },
  {
    id: 'user-4',
    numericId: 4,
    name: 'Shardul Amarchand & Partners',
    email: 'contact@shardul-law.in',
    password: '$2b$10$e2QTRoLOQ4//25wPgRD5duTRAsyyLbZLdDQ6gsqu06zUzw1RHSBIG',
    role: 'Law Firm',
    organization: 'Dispute Resolution & Appellate Litigation Practice Group',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
    bookmarks: ['sec-bnss-482', 'case-arnesh', 'sec-cpa-84'],
    createdAt: '2026-02-12T11:45:00Z'
  }
];

// All 10 Required Acts
const acts = [
  {
    id: 'act-ipc',
    numericId: 1,
    code: 'IPC',
    name: 'Indian Penal Code, 1860',
    shortName: 'IPC 1860 (Predecessor)',
    year: 1860,
    status: 'Repealed / Historical Reference',
    replacedBy: 'Bharatiya Nyaya Sanhita, 2023',
    totalSections: 511,
    chaptersCount: 23,
    enactmentDate: '6 October 1860',
    jurisdiction: 'Republic of India (pre-July 2024)',
    category: 'Criminal Substantive Law',
    description: 'The historic official criminal code of India covering offenses against human body, property, public tranquility, state, and reputation.',
    officialSource: 'Ministry of Law and Justice / India Code Repository',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2263',
    verified: true
  },
  {
    id: 'act-bns',
    numericId: 2,
    code: 'BNS',
    name: 'Bharatiya Nyaya Sanhita, 2023',
    shortName: 'BNS 2023 (New Criminal Law)',
    year: 2023,
    status: 'In Force (Effective 1 July 2024)',
    predecessorAct: 'Indian Penal Code, 1860',
    totalSections: 358,
    chaptersCount: 20,
    enactmentDate: '25 December 2023',
    jurisdiction: 'Republic of India',
    category: 'Criminal Substantive Law',
    description: 'Modern criminal substantive statute modernizing penal jurisprudence with provisions for community service, organized crime, mob lynching, and gender-neutral offenses.',
    officialSource: 'The Gazette of India, Extraordinary, Part II—Section 1, No. 45',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250883.pdf',
    verified: true
  },
  {
    id: 'act-crpc',
    numericId: 3,
    code: 'CrPC',
    name: 'Code of Criminal Procedure, 1973',
    shortName: 'CrPC 1973 (Predecessor)',
    year: 1973,
    status: 'Repealed / Historical Reference',
    replacedBy: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    totalSections: 484,
    chaptersCount: 37,
    enactmentDate: '25 January 1974',
    jurisdiction: 'Republic of India (pre-July 2024)',
    category: 'Criminal Procedural Law',
    description: 'Historical comprehensive procedural code providing machinery for investigation of crime, apprehension of offenders, bail, evidence collection, and determination of guilt.',
    officialSource: 'Ministry of Law and Justice / Legislative Department',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/1611',
    verified: true
  },
  {
    id: 'act-bnss',
    numericId: 4,
    code: 'BNSS',
    name: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    shortName: 'BNSS 2023 (New Criminal Procedure)',
    year: 2023,
    status: 'In Force (Effective 1 July 2024)',
    predecessorAct: 'Code of Criminal Procedure, 1973',
    totalSections: 531,
    chaptersCount: 39,
    enactmentDate: '25 December 2023',
    jurisdiction: 'Republic of India',
    category: 'Criminal Procedural Law',
    description: 'The principal legislation on criminal procedural law introducing timeline-driven trials, electronic summons, zero FIR mandates, mandatory forensic investigation, and audio-video recording.',
    officialSource: 'The Gazette of India, Extraordinary, Part II—Section 1, No. 46',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250884.pdf',
    verified: true
  },
  {
    id: 'act-iea',
    numericId: 5,
    code: 'IEA',
    name: 'Indian Evidence Act, 1872',
    shortName: 'IEA 1872 (Predecessor)',
    year: 1872,
    status: 'Repealed / Historical Reference',
    replacedBy: 'Bharatiya Sakshya Adhiniyam, 2023',
    totalSections: 167,
    chaptersCount: 11,
    enactmentDate: '15 March 1872',
    jurisdiction: 'Republic of India (pre-July 2024)',
    category: 'Evidence & Admissibility Law',
    description: 'The foundational law governing rules of evidence, facts relevancy, burden of proof, examination of witnesses, and electronic certificate requirements under Section 65B.',
    officialSource: 'India Code Repository, Legislative Department',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2188',
    verified: true
  },
  {
    id: 'act-bsa',
    numericId: 6,
    code: 'BSA',
    name: 'Bharatiya Sakshya Adhiniyam, 2023',
    shortName: 'BSA 2023 (New Evidence Law)',
    year: 2023,
    status: 'In Force (Effective 1 July 2024)',
    predecessorAct: 'Indian Evidence Act, 1872',
    totalSections: 170,
    chaptersCount: 12,
    enactmentDate: '25 December 2023',
    jurisdiction: 'Republic of India',
    category: 'Evidence & Admissibility Law',
    description: 'Contemporary evidence statute granting statutory primary status to digital records, electronic signatures, cloud data, and structured electronic certificates under Section 63.',
    officialSource: 'The Gazette of India, Extraordinary, Part II—Section 1, No. 47',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250885.pdf',
    verified: true
  },
  {
    id: 'act-coi',
    numericId: 7,
    code: 'COI',
    name: 'Constitution of India, 1950',
    shortName: 'Constitution of India',
    year: 1950,
    status: 'Supreme Law of the Land',
    totalSections: 395,
    chaptersCount: 22,
    enactmentDate: '26 January 1950',
    jurisdiction: 'Republic of India',
    category: 'Constitutional Law',
    description: 'The supreme legal charter of India establishing the fundamental political code, structure, procedures, powers, and duties of government institutions and setting out fundamental rights.',
    officialSource: 'Constitution of India (As on May 2024), Ministry of Law & Justice',
    sourceUrl: 'https://legislative.gov.in/constitution-of-india/',
    verified: true
  },
  {
    id: 'act-it',
    numericId: 8,
    code: 'IT Act',
    name: 'Information Technology Act, 2000',
    shortName: 'IT Act 2000',
    year: 2000,
    status: 'In Force (Amended 2008, 2023)',
    totalSections: 94,
    chaptersCount: 13,
    enactmentDate: '9 June 2000',
    jurisdiction: 'Republic of India',
    category: 'Cyber & Digital Law',
    description: 'Primary Indian law dealing with cybercrime, electronic commerce, intermediary liability, digital signatures, data protection compensation, and cyber surveillance.',
    officialSource: 'Ministry of Electronics and Information Technology (MeitY)',
    sourceUrl: 'https://www.meity.gov.in/content/information-technology-act-2000',
    verified: true
  },
  {
    id: 'act-pocso',
    numericId: 9,
    code: 'POCSO',
    name: 'Protection of Children from Sexual Offences (POCSO) Act, 2012',
    shortName: 'POCSO Act 2012',
    year: 2012,
    status: 'In Force (Amended 2019)',
    totalSections: 46,
    chaptersCount: 9,
    enactmentDate: '19 June 2012',
    jurisdiction: 'Republic of India',
    category: 'Child Protection & Special Penal Law',
    description: 'Comprehensive special legislation enacted to protect children from offences of sexual assault, sexual harassment and pornography, with child-friendly reporting and stringent presumption of guilt.',
    officialSource: 'Ministry of Women and Child Development / India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2079',
    verified: true
  },
  {
    id: 'act-cpa',
    numericId: 10,
    code: 'CPA',
    name: 'Consumer Protection Act, 2019',
    shortName: 'Consumer Protection Act 2019',
    year: 2019,
    status: 'In Force (Effective July 2020)',
    predecessorAct: 'Consumer Protection Act, 1986',
    totalSections: 107,
    chaptersCount: 8,
    enactmentDate: '9 August 2019',
    jurisdiction: 'Republic of India',
    category: 'Consumer Rights & Commercial Law',
    description: 'Modern consumer protection regime introducing the Central Consumer Protection Authority (CCPA), strict product liability, e-commerce dispute resolution, and mediation.',
    officialSource: 'Department of Consumer Affairs, Ministry of Consumer Affairs, Food & Public Distribution',
    sourceUrl: 'https://consumeraffairs.nic.in/acts-and-rules/consumer-protection',
    verified: true
  }
];

// Rich Sections covering all Acts and crucial search scenarios
const sections = [
  // BNS Sections
  {
    id: 'sec-bns-303',
    numericId: 1,
    actId: 'act-bns',
    actCode: 'BNS',
    sectionNumber: 'Section 303',
    title: 'Theft and punishment for theft',
    chapter: 'Chapter XVII - Of Offences Against Property',
    predecessorSection: 'IPC Section 378 & Section 379',
    content: 'Whoever, intending to take dishonestly any movable property out of the possession of any person without that person\'s consent, moves that property in order to such taking, is said to commit theft. (2) Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both; and in case of theft, where the value of stolen property is less than five thousand rupees, and a person is convicted for the first time, shall upon return of property or upon payment of value, be punished with community service.',
    explanation: 'A person is said to commit theft if there is dishonest intent to move movable property without consent. BNS introduces a landmark reform: first-time offenders where property value is under ₹5,000 are eligible for community service rather than mandatory prison sentence.',
    punishment: 'Imprisonment up to 3 years, or fine, or both. For first conviction where stolen value < ₹5,000, Community Service.',
    bailable: 'Non-Bailable (Subject to first-time community service discretion)',
    cognizable: 'Cognizable',
    compoundable: 'Compoundable with permission of Court (when value < ₹5,000)',
    triableBy: 'Any Magistrate',
    keyPoints: [
      'Property must be movable',
      'Dishonest intention at the moment of taking',
      'Taking without possessor\'s consent',
      'Introduces statutory community service for petty theft under ₹5,000'
    ],
    relevanceTags: ['theft', 'stolen', 'property', 'dishonest', 'community service', 'bns 303', 'ipc 379', 'movable property'],
    source: 'The Gazette of India No. 45, BNS 2023 Section 303',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250883.pdf',
    verified: true
  },
  {
    id: 'sec-bns-305',
    numericId: 2,
    actId: 'act-bns',
    actCode: 'BNS',
    sectionNumber: 'Section 305',
    title: 'Theft in dwelling house, building, tent or vessel',
    chapter: 'Chapter XVII - Of Offences Against Property',
    predecessorSection: 'IPC Section 380',
    content: 'Whoever commits theft in any building, tent or vessel, which building, tent or vessel is used as a human dwelling, or used for the custody of property, or in any place of worship, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
    explanation: 'Aggravated form of theft committed inside residential structures, houses, tents, vessels, or religious worship places where occupants have heightened expectation of security.',
    punishment: 'Rigorous or simple imprisonment up to 7 years, and mandatory fine.',
    bailable: 'Non-Bailable',
    cognizable: 'Cognizable',
    compoundable: 'Non-Compoundable',
    triableBy: 'Any Magistrate',
    keyPoints: [
      'Aggravated offence due to sanctum of dwelling or place of worship',
      'Requires building/tent/vessel to be used for human habitation or property custody',
      'Carries strict non-bailable classification and up to 7 years imprisonment'
    ],
    relevanceTags: ['theft in dwelling house', 'theft in house', 'residential theft', 'burglary', 'bns 305', 'ipc 380', 'house trespass theft'],
    source: 'The Gazette of India No. 45, BNS 2023 Section 305',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250883.pdf',
    verified: true
  },
  {
    id: 'sec-bns-103',
    numericId: 3,
    actId: 'act-bns',
    actCode: 'BNS',
    sectionNumber: 'Section 103',
    title: 'Punishment for murder and mob lynching',
    chapter: 'Chapter VI - Of Offences Affecting the Human Body',
    predecessorSection: 'IPC Section 302',
    content: '(1) Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. (2) When a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, personal belief or any other similar ground, each member of such group shall be punished with death or with imprisonment for life, and shall also be liable to fine.',
    explanation: 'Retains capital punishment and life imprisonment for murder (sub-sec 1) and adds dedicated sub-section (2) explicitly penalizing mob lynching and hate-based group killings by five or more persons.',
    punishment: 'Death or Imprisonment for Life, and fine.',
    bailable: 'Non-Bailable',
    cognizable: 'Cognizable',
    compoundable: 'Non-Compoundable',
    triableBy: 'Court of Session',
    keyPoints: [
      'Sub-clause 1 covers individual culpable homicide amounting to murder',
      'Sub-clause 2 specifically penalizes mob lynching with capital punishment or life term',
      'Applies strict joint liability to all members acting in concert'
    ],
    relevanceTags: ['murder', 'mob lynching', 'capital punishment', 'life imprisonment', 'bns 103', 'ipc 302', 'hate crime'],
    source: 'The Gazette of India No. 45, BNS 2023 Section 103',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250883.pdf',
    verified: true
  },
  {
    id: 'sec-bns-318',
    numericId: 4,
    actId: 'act-bns',
    actCode: 'BNS',
    sectionNumber: 'Section 318',
    title: 'Cheating and dishonestly inducing delivery of property',
    chapter: 'Chapter XVII - Of Offences Against Property',
    predecessorSection: 'IPC Section 415 & Section 420',
    content: '(1) Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property... commits cheating. (4) Whoever cheats and thereby dishonestly induces the person deceived to deliver any property, or to make, alter or destroy the whole or any part of a valuable security... shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
    explanation: 'Consolidates definition of cheating and aggravated fraudulent inducement into a structured provision replacing historical IPC 415 and 420.',
    punishment: 'Simple cheating: up to 3 years. Aggravated under sub-sec (4): up to 7 years and fine.',
    bailable: 'Sub-sec (4) is Non-Bailable',
    cognizable: 'Cognizable',
    compoundable: 'Compoundable with permission of Court',
    triableBy: 'Magistrate of the First Class',
    keyPoints: [
      'Deception and fraudulent inducement of victim',
      'Delivery of valuable security or movable/immovable property',
      'Equivalent to classic Section 420 IPC offence'
    ],
    relevanceTags: ['cheating', 'fraud', '420', 'dishonest inducement', 'valuable security', 'bns 318', 'ipc 420'],
    source: 'The Gazette of India No. 45, BNS 2023 Section 318',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250883.pdf',
    verified: true
  },
  {
    id: 'sec-bns-106',
    numericId: 5,
    actId: 'act-bns',
    actCode: 'BNS',
    sectionNumber: 'Section 106',
    title: 'Causing death by negligence (Rash driving & Hit and Run)',
    chapter: 'Chapter VI - Of Offences Affecting the Human Body',
    predecessorSection: 'IPC Section 304A',
    content: '(1) Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide, shall be punished with imprisonment of either description for a term which may extend to five years, and shall also be liable to fine; and if such act is done by a registered medical practitioner while performing medical procedure, he shall be punished with imprisonment of either description for a term which may extend to two years, and shall also be liable to fine. (2) Whoever causes the death of any person by rash and negligent driving of vehicle not amounting to culpable homicide, and escapes without reporting it to a police officer or a Magistrate soon after the incident, shall be punished with imprisonment of either description of a term which may extend to ten years, and shall also be liable to fine.',
    explanation: 'Upgrades punishment for general rash acts from 2 to 5 years, sets medical negligence at 2 years, and creates a stringent 10-year penalty for hit-and-run drivers who flee without reporting.',
    punishment: 'Sub-sec (1): up to 5 years (medical 2 years). Sub-sec (2) Hit & Run: up to 10 years and fine.',
    bailable: 'Sub-sec (1) Bailable; Sub-sec (2) Non-Bailable',
    cognizable: 'Cognizable',
    compoundable: 'Non-Compoundable',
    triableBy: 'Magistrate of the First Class',
    keyPoints: [
      'Calibrated punishment for medical practitioners following Jacob Mathew principles',
      'Strict 10-year deterrent penalty for hit-and-run evasion',
      'Replaces IPC 304A'
    ],
    relevanceTags: ['negligence', 'rash driving', 'hit and run', 'medical negligence', 'jacob mathew', 'bns 106', 'ipc 304a'],
    source: 'The Gazette of India No. 45, BNS 2023 Section 106',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250883.pdf',
    verified: true
  },

  // BNSS Sections
  {
    id: 'sec-bnss-482',
    numericId: 6,
    actId: 'act-bnss',
    actCode: 'BNSS',
    sectionNumber: 'Section 482',
    title: 'Direction for grant of bail to person apprehending arrest (Anticipatory Bail)',
    chapter: 'Chapter XXXV - Provisions as to Bail and Bonds',
    predecessorSection: 'CrPC Section 438',
    content: '(1) Where any person has reason to believe that he may be arrested on accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction under this section that in the event of such arrest he shall be released on bail; and that Court may, after taking into consideration, inter alia, the following factors: (i) the nature and gravity of the accusation; (ii) the antecedents of the applicant; (iii) the possibility of the applicant to flee from justice; (iv) whether the accusation has been made with the object of injuring or humiliating the applicant by having him so arrested, either reject the application forthwith or issue an interim order for the grant of anticipatory bail.',
    explanation: 'Empowers Sessions Courts and High Courts to grant pre-arrest protection to prevent unlawful harassment, humiliation, and arbitrary deprivation of liberty under Article 21.',
    punishment: 'Procedural Bail Mechanism (Protective Order)',
    bailable: 'Judicial Discretionary Relief for Non-Bailable Offences',
    cognizable: 'Applicable in Cognizable Non-Bailable Cases',
    compoundable: 'N/A (Procedural)',
    triableBy: 'High Court or Court of Session',
    keyPoints: [
      'Apprehension of arrest must be based on reasonable grounds, not vague fear',
      'Court must balance personal liberty against legitimate investigation requirements',
      'Incorporates Arnesh Kumar and Gurbaksh Singh Sibbia protective doctrines'
    ],
    relevanceTags: ['anticipatory bail', 'pre-arrest bail', 'bail rules', 'bnss 482', 'crpc 438', 'section 482 bnss', 'anticipatory bail rules', 'custodial interrogation'],
    source: 'The Gazette of India No. 46, BNSS 2023 Section 482',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250884.pdf',
    verified: true
  },
  {
    id: 'sec-bnss-173',
    numericId: 7,
    actId: 'act-bnss',
    actCode: 'BNSS',
    sectionNumber: 'Section 173',
    title: 'Information in cognizable cases (FIR, e-FIR, and Zero FIR)',
    chapter: 'Chapter XIII - Information to the Police and Their Powers to Investigate',
    predecessorSection: 'CrPC Section 154',
    content: '(1) Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced to writing as aforesaid, shall be signed by the person giving it. Provided that if the information is given by the woman against whom an offence under specified sections is alleged... such information shall be recorded by a woman police officer... Provided further that such information may be given electronically (e-FIR), irrespective of jurisdiction (Zero FIR), to be signed within three days by the informant.',
    explanation: 'Mandatory FIR registration mechanism codifying the Lalita Kumari constitutional mandate and introducing statutory recognition for Zero FIR and electronic FIR (e-FIR).',
    punishment: 'Mandatory statutory duty of police officer',
    bailable: 'N/A (Procedural)',
    cognizable: 'Directly applies to Cognizable Crimes',
    compoundable: 'N/A',
    triableBy: 'Officer in charge of Police Station / Judicial Magistrate',
    keyPoints: [
      'Mandatory registration upon disclosure of cognizable offence (Lalita Kumari)',
      'Statutory recognition of Zero FIR across India',
      'Electronic FIR recording with 3-day verification protocol'
    ],
    relevanceTags: ['fir', 'e-fir', 'zero fir', 'lalita kumari', 'mandatory fir', 'bnss 173', 'crpc 154', 'first information report'],
    source: 'The Gazette of India No. 46, BNSS 2023 Section 173',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250884.pdf',
    verified: true
  },
  {
    id: 'sec-bnss-35',
    numericId: 8,
    actId: 'act-bnss',
    actCode: 'BNSS',
    sectionNumber: 'Section 35',
    title: 'When police may arrest without warrant and Notice of Appearance',
    chapter: 'Chapter V - Arrest of Persons',
    predecessorSection: 'CrPC Section 41 & Section 41A',
    content: '(1) Any police officer may without an order from a Magistrate and without a warrant, arrest any person who commits in his presence a cognizable offence... (3) The police officer shall, in all cases where the arrest of a person is not required under sub-section (1), issue a notice directing the person against whom a reasonable complaint has been made, or credible information has been received, to appear before him or at such other place as may be specified in the notice.',
    explanation: 'Strict statutory curbs on arbitrary arrests for offences punishable with imprisonment up to 7 years, codifying Arnesh Kumar checklist and D.K. Basu guidelines.',
    punishment: 'Investigative restraint safeguards',
    bailable: 'Procedural statutory guarantee',
    cognizable: 'Regulates arrest in Cognizable offences',
    compoundable: 'N/A',
    triableBy: 'Magistrate / Investigating Agency',
    keyPoints: [
      'Mandatory issuance of Notice of Appearance under Section 35(3) for offences < 7 years',
      'Investigating officer must record written reasons for making or not making arrest',
      'Non-compliance attracts departmental and contempt proceedings (Arnesh Kumar)'
    ],
    relevanceTags: ['arrest rules', 'notice of appearance', 'arnesh kumar', 'section 35 bnss', 'crpc 41a', 'dk basu', 'custodial arrest'],
    source: 'The Gazette of India No. 46, BNSS 2023 Section 35',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250884.pdf',
    verified: true
  },

  // BSA & IEA Sections
  {
    id: 'sec-bsa-63',
    numericId: 9,
    actId: 'act-bsa',
    actCode: 'BSA',
    sectionNumber: 'Section 63',
    title: 'Admissibility of electronic records and Certificate requirements',
    chapter: 'Chapter V - Of Documentary and Electronic Evidence',
    predecessorSection: 'IEA Section 65B',
    content: '(1) Notwithstanding anything contained in this Adhiniyam, any information contained in an electronic record which is printed on a paper, stored, recorded or copied in optical or magnetic media or each produced by a computer... shall be deemed to be also a document, if the conditions mentioned in this section are satisfied... (4) In any proceedings where it is desired to give a statement in evidence by virtue of this section, a certificate doing any of the following things, that is to say, (a) identifying the electronic record containing the statement... (c) giving such particulars of any device involved... signed by a person in charge of the device or an expert, shall be submitted as specified in the Schedule.',
    explanation: 'Modernizes electronic evidence admissibility, clarifying statutory conditions, device custody, and standardizing the digital certificate in the Schedule pursuant to Arjun Panditrao Supreme Court precedent.',
    punishment: 'Evidence admissibility standard',
    bailable: 'N/A (Evidentiary Rule)',
    cognizable: 'N/A',
    compoundable: 'N/A',
    triableBy: 'All Courts receiving electronic evidence',
    keyPoints: [
      'Replaces Section 65B of Indian Evidence Act',
      'Statutory electronic certificate mandatory for secondary electronic evidence',
      'Certificate format standardized in Part A and Part B of BSA Schedule'
    ],
    relevanceTags: ['electronic evidence', 'section 65b vs 63', 'bsa 63', 'iea 65b', 'certificate 65b', 'digital evidence', 'arjun panditrao', 'cctv phone evidence'],
    source: 'The Gazette of India No. 47, BSA 2023 Section 63',
    sourceUrl: 'https://www.egazette.gov.in/WriteReadData/2023/250885.pdf',
    verified: true
  },
  {
    id: 'sec-iea-65b',
    numericId: 10,
    actId: 'act-iea',
    actCode: 'IEA',
    sectionNumber: 'Section 65B',
    title: 'Admissibility of electronic records (Predecessor Certificate Standard)',
    chapter: 'Chapter V - Of Documentary Evidence',
    replacedBy: 'BSA Section 63',
    content: '(1) Notwithstanding anything contained in this Act, any information contained in an electronic record which is printed on a paper, stored, recorded or copied in optical or magnetic media produced by a computer shall be deemed to be also a document... (4) In any proceedings where it is desired to give a statement in evidence by virtue of this section, a certificate doing any of the following things... signed by a person occupying a responsible official position in relation to the operation of the relevant device shall be evidence.',
    explanation: 'Historical evidence provision requiring mandatory certificate for computer outputs, leading to major Supreme Court rulings in Anvar P.V. and Arjun Panditrao.',
    punishment: 'Evidentiary threshold rule',
    bailable: 'N/A',
    cognizable: 'N/A',
    compoundable: 'N/A',
    triableBy: 'All Courts',
    keyPoints: [
      'Mandatory certificate condition established in Arjun Panditrao (2020)',
      'Substituted and restructured by BSA 2023 Section 63'
    ],
    relevanceTags: ['section 65b vs 63', 'iea 65b', 'electronic evidence', 'anvar pv', 'arjun panditrao'],
    source: 'India Code Repository, Indian Evidence Act 1872',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2188',
    verified: true
  },

  // Constitution of India Articles
  {
    id: 'sec-coi-21',
    numericId: 11,
    actId: 'act-coi',
    actCode: 'COI',
    sectionNumber: 'Article 21',
    title: 'Protection of life and personal liberty (Right to Privacy & Due Process)',
    chapter: 'Part III - Fundamental Rights',
    content: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
    explanation: 'The paramount constitutional fountainhead of rights in India. Expanded by Supreme Court jurisprudence in Maneka Gandhi (procedure must be just, fair and reasonable) and Puttaswamy (incorporates Fundamental Right to Privacy, bodily autonomy, and informational self-determination).',
    punishment: 'Constitutional protection; violation actionable under Article 32 & 226',
    bailable: 'Constitutional Fundamental Right',
    cognizable: 'Directly enforceable via Writ Jurisdiction',
    compoundable: 'Inalienable Fundamental Right',
    triableBy: 'Supreme Court of India (Art 32) & High Courts (Art 226)',
    keyPoints: [
      'Right to Privacy declared fundamental facet of Article 21 (Puttaswamy 9-judge bench)',
      'Procedure established by law must be just, fair and reasonable (Maneka Gandhi)',
      'Encompasses right to dignity, clean environment, speedy trial, and legal aid'
    ],
    relevanceTags: ['right to privacy article 21', 'article 21', 'privacy', 'personal liberty', 'puttaswamy', 'maneka gandhi', 'fundamental rights', 'golden triangle'],
    source: 'The Constitution of India, Ministry of Law and Justice',
    sourceUrl: 'https://legislative.gov.in/constitution-of-india/',
    verified: true
  },
  {
    id: 'sec-coi-14',
    numericId: 12,
    actId: 'act-coi',
    actCode: 'COI',
    sectionNumber: 'Article 14',
    title: 'Equality before law and equal protection of the laws',
    chapter: 'Part III - Fundamental Rights',
    content: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
    explanation: 'Guarantees equality and non-arbitrariness in state action, striking down capricious legislation and administrative discretion (E.P. Royappa doctrine).',
    punishment: 'Constitutional Fundamental Right',
    bailable: 'Constitutional Injunction against State Arbitrariness',
    cognizable: 'Enforceable under Art 32 & 226',
    compoundable: 'Inalienable Right',
    triableBy: 'Constitutional Courts',
    keyPoints: [
      'Strikes down manifest arbitrariness (Shayara Bano)',
      'Forms Golden Triangle with Articles 19 and 21 (Maneka Gandhi)'
    ],
    relevanceTags: ['article 14', 'equality', 'non-arbitrariness', 'golden triangle', 'maneka gandhi', 'fundamental rights'],
    source: 'The Constitution of India, Ministry of Law and Justice',
    sourceUrl: 'https://legislative.gov.in/constitution-of-india/',
    verified: true
  },

  // IT Act Sections
  {
    id: 'sec-it-66a',
    numericId: 13,
    actId: 'act-it',
    actCode: 'IT Act',
    sectionNumber: 'Section 66A',
    title: 'Punishment for sending offensive messages through communication service (Struck Down)',
    chapter: 'Chapter XI - Offences',
    content: '[Struck down as Unconstitutional by Supreme Court in Shreya Singhal v. Union of India (2015) 5 SCC 1] Any person who sends, by means of a computer resource or a communication device,— (a) any information that is grossly offensive or has menacing character; or (b) any information which he knows to be false, but for the purpose of causing annoyance, inconvenience, danger... shall be punishable with imprisonment for a term which may extend to three years and with fine.',
    explanation: 'Declared completely unconstitutional and void ab initio in Shreya Singhal (2015) for violating Article 19(1)(a) due to vagueness, overbreadth, and chilling effect on free speech.',
    punishment: 'Void / Struck Down (Historically up to 3 years and fine)',
    bailable: 'Unconstitutional / Void',
    cognizable: 'Invalidated',
    compoundable: 'N/A',
    triableBy: 'Void provision',
    keyPoints: [
      'Landmark judicial invalidation in Shreya Singhal (2015)',
      'Clear and present danger & chilling effect doctrine established for digital platforms'
    ],
    relevanceTags: ['section 66a', 'it act 66a', 'shreya singhal', 'online speech', 'free speech', 'digital liberty'],
    source: 'Supreme Court Judgment (2015) 5 SCC 1 / MeitY Official Notification',
    sourceUrl: 'https://main.sci.gov.in/judgment/judis/42491.pdf',
    verified: true
  },
  {
    id: 'sec-it-43a',
    numericId: 14,
    actId: 'act-it',
    actCode: 'IT Act',
    sectionNumber: 'Section 43A',
    title: 'Compensation for failure to protect sensitive personal data',
    chapter: 'Chapter IX - Penalties and Adjudication',
    content: 'Where a body corporate, possessing, dealing or handling any sensitive personal data or information in a computer resource which it owns, controls or operates, is negligent in implementing and maintaining reasonable security practices and procedures and thereby causes wrongful loss or wrongful gain to any person, such body corporate shall be liable to pay damages by way of compensation to the person so affected.',
    explanation: 'Imposes civil liability and damages on corporate entities that fail to secure sensitive personal data and biometrics, serving as early data protection anchor.',
    punishment: 'Civil damages and compensation without statutory ceiling.',
    bailable: 'Civil Adjudication',
    cognizable: 'Adjudicated by IT Adjudicating Officer',
    compoundable: 'Yes',
    triableBy: 'Adjudicating Officer appointed under IT Act',
    keyPoints: [
      'Strict corporate liability for sensitive personal data breach',
      'Requires implementation of reasonable security practices'
    ],
    relevanceTags: ['data protection', 'data breach', 'section 43a', 'privacy', 'corporate liability'],
    source: 'India Code / MeitY IT Act 2000',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/1999',
    verified: true
  },

  // POCSO Act Sections
  {
    id: 'sec-pocso-3-4',
    numericId: 15,
    actId: 'act-pocso',
    actCode: 'POCSO',
    sectionNumber: 'Section 3 & 4',
    title: 'Penetrative sexual assault and punishment for penetrative sexual assault',
    chapter: 'Chapter II - Offences Against Children',
    content: 'Section 3 defines penetrative sexual assault upon a child under 18 years of age. Section 4 provides: Whoever commits penetrative sexual assault shall be punished with imprisonment of either description for a term which shall not be less than ten years but which may extend to imprisonment for life, and shall also be liable to fine.',
    explanation: 'Special statutory offence safeguarding all children below eighteen years from sexual assault with gender-neutral victim framework and mandatory minimum sentencing.',
    punishment: 'Rigorous imprisonment of minimum 10 years extending to life imprisonment, and fine.',
    bailable: 'Non-Bailable',
    cognizable: 'Cognizable',
    compoundable: 'Non-Compoundable',
    triableBy: 'Special POCSO Court / Sessions Court',
    keyPoints: [
      'Gender neutral definition of child under age 18',
      'Mandatory minimum sentence of 10 years',
      'Statutory reverse presumption under Section 29'
    ],
    relevanceTags: ['pocso', 'child protection', 'sexual assault', 'section 4 pocso', 'special court'],
    source: 'India Code / Ministry of Women & Child Development',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2079',
    verified: true
  },

  // Consumer Protection Act Sections
  {
    id: 'sec-cpa-84',
    numericId: 16,
    actId: 'act-cpa',
    actCode: 'CPA',
    sectionNumber: 'Section 84',
    title: 'Liability of product manufacturer under Product Liability Action',
    chapter: 'Chapter VI - Product Liability',
    content: 'A product manufacturer shall be liable in a product liability action, if— (a) the product contains a manufacturing defect; or (b) the product is defective in design; or (c) there is a deviation from manufacturing specifications; or (d) the product does not conform to the express warranty; or (e) the product fails to contain adequate instructions of correct usage to prevent any harm or any warning regarding improper or incorrect usage.',
    explanation: 'Introduces strict product liability holding manufacturers, sellers, and e-commerce platforms accountable for defective goods and harmful design.',
    punishment: 'Statutory damages, recall orders, compensation, and punitive liability.',
    bailable: 'Civil / Consumer Redressal Action',
    cognizable: 'Consumer Dispute Forum',
    compoundable: 'Settlement through mediation permissible under Section 37',
    triableBy: 'District / State / National Consumer Disputes Redressal Commission',
    keyPoints: [
      'Strict product liability without necessity of proving subjective malice',
      'Covers manufacturing defect, design defect, and failure to warn',
      'Enforceable across online e-commerce platforms'
    ],
    relevanceTags: ['consumer protection', 'product liability', 'defective goods', 'manufacturer liability', 'cpa 84'],
    source: 'Department of Consumer Affairs, CPA 2019 Notification',
    sourceUrl: 'https://consumeraffairs.nic.in/acts-and-rules/consumer-protection',
    verified: true
  }
];

// All 11 Landmark Cases
const cases = [
  {
    id: 'case-kesavananda',
    numericId: 1,
    caseName: 'Kesavananda Bharati Sripadagalvaru v. State of Kerala',
    citation: '(1973) 4 SCC 225 : AIR 1973 SC 1461',
    court: 'Supreme Court of India',
    bench: '13-Judge Constitutional Bench (S.M. Sikri C.J., J.M. Shelat, K.S. Hegde, A.N. Grover, A.N. Ray, P.J. Reddy, D.G. Palekar, H.R. Khanna, K.K. Mathew, M.H. Beg, S.N. Dwivedi, A.K. Mukherjea, Y.V. Chandrachud JJ.)',
    judgmentDate: '24 April 1973',
    year: 1973,
    legalTopics: ['Basic Structure Doctrine', 'Article 368', 'Constitutional Amendment Limits', 'Judicial Review'],
    analysis: {
      facts: 'His Holiness Kesavananda Bharati, head of the Edneer Mutt in Kerala, challenged the Kerala Land Reforms Amendment Acts of 1969 and 1971 under Article 26 of the Constitution regarding property management rights. During the pendency, Parliament passed the 24th, 25th, and 29th Constitutional Amendments curtailing property rights and expanding Article 368 amending powers.',
      issues: '1. What is the scope and extent of Parliament\'s constituent power to amend the Constitution under Article 368?\n2. Can Parliament amend or abrogate Fundamental Rights?\n3. Is there an inherent or implied limitation on the amending power under Article 368?',
      arguments: {
        petitioner: 'Nani Palkhivala submitted that the power to amend under Article 368 is not absolute or unlimited. Parliament cannot destroy the identity or foundational democratic framework of the Constitution under the guise of an amendment.',
        respondent: 'Union of India and State of Kerala contended that Article 368 confers plenary constituent power without any express or implied limitations, enabling Parliament to alter any provision including fundamental rights.'
      },
      decision: 'By a historic 7:6 majority, the 13-judge Bench held that while Parliament has wide powers to amend any part of the Constitution under Article 368, it cannot alter, emasculate, or destroy the "Basic Structure" of the Constitution.',
      reasoning: 'The word "amendment" implies that the original foundation must survive the change. Core features such as the supremacy of the Constitution, republican and democratic form of government, secular character, separation of powers, and judicial review form the inviolable basic structure.'
    },
    precedentsReferred: ['Golak Nath v. State of Punjab (1967)', 'Sajjan Singh v. State of Rajasthan (1965)', 'Shankari Prasad v. Union of India (1951)'],
    overruledCases: ['Golak Nath v. State of Punjab (1967) (partially)'],
    source: 'Supreme Court of India Official Archives / SCC Online (1973) 4 SCC 225',
    sourceUrl: 'https://main.sci.gov.in/judgment/judis/4946.pdf',
    verified: true
  },
  {
    id: 'case-puttaswamy',
    numericId: 2,
    caseName: 'Justice K.S. Puttaswamy (Retd.) v. Union of India',
    citation: '(2017) 10 SCC 1 : AIR 2017 SC 4161',
    court: 'Supreme Court of India',
    bench: '9-Judge Constitutional Bench (J.S. Khehar C.J., J. Chelameswar, S.A. Bobde, R.K. Agrawal, R.F. Nariman, A.M. Sapre, D.Y. Chandrachud, S.K. Kaul, S. Abdul Nazeer JJ.)',
    judgmentDate: '24 August 2017',
    year: 2017,
    legalTopics: ['Right to Privacy', 'Article 21', 'Informational Privacy', 'Biometric Surveillance', 'Proportionality Test'],
    analysis: {
      facts: 'A 91-year-old retired High Court Judge, Justice K.S. Puttaswamy, challenged the constitutional validity of the Union\'s mandatory Aadhaar biometric identification scheme, arguing that collecting biometrics and iris scans without statutory data safeguards infringed citizens\' fundamental right to privacy.',
      issues: '1. Is the Right to Privacy guaranteed as an independent Fundamental Right under Part III of the Constitution?\n2. Are the earlier judgments in M.P. Sharma (8-Judge) and Kharak Singh (6-Judge) declaring no fundamental right to privacy good law?',
      arguments: {
        petitioner: 'Senior Advocates Gopal Subramanium, Shyam Divan and Arvind Datar argued that privacy is an inalienable natural right intrinsic to human dignity, liberty, and personal autonomy protected by Articles 14, 19, and 21.',
        respondent: 'Attorney General for India argued that the Constitution does not explicitly enumerate privacy as a fundamental right and that M.P. Sharma (1954) and Kharak Singh (1962) settled that privacy is merely a common law right subject to state welfare prioritization.'
      },
      decision: 'A unanimous 9-judge bench declared that the Right to Privacy is a Fundamental Right guaranteed under Article 21 and the overarching architecture of Part III of the Constitution.',
      reasoning: 'Privacy includes spatial privacy, bodily autonomy, and informational privacy. Any State intrusion must satisfy the threefold proportionality test: (i) Legality (backed by statutory law), (ii) Legitimate State Aim, and (iii) Proportionality (least restrictive means).'
    },
    precedentsReferred: ['Maneka Gandhi v. Union of India (1978)', 'Govind v. State of M.P. (1975)', 'Selvi v. State of Karnataka (2010)'],
    overruledCases: ['M.P. Sharma v. Satish Chandra (1954)', 'Kharak Singh v. State of U.P. (1962) (in so far as it held privacy is not a fundamental right)', 'ADM Jabalpur v. Shivkant Shukla (1976)'],
    source: 'Supreme Court Reports (2017) 10 SCC 1 / SCI Neutral Citation 2017 INSC 644',
    sourceUrl: 'https://main.sci.gov.in/supremecourt/2012/35071/35071_2012_Judgement_24-Aug-2017.pdf',
    verified: true
  },
  {
    id: 'case-maneka',
    numericId: 3,
    caseName: 'Maneka Gandhi v. Union of India',
    citation: '(1978) 1 SCC 248 : AIR 1978 SC 597',
    court: 'Supreme Court of India',
    bench: '7-Judge Constitutional Bench (M.H. Beg C.J., Y.V. Chandrachud, P.N. Bhagwati, V.R. Krishna Iyer, N.L. Untwalia, S. Murtaza Fazal Ali, P.S. Kailasam JJ.)',
    judgmentDate: '25 January 1978',
    year: 1978,
    legalTopics: ['Article 21', 'Due Process of Law', 'Golden Triangle', 'Natural Justice', 'Personal Liberty'],
    analysis: {
      facts: 'The passport of journalist Maneka Gandhi was impounded by the Regional Passport Office, New Delhi, under Section 10(3)(c) of the Passports Act in public interest without assigning any reason or providing prior opportunity of hearing.',
      issues: '1. Does the impounding of passport without a hearing violate Article 21 and principles of natural justice?\n2. Must "procedure established by law" under Article 21 satisfy the standards of fairness, justice, and reasonableness?',
      arguments: {
        petitioner: 'Argued that the right to travel abroad is an integral part of personal liberty under Article 21 and the audi alteram partem rule was violated.',
        respondent: 'The Union argued that Section 10(3)(c) authorized impounding without pre-decisional hearing in the interests of general public and Article 21 only required enacted statutory procedure (relying on A.K. Gopalan).'
      },
      decision: 'The 7-judge bench held that personal liberty under Article 21 cannot be deprived by mere formal statutory enactment. The procedure established by law must be "right, just and fair and not arbitrary, fanciful or oppressive".',
      reasoning: 'Articles 14, 19, and 21 form an interconnected "Golden Triangle". A law depriving personal liberty under Article 21 must also satisfy the non-arbitrariness mandate of Article 14 and reasonable restrictions of Article 19.'
    },
    precedentsReferred: ['Satwant Singh Sawhney v. D. Ramarathnam (1967)', 'E.P. Royappa v. State of Tamil Nadu (1974)'],
    overruledCases: ['A.K. Gopalan v. State of Madras (1950)'],
    source: 'Supreme Court Records (1978) 1 SCC 248',
    sourceUrl: 'https://main.sci.gov.in/judgment/judis/5238.pdf',
    verified: true
  },
  {
    id: 'case-navtej',
    numericId: 4,
    caseName: 'Navtej Singh Johar v. Union of India',
    citation: '(2018) 10 SCC 1 : AIR 2018 SC 4321',
    court: 'Supreme Court of India',
    bench: '5-Judge Constitutional Bench (Dipak Misra C.J., R.F. Nariman, A.M. Khanwilkar, D.Y. Chandrachud, Indu Malhotra JJ.)',
    judgmentDate: '6 September 2018',
    year: 2018,
    legalTopics: ['Decriminalization of Section 377 IPC', 'Constitutional Morality', 'Sexual Orientation Privacy', 'Article 14, 15, 19, 21'],
    analysis: {
      facts: 'Dancer Navtej Singh Johar, journalist Sunil Mehra, chef Ritu Dalmia, and others filed writ petitions challenging Section 377 of the Indian Penal Code which criminalized consensual sexual acts of LGBTQ+ adults in private.',
      issues: '1. Does Section 377 IPC violate Articles 14, 15, 19(1)(a), and 21 of the Constitution to the extent it penalizes consensual sexual conduct between adults?\n2. Was Suresh Kumar Koushal v. Naz Foundation correctly decided?',
      arguments: {
        petitioner: 'Counsel argued that sexual orientation is an intrinsic element of identity and privacy. Constitutional morality must supersede majoritarian popular morality.',
        respondent: 'Certain religious groups argued that Section 377 protects public health and morals, and judicial alteration of penal provisions violates separation of powers.'
      },
      decision: 'The 5-judge bench unanimously struck down Section 377 IPC to the extent it criminalized consensual sexual acts between adults in private.',
      reasoning: 'Constitutional morality requires the protection of minority rights against societal prejudice. Autonomy in intimate relationships is protected under Puttaswamy privacy jurisprudence.'
    },
    precedentsReferred: ['Justice K.S. Puttaswamy v. Union of India (2017)', 'NALSA v. Union of India (2014)', 'Shafin Jahan v. Asokan K.M. (2018)'],
    overruledCases: ['Suresh Kumar Koushal v. Naz Foundation (2014) 1 SCC 1'],
    source: 'Supreme Court Reports (2018) 10 SCC 1',
    sourceUrl: 'https://main.sci.gov.in/supremecourt/2016/14961/14961_2016_Judgement_06-Sep-2018.pdf',
    verified: true
  },
  {
    id: 'case-shreya',
    numericId: 5,
    caseName: 'Shreya Singhal v. Union of India',
    citation: '(2015) 5 SCC 1 : AIR 2015 SC 1523',
    court: 'Supreme Court of India',
    bench: '2-Judge Bench (J. Chelameswar, Rohinton Fali Nariman JJ.)',
    judgmentDate: '24 March 2015',
    year: 2015,
    legalTopics: ['Freedom of Speech and Expression', 'Section 66A IT Act Struck Down', 'Chilling Effect', 'Article 19(1)(a) & 19(2)', 'Intermediary Guidelines'],
    analysis: {
      facts: 'Following the arrest of two young women in Maharashtra for posting comments on social media questioning the shutdown of Mumbai, law student Shreya Singhal challenged the constitutional validity of Section 66A of the Information Technology Act, 2000.',
      issues: '1. Is Section 66A of the IT Act unconstitutionally vague and violative of the right to freedom of speech and expression under Article 19(1)(a)?\n2. Does Section 66A fall within the permissible reasonable restrictions of Article 19(2)?',
      arguments: {
        petitioner: 'Argued that terms like "grossly offensive", "annoyance", and "inconvenience" are undefined, creating a severe chilling effect on internet speech and failing the clear and present danger test.',
        respondent: 'The Union argued that the internet is a pervasive medium requiring statutory guardrails against inflammatory speech and that the provision could be interpreted narrowly.'
      },
      decision: 'The Supreme Court struck down Section 66A of the IT Act in its entirety as unconstitutional and void.',
      reasoning: 'The Court distinguished between discussion, advocacy, and incitement. Mere advocacy or annoyance does not justify restriction under Article 19(2). Section 66A was hopelessly open-ended and created an unconstitutional chilling effect.'
    },
    precedentsReferred: ['Maneka Gandhi v. Union of India (1978)', 'Romesh Thappar v. State of Madras (1950)', 'Kedar Nath Singh v. State of Bihar (1962)'],
    overruledCases: [],
    source: 'Supreme Court Records (2015) 5 SCC 1',
    sourceUrl: 'https://main.sci.gov.in/judgment/judis/42491.pdf',
    verified: true
  },
  {
    id: 'case-dk-basu',
    numericId: 6,
    caseName: 'D.K. Basu v. State of West Bengal',
    citation: '(1997) 1 SCC 416 : AIR 1997 SC 610',
    court: 'Supreme Court of India',
    bench: '2-Judge Bench (Kuldip Singh, A.S. Anand JJ.)',
    judgmentDate: '18 December 1996',
    year: 1997,
    legalTopics: ['Arrest Guidelines', 'Custodial Violence Safeguards', 'Article 21 & 22', 'Inspection Memo', 'Intimation to Relatives'],
    analysis: {
      facts: 'Executive Chairman of Legal Aid Services, West Bengal, addressed a letter to the Chief Justice regarding widespread deaths and torture in police lockups and custody.',
      issues: '1. What preventive guidelines and enforceable safeguards should be instituted to eradicate custodial violence and arbitrary lockup deaths?\n2. Can monetary compensation be awarded for violation of fundamental rights in custody under Article 21?',
      arguments: {
        petitioner: 'Highlighted that custodial torture is a gross violation of human dignity under Article 21 and requires mandatory nationwide arrest protocols.',
        respondent: 'States acknowledged instances of abuse but raised challenges regarding evidence gathering and policing realities in heinous crime investigations.'
      },
      decision: 'The Supreme Court laid down 11 mandatory guidelines (the "D.K. Basu Guidelines") to be strictly followed by police and investigating agencies in all cases of arrest and detention.',
      reasoning: 'Custodial torture strikes at the heart of the rule of law. The 11 guidelines mandate: identification badges for arresting personnel, preparation of memo of arrest, right to inform a friend/relative within 8–12 hours, medical examination every 48 hours, and transmission of records to the area magistrate.'
    },
    precedentsReferred: ['Nilabati Behera v. State of Orissa (1993)', 'Joginder Kumar v. State of U.P. (1994)'],
    overruledCases: [],
    source: 'Supreme Court Reports (1997) 1 SCC 416',
    sourceUrl: 'https://main.sci.gov.in/judgment/judis/13354.pdf',
    verified: true
  },
  {
    id: 'case-arnesh',
    numericId: 7,
    caseName: 'Arnesh Kumar v. State of Bihar',
    citation: '(2014) 8 SCC 273 : AIR 2014 SC 2756',
    court: 'Supreme Court of India',
    bench: '2-Judge Bench (Chandramauli Kr. Prasad, Pinaki Chandra Ghose JJ.)',
    judgmentDate: '2 July 2014',
    year: 2014,
    legalTopics: ['Section 41A CrPC Notice', 'Section 35 BNSS', 'Arrest Safeguards', 'Anti-Dowry Section 498A Check', 'Custodial Restraint'],
    analysis: {
      facts: 'Petitioner sought anticipatory bail in an FIR lodged by his wife alleging offences under Section 498A IPC and Section 4 Dowry Prohibition Act, highlighting routine mechanical arrests without verification.',
      issues: '1. Should police officers automatically effect arrest upon registration of FIR for offences punishable with imprisonment up to 7 years?\n2. What is the mandatory nature of Section 41A CrPC notice and Magistrate scrutiny under Section 167?',
      arguments: {
        petitioner: 'Argued that power of arrest is frequently misused as a tool of harassment and extortion in matrimonial disputes, bypassing statutory checks in Section 41 CrPC.',
        respondent: 'State argued that police have statutory prerogative to arrest in cognizable cases to secure investigation.'
      },
      decision: 'The Supreme Court ruled that no arrest shall be made automatically when an offence is punishable with imprisonment up to 7 years without satisfying Section 41 checklist. Notice of appearance under Section 41A must be issued.',
      reasoning: 'Arrest brings humiliation and curtails freedom. Police officers must furnish reasons for arrest in writing and Magistrates must authorize detention only upon recorded satisfaction. Disregard of guidelines renders officers liable to departmental action and contempt of court.'
    },
    precedentsReferred: ['D.K. Basu v. State of West Bengal (1997)', 'Joginder Kumar v. State of U.P. (1994)'],
    overruledCases: [],
    source: 'Supreme Court Reports (2014) 8 SCC 273',
    sourceUrl: 'https://main.sci.gov.in/judgment/judis/41725.pdf',
    verified: true
  },
  {
    id: 'case-lalita',
    numericId: 8,
    caseName: 'Lalita Kumari v. Govt. of U.P.',
    citation: '(2014) 2 SCC 1 : AIR 2014 SC 187',
    court: 'Supreme Court of India',
    bench: '5-Judge Constitutional Bench (P. Sathasivam C.J., B.S. Chauhan, Ranjana P. Desai, Ranjan Gogoi, S.A. Bobde JJ.)',
    judgmentDate: '12 November 2013',
    year: 2014,
    legalTopics: ['Mandatory Registration of FIR', 'Section 154 CrPC', 'Section 173 BNSS', 'Cognizable Offence', 'Preliminary Inquiry Exceptions'],
    analysis: {
      facts: 'Lalita Kumari, a minor girl, was kidnapped. Her father approached the police station, but the police refused to register an FIR without demanding illegal gratification. A habeas corpus writ petition was filed.',
      issues: '1. Is police officer bound to register an FIR under Section 154 CrPC upon receiving information disclosing a cognizable offence?\n2. Can the police conduct a preliminary inquiry before registering FIR in cognizable matters?',
      arguments: {
        petitioner: 'Submitted that Section 154(1) uses the word "shall" and admits no discretion to refuse registration of FIR when cognizable offence is disclosed.',
        respondent: 'Several States argued that mechanical FIR registration leads to harassment and preliminary inquiry must be permissible to check frivolous complaints.'
      },
      decision: 'The 5-judge bench held that registration of an FIR is mandatory under Section 154 CrPC if the information discloses the commission of a cognizable offence.',
      reasoning: 'The statutory word "shall" reflects mandatory legislative intent. Preliminary inquiry is permissible only in exceptional cases (e.g. matrimonial disputes, medical negligence, commercial disputes, corruption, or 3-month unexplained delay) and must be completed within 7 days.'
    },
    precedentsReferred: ['State of Haryana v. Bhajan Lal (1992)', 'Ramesh Kumari v. State (NCT of Delhi) (2006)', 'D.K. Basu v. State of West Bengal (1997)'],
    overruledCases: [],
    source: 'Supreme Court Reports (2014) 2 SCC 1',
    sourceUrl: 'https://main.sci.gov.in/judgment/judis/41009.pdf',
    verified: true
  },
  {
    id: 'case-vishaka',
    numericId: 9,
    caseName: 'Vishaka v. State of Rajasthan',
    citation: '(1997) 6 SCC 241 : AIR 1997 SC 3011',
    court: 'Supreme Court of India',
    bench: '3-Judge Bench (J.S. Verma C.J., Sujata V. Manohar, B.N. Kirpal JJ.)',
    judgmentDate: '13 August 1997',
    year: 1997,
    legalTopics: ['Workplace Sexual Harassment', 'Vishaka Guidelines', 'Article 14, 19(1)(g), 21', 'CEDAW International Law Integration', 'POSH Act Origin'],
    analysis: {
      facts: 'Bhanwari Devi, a social worker in Rajasthan engaged in campaign against child marriage, was brutally gang-raped by influential men. Her quest for justice exposed the total absence of legislation safeguarding women against sexual harassment at workplaces.',
      issues: '1. Does workplace sexual harassment violate fundamental rights to gender equality (Art 14), non-discrimination (Art 15), right to practice profession (Art 19(1)(g)), and right to life with dignity (Art 21)?\n2. In the absence of domestic legislation, can the Court formulate legally binding guidelines incorporating international conventions like CEDAW?',
      arguments: {
        petitioner: 'Women\'s rights groups argued that the constitutional guarantee of gender equality requires a safe working environment and international treaties signed by India (CEDAW) must fill legislative vacuums.',
        respondent: 'Union and State supported formulating guidelines to protect working women across government and private sectors.'
      },
      decision: 'The Supreme Court formulated comprehensive guidelines (Vishaka Guidelines) defining sexual harassment and mandating Internal Complaints Committees (ICC) across all workplaces, having the force of law until statutory enactment (which led to the POSH Act 2013).',
      reasoning: 'In the absence of domestic law, international conventions and norms (CEDAW) consistent with fundamental rights can be directly integrated into domestic jurisprudence under Articles 14, 19(1)(g), and 21 read with Article 51(c).'
    },
    precedentsReferred: ['Maneka Gandhi v. Union of India (1978)', 'Nilabati Behera v. State of Orissa (1993)'],
    overruledCases: [],
    source: 'Supreme Court Reports (1997) 6 SCC 241',
    sourceUrl: 'https://main.sci.gov.in/judgment/judis/13898.pdf',
    verified: true
  },
  {
    id: 'case-jacob-mathew',
    numericId: 10,
    caseName: 'Jacob Mathew v. State of Punjab',
    citation: '(2005) 6 SCC 1 : AIR 2005 SC 3180',
    court: 'Supreme Court of India',
    bench: '3-Judge Bench (R.C. Lahoti C.J., G.P. Mathur, P.K. Balasubramanyan JJ.)',
    judgmentDate: '5 August 2005',
    year: 2005,
    legalTopics: ['Medical Negligence', 'Gross Negligence Standard', 'Section 304A IPC', 'Section 106 BNS', 'Bolam Test', 'Guidelines against Doctor Arrests'],
    analysis: {
      facts: 'A patient admitted in CMC Hospital Ludhiana died due to breathing difficulty when oxygen cylinder was found empty. The son filed a criminal complaint against doctors under Section 304A IPC for causing death by negligence.',
      issues: '1. What degree of negligence is required to establish criminal liability of medical professionals under Section 304A IPC?\n2. What procedural safeguards must precede the arrest and criminal prosecution of registered doctors?',
      arguments: {
        petitioner: 'Doctor challenged criminal proceedings, arguing that an accident or error of judgment in medical practice cannot be equated with criminal recklessness or gross negligence.',
        respondent: 'Complainant contended that failure to provide working oxygen supply in a critical emergency was culpable criminal omission.'
      },
      decision: 'The Supreme Court ruled that criminal medical negligence requires "gross negligence" or high degree of reckless disregard, not mere error of judgment. Laid down mandatory safeguards prohibiting arrest of doctors without an independent medical board opinion.',
      reasoning: 'To prosecute a doctor criminally under Section 304A IPC / Section 106 BNS, the standard is gross incompetence or wanton negligence. An investigating officer must obtain an independent expert medical opinion before arresting or prosecuting a medical professional.'
    },
    precedentsReferred: ['Bolam v. Friern Hospital Management Committee [1957] 1 WLR 582', 'Dr. Suresh Gupta v. Govt. of NCT of Delhi (2004)'],
    overruledCases: [],
    source: 'Supreme Court Reports (2005) 6 SCC 1',
    sourceUrl: 'https://main.sci.gov.in/judgment/judis/27123.pdf',
    verified: true
  },
  {
    id: 'case-selvi',
    numericId: 11,
    caseName: 'Selvi v. State of Karnataka',
    citation: '(2010) 7 SCC 263 : AIR 2010 SC 1974',
    court: 'Supreme Court of India',
    bench: '3-Judge Bench (K.G. Balakrishnan C.J., R.V. Raveendran, J.M. Panchal JJ.)',
    judgmentDate: '5 May 2010',
    year: 2010,
    legalTopics: ['Narco-Analysis', 'Brain Mapping & Polygraph', 'Article 20(3) Self-Incrimination', 'Article 21 Mental Privacy', 'Involuntary Neuro-testing'],
    analysis: {
      facts: 'Multiple accused challenged trial court orders permitting investigative agencies to subject them involuntarily to modern neuro-technological tests: Narco-Analysis (Sodium Pentothal), Polygraph (Lie Detector), and Brain Electrical Activation Profile (BEAP / Brain Fingerprinting).',
      issues: '1. Does the involuntary administration of Narco-Analysis, Polygraph, and Brain Mapping violate the privilege against self-incrimination under Article 20(3)?\n2. Does forcible extraction of mental thoughts violate the right to personal liberty and mental privacy under Article 21?',
      arguments: {
        petitioner: 'Argued that compelling a person to undergo chemical narco-hypnosis extracts testimonial responses from subconscious mind in violation of Article 20(3) and violates cognitive privacy and bodily integrity.',
        respondent: 'Investigative agencies argued that these scientific techniques do not involve physical brutality and are vital for terrorism and organized crime investigations.'
      },
      decision: 'The Supreme Court held that no individual can be forcibly subjected to Narco-Analysis, Polygraph, or Brain Mapping tests without voluntary, informed consent. Involuntary tests violate Article 20(3) and Article 21.',
      reasoning: 'The right against self-incrimination protects mental silence and testimonial autonomy. Forcible intrusion into the mental domain of an individual constitutes cruel, inhuman, and degrading treatment infringing substantive privacy under Article 21.'
    },
    precedentsReferred: ['State of Bombay v. Kathi Kalu Oghad (1961) (distinguished)', 'M.P. Sharma v. Satish Chandra (1954)', 'Maneka Gandhi v. Union of India (1978)'],
    overruledCases: [],
    source: 'Supreme Court Reports (2010) 7 SCC 263',
    sourceUrl: 'https://main.sci.gov.in/judgment/judis/36306.pdf',
    verified: true
  }
];

// Precedent Relationships (Followed, Overruled, Distinguished, Referred)
const precedentRelationships = [
  {
    id: 'rel-1',
    numericId: 1,
    sourceCaseId: 'case-puttaswamy',
    sourceCaseName: 'Justice K.S. Puttaswamy v. Union of India (2017)',
    targetCaseId: 'case-maneka',
    targetCaseName: 'Maneka Gandhi v. Union of India (1978)',
    relationshipType: 'Followed',
    notes: 'The 9-judge bench in Puttaswamy followed Maneka Gandhi\'s expansive doctrine of substantive reasonableness and the Golden Triangle (Arts 14, 19, 21).',
    citation: '(2017) 10 SCC 1 at para 114',
    verified: true
  },
  {
    id: 'rel-2',
    numericId: 2,
    sourceCaseId: 'case-navtej',
    sourceCaseName: 'Navtej Singh Johar v. Union of India (2018)',
    targetCaseId: 'case-puttaswamy',
    targetCaseName: 'Justice K.S. Puttaswamy v. Union of India (2017)',
    relationshipType: 'Followed',
    notes: 'Navtej Johar applied Puttaswamy\'s holding that privacy encompasses identity, dignity, bodily autonomy, and consensual adult choices.',
    citation: '(2018) 10 SCC 1 at para 142',
    verified: true
  },
  {
    id: 'rel-3',
    numericId: 3,
    sourceCaseId: 'case-shreya',
    sourceCaseName: 'Shreya Singhal v. Union of India (2015)',
    targetCaseId: 'case-maneka',
    targetCaseName: 'Maneka Gandhi v. Union of India (1978)',
    relationshipType: 'Followed',
    notes: 'Applied Maneka Gandhi doctrine of non-arbitrariness and substantive reasonableness to digital speech rights under Article 19(1)(a).',
    citation: '(2015) 5 SCC 1 at para 43',
    verified: true
  },
  {
    id: 'rel-4',
    numericId: 4,
    sourceCaseId: 'case-arnesh',
    sourceCaseName: 'Arnesh Kumar v. State of Bihar (2014)',
    targetCaseId: 'case-dk-basu',
    targetCaseName: 'D.K. Basu v. State of West Bengal (1997)',
    relationshipType: 'Followed',
    notes: 'Followed D.K. Basu custodial safeguards, extending mandatory protective procedures against routine arrests under Section 41A CrPC / Section 35 BNSS.',
    citation: '(2014) 8 SCC 273 at para 11',
    verified: true
  },
  {
    id: 'rel-5',
    numericId: 5,
    sourceCaseId: 'case-lalita',
    sourceCaseName: 'Lalita Kumari v. Govt. of U.P. (2014)',
    targetCaseId: 'case-dk-basu',
    targetCaseName: 'D.K. Basu v. State of West Bengal (1997)',
    relationshipType: 'Followed',
    notes: 'Harmonized mandatory FIR registration with D.K. Basu rules on liberty and transparent police documentation.',
    citation: '(2014) 2 SCC 1 at para 115',
    verified: true
  },
  {
    id: 'rel-6',
    numericId: 6,
    sourceCaseId: 'case-vishaka',
    sourceCaseName: 'Vishaka v. State of Rajasthan (1997)',
    targetCaseId: 'case-maneka',
    targetCaseName: 'Maneka Gandhi v. Union of India (1978)',
    relationshipType: 'Followed',
    notes: 'Applied Maneka Gandhi\'s purposive interpretation of Article 21 to create workplace safety standards for working women.',
    citation: '(1997) 6 SCC 241 at para 14',
    verified: true
  },
  {
    id: 'rel-7',
    numericId: 7,
    sourceCaseId: 'case-navtej',
    sourceCaseName: 'Navtej Singh Johar v. Union of India (2018)',
    targetCaseId: 'case-suresh-koushal',
    targetCaseName: 'Suresh Kumar Koushal v. Naz Foundation (2014)',
    relationshipType: 'Overruled',
    notes: 'Expressly overruled Suresh Koushal, holding that judicial deference to majoritarian morality cannot abridge constitutional rights of minuscule minorities.',
    citation: '(2018) 10 SCC 1 at para 267',
    verified: true
  },
  {
    id: 'rel-8',
    numericId: 8,
    sourceCaseId: 'case-puttaswamy',
    sourceCaseName: 'Justice K.S. Puttaswamy v. Union of India (2017)',
    targetCaseId: 'case-mp-sharma',
    targetCaseName: 'M.P. Sharma v. Satish Chandra (1954)',
    relationshipType: 'Overruled',
    notes: 'Overruled M.P. Sharma and Kharak Singh to the extent they held there was no fundamental right to privacy in the Indian Constitution.',
    citation: '(2017) 10 SCC 1 at para 296',
    verified: true
  },
  {
    id: 'rel-9',
    numericId: 9,
    sourceCaseId: 'case-maneka',
    sourceCaseName: 'Maneka Gandhi v. Union of India (1978)',
    targetCaseId: 'case-ak-gopalan',
    targetCaseName: 'A.K. Gopalan v. State of Madras (1950)',
    relationshipType: 'Overruled',
    notes: 'Overruled A.K. Gopalan\'s narrow silo-view of fundamental rights, establishing that procedure in Article 21 must satisfy Articles 14 and 19.',
    citation: '(1978) 1 SCC 248 at para 56',
    verified: true
  },
  {
    id: 'rel-10',
    numericId: 10,
    sourceCaseId: 'case-selvi',
    sourceCaseName: 'Selvi v. State of Karnataka (2010)',
    targetCaseId: 'case-kathi-kalu',
    targetCaseName: 'State of Bombay v. Kathi Kalu Oghad (1961)',
    relationshipType: 'Distinguished',
    notes: 'Distinguished physical biometric identification (fingerprints/handwriting under Kathi Kalu) from forcible chemical extraction of testimonial thoughts via narco-analysis.',
    citation: '(2010) 7 SCC 263 at para 162',
    verified: true
  },
  {
    id: 'rel-11',
    numericId: 11,
    sourceCaseId: 'case-jacob-mathew',
    sourceCaseName: 'Jacob Mathew v. State of Punjab (2005)',
    targetCaseId: 'case-spring-meadows',
    targetCaseName: 'Spring Meadows Hospital v. Harjol Ahluwalia (1998)',
    relationshipType: 'Distinguished',
    notes: 'Distinguished civil tortious liability under Consumer Protection from the higher "gross negligence" threshold required for criminal liability under Section 304A IPC / Section 106 BNS.',
    citation: '(2005) 6 SCC 1 at para 28',
    verified: true
  },
  {
    id: 'rel-12',
    numericId: 12,
    sourceCaseId: 'case-kesavananda',
    sourceCaseName: 'Kesavananda Bharati v. State of Kerala (1973)',
    targetCaseId: 'case-golak-nath',
    targetCaseName: 'I.C. Golak Nath v. State of Punjab (1967)',
    relationshipType: 'Referred',
    notes: 'Referred and modified Golak Nath, upholding Parliament\'s power to amend fundamental rights subject to the Basic Structure Doctrine.',
    citation: '(1973) 4 SCC 225 at para 580',
    verified: true
  },
  {
    id: 'rel-13',
    numericId: 13,
    sourceCaseId: 'case-selvi',
    sourceCaseName: 'Selvi v. State of Karnataka (2010)',
    targetCaseId: 'case-puttaswamy',
    targetCaseName: 'Justice K.S. Puttaswamy v. Union of India (2017)',
    relationshipType: 'Referred',
    notes: 'Selvi\'s recognition of cognitive liberty and mental privacy was heavily cited by the 9-judge bench in Puttaswamy as foundational to Article 21 privacy.',
    citation: '(2017) 10 SCC 1 at para 192',
    verified: true
  }
];

// Rich Old Law -> New Law Mappings
const lawMappings = [
  {
    id: 'map-1',
    numericId: 1,
    category: 'Criminal Law Reform',
    oldAct: 'Indian Penal Code, 1860',
    oldSection: 'Section 302',
    oldTitle: 'Punishment for murder',
    newAct: 'Bharatiya Nyaya Sanhita, 2023',
    newSection: 'Section 103(1) & 103(2)',
    newTitle: 'Punishment for murder and mob lynching',
    oldProvision: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    newProvision: '(1) Whoever commits murder shall be punished with death or imprisonment for life, and fine. (2) When a group of five or more persons acting in concert commits murder on the ground of race, caste or community, sex, place of birth, language, personal belief... each shall be punished with death or imprisonment for life, and fine.',
    punishmentChange: 'Maintains Death or Life Imprisonment; explicitly establishes capital punishment / life term for Mob Lynching by 5+ persons.',
    importantDifferences: [
      'Introduces dedicated sub-section (2) explicitly penalizing mob lynching and hate-motivated group killings',
      'Provides statutory definition of joint liability for mob attacks',
      'Clarity in sentencing calibration'
    ],
    notes: 'Historic criminal reform addressing mob violence and lynching without diluting classical murder jurisprudence.',
    relevanceTags: ['murder', 'mob lynching', '302', '103', 'ipc to bns', 'capital punishment'],
    source: 'BNS 2023 Gazette / 2024 Law Commission Concordance Table',
    verified: true
  },
  {
    id: 'map-2',
    numericId: 2,
    category: 'Property Offences',
    oldAct: 'Indian Penal Code, 1860',
    oldSection: 'Section 378 & 379',
    oldTitle: 'Theft & Punishment for theft',
    newAct: 'Bharatiya Nyaya Sanhita, 2023',
    newSection: 'Section 303',
    newTitle: 'Theft and punishment for theft (with Community Service)',
    oldProvision: 'Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.',
    newProvision: 'Whoever commits theft shall be punished with imprisonment up to three years, or with fine, or with both; and in case of theft where stolen property value is less than ₹5,000 and the person is convicted for the first time, shall upon return of property or upon payment of value, be punished with community service.',
    punishmentChange: 'Introduces Community Service for first-time petty theft where stolen valuation is less than ₹5,000.',
    importantDifferences: [
      'Statutory institutionalization of Community Service as a reformative alternative',
      'Reduces unnecessary prison overcrowding for petty first-time offenders',
      'Restorative justice model requiring restitution or return of property'
    ],
    notes: 'Major penological advancement shifting minor property crimes toward reformative rehabilitation.',
    relevanceTags: ['theft', 'community service', 'petty theft', '379', '303', 'ipc to bns'],
    source: 'BNS 2023 Gazette / Section 303(2) Proviso',
    verified: true
  },
  {
    id: 'map-3',
    numericId: 3,
    category: 'Property Offences (Aggravated)',
    oldAct: 'Indian Penal Code, 1860',
    oldSection: 'Section 380',
    oldTitle: 'Theft in dwelling house, etc.',
    newAct: 'Bharatiya Nyaya Sanhita, 2023',
    newSection: 'Section 305',
    newTitle: 'Theft in dwelling house, building, tent or vessel',
    oldProvision: 'Whoever commits theft in any building, tent or vessel, which building, tent or vessel is used as a human dwelling, or used for the custody of property, shall be punished with imprisonment up to seven years, and fine.',
    newProvision: 'Whoever commits theft in any building, tent or vessel used as human dwelling or custody of property, or in any place of worship, shall be punished with imprisonment up to seven years, and shall also be liable to fine.',
    punishmentChange: 'Maintains up to 7 years imprisonment and mandatory fine; explicitly adds places of worship into the aggravated tier.',
    importantDifferences: [
      'Explicitly includes places of worship alongside residential dwellings',
      'Strict non-bailable classification maintained',
      'Clearer statutory structure'
    ],
    notes: 'Protects both private residential sanctuaries and public sacred spaces.',
    relevanceTags: ['theft in dwelling house', '380', '305', 'dwelling house', 'bns 305', 'ipc 380'],
    source: 'BNS 2023 Gazette Section 305',
    verified: true
  },
  {
    id: 'map-4',
    numericId: 4,
    category: 'Commercial & Fraud Offences',
    oldAct: 'Indian Penal Code, 1860',
    oldSection: 'Section 420',
    oldTitle: 'Cheating and dishonestly inducing delivery of property',
    newAct: 'Bharatiya Nyaya Sanhita, 2023',
    newSection: 'Section 318(4)',
    newTitle: 'Cheating and dishonestly inducing delivery of property',
    oldProvision: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property... shall be punished with imprisonment up to seven years, and fine.',
    newProvision: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property, or make, alter or destroy valuable security... shall be punished with imprisonment up to seven years, and fine.',
    punishmentChange: 'Retains rigorous/simple imprisonment up to 7 years and fine.',
    importantDifferences: [
      'Subsumes classic Section 420 into Section 318 sub-clause (4)',
      'Unified with basic cheating definitions under Section 318(1)',
      'Streamlines charge-framing under new code'
    ],
    notes: 'The ubiquitous Section 420 IPC is now Section 318(4) in BNS.',
    relevanceTags: ['cheating', '420', '318', 'fraud', 'valuable security', 'ipc 420'],
    source: 'BNS 2023 Gazette Section 318',
    verified: true
  },
  {
    id: 'map-5',
    numericId: 5,
    category: 'Criminal Procedure',
    oldAct: 'Code of Criminal Procedure, 1973',
    oldSection: 'Section 154',
    oldTitle: 'Information in cognizable cases (FIR)',
    newAct: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    newSection: 'Section 173',
    newTitle: 'Information in cognizable cases (FIR, e-FIR & Zero FIR)',
    oldProvision: 'Every information relating to the commission of a cognizable offence, if given orally, shall be reduced to writing by the officer in charge of a police station...',
    newProvision: 'Every information relating to cognizable offence may be given orally, in writing, or electronically (e-FIR) irrespective of territorial jurisdiction (Zero FIR). Electronic FIR to be signed within three days.',
    punishmentChange: 'Procedural Mandate: Police officer failing to register FIR faces prosecution under Section 199 BNS.',
    importantDifferences: [
      'Statutory formalization of Zero FIR across India',
      'Statutory mechanism for e-FIR with 3-day signature protocol',
      'Mandatory recording of women complaints by woman police officer'
    ],
    notes: 'Codifies Lalita Kumari constitutional mandate into express statutory text.',
    relevanceTags: ['fir', '154', '173', 'zero fir', 'e-fir', 'crpc to bnss', 'lalita kumari'],
    source: 'BNSS 2023 Gazette Section 173',
    verified: true
  },
  {
    id: 'map-6',
    numericId: 6,
    category: 'Criminal Procedure & Liberty',
    oldAct: 'Code of Criminal Procedure, 1973',
    oldSection: 'Section 438',
    oldTitle: 'Direction for grant of bail to person apprehending arrest (Anticipatory Bail)',
    newAct: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    newSection: 'Section 482',
    newTitle: 'Direction for grant of bail to person apprehending arrest',
    oldProvision: 'Where any person has reason to believe that he may be arrested on accusation of having committed a non-bailable offence, he may apply to the High Court or Court of Session...',
    newProvision: 'Where any person has reason to believe that he may be arrested on accusation of having committed a non-bailable offence, he may apply to High Court or Court of Session for pre-arrest bail after considering nature, gravity, antecedents, and bona fides.',
    punishmentChange: 'Procedural Bail Mechanism.',
    importantDifferences: [
      'Transferred from Section 438 CrPC to Section 482 BNSS',
      'Integrates statutory four-factor test in sub-clause (1)',
      'Provides clearer interim protection powers'
    ],
    notes: 'Preserves the vital constitutional safeguard of anticipatory bail.',
    relevanceTags: ['anticipatory bail', '438', '482', 'pre-arrest bail', 'crpc 438', 'bnss 482', 'anticipatory bail rules'],
    source: 'BNSS 2023 Gazette Section 482',
    verified: true
  },
  {
    id: 'map-7',
    numericId: 7,
    category: 'Evidence & Admissibility',
    oldAct: 'Indian Evidence Act, 1872',
    oldSection: 'Section 65B',
    oldTitle: 'Admissibility of electronic records',
    newAct: 'Bharatiya Sakshya Adhiniyam, 2023',
    newSection: 'Section 63',
    newTitle: 'Admissibility of electronic records and Certificate format',
    oldProvision: 'Any information contained in an electronic record produced by a computer shall be deemed to be a document... certificate required under sub-section (4).',
    newProvision: 'Electronic records are admissible as documents. Mandatory Certificate to be submitted as per format prescribed in Part A and Part B of the Schedule to the Adhiniyam.',
    punishmentChange: 'Admissibility standard.',
    importantDifferences: [
      'Provides standardized statutory Certificate format in the Schedule',
      'Explicitly recognizes modern devices, cloud storage, semiconductor memory, and distributed electronic records',
      'Integrates Arjun Panditrao Supreme Court precedent into statutory text'
    ],
    notes: 'The infamous Section 65B Certificate is now Section 63 BSA Certificate.',
    relevanceTags: ['electronic evidence', '65b', '63', 'bsa 63', 'iea 65b', 'section 65b vs 63', 'certificate 65b'],
    source: 'BSA 2023 Gazette Section 63 & Schedule',
    verified: true
  },
  {
    id: 'map-8',
    numericId: 8,
    category: 'Negligence & Traffic Law',
    oldAct: 'Indian Penal Code, 1860',
    oldSection: 'Section 304A',
    oldTitle: 'Causing death by negligence',
    newAct: 'Bharatiya Nyaya Sanhita, 2023',
    newSection: 'Section 106(1) & 106(2)',
    newTitle: 'Causing death by negligence (Medical & Hit-and-Run)',
    oldProvision: 'Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide, shall be punished with imprisonment up to two years, or fine, or both.',
    newProvision: '(1) General rash/negligent act: up to five years and fine. For registered medical practitioners: up to two years and fine. (2) Hit and Run: rash driving escaping without reporting to police/Magistrate: up to ten years and fine.',
    punishmentChange: 'Increased general negligence from 2 to 5 years; created 10-year term for Hit & Run failure to report; maintained 2 years for doctors.',
    importantDifferences: [
      'Stringent deterrent punishment for Hit-and-Run drivers fleeing accident scenes',
      'Statutory distinction protecting medical professionals during bona fide procedures',
      'Incorporates Jacob Mathew guidelines'
    ],
    notes: 'Substantial upgrade in vehicular manslaughter deterrence.',
    relevanceTags: ['negligence', '304a', '106', 'hit and run', 'medical negligence', 'ipc 304a', 'jacob mathew'],
    source: 'BNS 2023 Gazette Section 106',
    verified: true
  },
  {
    id: 'map-9',
    numericId: 9,
    category: 'Matrimonial & Cruelty Law',
    oldAct: 'Indian Penal Code, 1860',
    oldSection: 'Section 498A',
    oldTitle: 'Husband or relative of husband subjecting woman to cruelty',
    newAct: 'Bharatiya Nyaya Sanhita, 2023',
    newSection: 'Section 85 & 86',
    newTitle: 'Husband or relative of husband of a woman subjecting her to cruelty',
    oldProvision: 'Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment up to three years and fine.',
    newProvision: 'Section 85 prescribes imprisonment up to three years and fine. Section 86 provides comprehensive definition of cruelty including physical harm, mental torture, and unlawful harassment for property.',
    punishmentChange: 'Retains imprisonment up to 3 years and fine.',
    importantDifferences: [
      'Separates penal sanction (Sec 85) from statutory definition of cruelty (Sec 86)',
      'Defines mental cruelty and economic harassment with greater legislative clarity'
    ],
    notes: 'Subject to Arnesh Kumar / BNSS 35 mandatory notice safeguards before arrest.',
    relevanceTags: ['498a', '85', '86', 'cruelty', 'matrimonial', 'dowry', 'arnesh kumar'],
    source: 'BNS 2023 Gazette Sections 85 and 86',
    verified: true
  }
];

// Rich Legal Community Posts & Discussions
const communityPosts = [
  {
    id: 'post-1',
    numericId: 1,
    title: 'Admissibility of WhatsApp & Signal Chats under Section 63 BSA (formerly 65B IEA)',
    category: 'Legal Reform',
    author: {
      id: 'user-1',
      name: 'Adv. Aarav Sharma',
      role: 'Lawyer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      organization: 'Supreme Court Bar Association'
    },
    content: 'With the transition to Bharatiya Sakshya Adhiniyam, Section 63 now provides a standardized Certificate format in the Schedule. For digital communication from end-to-end encrypted messaging applications (WhatsApp, Signal, Telegram), what is the exact evidentiary threshold when the physical phone is in custody versus when screenshots/cloud backups are produced? In our recent appellate brief, we argued that secondary screenshots require the Part B Certificate signed by a certified forensic expert or cloud administrator pursuant to Arjun Panditrao. What are your recent experiences across trial benches in Delhi and Mumbai?',
    tags: ['BSA Section 63', 'Electronic Evidence', 'Section 65B vs 63', 'WhatsApp Chats', 'Trial Practice'],
    upvotes: 42,
    upvotedBy: ['user-2', 'user-3', 'user-4'],
    createdAt: '2026-02-20T08:30:00Z',
    comments: [
      {
        id: 'c-101',
        author: {
          name: 'Dr. Vikramaditya Sen',
          role: 'Researcher',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        },
        content: 'Crucial point Counsel. In Arjun Panditrao, the SC clarified that if the original device is produced in court, the 65B/63 certificate is unnecessary as it is primary evidence under Section 57 BSA. But if secondary printouts are filed, the Section 63 Schedule certificate remains strictly mandatory and cannot be waived.',
        createdAt: '2026-02-20T10:15:00Z'
      },
      {
        id: 'c-102',
        author: {
          name: 'Priya Narayanan',
          role: 'Student',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
        },
        content: 'Also worth noting that BSA Section 63 explicitly mentions distributed computing systems and cloud storage, resolving the ambiguities under older 65B jurisprudence.',
        createdAt: '2026-02-20T14:40:00Z'
      }
    ]
  },
  {
    id: 'post-2',
    numericId: 2,
    title: '5-Pillar Case Breakdown: Puttaswamy and the Proportionality Test in Digital Surveillance',
    category: 'Landmark Analysis',
    author: {
      id: 'user-3',
      name: 'Dr. Vikramaditya Sen',
      role: 'Researcher',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      organization: 'Centre for Policy & Judicial Reform Studies'
    },
    content: 'Analyzing the 9-Judge Bench Puttaswamy judgment through our 5-Pillar model reveals why the threefold test (Legality, Legitimate State Aim, Proportionality) has become the gold standard for testing digital privacy incursions, CCTV surveillance, and Pegasus-style state interventions. When courts examine smartphone searches during arrests, any search without a Magistrate\'s warrant violates the least-intrusive-means prong.',
    tags: ['Right to Privacy', 'Article 21', 'Puttaswamy', 'Proportionality Test', 'Constitutional Law'],
    upvotes: 38,
    upvotedBy: ['user-1', 'user-4'],
    createdAt: '2026-02-18T11:20:00Z',
    comments: [
      {
        id: 'c-201',
        author: {
          name: 'Adv. Aarav Sharma',
          role: 'Lawyer',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        },
        content: 'Spot on Dr. Sen. We recently relied on Puttaswamy alongside Selvi v. State of Karnataka to successfully suppress forced phone unlocking without biometric consent.',
        createdAt: '2026-02-18T15:00:00Z'
      }
    ]
  },
  {
    id: 'post-3',
    numericId: 3,
    title: 'Community Service under BNS Section 303: Practical Implementation for Petty Thefts',
    category: 'Case Discussion',
    author: {
      id: 'user-4',
      name: 'Shardul Amarchand & Partners',
      role: 'Law Firm',
      avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
      organization: 'Dispute Resolution & Appellate Litigation Practice Group'
    },
    content: 'Section 303(2) BNS provides community service for first-time theft convictions where the stolen property value is under ₹5,000 upon return or reimbursement of value. Have subordinate courts in your jurisdiction started framing specific community service orders (e.g. municipal cleaning, legal clinic assistance, tree plantation)? Sharing sample sentencing drafting templates.',
    tags: ['BNS Section 303', 'Theft', 'Community Service', 'Sentencing Reform', 'Criminal Law'],
    upvotes: 29,
    upvotedBy: ['user-1', 'user-2'],
    createdAt: '2026-02-15T16:00:00Z',
    comments: [
      {
        id: 'c-301',
        author: {
          name: 'Priya Narayanan',
          role: 'Student',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
        },
        content: 'This aligns with modern penal jurisprudence in UK and Commonwealth jurisdictions. Looking forward to standard guidelines from High Courts on this.',
        createdAt: '2026-02-16T09:30:00Z'
      }
    ]
  }
];

const searchHistory = [
  {
    id: 'hist-1',
    userId: 'user-1',
    query: 'Theft in dwelling house',
    resultsCount: 8,
    topMatch: 'BNS Section 305: Theft in dwelling house, building, tent or vessel',
    timestamp: '2026-02-26T14:20:00Z'
  },
  {
    id: 'hist-2',
    userId: 'user-1',
    query: 'Anticipatory bail rules',
    resultsCount: 10,
    topMatch: 'BNSS Section 482: Direction for grant of bail to person apprehending arrest',
    timestamp: '2026-02-26T11:05:00Z'
  },
  {
    id: 'hist-3',
    userId: 'user-1',
    query: 'Right to Privacy Article 21',
    resultsCount: 12,
    topMatch: 'Justice K.S. Puttaswamy (Retd.) v. Union of India (2017) 10 SCC 1',
    timestamp: '2026-02-25T16:45:00Z'
  },
  {
    id: 'hist-4',
    userId: 'user-1',
    query: 'Electronic Evidence Section 65B vs 63',
    resultsCount: 9,
    topMatch: 'BSA Section 63: Admissibility of electronic records and Certificate requirements',
    timestamp: '2026-02-25T09:30:00Z'
  }
];

module.exports = {
  users,
  acts,
  sections,
  cases,
  precedentRelationships,
  lawMappings,
  communityPosts,
  searchHistory
};
