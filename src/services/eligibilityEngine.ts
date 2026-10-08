import { UserProfile, EducationLevel } from '../types/profile';
import { Opportunity, EligibilityResult, CriterionCheck, MatchStatus, PhysicalRequirement } from '../types/opportunity';

const EDUCATION_RANK: Record<EducationLevel, number> = {
  '10th': 1,
  '12th': 2,
  'Diploma': 2,
  'Undergraduate': 3,
  'Postgraduate': 4,
  'Doctorate': 5,
};

export const EligibilityEngine = {
  evaluate(user: UserProfile, opportunity: Opportunity): EligibilityResult {
    const checks: CriterionCheck[] = [];
    const missingFields: string[] = [];
    let passCount = 0;
    let totalCriteria = 0;
    let hasHardFail = false;
    let hasMissingCritical = false;

    const reqs = opportunity.eligibilityRequirements;

    // 1. Age Evaluation (with Category Relaxation)
    if (reqs.minAge !== undefined || reqs.maxAge !== undefined) {
      totalCriteria++;
      const minAge = reqs.minAge ?? 18;
      let maxAge = reqs.maxAge ?? 35;

      // Apply statutory category relaxation
      let relaxation = 0;
      if (reqs.ageRelaxation && reqs.ageRelaxation[user.category]) {
        relaxation = reqs.ageRelaxation[user.category] || 0;
        maxAge += relaxation;
      }

      const userAge = user.age;
      const isAgeValid = userAge >= minAge && userAge <= maxAge;

      if (isAgeValid) {
        passCount++;
        checks.push({
          criterion: 'Age Requirement',
          userValue: `${userAge} years`,
          requiredValue: `${minAge} - ${reqs.maxAge}${relaxation > 0 ? ` (+${relaxation} yrs for ${user.category})` : ''}`,
          status: 'pass',
          message: '✓ Age requirement met',
          detail: relaxation > 0 ? `Includes +${relaxation} years relaxation for ${user.category}.` : 'Within general age band.'
        });
      } else {
        hasHardFail = true;
        checks.push({
          criterion: 'Age Requirement',
          userValue: `${userAge} years`,
          requiredValue: `${minAge} - ${maxAge} years`,
          status: 'fail',
          message: '✕ Age limit exceeded or below threshold',
          detail: userAge > maxAge 
            ? `Current age (${userAge}) exceeds maximum permissible limit of ${maxAge} years.`
            : `Current age (${userAge}) is below minimum requirement of ${minAge} years.`
        });
      }
    }

    // 2. Education Level Evaluation
    if (reqs.educationLevels && reqs.educationLevels.length > 0) {
      totalCriteria++;
      const userRank = EDUCATION_RANK[user.educationLevel] || 0;
      const minReqRank = Math.min(...reqs.educationLevels.map(lvl => EDUCATION_RANK[lvl] || 0));
      const isEduMatch = userRank >= minReqRank || reqs.educationLevels.includes(user.educationLevel);

      if (isEduMatch) {
        passCount++;
        checks.push({
          criterion: 'Education Level',
          userValue: user.educationLevel + (user.degreeName ? ` (${user.degreeName})` : ''),
          requiredValue: reqs.educationLevels.join(' or '),
          status: 'pass',
          message: '✓ Educational qualification satisfied',
          detail: `Your qualification meets or exceeds the required level.`
        });
      } else {
        hasHardFail = true;
        checks.push({
          criterion: 'Education Level',
          userValue: user.educationLevel,
          requiredValue: reqs.educationLevels.join(' or '),
          status: 'fail',
          message: '✕ Higher qualification required',
          detail: `Requires at least ${reqs.educationLevels.join(' / ')}.`
        });
      }
    }

    // 3. State Domicile Evaluation
    if (reqs.allowedStates && reqs.allowedStates.length > 0) {
      totalCriteria++;
      const isAllIndia = reqs.allowedStates.includes('All India');
      const isStateMatch = isAllIndia || reqs.allowedStates.includes(user.state);

      if (isStateMatch) {
        passCount++;
        checks.push({
          criterion: 'State / Domicile',
          userValue: user.state,
          requiredValue: reqs.allowedStates.join(', '),
          status: 'pass',
          message: '✓ State criteria satisfied',
          detail: isAllIndia ? 'Open to candidates from all Indian States & UTs.' : `Resident of eligible state (${user.state}).`
        });
      } else {
        hasHardFail = true;
        checks.push({
          criterion: 'State / Domicile',
          userValue: user.state,
          requiredValue: reqs.allowedStates.join(', '),
          status: 'fail',
          message: '✕ State specific restriction',
          detail: `Exclusively for domicile residents of ${reqs.allowedStates.join(', ')}.`
        });
      }
    }

    // 4. Social Category Evaluation
    if (reqs.allowedCategories && reqs.allowedCategories.length > 0) {
      totalCriteria++;
      if (reqs.allowedCategories.includes(user.category)) {
        passCount++;
        checks.push({
          criterion: 'Category Eligibility',
          userValue: user.category,
          requiredValue: reqs.allowedCategories.join(' / '),
          status: 'pass',
          message: '✓ Category criteria satisfied',
          detail: `You belong to one of the specified beneficiary categories.`
        });
      } else {
        hasHardFail = true;
        checks.push({
          criterion: 'Category Eligibility',
          userValue: user.category,
          requiredValue: reqs.allowedCategories.join(' / '),
          status: 'fail',
          message: '✕ Specific category required',
          detail: `This scheme is exclusively earmarked for ${reqs.allowedCategories.join(', ')} applicants.`
        });
      }
    }

    // 5. PWD (Person with Disability) Evaluation
    if (user.isPwd) {
      totalCriteria++;
      if (reqs.pwdEligible) {
        passCount++;
        checks.push({
          criterion: 'Disability (PWD) Reservation',
          userValue: `PWD (${user.pwdPercentage || 40}%+)`,
          requiredValue: 'PWD Eligible & Scribe Allowed',
          status: 'pass',
          message: '✓ Post is identified suitable for PWD',
          detail: 'Reservations, compensatory time, and scribe facilities available as per DoPT norms.'
        });
      } else {
        hasHardFail = true;
        checks.push({
          criterion: 'Disability (PWD) Exemption',
          userValue: 'PWD Candidate',
          requiredValue: 'Exempt from PWD (Uniformed Service)',
          status: 'fail',
          message: '✕ Post not identified for PWD',
          detail: 'Uniformed armed forces and tactical posts are statutory exemptions under RPwD Act.'
        });
      }
    }

    // 6. Annual Family Income (Welfare schemes)
    if (reqs.maxFamilyIncome !== undefined) {
      totalCriteria++;
      if (user.annualFamilyIncome === undefined) {
        hasMissingCritical = true;
        missingFields.push('annualFamilyIncome');
        checks.push({
          criterion: 'Annual Family Income',
          userValue: 'Not provided in profile',
          requiredValue: `Up to ₹${(reqs.maxFamilyIncome / 100000).toFixed(1)} Lakhs / year`,
          status: 'missing',
          message: '? Income information needed',
          detail: 'We need your annual family income to verify if you qualify for this financial grant.'
        });
      } else {
        const isIncomeEligible = user.annualFamilyIncome <= reqs.maxFamilyIncome;
        if (isIncomeEligible) {
          passCount++;
          checks.push({
            criterion: 'Annual Family Income',
            userValue: `₹${(user.annualFamilyIncome / 100000).toFixed(1)} Lakhs`,
            requiredValue: `Under ₹${(reqs.maxFamilyIncome / 100000).toFixed(1)} Lakhs`,
            status: 'pass',
            message: '✓ Family income within ceiling limit',
            detail: 'Qualifies for means-tested government benefit.'
          });
        } else {
          hasHardFail = true;
          checks.push({
            criterion: 'Annual Family Income',
            userValue: `₹${(user.annualFamilyIncome / 100000).toFixed(1)} Lakhs`,
            requiredValue: `Max ₹${(reqs.maxFamilyIncome / 100000).toFixed(1)} Lakhs`,
            status: 'fail',
            message: '✕ Income exceeds permissible ceiling',
            detail: `Reported income is higher than maximum scheme threshold.`
          });
        }
      }
    }

    // 7. Physical Requirements (if applicable)
    if (reqs.requiresPhysical && opportunity.physicalRequirements) {
      totalCriteria++;
      const physReq = opportunity.physicalRequirements;
      const userPhys = user.physicalMeasurements;

      if (!userPhys || userPhys.heightCm === undefined) {
        missingFields.push('physicalMeasurements');
        checks.push({
          criterion: 'Physical Standards (PST)',
          userValue: 'Measurements pending',
          requiredValue: `Height ≥ ${physReq.minHeightCm}cm (Male)`,
          status: 'warning',
          message: '? Physical criteria check recommended',
          detail: 'Uniformed post with mandatory height and chest standards. Tap "Check Physical Criteria".'
        });
      } else {
        // Physical evaluation
        const physResult = this.evaluatePhysical(userPhys, physReq, user.gender || 'Male');
        if (physResult.isQualified) {
          passCount++;
          checks.push({
            criterion: 'Physical Standards (PST)',
            userValue: `Height: ${userPhys.heightCm}cm, Chest: ${userPhys.chestCm || '-'}cm`,
            requiredValue: `Min Height: ${physReq.minHeightCm}cm`,
            status: 'pass',
            message: '✓ Meets published physical standards',
            detail: 'Height and chest specifications appear within qualifying range.'
          });
        } else {
          hasHardFail = true;
          checks.push({
            criterion: 'Physical Standards (PST)',
            userValue: `Height: ${userPhys.heightCm}cm`,
            requiredValue: `Min Height: ${physReq.minHeightCm}cm`,
            status: 'fail',
            message: '✕ Physical standards not met',
            detail: physResult.reason
          });
        }
      }
    }

    // Overall Status Computation
    let status: MatchStatus = 'POSSIBLY_ELIGIBLE';
    if (hasHardFail) {
      status = 'NOT_ELIGIBLE';
    } else if (hasMissingCritical) {
      status = 'MORE_INFORMATION_REQUIRED';
    } else if (passCount === totalCriteria && totalCriteria > 0) {
      status = 'ELIGIBLE';
    } else {
      status = 'POSSIBLY_ELIGIBLE';
    }

    // Match score heuristic (0 to 100)
    let matchScore = 0;
    if (status === 'ELIGIBLE') {
      matchScore = 95;
    } else if (status === 'POSSIBLY_ELIGIBLE') {
      matchScore = Math.max(70, Math.round((passCount / Math.max(1, totalCriteria)) * 90));
    } else if (status === 'MORE_INFORMATION_REQUIRED') {
      matchScore = 65;
    } else {
      matchScore = Math.max(15, Math.round((passCount / Math.max(1, totalCriteria)) * 40));
    }

    return {
      status,
      matchScore,
      scoreExplanation: 'Match score is an informational estimate based on the details you provided.',
      summary: status === 'ELIGIBLE' 
        ? 'You appear to meet all primary criteria based on your current profile.'
        : status === 'MORE_INFORMATION_REQUIRED'
        ? 'You may be eligible, but additional details are needed to confirm.'
        : status === 'POSSIBLY_ELIGIBLE'
        ? 'You meet core requirements; verify exact sub-clauses in official notification.'
        : 'Based on current details, you do not meet one or more primary criteria.',
      checks,
      missingFields,
      disclaimer: 'Informational assessment only. Final eligibility is determined exclusively by the official recruiting authority upon document verification.'
    };
  },

  evaluatePhysical(
    measurements: NonNullable<UserProfile['physicalMeasurements']>,
    reqs: PhysicalRequirement,
    gender: 'Male' | 'Female' | 'Other'
  ): { isQualified: boolean; reason: string } {
    const isFemale = gender === 'Female';
    const effectiveMinHeight = isFemale ? Math.max(152, (reqs.minHeightCm || 165) - 13) : (reqs.minHeightCm || 165);

    if (measurements.heightCm !== undefined && measurements.heightCm < effectiveMinHeight) {
      return {
        isQualified: false,
        reason: `Your height (${measurements.heightCm} cm) is below minimum required (${effectiveMinHeight} cm).`
      };
    }

    if (!isFemale && reqs.minChestCm !== undefined && measurements.chestCm !== undefined) {
      if (measurements.chestCm < reqs.minChestCm) {
        return {
          isQualified: false,
          reason: `Chest measurement (${measurements.chestCm} cm) is below minimum (${reqs.minChestCm} cm).`
        };
      }
    }

    if (reqs.allowsColorBlindness === false && measurements.colorBlindness) {
      return {
        isQualified: false,
        reason: 'Candidates with color vision deficiency are disqualified for this post.'
      };
    }

    return {
      isQualified: true,
      reason: 'Measurements satisfy basic published physical standards.'
    };
  }
};
