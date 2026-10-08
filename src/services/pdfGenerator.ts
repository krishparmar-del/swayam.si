import { jsPDF } from 'jspdf';
import { Opportunity, EligibilityResult, DocumentReadinessStatus } from '../types/opportunity';
import { UserProfile } from '../types/profile';
import { drawSwayamLogo } from './pdfLogo';

/**
 * Clean, lightweight, print-ready PDF generator with official vector logo and
 * ink-friendly high-legibility typography.
 */
export const PdfGenerator = {
  generateChecklistPdf(
    user: UserProfile,
    opportunity: Opportunity,
    eligibility: EligibilityResult,
    docWallet: Record<string, DocumentReadinessStatus>
  ): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Ink-efficient, high-contrast, light printable palette
    const primaryColor = [23, 75, 50];    // Forest Green #174B32
    const leafGreen = [39, 116, 72];      // Green #277448
    const darkGray = [33, 43, 37];        // Readable Charcoal #212B25
    const lightText = [80, 92, 85];       // Soft readable gray #505C55
    const hairlineColor = [215, 222, 218]; // Crisp light border #D7DEDA
    const bannerBg = [248, 250, 248];     // Crisp ultra-light background
    const whiteBg = [255, 255, 255];

    let y = 14;

    // 1. Top Printable Header with Official Logo Emblem & Wordmark
    // Clean minimal card with fine hairline border
    doc.setFillColor(bannerBg[0], bannerBg[1], bannerBg[2]);
    doc.roundedRect(14, y, 182, 26, 2, 2, 'F');
    doc.setDrawColor(hairlineColor[0], hairlineColor[1], hairlineColor[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, y, 182, 26, 2, 2, 'D');

    // Draw Official SWAYAM.SI Vector Logo (Emblem + Wordmark + Tagline)
    drawSwayamLogo(doc, 18, y + 4, {
      scale: 1.05,
      showWordmark: true,
      subtitle: 'CIVIC OPPORTUNITY NAVIGATOR · VERIFIED PRINTABLE CHECKLIST'
    });

    // Date & Document ID in top-right
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(lightText[0], lightText[1], lightText[2]);
    doc.text(
      `Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      190,
      y + 9,
      { align: 'right' }
    );
    doc.text(
      `Ref: SWY-${opportunity.id.substring(0, 8).toUpperCase()}`,
      190,
      y + 14,
      { align: 'right' }
    );

    y += 32;

    // 2. Candidate Profile Summary (Clean light text block)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('1. APPLICANT PROFILE SUMMARY', 14, y);
    y += 3.5;

    doc.setFillColor(whiteBg[0], whiteBg[1], whiteBg[2]);
    doc.setDrawColor(hairlineColor[0], hairlineColor[1], hairlineColor[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, y, 182, 17, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

    doc.text(`Candidate Name: ${user.name || 'Citizen'}`, 18, y + 5.5);
    doc.text(`Age: ${user.age} Years`, 82, y + 5.5);
    doc.text(`Category: ${user.category}`, 134, y + 5.5);

    doc.text(`Domicile: ${user.state}`, 18, y + 11.5);
    doc.text(`Education: ${user.educationLevel} ${user.degreeName ? `(${user.degreeName})` : ''}`, 82, y + 11.5);
    doc.text(`Disability (PWD): ${user.isPwd ? 'Yes' : 'No'}`, 134, y + 11.5);

    y += 23;

    // 3. Opportunity Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('2. TARGET OPPORTUNITY & RECRUITMENT COMMISSION', 14, y);
    y += 3.5;

    doc.setFillColor(whiteBg[0], whiteBg[1], whiteBg[2]);
    doc.roundedRect(14, y, 182, 22, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(opportunity.title, 18, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(lightText[0], lightText[1], lightText[2]);
    doc.text(`Authority: ${opportunity.authority}`, 18, y + 10.5);
    doc.text(`Level: ${opportunity.level.toUpperCase()} ${opportunity.state ? `(${opportunity.state})` : ''}`, 115, y + 10.5);
    doc.text(`Deadline: ${opportunity.deadline || 'Consult official gazette notification'}`, 18, y + 15.5);
    doc.text(`Official Portal: ${opportunity.officialUrl}`, 115, y + 15.5);

    y += 28;

    // 4. Eligibility Evaluation (Clean scorecard)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('3. ELIGIBILITY MATCH BREAKDOWN', 14, y);
    y += 3.5;

    // Light Match Pill Bar
    doc.setFillColor(bannerBg[0], bannerBg[1], bannerBg[2]);
    doc.setDrawColor(hairlineColor[0], hairlineColor[1], hairlineColor[2]);
    doc.roundedRect(14, y, 182, 9, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`Result: ${eligibility.status.replace(/_/g, ' ')}`, 18, y + 5.8);
    doc.setTextColor(leafGreen[0], leafGreen[1], leafGreen[2]);
    doc.text(`Match Index: ${eligibility.matchScore}%`, 140, y + 5.8);
    y += 11;

    // Eligibility Criteria rows (Clean, light text for easy printing)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);

    eligibility.checks.slice(0, 5).forEach((check) => {
      const isPass = check.status === 'pass';
      const isWarn = check.status === 'missing' || check.status === 'warning';

      if (isPass) {
        doc.setTextColor(leafGreen[0], leafGreen[1], leafGreen[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('[PASS]', 18, y);
      } else if (isWarn) {
        doc.setTextColor(180, 110, 20);
        doc.setFont('helvetica', 'bold');
        doc.text('[INFO]', 18, y);
      } else {
        doc.setTextColor(170, 45, 45);
        doc.setFont('helvetica', 'bold');
        doc.text('[FAIL]', 18, y);
      }

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text(`${check.criterion}:`, 32, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(lightText[0], lightText[1], lightText[2]);
      doc.text(`Your profile: ${check.userValue} (Req: ${check.requiredValue})`, 76, y);
      y += 4.8;
    });

    y += 4;

    // 5. Document Readiness Checklist Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('4. MANDATORY & SUPPORTING DOCUMENT CHECKLIST', 14, y);
    y += 3.5;

    // Crisp Table Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(14, y, 182, 6.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(255, 255, 255);
    doc.text('Document Name', 18, y + 4.5);
    doc.text('Classification', 110, y + 4.5);
    doc.text('Your Wallet Status', 152, y + 4.5);
    y += 6.5;

    // Document Rows
    opportunity.requiredDocuments.forEach((docItem, index) => {
      if (index % 2 === 1) {
        doc.setFillColor(250, 252, 250);
        doc.rect(14, y, 182, 5.8, 'F');
      }

      const status = docWallet[docItem.id] || 'missing';
      const statusLabel =
        status === 'ready' ? 'HAVE (Ready in Hand)' :
        status === 'action_needed' ? 'GETTING (In Process)' :
        status === 'missing' ? 'MISSING (Action Needed)' : 'NOT REQUIRED';

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.4);
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text(docItem.name.substring(0, 48), 18, y + 4);

      doc.setTextColor(lightText[0], lightText[1], lightText[2]);
      doc.text(docItem.isMandatory ? 'Mandatory' : 'Relaxation/Supporting', 110, y + 4);

      if (status === 'ready') {
        doc.setTextColor(leafGreen[0], leafGreen[1], leafGreen[2]);
        doc.setFont('helvetica', 'bold');
      } else if (status === 'action_needed') {
        doc.setTextColor(180, 110, 20);
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setTextColor(170, 45, 45);
        doc.setFont('helvetica', 'bold');
      }
      doc.text(statusLabel, 152, y + 4);

      // Light row divider
      doc.setDrawColor(235, 240, 236);
      doc.setLineWidth(0.2);
      doc.line(14, y + 5.8, 196, y + 5.8);

      y += 5.8;
    });

    y += 6;

    // 6. Actionable Next Steps
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('5. NEXT STEPS & OFFICIAL APPLICATION INSTRUCTIONS', 14, y);
    y += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.6);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text('1. Cross-verify qualifications against the published official gazette / notification PDF.', 18, y + 3.5);
    doc.text('2. Scan and prepare any documents marked [MISSING] or [GETTING] before the application closes.', 18, y + 7.5);
    doc.text(`3. Submit online application directly at the authorized portal: ${opportunity.applicationUrl || opportunity.officialUrl}`, 18, y + 11.5);
    y += 16;

    // 7. Statutory Civic Disclaimer (Light, ink-friendly print border)
    doc.setFillColor(254, 252, 247);
    doc.setDrawColor(230, 215, 185);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, y, 182, 13, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(140, 95, 25);
    doc.text('STATUTORY CIVIC DISCLAIMER & INFORMATIONAL USE NOTICE:', 18, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(115, 95, 65);
    doc.text('SWAYAM.SI is an independent informational civic-tech navigator. It does not issue admit cards or guarantee selection.', 18, y + 7.5);
    doc.text('Final eligibility and verification rest exclusively with the conducting ministry or commission.', 18, y + 10.8);

    // Save and trigger clean download
    const filename = `SWAYAM_Checklist_${opportunity.id}_${(user.name || 'Candidate').replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
  }
};
