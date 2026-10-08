import { jsPDF } from 'jspdf';

/**
 * Draws the official SWAYAM.SI Brand Logo Emblem & Wordmark on a jsPDF canvas.
 * Designed with light, crisp lines and high-contrast vector fidelity for clean, ink-efficient printing.
 */
export function drawSwayamLogo(
  doc: jsPDF,
  x: number,
  y: number,
  options?: {
    scale?: number;
    showWordmark?: boolean;
    subtitle?: string;
  }
): void {
  const scale = options?.scale ?? 1.0;
  const showWordmark = options?.showWordmark ?? true;

  // Colors
  const forestGreen = [23, 75, 50]; // #174B32
  const leafGreen = [39, 116, 72];   // #277448
  const emeraldGreen = [63, 163, 99]; // #3FA363
  const marigold = [242, 169, 59];   // #F2A93B
  const textMuted = [102, 115, 107]; // #66736B

  doc.saveGraphicsState();

  // Draw Logo Emblem (Vector Open Book with Sprouting Leaf & Star)
  // Dimensions roughly 12mm x 12mm at scale = 1
  const w = 12 * scale;
  const h = 12 * scale;
  const ox = x;
  const oy = y;

  // Book Base curve 1 (Left & Right pages)
  doc.setFillColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.circle(ox + 4 * scale, oy + 9 * scale, 2.5 * scale, 'F');
  doc.circle(ox + 8 * scale, oy + 9 * scale, 2.5 * scale, 'F');

  // Center sprout leaf
  doc.setFillColor(leafGreen[0], leafGreen[1], leafGreen[2]);
  doc.ellipse(ox + 6 * scale, oy + 5.5 * scale, 2.2 * scale, 3.8 * scale, 'F');

  // Supporting side leaf
  doc.setFillColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.ellipse(ox + 4.5 * scale, oy + 6 * scale, 1.4 * scale, 2.4 * scale, 'F');

  // Guiding Star / Aspirant Head (Marigold golden badge)
  doc.setFillColor(marigold[0], marigold[1], marigold[2]);
  doc.circle(ox + 7.5 * scale, oy + 2.8 * scale, 1.3 * scale, 'F');

  // Star sparkle dot
  doc.setFillColor(255, 255, 255);
  doc.circle(ox + 7.5 * scale, oy + 2.8 * scale, 0.4 * scale, 'F');

  // Wordmark
  if (showWordmark) {
    const textStartX = ox + w + 3;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14 * scale);
    doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
    doc.text('SWAYAM', textStartX, oy + 6 * scale);

    // .SI Accent
    const swayamWidth = doc.getTextWidth('SWAYAM');
    doc.setTextColor(leafGreen[0], leafGreen[1], leafGreen[2]);
    doc.text('.SI', textStartX + swayamWidth, oy + 6 * scale);

    // Subtitle tagline with crisp light print styling
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5 * scale);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const subtitle = options?.subtitle || 'CIVIC OPPORTUNITY NAVIGATOR · AAPKE SAATH';
    doc.text(subtitle, textStartX, oy + 10 * scale);
  }

  doc.restoreGraphicsState();
}
