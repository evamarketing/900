
import { useSupabaseData } from './useSupabaseData';
import { categories as staticCategories } from '@/types/admin';

// Legacy adapter for backwards compatibility
export const useAdminData = () => {
  const {
    registrations: supabaseRegistrations,
    categories: supabaseCategories,
    panchayaths: supabasePanchayaths,
    announcements: supabaseAnnouncements,
    photoGallery: supabasePhotoGallery,
    notifications: supabaseNotifications,
    loading,
    createRegistration,
    updateRegistrationStatus,
    deleteRegistration,
    refreshData,
  } = useSupabaseData();

  // Transform Supabase data to match the expected format
  const registrations = supabaseRegistrations.map(reg => ({
    id: reg.id,
    fullName: reg.full_name,
    mobileNumber: reg.mobile_number,
    whatsappNumber: reg.whatsapp_number,
    address: reg.address,
    panchayathDetails: reg.panchayath_details,
    category: reg.category,
    status: reg.status,
    submittedAt: reg.submitted_at,
    approvedAt: reg.approved_at,
    uniqueId: reg.unique_id,
  }));

  const categoryFees = supabaseCategories.map(cat => ({
    category: cat.name,
    actualFee: cat.actual_fee,
    offerFee: cat.offer_fee,
    hasOffer: cat.has_offer,
    image: cat.image_url,
  }));

  const panchayaths = supabasePanchayaths.map(p => ({
    id: p.id,
    malayalamName: p.malayalam_name,
    englishName: p.english_name,
    pincode: p.pincode || '',
    district: p.district,
  }));

  const announcements = supabaseAnnouncements.map(ann => ({
    id: ann.id,
    title: ann.title,
    content: ann.content,
    link: ann.link,
    createdAt: ann.created_at,
    isActive: ann.is_active,
    category: ann.category,
  }));

  const photoGallery = supabasePhotoGallery.map(photo => ({
    id: photo.id,
    title: photo.title,
    imageUrl: photo.image_url,
    description: photo.description,
    category: photo.category,
    uploadedAt: photo.uploaded_at,
  }));

  const notifications = supabaseNotifications.map(notif => ({
    id: notif.id,
    title: notif.title,
    content: notif.content,
    targetAudience: notif.target_audience,
    targetValue: notif.target_value,
    scheduledAt: notif.scheduled_at,
    sentAt: notif.sent_at,
    isActive: notif.is_active,
    createdAt: notif.created_at,
  }));

  // Legacy update functions (now no-ops or minimal implementations)
  const updateRegistrations = async (newRegistrations: any[]) => {
    // This is handled by Supabase now
    console.log('Legacy updateRegistrations called - use Supabase methods instead');
  };

  const updateCategoryFees = async (newFees: any[]) => {
    console.log('Legacy updateCategoryFees called - use Supabase methods instead');
  };

  const updatePanchayaths = async (newPanchayaths: any[]) => {
    console.log('Legacy updatePanchayaths called - use Supabase methods instead');
  };

  const updateAnnouncements = async (newAnnouncements: any[]) => {
    console.log('Legacy updateAnnouncements called - use Supabase methods instead');
  };

  const updatePhotoGallery = async (newGallery: any[]) => {
    console.log('Legacy updatePhotoGallery called - use Supabase methods instead');
  };

  const updateNotifications = async (newNotifications: any[]) => {
    console.log('Legacy updateNotifications called - use Supabase methods instead');
  };

  return {
    registrations,
    categoryFees,
    panchayaths,
    announcements,
    photoGallery,
    notifications,
    loading,
    updateRegistrations,
    updateCategoryFees,
    updatePanchayaths,
    updateAnnouncements,
    updatePhotoGallery,
    updateNotifications,
    // Expose new Supabase methods
    createRegistration,
    updateRegistrationStatus,
    deleteRegistration,
    refreshData,
  };
};
