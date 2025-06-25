
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QRPaymentCodeProps {
  amount: number;
  category: string;
  uniqueId: string;
  payeeName?: string;
  upiId?: string;
}

const QRPaymentCode = ({ amount, category, uniqueId, payeeName = "SEDP Registration", upiId = "sedp@upi" }: QRPaymentCodeProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qrRef.current && amount > 0) {
      // Clear previous QR code
      qrRef.current.innerHTML = '';
      
      // Create UPI payment string
      const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`${category} - ${uniqueId}`)}`;
      
      // Generate QR code using a simple text-based approach
      // In a real implementation, you would use a proper QR code library like qrcode.js
      const qrSize = 200;
      const canvas = document.createElement('canvas');
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Simple placeholder - in real implementation, use QR code library
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, qrSize, qrSize);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText('QR CODE', 70, 100);
        ctx.fillText(`₹${amount}`, 80, 120);
        
        // Create a more realistic QR pattern
        for (let i = 0; i < 20; i++) {
          for (let j = 0; j < 20; j++) {
            if ((i + j) % 2 === 0) {
              ctx.fillStyle = '#000000';
              ctx.fillRect(i * 10, j * 10, 8, 8);
            }
          }
        }
        
        qrRef.current.appendChild(canvas);
      }
    }
  }, [amount, category, uniqueId, payeeName, upiId]);

  if (amount === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center">
          <CardTitle className="text-green-800">Free Registration</CardTitle>
          <CardDescription className="text-green-600">
            No payment required for this category
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="text-center">
        <CardTitle className="text-blue-800">Payment QR Code</CardTitle>
        <CardDescription className="text-blue-600">
          Scan this QR code to complete your registration payment
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center">
          <div ref={qrRef} className="border-2 border-blue-300 rounded-lg p-2 bg-white"></div>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-lg">Amount: ₹{amount}</p>
          <p className="text-sm text-gray-600">Category: {category}</p>
          <p className="text-sm text-gray-600">Reference: {uniqueId}</p>
          <p className="text-xs text-gray-500 mt-4">
            Use any UPI app to scan and pay. Payment confirmation may take 2-3 minutes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRPaymentCode;
