import { DocumentItem } from '../types/opportunity';

export const MASTER_DOCUMENTS: DocumentItem[] = [
  // IDENTITY
  {
    id: 'aadhaar_card',
    name: 'Aadhaar Card',
    group: 'IDENTITY',
    description: 'Government issued unique identity card linked with active mobile number for OTP authentication.',
    isMandatory: true,
    howToObtain: 'Download e-Aadhaar from uidai.gov.in or visit your nearest Aadhaar Seva Kendra.',
    officialIssuingAuthority: 'UIDAI (Unique Identification Authority of India)'
  },
  {
    id: 'pan_card',
    name: 'PAN Card',
    group: 'IDENTITY',
    description: 'Permanent Account Number card required for financial allowances, stipend disbursement, and identity.',
    isMandatory: false,
    howToObtain: 'Apply via NSDL or UTIITSL online portal.',
    officialIssuingAuthority: 'Income Tax Department of India'
  },

  // EDUCATION
  {
    id: '10th_marksheet',
    name: 'Class 10th Certificate / Marksheet',
    group: 'EDUCATION',
    description: 'Mandatory proof of date of birth and secondary school qualification across almost all recruitment exams.',
    isMandatory: true,
    howToObtain: 'Issued by your respective State Board / CBSE / ICSE.',
    officialIssuingAuthority: 'Secondary Education Board'
  },
  {
    id: '12th_marksheet',
    name: 'Class 12th Marksheet',
    group: 'EDUCATION',
    description: 'Required for intermediate-level posts, technical entries, and undergraduate admissions/scholarships.',
    isMandatory: true,
    howToObtain: 'Issued by your State School Education Board or CBSE/CISCE.',
    officialIssuingAuthority: 'Higher Secondary Board'
  },
  {
    id: 'graduation_degree',
    name: 'Graduation Degree / Final Provisional Certificate',
    group: 'EDUCATION',
    description: 'Required for all graduate-level recruitment exams (UPSC, SSC CGL, State PSC, Bank PO).',
    isMandatory: true,
    howToObtain: 'Collect from your affiliated University examination cell or DigiLocker.',
    officialIssuingAuthority: 'Recognized University / Institute'
  },

  // CATEGORY / RESERVATION
  {
    id: 'caste_certificate',
    name: 'Caste Certificate (OBC-NCL / SC / ST)',
    group: 'CATEGORY_RESERVATION',
    description: 'Required to avail age relaxation, lower fee cutoffs, and quota reservations. Must be in central/state format.',
    isMandatory: false,
    howToObtain: 'Apply through your state e-District portal or Tehsildar / SDO office.',
    officialIssuingAuthority: 'Revenue Department / Sub-Divisional Magistrate (SDM)'
  },
  {
    id: 'ews_certificate',
    name: 'EWS Income & Asset Certificate',
    group: 'CATEGORY_RESERVATION',
    description: 'Economically Weaker Section certificate for General category quota reservation.',
    isMandatory: false,
    howToObtain: 'Issued by designated Revenue Authority (SDM/Tehsildar).',
    officialIssuingAuthority: 'Revenue Department'
  },
  {
    id: 'pwd_certificate',
    name: 'Disability Certificate / UDID Card',
    group: 'CATEGORY_RESERVATION',
    description: 'Unique Disability ID card indicating 40% or more disability to claim PWD reservations and scribe facilities.',
    isMandatory: false,
    howToObtain: 'Issued by District Medical Board via swavlambancard.gov.in.',
    officialIssuingAuthority: 'District Chief Medical Officer (CMO)'
  },

  // RESIDENCE / INCOME
  {
    id: 'domicile_certificate',
    name: 'Domicile / Residence Certificate (Mool Niwas)',
    group: 'RESIDENCE_INCOME',
    description: 'Proof that you are a permanent resident of your state; required for state-specific quotas and state schemes.',
    isMandatory: false,
    howToObtain: 'Apply on state Lok Seva Kendra / e-District online portal with residence proof.',
    officialIssuingAuthority: 'District Magistrate / Tehsildar'
  },
  {
    id: 'income_certificate',
    name: 'Family Income Certificate (Aay Praman Patra)',
    group: 'RESIDENCE_INCOME',
    description: 'Required for financial welfare schemes, fee waivers, and EWS quota validity. Usually valid for 1 financial year.',
    isMandatory: false,
    howToObtain: 'Issued by Revenue Authority (Tehsildar/SDM) through state public service portals.',
    officialIssuingAuthority: 'Tehsildar / Taluk Office'
  },

  // OTHER
  {
    id: 'passport_photo',
    name: 'Recent Passport Sized Photograph',
    group: 'OTHER',
    description: 'White background, clear face, no sunglasses or caps, taken within last 3 months, usually 20KB-50KB JPG format.',
    isMandatory: true,
    howToObtain: 'Standard studio photograph scanned as digital JPG.',
    officialIssuingAuthority: 'Self / Authorized Photo Studio'
  },
  {
    id: 'signature_specimen',
    name: 'Digital Signature Specimen',
    group: 'OTHER',
    description: 'Black ink signature on clean white unruled paper, scanned clearly between 10KB-20KB.',
    isMandatory: true,
    howToObtain: 'Sign clearly in running hand on blank paper and scan/crop.',
    officialIssuingAuthority: 'Candidate'
  }
];
