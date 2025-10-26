'use client';

import { jsPDF } from 'jspdf';
import type { Design } from './mock-data';
import type { User } from 'firebase/auth';

// This function is a placeholder for sending an email.
// In a real application, you would use a service like Firebase Functions with Nodemailer, SendGrid, or Mailgun.
const sendEmail = async (to: string, subject: string, body: string, pdfDataUri: string) => {
  console.log(`
    --- Mock Email ---
    To: ${to}
    Subject: ${subject}
    Body: ${body}
    Attachment: PDF is attached.
    --- End Mock Email ---
  `);
  // Here you would integrate with your email sending service.
  // Example with a hypothetical email service:
  //
  // await fetch('/api/send-email', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ to, subject, body, attachment: pdfDataUri }),
  // });
  return Promise.resolve();
};

export const generateAndEmailProof = async (design: Design, buyer: User, transactionId: string) => {
  const doc = new jsPDF();
  const purchaseDate = new Date();

  // --- PDF Content ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('TeeSpark - Proof of Purchase', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Transaction ID: ${transactionId}`, 105, 30, { align: 'center' });
  doc.text(`Purchase Date: ${purchaseDate.toLocaleDateString()} ${purchaseDate.toLocaleTimeString()}`, 105, 37, { align: 'center' });

  doc.line(20, 45, 190, 45); // Separator

  // Buyer Info
  doc.setFont('helvetica', 'bold');
  doc.text('Buyer Information', 20, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${buyer.displayName || 'N/A'}`, 20, 62);
  doc.text(`Email: ${buyer.email}`, 20, 69);

  // Designer Info
  doc.setFont('helvetica', 'bold');
  doc.text('Designer Information', 110, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${design.designer.name}`, 110, 62);
  doc.text(`Email: ${design.designer.id}@example.com`, 110, 69); // Mock designer email

  doc.line(20, 80, 190, 80); // Separator

  // Design Details
  doc.setFont('helvetica', 'bold');
  doc.text('Design Details', 20, 90);
  doc.setFont('helvetica', 'normal');
  doc.text(`Design Title: ${design.title}`, 20, 97);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Amount Paid:', 20, 107);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(3, 169, 81); // A green color
  doc.text(`$${design.price.toFixed(2)}`, 50, 107);
  
  doc.setTextColor(0, 0, 0); // Reset color
  
  doc.line(20, 115, 190, 115); // Separator

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text('Thank you for your purchase from TeeSpark!', 105, 130, { align: 'center' });
  doc.text('This document serves as your official receipt and proof of license.', 105, 135, { align: 'center' });

  const pdfDataUri = doc.output('datauristring');

  // --- Emailing ---
  const buyerSubject = `Your TeeSpark Purchase Receipt for "${design.title}"`;
  const buyerBody = `Hi ${buyer.displayName || 'Customer'},\n\nThank you for your purchase! Attached is the receipt for your purchase of "${design.title}".\n\nBest,\nThe TeeSpark Team`;
  
  const designerSubject = `Your design "${design.title}" has been sold!`;
  const designerBody = `Hi ${design.designer.name},\n\nGreat news! Your design "${design.title}" has been purchased. A proof of the transaction is attached.\n\nBest,\nThe TeeSpark Team`;

  // Send emails (mocked)
  await Promise.all([
    sendEmail(buyer.email!, buyerSubject, buyerBody, pdfDataUri),
    sendEmail(`${design.designer.id}@example.com`, designerSubject, designerBody, pdfDataUri)
  ]);
};
