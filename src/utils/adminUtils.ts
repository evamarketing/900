
import { Registration, categories } from "@/types/admin";

export const generateUniqueId = (mobileNumber: string, fullName: string) => {
  const firstLetter = fullName.charAt(0).toUpperCase();
  return `ESP${mobileNumber}${firstLetter}`;
};

export const exportToCSV = (data: Registration[], filename: string) => {
  const headers = ['S.No', 'Full Name', 'Mobile Number', 'WhatsApp Number', 'Address', 'Panchayath', 'Category', 'Status', 'Submitted Date', 'Approved Date', 'Unique ID'];
  const csvContent = [
    headers.join(','),
    ...data.map((reg, index) => [
      index + 1,
      `"${reg.fullName}"`,
      reg.mobileNumber,
      reg.whatsappNumber,
      `"${reg.address.replace(/"/g, '""')}"`,
      `"${reg.panchayathDetails}"`,
      `"${categories.find(c => c.value === reg.category)?.label || reg.category}"`,
      reg.status.toUpperCase(),
      new Date(reg.submittedAt).toLocaleDateString(),
      reg.approvedAt ? new Date(reg.approvedAt).toLocaleDateString() : '',
      reg.uniqueId || ''
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToPDF = (data: Registration[], filename: string) => {
  const content = `SELF EMPLOYMENT DEVELOPMENT PROGRAM (SEDP)
REGISTRATION REPORT
${'='.repeat(80)}

Generated: ${new Date().toLocaleString()}
Total Records: ${data.length}
Report Type: ${filename.replace('.txt', '').replace(/_/g, ' ').toUpperCase()}

${'='.repeat(80)}

${data.map((reg, index) => `
${(index + 1).toString().padStart(3, '0')}. ${reg.fullName.toUpperCase()}
     Mobile: ${reg.mobileNumber} | WhatsApp: ${reg.whatsappNumber}
     Address: ${reg.address}
     Panchayath: ${reg.panchayathDetails}
     Category: ${categories.find(c => c.value === reg.category)?.label}
     Status: ${reg.status.toUpperCase()}
     Submitted: ${new Date(reg.submittedAt).toLocaleDateString()}${reg.approvedAt ? `
     Processed: ${new Date(reg.approvedAt).toLocaleDateString()}` : ''}${reg.uniqueId ? `
     Unique ID: ${reg.uniqueId}` : ''}
     ${'-'.repeat(70)}
`).join('')}

${'='.repeat(80)}
End of Report
Generated by SEDP Admin Panel
Contact: +91 9876543210 | Email: admin@sedp.com
${'='.repeat(80)}`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace('.pdf', '.txt');
  link.click();
  URL.revokeObjectURL(url);
};
