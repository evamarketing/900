export interface Registration {
  id: string;
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  address: string;
  panchayathDetails: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
  uniqueId?: string;
}

export interface CategoryFee {
  category: string;
  actualFee: number;
  offerFee: number;
  hasOffer: boolean;
  image?: string;
}

export interface Panchayath {
  id: string;
  malayalamName: string;
  englishName: string;
  pincode: string;
  district: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  link?: string;
  createdAt: string;
  isActive: boolean;
  category?: string;
}

export interface PhotoGallery {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  category: string;
  uploadedAt: string;
}

export interface PushNotification {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'category' | 'panchayath' | 'admin';
  targetValue?: string;
  scheduledAt?: string;
  sentAt?: string;
  isActive: boolean;
  createdAt: string;
}

export const categories = [
  { value: "pennyekart-free", label: "Pennyekart Free Registration" },
  { value: "pennyekart-paid", label: "Pennyekart Paid Registration" },
  { value: "farmelife", label: "FarmeLife" },
  { value: "foodelife", label: "FoodeLife" },
  { value: "organelife", label: "OrganeLife" },
  { value: "entrelife", label: "EntreLife" },
  { value: "job-card", label: "Job Card (All Categories)" }
];