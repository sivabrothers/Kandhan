import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Profile, User } from "../types";

export const generateInvoice = (user: User, profile: Profile | null, plan: any) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();
  const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(139, 0, 0); // Primary Red
  doc.text("Kandhan Kudil Matrimony", 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("செங்குந்தர் திருமண ஜாதக பரிவர்த்தனை மையம்", 14, 28);

  // Invoice Info
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.text("INVOICE", 140, 22);
  doc.setFontSize(10);
  doc.text(`Invoice No: ${invoiceNo}`, 140, 28);
  doc.text(`Date: ${date}`, 140, 34);

  // Bill To
  doc.setFontSize(12);
  doc.text("Bill To:", 14, 50);
  doc.setFontSize(10);
  doc.text(profile?.name || "Valued Member", 14, 56);
  doc.text(user.email, 14, 62);
  if (profile?.city) doc.text(`${profile.city}, ${profile.state}`, 14, 68);

  // Table
  autoTable(doc, {
    startY: 80,
    head: [['Description', 'Plan Type', 'Validity', 'Amount']],
    body: [
      [
        `Membership Subscription - ${plan.name}`,
        plan.name,
        plan.duration || "6 Months",
        `INR ${plan.price}`
      ]
    ],
    headStyles: { fillColor: [139, 0, 0] },
    alternateRowStyles: { fillColor: [255, 249, 245] }
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.text(`Subtotal: INR ${plan.price}`, 140, finalY);
  doc.text(`Tax (GST 0%): INR 0`, 140, finalY + 6);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: INR ${plan.price}`, 140, finalY + 14);

  // Footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150);
  doc.text("Thank you for choosing Kandhan Kudil Matrimony.", 14, 280);
  doc.text("This is a computer-generated invoice.", 14, 285);

  doc.save(`Kandhan_Kudil_Invoice_${invoiceNo}.pdf`);
};
