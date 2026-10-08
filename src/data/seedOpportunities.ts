import { Opportunity } from '../types/opportunity';
import { MASTER_DOCUMENTS } from './masterDocuments';

const getDoc = (id: string) => {
  const found = MASTER_DOCUMENTS.find(d => d.id === id);
  if (!found) throw new Error(`Document ${id} not found`);
  return found;
};

export const SEED_OPPORTUNITIES: Opportunity[] = [
  // 1. SSC CGL
  {
    id: 'ssc_cgl_2025_26',
    type: 'exam',
    title: 'SSC Combined Graduate Level (CGL)',
    titleHindi: 'एसएससी संयुक्त स्नातक स्तरीय परीक्षा (CGL)',
    shortDescription: 'Gateway exam for Group B & C gazetted and non-gazetted posts across Central Ministries, Income Tax, and Customs.',
    shortDescriptionHindi: 'केंद्रीय मंत्रालयों, आयकर और सीमा शुल्क विभागों में ग्रुप B और C पदों की सबसे प्रतिष्ठित परीक्षा।',
    fullDescription: 'Staff Selection Commission conducts the Combined Graduate Level Examination for recruitment to various Group B and Group C posts in ministries, departments, and organizations of the Government of India.',
    fullDescriptionHindi: 'कर्मचारी चयन आयोग (SSC) भारत सरकार के मंत्रालयों और केंद्रीय विभागों में विभिन्न प्रतिष्ठित पदों पर भर्ती के लिए यह परीक्षा आयोजित करता है।',
    authority: 'Staff Selection Commission (SSC)',
    authorityHindi: 'कर्मचारी चयन आयोग (भारत सरकार)',
    level: 'central',
    tags: ['Graduate', 'Central Govt', 'Group B/C', 'Desk Job', 'Ministries'],
    beneficiaryType: 'youth',
    status: 'open',
    deadline: '2026-07-24',
    notificationDate: '2026-06-11',
    examDate: '2026-09-15',
    keyBenefit: 'Group B & C Central Govt Posts with 7th Pay Matrix Level 4 to Level 8 (₹25,500 - ₹1,51,100).',
    keyBenefitHindi: '7वें वेतन आयोग के पे-लेवल 4 से 8 के अंतर्गत प्रतिष्ठित केंद्रीय सरकारी नौकरी और भत्ते।',
    detailedBenefits: [
      'Appointment as Assistant Section Officer (ASO) in MEA, CSS, Intelligence Bureau, or Inspector in CGST & Income Tax.',
      'Stable central government service with comprehensive medical (CGHS), pension benefits, and quarters allowance.',
      'Two-tier computer-based test pattern (Tier 1 qualifying, Tier 2 merit based).'
    ],
    officialUrl: 'https://ssc.gov.in',
    notificationUrl: 'https://ssc.gov.in/notices',
    applicationUrl: 'https://ssc.gov.in/apply',
    isOfficialSourceVerified: true,
    popularityScore: 98,
    lastVerifiedDate: '2026-05-01',
    eligibilityRequirements: {
      minAge: 18,
      maxAge: 30, // up to 32 for JSO
      ageRelaxation: {
        OBC: 3,
        SC: 5,
        ST: 5,
        EWS: 0
      },
      educationLevels: ['Undergraduate', 'Postgraduate', 'Doctorate'],
      pwdEligible: true,
      requiresPhysical: false,
      customRequirements: [
        'Candidate must hold a Bachelor’s degree in any discipline from a recognized University.',
        'Final year students are eligible provided degree certificate is obtained before the cutoff date.'
      ]
    },
    requiredDocuments: [
      getDoc('aadhaar_card'),
      getDoc('10th_marksheet'),
      getDoc('12th_marksheet'),
      getDoc('graduation_degree'),
      getDoc('caste_certificate'),
      getDoc('passport_photo'),
      getDoc('signature_specimen')
    ],
    tutorial: {
      tutorialTitle: 'How to register on new SSC OTR portal & fill SSC CGL form step-by-step',
      youtubeUrl: 'https://www.youtube.com/results?search_query=ssc+cgl+application+form+filling+step+by+step',
      source: 'Verified Academic Educators',
      language: 'Hindi & English',
      duration: '14 mins'
    },
    officialExcerpt: 'A candidate must possess Bachelor’s Degree from a recognized University or equivalent. Crucial date for determination of age and qualification is as specified in the official employment notification.',
    faqs: [
      {
        question: 'Can final year students apply for SSC CGL?',
        questionHindi: 'क्या अंतिम वर्ष के छात्र SSC CGL के लिए आवेदन कर सकते हैं?',
        answer: 'Yes, if you acquire your educational qualification on or before the crucial cutoff date mentioned in the notification.',
        answerHindi: 'हाँ, यदि आप अधिसूचना में उल्लिखित कटऑफ तिथि से पहले अपनी डिग्री परीक्षा उत्तीर्ण कर लेते हैं।'
      },
      {
        question: 'Is there any negative marking in SSC CGL Tier 1?',
        questionHindi: 'क्या SSC CGL टियर 1 में नेगेटिव मार्किंग है?',
        answer: 'Yes, 0.50 marks are deducted for each wrong answer in Tier-I computer-based examination.',
        answerHindi: 'हाँ, टियर-I कंप्यूटर आधारित परीक्षा में प्रत्येक गलत उत्तर के लिए 0.50 अंक काटे जाते हैं।'
      }
    ]
  },

  // 2. SSC GD Constable (With Physical Requirement)
  {
    id: 'ssc_gd_constable_2026',
    type: 'exam',
    title: 'SSC GD Constable (CAPFs, SSF & Rifleman)',
    titleHindi: 'एसएससी जीडी कांस्टेबल (केंद्रीय सशस्त्र पुलिस बल)',
    shortDescription: 'Uniformed recruitment in BSF, CISF, CRPF, ITBP, SSB, SSF and Assam Rifles for 10th pass candidates.',
    shortDescriptionHindi: '10वीं पास युवाओं के लिए बीएसएफ, सीआईएसएफ, सीआरपीएफ, आईटीबीपी में वर्दीधारी सिपाही बनने का मौका।',
    fullDescription: 'Staff Selection Commission conducts the General Duty (GD) Constable exam for filling thousands of constable vacancies across Central Armed Police Forces.',
    fullDescriptionHindi: 'केंद्रीय सशस्त्र पुलिस बलों (CAPF) में सिपाही (सामान्य ड्यूटी) के पदों पर चयन हेतु कंप्यूटर आधारित परीक्षा एवं शारीरिक दक्षता परीक्षा।',
    authority: 'Ministry of Home Affairs / SSC',
    authorityHindi: 'गृह मंत्रालय / कर्मचारी चयन आयोग',
    level: 'central',
    tags: ['10th Pass', 'Uniform', 'Defense/Police', 'Physical Test', 'Central Govt'],
    beneficiaryType: 'youth',
    status: 'upcoming',
    deadline: '2026-08-30',
    notificationDate: '2026-07-15',
    examDate: '2026-11-20',
    keyBenefit: 'Permanent Uniformed Central Government Job (Pay Level 3: ₹21,700 - ₹69,100) + Ration and Risk Allowance.',
    keyBenefitHindi: 'पे-लेवल 3 (₹21,700 - ₹69,100) के साथ स्थायी वर्दीधारी केंद्रीय सेवा और राशन/जोखिम भत्ते।',
    detailedBenefits: [
      'Opportunity to serve in premier border guarding forces like BSF, ITBP, CISF, and CRPF.',
      'Fast-track departmental promotions and service pension benefits.',
      'Extensive family welfare and defense canteen (CPCF) amenities.'
    ],
    officialUrl: 'https://ssc.gov.in',
    notificationUrl: 'https://ssc.gov.in/notices',
    applicationUrl: 'https://ssc.gov.in/apply',
    isOfficialSourceVerified: true,
    popularityScore: 95,
    lastVerifiedDate: '2026-05-02',
    eligibilityRequirements: {
      minAge: 18,
      maxAge: 23,
      ageRelaxation: {
        OBC: 3,
        SC: 5,
        ST: 5,
        EWS: 0
      },
      educationLevels: ['10th', '12th', 'Diploma', 'Undergraduate'],
      pwdEligible: false, // Force jobs are exempt from PWD
      requiresPhysical: true,
      customRequirements: [
        'Must have passed Matriculation (10th Class Examination) from a recognized Board/University.',
        'Must clear the Physical Standard Test (PST) and Physical Efficiency Test (PET).'
      ]
    },
    physicalRequirements: {
      applicableGender: 'All',
      minHeightCm: 170, // 170cm for Male General/OBC/SC, 157cm for Female
      minChestCm: 80, // Male unexpanded
      minChestExpansionCm: 5, // minimum 5cm expansion
      requiredVision: '6/6 or 6/9 in better eye without glasses',
      allowsColorBlindness: false,
      relaxationNotes: 'ST Male height relaxed to 162.5 cm, Chest 76 cm. Female candidates are exempt from chest measurements.'
    },
    requiredDocuments: [
      getDoc('aadhaar_card'),
      getDoc('10th_marksheet'),
      getDoc('caste_certificate'),
      getDoc('domicile_certificate'),
      getDoc('passport_photo'),
      getDoc('signature_specimen')
    ],
    tutorial: {
      tutorialTitle: 'SSC GD Physical Standard Test & Online Form Tutorial',
      youtubeUrl: 'https://www.youtube.com/results?search_query=ssc+gd+form+fill+up+and+physical+test+details',
      source: 'Government Exam Mentors',
      language: 'Hindi',
      duration: '11 mins'
    },
    officialExcerpt: 'Physical Standard Test (PST) entails measurement of Height and Chest. Physical Efficiency Test (PET) requires running 5 kms in 24 minutes for male candidates.',
    faqs: [
      {
        question: 'Are PWD candidates eligible for SSC GD Constable?',
        questionHindi: 'क्या दिव्यांग (PWD) अभ्यर्थी SSC GD के लिए पात्र हैं?',
        answer: 'No, due to rigorous operational and combat duties in CAPFs, PWD candidates are not eligible for armed forces constable posts.',
        answerHindi: 'नहीं, सुरक्षा बलों में अनिवार्य शारीरिक और सामरिक ड्यूटी के कारण दिव्यांग अभ्यर्थी इसके लिए पात्र नहीं हैं।'
      }
    ]
  },

  // 3. UPSC Civil Services
  {
    id: 'upsc_cse_2026',
    type: 'exam',
    title: 'UPSC Civil Services Examination (IAS / IPS / IFS)',
    titleHindi: 'संघ लोक सेवा आयोग सिविल सेवा परीक्षा (IAS / IPS / IFS)',
    shortDescription: 'India’s premier constitutional recruitment exam for Indian Administrative Service, Police Service, and Foreign Service.',
    shortDescriptionHindi: 'भारतीय प्रशासनिक सेवा (IAS), पुलिस सेवा (IPS) और विदेश सेवा (IFS) के लिए देश की सर्वोच्च परीक्षा।',
    fullDescription: 'The Union Public Service Commission conducts the Civil Services Examination in three stages: Preliminary Examination, Main Written Examination, and the Personality Test (Interview).',
    fullDescriptionHindi: 'संघ लोक सेवा आयोग द्वारा तीन चरणों (प्रारंभिक, मुख्य लिखित, एवं साक्षात्कार) में आयोजित प्रतिष्ठित परीक्षा।',
    authority: 'Union Public Service Commission (UPSC)',
    authorityHindi: 'संघ लोक सेवा आयोग (UPSC)',
    level: 'central',
    tags: ['Graduate', 'All India Service', 'Constitutional', 'Group A', 'Leadership'],
    beneficiaryType: 'youth',
    status: 'open',
    deadline: '2026-03-05',
    notificationDate: '2026-02-04',
    examDate: '2026-05-24',
    keyBenefit: 'Group A Constitutional Officers (IAS, IPS, IFS, IRS) with immense leadership impact and prestige.',
    keyBenefitHindi: 'ग्रुप A सर्वोच्च संवैधानिक पद (IAS, IPS, IFS) और राष्ट्र निर्माण में नीतिगत नेतृत्व।',
    detailedBenefits: [
      'Appointment as Sub-Divisional Magistrate (SDM), Assistant Commissioner, or Assistant Superintendent of Police.',
      'Apex career progression up to Cabinet Secretary / Director General of Police.',
      'Equal opportunity examination open to graduates of all academic disciplines.'
    ],
    officialUrl: 'https://upsc.gov.in',
    notificationUrl: 'https://upsc.gov.in/examinations/active-exams',
    applicationUrl: 'https://upsconline.nic.in',
    isOfficialSourceVerified: true,
    popularityScore: 99,
    lastVerifiedDate: '2026-05-01',
    eligibilityRequirements: {
      minAge: 21,
      maxAge: 32,
      ageRelaxation: {
        OBC: 3,
        SC: 5,
        ST: 5,
        EWS: 0
      },
      educationLevels: ['Undergraduate', 'Postgraduate', 'Doctorate'],
      pwdEligible: true,
      requiresPhysical: false, // General IAS is non-physical; IPS has post-exam standards
      customRequirements: [
        'Candidate must hold a degree from a recognized University or deemed university.',
        'Number of attempts permitted: General 6, OBC 9, SC/ST Unlimited (up to age limit).'
      ]
    },
    requiredDocuments: [
      getDoc('aadhaar_card'),
      getDoc('10th_marksheet'),
      getDoc('graduation_degree'),
      getDoc('caste_certificate'),
      getDoc('passport_photo'),
      getDoc('signature_specimen')
    ],
    tutorial: {
      tutorialTitle: 'UPSC One Time Registration (OTR) and CSE Application Guidance',
      youtubeUrl: 'https://www.youtube.com/results?search_query=upsc+otr+registration+and+form+filling',
      source: 'National Civil Services Academy Guidance',
      language: 'Hindi & English',
      duration: '18 mins'
    },
    officialExcerpt: 'A candidate must have attained the age of 21 years and must not have attained the age of 32 years on the 1st of August of the examination year.',
    faqs: [
      {
        question: 'Are there any minimum graduation marks required for UPSC?',
        questionHindi: 'क्या UPSC के लिए स्नातक में न्यूनतम प्रतिशत अंक आवश्यक हैं?',
        answer: 'No, there is no minimum percentage requirement. Any pass graduate from a recognized university can appear.',
        answerHindi: 'नहीं, कोई न्यूनतम प्रतिशत सीमा नहीं है। किसी भी मान्यता प्राप्त विश्वविद्यालय से उत्तीर्ण स्नातक आवेदन कर सकता है।'
      }
    ]
  },

  // 4. MPPSC State Services
  {
    id: 'mppsc_state_services_2026',
    type: 'exam',
    title: 'MPPSC State Services Examination (MP PCS)',
    titleHindi: 'मध्य प्रदेश राज्य सेवा परीक्षा (MPPSC PCS)',
    shortDescription: 'State administrative recruitment for Deputy Collector, DSP, Commercial Tax Officer, and Naib Tehsildar in MP.',
    shortDescriptionHindi: 'मध्य प्रदेश शासन में डिप्टी कलेक्टर, डीएसपी, वाणिज्यिक कर अधिकारी एवं नायब तहसीलदार पदों पर भर्ती।',
    fullDescription: 'Madhya Pradesh Public Service Commission conducts the State Services Examination for recruitment to administrative, police, and executive cadres of the MP State Government.',
    fullDescriptionHindi: 'मध्य प्रदेश लोक सेवा आयोग (इंदौर) द्वारा राज्य के प्रशासनिक और पुलिस पदों हेतु आयोजित राज्य स्तरीय परीक्षा।',
    authority: 'Madhya Pradesh Public Service Commission (MPPSC)',
    authorityHindi: 'मध्य प्रदेश लोक सेवा आयोग',
    level: 'state',
    state: 'Madhya Pradesh',
    tags: ['State Govt', 'Madhya Pradesh', 'Graduate', 'Deputy Collector', 'DSP'],
    beneficiaryType: 'youth',
    status: 'open',
    deadline: '2026-06-18',
    notificationDate: '2026-05-10',
    examDate: '2026-08-23',
    keyBenefit: 'Class II Gazetted Executive Posts in Madhya Pradesh Government with Pay Scale ₹56,100 - ₹1,77,500.',
    keyBenefitHindi: 'मध्य प्रदेश शासन में द्वितीय श्रेणी राजपत्रित अधिकारी का पद और प्रशासनिक अधिकार।',
    detailedBenefits: [
      'Recruitment to core state civil cadre: Deputy Collector, DSP, District Registrar, Excise Officer.',
      'Generous upper age limit of 40 years for state residents (+5 years for SC/ST/OBC/Women).',
      'Preliminary examination held across all district headquarters in MP.'
    ],
    officialUrl: 'https://mppsc.mp.gov.in',
    notificationUrl: 'https://mppsc.mp.gov.in/advertisement',
    applicationUrl: 'https://www.mponline.gov.in',
    isOfficialSourceVerified: true,
    popularityScore: 92,
    lastVerifiedDate: '2026-05-01',
    eligibilityRequirements: {
      minAge: 21,
      maxAge: 40,
      ageRelaxation: {
        OBC: 5,
        SC: 5,
        ST: 5,
        EWS: 0
      },
      educationLevels: ['Undergraduate', 'Postgraduate', 'Doctorate'],
      allowedStates: ['Madhya Pradesh', 'All India'],
      pwdEligible: true,
      requiresPhysical: false, // Only DSP requires height, general posts do not
      customRequirements: [
        'Bachelor’s degree from a recognized university.',
        'Must hold valid MP State Employment Exchange (Rojgar Panjiyan) registration at the time of interview.'
      ]
    },
    requiredDocuments: [
      getDoc('aadhaar_card'),
      getDoc('10th_marksheet'),
      getDoc('12th_marksheet'),
      getDoc('graduation_degree'),
      getDoc('domicile_certificate'),
      getDoc('caste_certificate'),
      getDoc('passport_photo'),
      getDoc('signature_specimen')
    ],
    tutorial: {
      tutorialTitle: 'MPPSC State Service Online Form Filling via MP Online Portal',
      youtubeUrl: 'https://www.youtube.com/results?search_query=mppsc+prelims+form+fill+up+step+by+step',
      source: 'State Civil Prep Network',
      language: 'Hindi',
      duration: '15 mins'
    },
    officialExcerpt: 'Candidate must have graduated from a university established by an Act of Central or State Legislature.',
    faqs: [
      {
        question: 'Can candidates from other states apply for MPPSC?',
        questionHindi: 'क्या अन्य राज्यों के उम्मीदवार MPPSC के लिए आवेदन कर सकते हैं?',
        answer: 'Yes, candidates from other states can apply as Unreserved (General) category candidates.',
        answerHindi: 'हाँ, अन्य राज्यों के अभ्यर्थी अनारक्षित (सामान्य) श्रेणी के अंतर्गत आवेदन कर सकते हैं।'
      }
    ]
  },

  // 5. IBPS Probationary Officer (PO)
  {
    id: 'ibps_po_2026',
    type: 'exam',
    title: 'IBPS PO / Management Trainee (Public Sector Banks)',
    titleHindi: 'आईबीपीएस पीओ (सार्वजनिक क्षेत्र के बैंक)',
    shortDescription: 'National recruitment for Probationary Officers across 11 major Public Sector Banks like PNB, Canara Bank, and BoB.',
    shortDescriptionHindi: 'पीएनबी, बैंक ऑफ बड़ौदा, केनरा बैंक सहित 11 प्रमुख सरकारी बैंकों में प्रोबेशनरी ऑफिसर भर्ती।',
    fullDescription: 'Institute of Banking Personnel Selection conducts the Common Recruitment Process for Probationary Officers and Management Trainees in participating public sector banks.',
    fullDescriptionHindi: 'बैंकिंग कार्मिक चयन संस्थान (IBPS) द्वारा सार्वजनिक क्षेत्र के राष्ट्रीयकृत बैंकों में अधिकारी संवर्ग हेतु परीक्षा।',
    authority: 'Institute of Banking Personnel Selection (IBPS)',
    authorityHindi: 'बैंकिंग कार्मिक चयन संस्थान (IBPS)',
    level: 'central',
    tags: ['Graduate', 'Banking', 'Finance', 'Nationalized Banks', 'Fast Promotion'],
    beneficiaryType: 'youth',
    status: 'upcoming',
    deadline: '2026-08-28',
    notificationDate: '2026-08-01',
    examDate: '2026-10-18',
    keyBenefit: 'Officer Grade in Public Sector Banks starting with in-hand ₹58,000+ per month plus leased accommodation and loans.',
    keyBenefitHindi: 'सरकारी बैंकों में स्केल 1 अधिकारी का पद, ₹58,000+ वेतन, बैंक ऋण छूट एवं मकान किराया।',
    detailedBenefits: [
      'Fastest recruitment cycle in India: Completed from notification to appointment within 7-8 months.',
      'Clear promotional hierarchy leading to Branch Manager, AGM, and General Manager.',
      'Equal evaluation across Arts, Commerce, Science, and Engineering graduates.'
    ],
    officialUrl: 'https://www.ibps.in',
    notificationUrl: 'https://www.ibps.in/crp-po-mt',
    applicationUrl: 'https://ibpsonline.ibps.in',
    isOfficialSourceVerified: true,
    popularityScore: 91,
    lastVerifiedDate: '2026-05-02',
    eligibilityRequirements: {
      minAge: 20,
      maxAge: 30,
      ageRelaxation: {
        OBC: 3,
        SC: 5,
        ST: 5,
        EWS: 0
      },
      educationLevels: ['Undergraduate', 'Postgraduate', 'Doctorate'],
      pwdEligible: true,
      requiresPhysical: false,
      customRequirements: [
        'A Degree (Graduation) in any discipline from a recognized University.',
        'Basic operating and working knowledge in computer systems is mandatory.'
      ]
    },
    requiredDocuments: [
      getDoc('aadhaar_card'),
      getDoc('10th_marksheet'),
      getDoc('graduation_degree'),
      getDoc('caste_certificate'),
      getDoc('passport_photo'),
      getDoc('signature_specimen')
    ],
    officialExcerpt: 'A candidate must have attained 20 years and not exceed 30 years as on the first day of the application month.',
    faqs: [
      {
        question: 'Does IBPS PO require work experience?',
        questionHindi: 'क्या IBPS PO के लिए कार्य अनुभव आवश्यक है?',
        answer: 'No, fresh graduates with zero work experience are fully eligible.',
        answerHindi: 'नहीं, बिना किसी पूर्व अनुभव वाले नए स्नातक पूरी तरह पात्र हैं।'
      }
    ]
  },

  // 6. SCHEME: PM Uchchatar Shiksha Protsahan (PM-USP Central Sector Scholarship)
  {
    id: 'pm_usp_scholarship_2026',
    type: 'scheme',
    title: 'PM Uchchatar Shiksha Protsahan (Central Sector Scholarship)',
    titleHindi: 'पीएम उच्चतर शिक्षा प्रोत्साहन योजना (केंद्रीय क्षेत्र छात्रवृत्ति)',
    shortDescription: '₹12,000 to ₹20,000 annual scholarship for meritorious college students from low-income families.',
    shortDescriptionHindi: 'कॉलेज और विश्वविद्यालय में पढ़ने वाले मेधावी छात्रों के लिए प्रति वर्ष ₹12,000 से ₹20,000 की वित्तीय सहायता।',
    fullDescription: 'Centrally sponsored scholarship scheme by the Department of Higher Education (Ministry of Education) to support meritorious students from economically weaker sections pursuing undergraduate and postgraduate degrees.',
    fullDescriptionHindi: 'शिक्षा मंत्रालय, भारत सरकार द्वारा उच्च शिक्षा में अध्ययनरत मेधावी विद्यार्थियों के लिए प्रत्यक्ष बैंक खाते में दी जाने वाली छात्रवृत्ति।',
    authority: 'Ministry of Education, Govt of India',
    authorityHindi: 'शिक्षा मंत्रालय, भारत सरकार',
    level: 'central',
    tags: ['Scholarship', 'College Students', 'Direct Cash Transfer', 'Merit-cum-Means'],
    beneficiaryType: 'student',
    status: 'open',
    deadline: '2026-10-31',
    notificationDate: '2026-07-01',
    keyBenefit: '₹12,000 per annum for Undergraduate (1st, 2nd, 3rd year) and ₹20,000 per annum for Postgraduate courses.',
    keyBenefitHindi: 'स्नातक स्तर पर ₹12,000 प्रति वर्ष और परास्नातक स्तर पर ₹20,000 प्रति वर्ष सीधे बैंक खाते में।',
    detailedBenefits: [
      'Direct Benefit Transfer (DBT) credited directly into the student’s Aadhaar-seeded bank account.',
      'Renewable every academic year until completion of course, contingent on maintaining 50%+ marks.',
      '50% seats reserved earmarked for female students.'
    ],
    officialUrl: 'https://scholarships.gov.in',
    notificationUrl: 'https://scholarships.gov.in/public/schemeGuidelines/CSSS_Guideline.pdf',
    applicationUrl: 'https://scholarships.gov.in',
    isOfficialSourceVerified: true,
    popularityScore: 97,
    lastVerifiedDate: '2026-05-01',
    eligibilityRequirements: {
      minAge: 17,
      maxAge: 25,
      educationLevels: ['Undergraduate', 'Postgraduate'],
      minimumPercentage: 80, // Top 20th percentile in Class 12 board
      maxFamilyIncome: 450000, // Annual family income <= ₹4.5 Lakh
      pwdEligible: true,
      requiresPhysical: false,
      customRequirements: [
        'Must have scored above 80th percentile in respective Class 12th Board Examination.',
        'Must be enrolled in regular (non-distance) degree course in a recognized college/university.',
        'Not availing any other central or state government scholarship for the same degree.'
      ]
    },
    requiredDocuments: [
      getDoc('aadhaar_card'),
      getDoc('12th_marksheet'),
      getDoc('income_certificate'),
      getDoc('caste_certificate'),
      getDoc('passport_photo')
    ],
    tutorial: {
      tutorialTitle: 'National Scholarship Portal (NSP) Online Application & OTR Guide',
      youtubeUrl: 'https://www.youtube.com/results?search_query=nsp+scholarship+form+fill+up+central+sector',
      source: 'National Scholarship Portal Helpdesk',
      language: 'Hindi',
      duration: '12 mins'
    },
    officialExcerpt: 'Students who are above 80th percentile of successful candidates in the relevant stream from a particular Board of Examination, in Class XII, having family income less than Rs. 4.5 lakh per annum.',
    faqs: [
      {
        question: 'Can I get this scholarship if studying in a private college?',
        questionHindi: 'क्या निजी कॉलेज में पढ़ने वाले छात्र भी इस छात्रवृत्ति के पात्र हैं?',
        answer: 'Yes, as long as the private college is recognized by UGC/AICTE and affiliated with a recognized university.',
        answerHindi: 'हाँ, बशर्ते निजी कॉलेज यूजीसी/एआईसीटीई से मान्यता प्राप्त हो।'
      }
    ]
  },

  // 7. SCHEME: MP Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)
  {
    id: 'mp_mmvy_scheme_2026',
    type: 'scheme',
    title: 'Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)',
    titleHindi: 'मुख्यमंत्री मेधावी विद्यार्थी योजना (मध्य प्रदेश)',
    shortDescription: 'Full tuition fee waiver for higher education (Engineering, Medical, Law, Degree) in MP.',
    shortDescriptionHindi: 'मध्य प्रदेश के मेधावी छात्रों के लिए इंजीनियरिंग, मेडिकल, लॉ और डिग्री कॉलेजों की पूरी ट्यूशन फीस सरकार देती है।',
    fullDescription: 'Government of Madhya Pradesh covers the entire college tuition fee of meritorious students who scored 70%+ in MP Board or 85%+ in CBSE/ICSE in 12th grade.',
    fullDescriptionHindi: 'मध्य प्रदेश सरकार द्वारा 12वीं में उत्कृष्ट अंक लाने वाले विद्यार्थियों की उच्च शिक्षा की संपूर्ण फीस सीधे संस्थान को वहन करने की योजना।',
    authority: 'Department of Technical Education & Higher Education, MP',
    authorityHindi: 'तकनीकी शिक्षा एवं कौशल विकास विभाग, मध्य प्रदेश शासन',
    level: 'state',
    state: 'Madhya Pradesh',
    tags: ['Madhya Pradesh', 'Fee Waiver', 'Engineering/Medical', 'Higher Education', 'State Scheme'],
    beneficiaryType: 'student',
    status: 'open',
    deadline: '2026-11-15',
    notificationDate: '2026-06-15',
    keyBenefit: '100% Tuition Fee paid by MP Government for IIT, NIT, Government & Private Engineering, MBBS, CLAT, and State Colleges.',
    keyBenefitHindi: 'इंजीनियरिंग, मेडिकल और डिग्री कॉलेज की 100% शिक्षण फीस मध्य प्रदेश सरकार द्वारा भरी जाती है।',
    detailedBenefits: [
      'Covers complete actual tuition fee directly disbursed to the academic institution.',
      'Eligible across premier national institutes (IIT, IIM, AIIMS, NIT, NLU) as well as state government/private colleges.',
      'Income ceiling generous at ₹6,00,000 per annum.'
    ],
    officialUrl: 'https://medhavikalyan.mp.gov.in',
    notificationUrl: 'https://medhavikalyan.mp.gov.in/Schemes.aspx',
    applicationUrl: 'https://medhavikalyan.mp.gov.in',
    isOfficialSourceVerified: true,
    popularityScore: 96,
    lastVerifiedDate: '2026-05-01',
    eligibilityRequirements: {
      minAge: 16,
      maxAge: 26,
      allowedStates: ['Madhya Pradesh'],
      educationLevels: ['Undergraduate', 'Postgraduate'],
      minimumPercentage: 70, // 70% in MP Board or 85% in CBSE
      maxFamilyIncome: 600000, // ₹6 Lakhs
      pwdEligible: true,
      requiresPhysical: false,
      customRequirements: [
        'Candidate must be a permanent domicile resident of Madhya Pradesh.',
        'Must have secured 70% or more marks in Class 12 (MP Board) OR 85% or more in CBSE/ICSE.',
        'Father/Guardian’s annual income from all sources must not exceed ₹6,00,000.'
      ]
    },
    requiredDocuments: [
      getDoc('aadhaar_card'),
      getDoc('10th_marksheet'),
      getDoc('12th_marksheet'),
      getDoc('domicile_certificate'),
      getDoc('income_certificate'),
      getDoc('passport_photo')
    ],
    tutorial: {
      tutorialTitle: 'How to register on MP Medhavi Portal & upload fee sanction documents',
      youtubeUrl: 'https://www.youtube.com/results?search_query=mp+medhavi+yojana+form+fill+up',
      source: 'MP Education Department Portal Help',
      language: 'Hindi',
      duration: '10 mins'
    },
    officialExcerpt: 'Madhya Pradesh domicile students securing 70% in MPBSE or 85% in CBSE/ICSE with parental income under Rs. 6 Lakhs are entitled to institutional course fee sanction.',
    faqs: [
      {
        question: 'Is there an agreement or bond required for engineering students under MMVY?',
        questionHindi: 'क्या MMVY योजना में इंजीनियरिंग छात्रों के लिए कोई अनुबंध या बॉन्ड होता है?',
        answer: 'Students studying in government institutes agree to serve in MP for 2 years or repay the fee if they seek private exemptions.',
        answerHindi: 'शासकीय संस्थानों के विद्यार्थियों के लिए पढ़ाई पूरी करने के बाद राज्य में 2 वर्ष की सेवा की सामान्य शर्त लागू होती है।'
      }
    ]
  },

  // 8. SCHEME: PM Yashasvi Scholarship
  {
    id: 'pm_yashasvi_scholarship_2026',
    type: 'scheme',
    title: 'PM Young Achievers Scholarship (PM YASHASVI)',
    titleHindi: 'पीएम यशस्वी छात्रवृत्ति योजना (PM-YASHASVI)',
    shortDescription: 'Scholarship scheme for OBC, EBC, and DNT students studying in Top Class Schools and Colleges.',
    shortDescriptionHindi: 'अन्य पिछड़ा वर्ग (OBC), ईबीसी और डीएनटी वर्ग के होनहार विद्यार्थियों के लिए राष्ट्रीय छात्रवृत्ति।',
    fullDescription: 'Department of Social Justice and Empowerment provides financial support to talented OBC, EBC, and Nomadic Tribe students to ensure no youth drops out due to lack of financial resources.',
    fullDescriptionHindi: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय द्वारा पिछड़े वर्गों के विद्यार्थियों की शिक्षा को गति देने हेतु योजना।',
    authority: 'Ministry of Social Justice & Empowerment, Govt of India',
    authorityHindi: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय, भारत सरकार',
    level: 'central',
    tags: ['Scholarship', 'OBC/EBC', 'Central Govt', 'Direct Cash Transfer'],
    beneficiaryType: 'student',
    status: 'open',
    deadline: '2026-09-30',
    notificationDate: '2026-06-20',
    keyBenefit: 'Financial assistance up to ₹75,000 to ₹1,25,000 per year covering school tuition, hostel, and study material.',
    keyBenefitHindi: 'स्कूल/कॉलेज की पढ़ाई, हॉस्टल और अध्ययन सामग्री के लिए प्रति वर्ष ₹75,000 से ₹1,25,000 तक की सहायता।',
    detailedBenefits: [
      'Direct DBT credit to student account via National Scholarship Portal.',
      'Enables students to study in top identified schools and colleges across India.',
      'No application fees required.'
    ],
    officialUrl: 'https://scholarships.gov.in',
    notificationUrl: 'https://socialjustice.gov.in/schemes',
    applicationUrl: 'https://scholarships.gov.in',
    isOfficialSourceVerified: true,
    popularityScore: 93,
    lastVerifiedDate: '2026-05-01',
    eligibilityRequirements: {
      minAge: 14,
      maxAge: 25,
      educationLevels: ['10th', '12th', 'Diploma', 'Undergraduate'],
      allowedCategories: ['OBC', 'EWS'],
      maxFamilyIncome: 250000, // ₹2.5 Lakhs
      pwdEligible: true,
      requiresPhysical: false,
      customRequirements: [
        'Candidate must belong to OBC, EBC, or Nomadic/Semi-Nomadic Tribe category.',
        'Total annual family income must not exceed ₹2,50,000.'
      ]
    },
    requiredDocuments: [
      getDoc('aadhaar_card'),
      getDoc('caste_certificate'),
      getDoc('income_certificate'),
      getDoc('10th_marksheet'),
      getDoc('passport_photo')
    ],
    faqs: [
      {
        question: 'Who can apply under PM YASHASVI?',
        questionHindi: 'पीएम यशस्वी योजना के लिए कौन आवेदन कर सकता है?',
        answer: 'Students belonging to OBC, EBC, and DNT categories with family income under ₹2.5 Lakh.',
        answerHindi: 'ओबीसी, ईबीसी और विमुक्त जनजाति के छात्र जिनकी पारिवारिक आय ₹2.5 लाख से कम है।'
      }
    ]
  },

  // 9. SCHEME: National Fellowship for Persons with Disabilities (NFPwD)
  {
    id: 'nfpwd_scheme_2026',
    type: 'scheme',
    title: 'National Fellowship for Persons with Disabilities (NFPwD)',
    titleHindi: 'दिव्यांगजनों के लिए राष्ट्रीय फैलोशिप योजना (NFPwD)',
    shortDescription: '₹37,000+ monthly research fellowship + contingency grant for students with disabilities in higher education.',
    shortDescriptionHindi: 'उच्च शिक्षा और शोध में अध्ययनरत 40% या अधिक दिव्यांगता वाले छात्रों के लिए ₹37,000+ मासिक फैलोशिप।',
    fullDescription: 'Under the Department of Empowerment of Persons with Disabilities, UGC awards 200 fellowships annually to PwD candidates pursuing M.Phil and Ph.D degrees.',
    fullDescriptionHindi: 'दिव्यांगजन सशक्तिकरण विभाग द्वारा उच्च शोध (M.Phil / Ph.D) कर रहे दिव्यांग विद्यार्थियों को दी जाने वाली मासिक आर्थिक सहायता।',
    authority: 'DEPwD, Ministry of Social Justice / UGC',
    authorityHindi: 'दिव्यांगजन सशक्तिकरण विभाग / विश्वविद्यालय अनुदान आयोग',
    level: 'central',
    tags: ['PWD Exclusive', 'Fellowship', 'Higher Education', 'Monthly Stipend'],
    beneficiaryType: 'student',
    status: 'open',
    deadline: '2026-11-30',
    notificationDate: '2026-08-10',
    keyBenefit: 'Junior Research Fellow (JRF) rate of ₹37,000/month + HRA + ₹10,000 to ₹20,500 annual contingency grant.',
    keyBenefitHindi: '₹37,000 प्रति माह फैलोशिप + मकान किराया भत्ता (HRA) + वार्षिक आकस्मिक अनुदान।',
    detailedBenefits: [
      'Guaranteed financial independence throughout the research tenure (up to 5 years).',
      'Reader assistance allowance of ₹2,000/month in case of visual or severe physical handicap.',
      'No parental income ceiling applies.'
    ],
    officialUrl: 'https://ugc.gov.in',
    notificationUrl: 'https://disabilityaffairs.gov.in',
    applicationUrl: 'https://ugcnet.nta.ac.in',
    isOfficialSourceVerified: true,
    popularityScore: 88,
    lastVerifiedDate: '2026-05-01',
    eligibilityRequirements: {
      educationLevels: ['Postgraduate', 'Doctorate'],
      pwdEligible: true,
      requiresPhysical: false,
      customRequirements: [
        'Candidate must have a minimum of 40% disability certified by a competent medical authority (UDID card).',
        'Must have completed Master’s degree with at least 50% aggregate marks.',
        'Admitted to full-time regular research degree in a UGC recognized university.'
      ]
    },
    requiredDocuments: [
      getDoc('aadhaar_card'),
      getDoc('pwd_certificate'),
      getDoc('graduation_degree'),
      getDoc('passport_photo')
    ],
    faqs: [
      {
        question: 'Is UDID card mandatory for this fellowship?',
        questionHindi: 'क्या इस फैलोशिप के लिए UDID कार्ड अनिवार्य है?',
        answer: 'Yes, a valid government Disability Certificate or UDID card verifying 40%+ disability is mandatory.',
        answerHindi: 'हाँ, सक्षम चिकित्सा बोर्ड द्वारा जारी 40% या अधिक दिव्यांगता वाला प्रमाणपत्र आवश्यक है।'
      }
    ]
  }
];
