import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Database } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import AdminStats from "./admin/AdminStats";
import RegistrationFilters from "./admin/RegistrationFilters";
import RegistrationsTable from "./admin/RegistrationsTable";
import FeeManagement from "./admin/FeeManagement";
import PanchayathManager from "./admin/PanchayathManager";
import AnnouncementManager from "./admin/AnnouncementManager";
import PhotoGalleryManager from "./admin/PhotoGalleryManager";
import NotificationManager from "./admin/NotificationManager";
import AdminSetup from "./AdminSetup";
import AdminDashboard from "./AdminDashboard";

const AdminPanel = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { 
    registrations, 
    categories, 
    panchayaths, 
    announcements, 
    photoGallery, 
    notifications,
    loading: dataLoading,
    updateRegistrationStatus,
    deleteRegistration,
    refreshData
  } = useSupabaseData();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Please sign in to access the admin panel.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto p-4">
          <AdminSetup />
        </div>
      </div>
    );
  }

  // Transform data for legacy components
  const legacyRegistrations = registrations.map(reg => ({
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

  const legacyCategoryFees = categories.map(cat => ({
    category: cat.name,
    actualFee: cat.actual_fee,
    offerFee: cat.offer_fee,
    hasOffer: cat.has_offer,
    image: cat.image_url,
  }));

  const legacyPanchayaths = panchayaths.map(p => ({
    id: p.id,
    malayalamName: p.malayalam_name,
    englishName: p.english_name,
    pincode: p.pincode || '',
    district: p.district,
  }));

  const legacyAnnouncements = announcements.map(ann => ({
    id: ann.id,
    title: ann.title,
    content: ann.content,
    link: ann.link,
    createdAt: ann.created_at,
    isActive: ann.is_active,
    category: ann.category,
  }));

  const legacyPhotoGallery = photoGallery.map(photo => ({
    id: photo.id,
    title: photo.title,
    imageUrl: photo.image_url,
    description: photo.description,
    category: photo.category,
    uploadedAt: photo.uploaded_at,
  }));

  const legacyNotifications = notifications.map(notif => ({
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

  // Filter registrations
  const filteredRegistrations = legacyRegistrations.filter(registration => {
    const matchesSearch = 
      registration.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.mobileNumber.includes(searchTerm) ||
      registration.panchayathDetails.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || registration.category === filterCategory;
    const matchesStatus = filterStatus === "all" || registration.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRegistrations(filteredRegistrations.map(reg => reg.id));
    } else {
      setSelectedRegistrations([]);
    }
  };

  const handleSelectRegistration = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRegistrations(prev => [...prev, id]);
    } else {
      setSelectedRegistrations(prev => prev.filter(regId => regId !== id));
    }
  };

  const handleApproval = async (id: string, action: 'approve' | 'reject') => {
    const registration = legacyRegistrations.find(reg => reg.id === id);
    if (!registration) return;

    let uniqueId = undefined;
    const status = action === 'approve' ? 'approved' : 'rejected';
    
    if (action === 'approve') {
      const firstLetter = registration.fullName.charAt(0).toUpperCase();
      uniqueId = `ESP${registration.mobileNumber}${firstLetter}`;
    }

    await updateRegistrationStatus(id, status, uniqueId);
  };

  const handleEdit = (registration: any) => {
    console.log('Edit registration:', registration);
    // TODO: Implement edit functionality
  };

  const handleDelete = async (id: string) => {
    await deleteRegistration(id);
  };

  const handleChangeCategory = (registration: any) => {
    console.log('Change category for:', registration);
    // TODO: Implement change category functionality
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Self Employment Development Program</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="w-3 h-3 mr-1" />
            Administrator
          </Badge>
          {user.email === 'evamarketingsolutions@gmail.com' && (
            <Badge className="bg-green-600 text-white">
              <Database className="w-3 h-3 mr-1" />
              Primary Admin
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="fees">Category Fees</TabsTrigger>
          <TabsTrigger value="panchayaths">Panchayaths</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AdminDashboard />
        </TabsContent>

        <TabsContent value="registrations" className="space-y-6">
          <AdminStats registrations={legacyRegistrations} />
          
          <Card>
            <CardHeader>
              <CardTitle>Registration Management</CardTitle>
              <CardDescription>
                Manage and review registration applications with universal admin access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RegistrationFilters
                searchTerm={searchTerm}
                filterCategory={filterCategory}
                filterStatus={filterStatus}
                onSearchChange={setSearchTerm}
                onCategoryChange={setFilterCategory}
                onStatusChange={setFilterStatus}
              />
              
              <RegistrationsTable
                registrations={filteredRegistrations}
                selectedRegistrations={selectedRegistrations}
                onSelectAll={handleSelectAll}
                onSelectRegistration={handleSelectRegistration}
                onApproval={handleApproval}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onChangeCategory={handleChangeCategory}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <FeeManagement 
            categoryFees={legacyCategoryFees}
            editingFees={false}
            onEditStart={() => {}}
            onEditCancel={() => {}}
            onSave={() => {}}
            onFeeUpdate={() => {}}
          />
        </TabsContent>

        <TabsContent value="panchayaths">
          <PanchayathManager 
            panchayaths={legacyPanchayaths}
            onUpdate={() => refreshData()}
          />
        </TabsContent>

        <TabsContent value="announcements">
          <AnnouncementManager 
            announcements={legacyAnnouncements}
            onUpdate={() => refreshData()}
          />
        </TabsContent>

        <TabsContent value="gallery">
          <PhotoGalleryManager 
            gallery={legacyPhotoGallery}
            onUpdate={() => refreshData()}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationManager 
            notifications={legacyNotifications}
            onUpdate={() => refreshData()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;