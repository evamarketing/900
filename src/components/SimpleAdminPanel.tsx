import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Database, LogOut, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SimpleAdminLogin from "./admin/SimpleAdminLogin";
import RegistrationFilters from "./admin/RegistrationFilters";
import RegistrationsTable from "./admin/RegistrationsTable";
import FeeManagement from "./admin/FeeManagement";
import PanchayathManager from "./admin/PanchayathManager";
import AnnouncementManager from "./admin/AnnouncementManager";
import PhotoGalleryManager from "./admin/PhotoGalleryManager";
import NotificationManager from "./admin/NotificationManager";

const SimpleAdminPanel = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [categoryFees, setCategoryFees] = useState([]);
  const [panchayaths, setPanchayaths] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [photoGallery, setPhotoGallery] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [editingFees, setEditingFees] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);

  // Check login status on component mount
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('sedp_admin_logged_in');
    setIsLoggedIn(adminLoggedIn === 'true');
    setLoading(false);
    
    if (adminLoggedIn === 'true') {
      loadData();
    }
  }, []);

  // Load data from localStorage
  const loadData = () => {
    try {
      const storedRegistrations = JSON.parse(localStorage.getItem('sedp_registrations') || '[]');
      const storedFees = JSON.parse(localStorage.getItem('sedp_category_fees') || '[]');
      const storedPanchayaths = JSON.parse(localStorage.getItem('sedp_panchayaths') || '[]');
      const storedAnnouncements = JSON.parse(localStorage.getItem('sedp_announcements') || '[]');
      const storedGallery = JSON.parse(localStorage.getItem('sedp_photo_gallery') || '[]');
      const storedNotifications = JSON.parse(localStorage.getItem('sedp_notifications') || '[]');

      setRegistrations(storedRegistrations);
      setCategoryFees(storedFees);
      setPanchayaths(storedPanchayaths);
      setAnnouncements(storedAnnouncements);
      setPhotoGallery(storedGallery);
      setNotifications(storedNotifications);

      // Initialize default data if empty
      if (storedPanchayaths.length === 0) {
        initializeDefaultPanchayaths();
      }
      if (storedFees.length === 0) {
        initializeDefaultFees();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Initialize default panchayaths
  const initializeDefaultPanchayaths = () => {
    const defaultPanchayaths = [
      { id: '1', malayalamName: 'കൊണ്ടോട്ടി', englishName: 'Kondotty', pincode: '673638', district: 'Malappuram' },
      { id: '2', malayalamName: 'മലപ്പുറം', englishName: 'Malappuram', pincode: '676505', district: 'Malappuram' },
      { id: '3', malayalamName: 'മഞ്ചേരി', englishName: 'Manjeri', pincode: '676121', district: 'Malappuram' },
      { id: '4', malayalamName: 'പെരിന്തൽമണ്ണ', englishName: 'Perinthalmanna', pincode: '679322', district: 'Malappuram' },
      { id: '5', malayalamName: 'തിരുരങ്ങാടി', englishName: 'Tirurangadi', pincode: '676306', district: 'Malappuram' },
      { id: '6', malayalamName: 'തൃപ്രാങ്കോട്', englishName: 'Triprangode', pincode: '676303', district: 'Malappuram' },
      { id: '7', malayalamName: 'താനൂർ', englishName: 'Tanur', pincode: '676302', district: 'Malappuram' },
      { id: '8', malayalamName: 'പൊൻമുണ്ടം', englishName: 'Ponmundam', pincode: '679577', district: 'Malappuram' },
      { id: '9', malayalamName: 'ഇടപ്പാൽ', englishName: 'Edappal', pincode: '679576', district: 'Malappuram' },
      { id: '10', malayalamName: 'കുറ്റിപ്പുറം', englishName: 'Kuttippuram', pincode: '679571', district: 'Malappuram' }
    ];
    
    setPanchayaths(defaultPanchayaths);
    localStorage.setItem('sedp_panchayaths', JSON.stringify(defaultPanchayaths));
  };

  // Initialize default category fees
  const initializeDefaultFees = () => {
    const defaultFees = [
      { category: 'pennyekart-free', actualFee: 0, offerFee: 0, hasOffer: false, image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { category: 'pennyekart-paid', actualFee: 800, offerFee: 300, hasOffer: true, image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { category: 'farmelife', actualFee: 1000, offerFee: 400, hasOffer: true, image: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { category: 'foodelife', actualFee: 1200, offerFee: 500, hasOffer: true, image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { category: 'organelife', actualFee: 1500, offerFee: 600, hasOffer: true, image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { category: 'entrelife', actualFee: 900, offerFee: 350, hasOffer: true, image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { category: 'job-card', actualFee: 2000, offerFee: 800, hasOffer: true, image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800' }
    ];
    
    setCategoryFees(defaultFees);
    localStorage.setItem('sedp_category_fees', JSON.stringify(defaultFees));
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem('sedp_admin_logged_in');
    localStorage.removeItem('sedp_admin_user');
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
  };

  const handleApproval = (id, action) => {
    const updatedRegistrations = registrations.map(reg => {
      if (reg.id === id) {
        const firstLetter = reg.fullName.charAt(0).toUpperCase();
        const uniqueId = action === 'approve' ? `ESP${reg.mobileNumber}${firstLetter}` : undefined;
        
        return {
          ...reg,
          status: action === 'approve' ? 'approved' : 'rejected',
          approvedAt: new Date().toISOString(),
          uniqueId
        };
      }
      return reg;
    });
    
    setRegistrations(updatedRegistrations);
    localStorage.setItem('sedp_registrations', JSON.stringify(updatedRegistrations));
    
    toast({
      title: "Registration Updated",
      description: `Registration has been ${action === 'approve' ? 'approved' : 'rejected'}`
    });
  };

  const handleDelete = (id) => {
    const updatedRegistrations = registrations.filter(reg => reg.id !== id);
    setRegistrations(updatedRegistrations);
    localStorage.setItem('sedp_registrations', JSON.stringify(updatedRegistrations));
    
    toast({
      title: "Registration Deleted",
      description: "Registration has been deleted successfully"
    });
  };

  const handleFeeUpdate = (category, field, value) => {
    const updatedFees = categoryFees.map(fee => {
      if (fee.category === category) {
        return { ...fee, [field]: value };
      }
      return fee;
    });
    
    setCategoryFees(updatedFees);
    localStorage.setItem('sedp_category_fees', JSON.stringify(updatedFees));
  };

  const handleSaveFees = () => {
    setEditingFees(false);
    toast({
      title: "Fees Updated",
      description: "Category fees have been saved successfully"
    });
  };

  const updateAllUserRecords = () => {
    // Sync and update all user records
    const updatedRegistrations = registrations.map(reg => ({
      ...reg,
      lastUpdated: new Date().toISOString()
    }));
    
    setRegistrations(updatedRegistrations);
    localStorage.setItem('sedp_registrations', JSON.stringify(updatedRegistrations));
    
    toast({
      title: "Database Updated",
      description: "All user records have been synchronized and updated"
    });
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.mobileNumber.includes(searchTerm) ||
      registration.panchayathDetails.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || registration.category === filterCategory;
    const matchesStatus = filterStatus === "all" || registration.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRegistrations(filteredRegistrations.map(reg => reg.id));
    } else {
      setSelectedRegistrations([]);
    }
  };

  const handleSelectRegistration = (id, checked) => {
    if (checked) {
      setSelectedRegistrations(prev => [...prev, id]);
    } else {
      setSelectedRegistrations(prev => prev.filter(regId => regId !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <SimpleAdminLogin onLogin={handleLogin} />;
  }

  // Calculate stats
  const total = registrations.length;
  const pending = registrations.filter(r => r.status === 'pending').length;
  const approved = registrations.filter(r => r.status === 'approved').length;
  const rejected = registrations.filter(r => r.status === 'rejected').length;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEDP Admin Panel</h1>
          <p className="text-gray-600">Self Employment Development Program</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="w-3 h-3 mr-1" />
            Administrator
          </Badge>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>

      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          <strong>Admin Access Active:</strong> You have full access to all system data and features.
        </AlertDescription>
      </Alert>

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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Registrations</p>
                    <p className="text-2xl font-bold">{total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">{pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{approved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{rejected}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Administrative tools and data management options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={updateAllUserRecords} variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Update All User Records
                </Button>
                <Button onClick={loadData} variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration Management</CardTitle>
              <CardDescription>
                Manage and review registration applications
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
                onEdit={() => {}}
                onDelete={handleDelete}
                onChangeCategory={() => {}}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <FeeManagement 
            categoryFees={categoryFees}
            editingFees={editingFees}
            onEditStart={() => setEditingFees(true)}
            onEditCancel={() => setEditingFees(false)}
            onSave={handleSaveFees}
            onFeeUpdate={handleFeeUpdate}
          />
        </TabsContent>

        <TabsContent value="panchayaths">
          <PanchayathManager 
            panchayaths={panchayaths}
            onUpdate={(newPanchayaths) => {
              setPanchayaths(newPanchayaths);
              localStorage.setItem('sedp_panchayaths', JSON.stringify(newPanchayaths));
            }}
          />
        </TabsContent>

        <TabsContent value="announcements">
          <AnnouncementManager 
            announcements={announcements}
            onUpdate={(newAnnouncements) => {
              setAnnouncements(newAnnouncements);
              localStorage.setItem('sedp_announcements', JSON.stringify(newAnnouncements));
            }}
          />
        </TabsContent>

        <TabsContent value="gallery">
          <PhotoGalleryManager 
            gallery={photoGallery}
            onUpdate={(newGallery) => {
              setPhotoGallery(newGallery);
              localStorage.setItem('sedp_photo_gallery', JSON.stringify(newGallery));
            }}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationManager 
            notifications={notifications}
            onUpdate={(newNotifications) => {
              setNotifications(newNotifications);
              localStorage.setItem('sedp_notifications', JSON.stringify(newNotifications));
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimpleAdminPanel;