export interface FAQItem {
  id: string;
  category: 'general' | 'eligibility' | 'documents' | 'exams' | 'schemes' | 'privacy';
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
}

export const SEED_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    questionEn: 'What does "Potential Match" mean in SWAYAM.SI?',
    questionHi: 'स्वयं.SI में "संभावित मेल (Potential Match)" का क्या अर्थ है?',
    answerEn: 'A "Potential Match" means that based on the basic details you shared (such as your age, education level, state, and category), you appear to meet the primary published criteria. It is an informational match to help you prioritize your research—not a formal government acceptance.',
    answerHi: '"संभावित मेल" का अर्थ है कि आपके द्वारा दर्ज की गई बुनियादी जानकारी (आयु, शिक्षा स्तर, राज्य और श्रेणी) के आधार पर आप प्रकाशित पात्रता मानकों को पूरा करते प्रतीत होते हैं। यह एक सूचनात्मक अनुमान है, आधिकारिक चयन नहीं।'
  },
  {
    id: 'faq-2',
    category: 'eligibility',
    questionEn: 'How accurate is the eligibility engine?',
    questionHi: 'पात्रता निर्धारण इंजन कितना सटीक है?',
    answerEn: 'Our eligibility engine uses deterministic, transparent rules coded directly from published official gazettes and recruitment notifications. Rather than guessing, we evaluate each parameter (age limits, relaxations, minimum marks, state domicile) one by one and tell you exactly what matches and what is missing.',
    answerHi: 'हमारा पात्रता इंजन आधिकारिक सरकारी अधिसूचनाओं के नियमों पर आधारित है। यह अनुमान लगाने के बजाय आपकी उम्र, शिक्षा, छूट और राज्य के नियमों का एक-एक करके पारदर्शी मिलान करता है।'
  },
  {
    id: 'faq-3',
    category: 'eligibility',
    questionEn: 'Why do you ask for my social category (General / OBC / SC / ST / EWS)?',
    questionHi: 'आप मेरी सामाजिक श्रेणी (General / OBC / SC / ST / EWS) क्यों पूछते हैं?',
    answerEn: 'In India, government recruitment exams and welfare schemes offer legal age relaxations (typically +3 years for OBC, +5 years for SC/ST), reduced application fees, and exclusive scholarship programs. We ask for your category solely to check if you qualify for these statutory provisions.',
    answerHi: 'भारतीय परीक्षाओं और योजनाओं में आयु में छूट (OBC को 3 वर्ष, SC/ST को 5 वर्ष), शुल्क में रियायत और विशेष छात्रवृत्तियां मिलती हैं। हम केवल इन लाभों की सटीक जांच के लिए श्रेणी पूछते हैं।'
  },
  {
    id: 'faq-4',
    category: 'exams',
    questionEn: 'What is the difference between a Central exam and a State exam?',
    questionHi: 'केंद्रीय परीक्षा और राज्य परीक्षा में क्या अंतर है?',
    answerEn: 'Central exams (like SSC, UPSC, Railways, Banking) recruit for ministries and departments across the whole country, with equal opportunity for all Indian citizens. State exams (like MPPSC, UPPSC, State Police) are conducted by specific state commissions and often prioritize permanent state residents (domicile holders).',
    answerHi: 'केंद्रीय परीक्षाएं (जैसे SSC, UPSC, रेलवे) पूरे देश के केंद्रीय मंत्रालयों के लिए होती हैं जहां सभी राज्यों के अभ्यर्थी समान रूप से आवेदन करते हैं। राज्य स्तरीय परीक्षाएं (जैसे MPPSC, UPPSC) विशेष राज्य सरकार द्वारा आयोजित होती हैं और इनमें स्थानीय मूल निवासियों को प्राथमिकता मिलती है।'
  },
  {
    id: 'faq-5',
    category: 'exams',
    questionEn: 'Why do certain exams ask for physical measurements?',
    questionHi: 'कुछ परीक्षाओं में शारीरिक माप (ऊंचाई और सीना) क्यों पूछा जाता है?',
    answerEn: 'Uniformed services (such as Police, Armed Forces, Paramilitary, and Forest Guards) require candidates to meet mandatory physical fitness standards (such as minimum height, chest expansion, and vision standard). SWAYAM.SI checks these before you apply so you do not waste effort on posts where you might be physically disqualified.',
    answerHi: 'वर्दीधारी सेवाओं (जैसे पुलिस, अर्धसैनिक बल, सिपाही) में न्यूनतम शारीरिक मानक अनिवार्य होते हैं। स्वयं.SI आवेदन से पहले ही इसकी जांच कर लेता है ताकि आप अनावश्यक समय और फीस व्यर्थ न करें।'
  },
  {
    id: 'faq-6',
    category: 'documents',
    questionEn: 'Do you store or upload my original documents?',
    questionHi: 'क्या आप मेरे मूल दस्तावेज़ अपलोड या स्टोर करते हैं?',
    answerEn: 'No. In this version, SWAYAM.SI only maintains a readiness checklist. We help you track which documents you already have and which you need to apply for. Your actual certificates remain in your custody; no images or sensitive PDFs are uploaded to any cloud server.',
    answerHi: 'बिल्कुल नहीं। इस संस्करण में स्वयं.SI केवल एक तैयारी चेकलिस्ट रखता है। हम केवल यह ट्रैक करने में मदद करते हैं कि आपके पास कौन से दस्तावेज़ तैयार हैं। आपके प्रमाणपत्र आपके पास ही रहते हैं, कोई भी फ़ाइल सर्वर पर अपलोड नहीं की जाती।'
  },
  {
    id: 'faq-7',
    category: 'general',
    questionEn: 'Can I apply for exams or schemes directly through SWAYAM.SI?',
    questionHi: 'क्या मैं सीधे स्वयं.SI से परीक्षा या योजना के लिए आवेदन कर सकता हूँ?',
    answerEn: 'No. SWAYAM.SI does not process government applications or collect government fees. We direct you directly to the verified official government portal (such as ssc.gov.in, scholarships.gov.in, upsc.gov.in) with a clear checklist of what to do.',
    answerHi: 'नहीं। स्वयं.SI कोई सरकारी आवेदन स्वीकार नहीं करता और न ही फीस लेता है। हम आपको आधिकारिक सरकारी वेबसाइट (जैसे ssc.gov.in, scholarships.gov.in) पर भेजते हैं और आवेदन करने के लिए आवश्यक तैयारी बताते हैं।'
  },
  {
    id: 'faq-8',
    category: 'privacy',
    questionEn: 'Where is my profile information stored?',
    questionHi: 'मेरी प्रोफ़ाइल जानकारी कहाँ सहेजी जाती है?',
    answerEn: 'All your profile details, saved opportunities, and document wallet statuses are stored exclusively in your browser\'s local storage on your own device. You can clear all data anytime with one click in the "My Profile" tab.',
    answerHi: 'आपकी प्रोफ़ाइल, सहेजी गई परीक्षाएं और दस्तावेज़ स्थिति केवल आपके अपने फ़ोन या कंप्यूटर के ब्राउज़र में सुरक्षित रहती है। आप जब चाहें "मेरी प्रोफ़ाइल" में जाकर एक क्लिक में पूरा डेटा मिटा सकते हैं।'
  }
];
