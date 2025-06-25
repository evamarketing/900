import { useState, useEffect } from 'react';
import { supabase, subscribeToRegistrations, subscribeToCategories, subscribeToPanchayaths, subscribeToAnnouncements } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Registration {
  id: string;
  full_name: string;
  mobile_number: string;
  whatsapp_number: string;
  address: string;
  panchayath_details: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_at?: string;
  unique_id?: string;
  user_id?: string;
}

interface Category {
  id: string;
  name: string;
  label: string;
  actual_fee: number;
  offer_fee: number;
  has_offer: boolean;
  image_url?: string;
}

interface Panchayath {
  id: string;
  malayalam_name: string;
  english_name: string;
  pincode?: string;
  district: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  link?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
}

interface PhotoGalleryItem {
  id: string;
  title: string;
  image_url: string;
  description?: string;
  category: string;
  uploaded_at: string;
}

interface PushNotification {
  id: string;
  title: string;
  content: string;
  target_audience: 'all' | 'category' | 'panchayath' | 'admin';
  target_value?: string;
  scheduled_at?: string;
  sent_at?: string;
  is_active: boolean;
  created_at: string;
}

export const useSupabaseData = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [panchayaths, setPanchayaths] = useState<Panchayath[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [photoGallery, setPhotoGallery] = useState<PhotoGalleryItem[]>([]);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories (public)
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch panchayaths (public)
      const { data: panchayathsData, error: panchayathsError } = await supabase
        .from('panchayaths')
        .select('*')
        .order('malayalam_name');
      
      if (panchayathsError) throw panchayathsError;
      setPanchayaths(panchayathsData || []);

      // Fetch announcements (public - active only)
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (announcementsError) throw announcementsError;
      setAnnouncements(announcementsData || []);

      // Fetch photo gallery (public)
      const { data: galleryData, error: galleryError } = await supabase
        .from('photo_gallery')
        .select('*')
        .order('uploaded_at', { ascending: false });
      
      if (galleryError) throw galleryError;
      setPhotoGallery(galleryData || []);

      if (user) {
        // Fetch registrations (user's own or all if admin)
        const registrationsQuery = supabase
          .from('registrations')
          .select('*')
          .order('submitted_at', { ascending: false });
        
        if (!isAdmin) {
          registrationsQuery.eq('user_id', user.id);
        }
        
        const { data: registrationsData, error: registrationsError } = await registrationsQuery;
        
        if (registrationsError) throw registrationsError;
        setRegistrations(registrationsData || []);

        // Fetch notifications (admin only)
        if (isAdmin) {
          const { data: notificationsData, error: notificationsError } = await supabase
            .from('push_notifications')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (notificationsError) throw notificationsError;
          const validNotifications = (notificationsData || []).filter(
            (notif): notif is PushNotification => 
              ['all', 'category', 'panchayath', 'admin'].includes(notif.target_audience)
          );
          setNotifications(validNotifications);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const unsubscribeRegistrations = subscribeToRegistrations((payload) => {
      console.log('Registration change:', payload);
      fetchData(); // Refresh all data when registrations change
    });

    const unsubscribeCategories = subscribeToCategories((payload) => {
      console.log('Category change:', payload);
      fetchData(); // Refresh all data when categories change
    });

    const unsubscribePanchayaths = subscribeToPanchayaths((payload) => {
      console.log('Panchayath change:', payload);
      fetchData(); // Refresh all data when panchayaths change
    });

    const unsubscribeAnnouncements = subscribeToAnnouncements((payload) => {
      console.log('Announcement change:', payload);
      fetchData(); // Refresh all data when announcements change
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeRegistrations();
      unsubscribeCategories();
      unsubscribePanchayaths();
      unsubscribeAnnouncements();
    };
  }, [user, isAdmin]);

  // Create registration
  const createRegistration = async (registrationData: Omit<Registration, 'id' | 'submitted_at' | 'user_id'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a registration.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert([{
          ...registrationData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted successfully.",
      });

      return data;
    } catch (error) {
      console.error('Error creating registration:', error);
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update registration status (admin only)
  const updateRegistrationStatus = async (id: string, status: 'approved' | 'rejected', uniqueId?: string) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to perform this action.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const updateData: any = {
        status,
        approved_at: new Date().toISOString(),
      };

      if (uniqueId) {
        updateData.unique_id = uniqueId;
      }

      const { error } = await supabase
        .from('registrations')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Registration Updated",
        description: `Registration has been ${status}.`,
      });

      return true;
    } catch (error) {
      console.error('Error updating registration:', error);
      toast({
        title: "Error",
        description: "Failed to update registration. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete registration (admin only)
  const deleteRegistration = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to perform this action.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Registration Deleted",
        description: "Registration has been deleted successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting registration:', error);
      toast({
        title: "Error",
        description: "Failed to delete registration. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Check application status by mobile number or unique ID
  const checkApplicationStatus = async (searchQuery: string) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .or(`mobile_number.eq.${searchQuery},unique_id.eq.${searchQuery.toUpperCase()}`)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error checking application status:', error);
      return null;
    }
  };

  return {
    registrations,
    categories,
    panchayaths,
    announcements,
    photoGallery,
    notifications,
    loading,
    createRegistration,
    updateRegistrationStatus,
    deleteRegistration,
    checkApplicationStatus,
    refreshData: fetchData,
  };
};