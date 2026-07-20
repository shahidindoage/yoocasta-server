import { Response } from 'express';
import prisma from '../../config/db';
import PDFDocument from 'pdfkit';

const R2_BASE = process.env.R2_PUBLIC_URL as string;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const calculateAge = (dob: Date | null | undefined): number | null => {
  if (!dob) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

const fetchImageBuffer = async (url: string): Promise<Buffer | null> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
};

export const streamZCardPdf = async (talentUserIds: string[], res: Response) => {
  const talents = await prisma.user.findMany({
    where: { id: { in: talentUserIds }, role: 'TALENT' },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      image: true,
      nationality: { select: { name: true } },
      talentProfile: {
        select: {
          city: { select: { name: true, country: { select: { name: true } } } },
          dob: true,
        },
      },
    },
  });

  const doc = new PDFDocument({ size: 'A4', layout: 'portrait', margin: 40, autoFirstPage: false });
  doc.pipe(res);

  const cardH = 200;

  for (const t of talents) {
    doc.addPage();

    const pageW = doc.page.width - 80;
    const pageH = doc.page.height - 80;

    doc.roundedRect(20, 20, doc.page.width - 40, doc.page.height - 40, 8);
    doc.lineWidth(2).strokeColor('#C6007E').stroke();

    doc.roundedRect(28, 28, doc.page.width - 56, doc.page.height - 56, 6);
    doc.lineWidth(0.5).strokeColor('#ddd').stroke();

    doc.roundedRect(40, 40, pageW, cardH, 12);
    doc.fillColor('#f5f5f5').fill();
    doc.strokeColor('#ddd').lineWidth(1).stroke();

    const imgX = 60;
    const imgY = 55;
    const imgSize = 130;

    const imageUrl = t.image ? `${R2_BASE}/profile/${t.image}` : null;
    let imageBuffer: Buffer | null = null;
    if (imageUrl) {
      imageBuffer = await fetchImageBuffer(imageUrl);
    }

    if (imageBuffer) {
      doc.save();
      doc.circle(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2).clip();
      doc.image(imageBuffer, imgX, imgY, { width: imgSize, height: imgSize });
      doc.restore();
    } else {
      doc.circle(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2);
      doc.fillColor('#e0e0e0').fill();
      doc.fontSize(48).font('Helvetica').fillColor('#999');
      const initial = (t.firstName?.[0] || '?').toUpperCase();
      doc.text(initial, imgX + imgSize / 2 - 14, imgY + imgSize / 2 - 24);
    }

    const infoX = imgX + imgSize + 28;
    const infoY = imgY + 4;
    const lineH = 19;

    doc.fontSize(22).font('Helvetica-Bold').fillColor('#111');
    doc.text(`${t.firstName || ''} ${t.lastName || ''}`.trim(), infoX, infoY, { width: pageW - infoX + 40 - 60 });

    let y = infoY + 34;

    doc.fontSize(10).font('Helvetica').fillColor('#555');
    doc.text(`ID: ${t.id}`, infoX, y);
    y += lineH;

    if (t.nationality?.name) {
      doc.text(`Nationality: ${t.nationality.name}`, infoX, y);
      y += lineH;
    }

    if (t.talentProfile?.city) {
      const city = t.talentProfile.city.name;
      const country = t.talentProfile.city.country?.name;
      doc.text(`City: ${city}${country ? `, ${country}` : ''}`, infoX, y);
      y += lineH;
    }

    const age = calculateAge(t.talentProfile?.dob);
    if (age != null) {
      doc.text(`Age: ${age}`, infoX, y);
      y += lineH;
    }

    const profileUrl = `${FRONTEND_URL}/talent/${t.username}`;
    doc.fontSize(9).fillColor('#3835A4');
    doc.text('Profile: ', infoX, y, { continued: true });
    doc.fillColor('#C6007E');
    doc.text(profileUrl, { link: profileUrl, underline: true });

    doc.roundedRect(40, 40, 6, cardH, 3);
    doc.fillColor('#3835A4').fill();

    const footerY = doc.page.height - 60;
    doc.fontSize(7).font('Helvetica').fillColor('#888');
    doc.text('Email: casting@yoocasta.com   |   Phone: +971 123 456 789 |  Web: www.yoocasta.com', 40, footerY, { align: 'center', width: pageW });
  }

  doc.end();
};
