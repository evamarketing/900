import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Download, 
  RefreshCw,
  Shield,
  Database,
  Globe,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { registrations, loading, refreshData } = useSupabaseData();
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalRegistrations: 0,
    pendingApprovals: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    todayRegistrations: 0
  });

  useEffect(() => {
    if (registrations.length > 0) {
      const today = new Date().toDateString();
      const todayRegs = registrations.filter(reg => 
        new Date(reg.submitted_at).toDateString() === today
      );

      setSystemStats({
        totalUsers: new Set(registrations.map(r => r.user_id)).size,
        totalRegistrations: registrations.length,
        pendingApprovals: registrations.filter(r => r.status === 'pending').length,
        approvedApplications: registrations.filter(r => r.status === 'approved').length,
        rejectedApplications: registrations.filter(r => r.status === 'rejected').length,
        todayRegistrations: todayRegs.length
      });
    }
  }, [registrations]);

  const handleExportData = () => {
    const csvContent = [
      ['ID', 'Name', 'Mobile', 'Category', 'Status', 'Submitted', 'Panchayath'].join(','),
      ...registrations.map(reg => [
        reg.id,
        `"${reg.full_name}"`,
        reg.mobile_number,
        reg.category,
        reg.status,
        new Date(reg.submitted_at).toLocaleDateString(),
        `"${reg.panchayath_details}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sedp-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Status Banner */}
      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700">
          <strong>Admin Access Active:</strong> You have universal access to all system data and features.
          {user?.email === 'evamarketingsolutions@gmail.com' && (
            <span className="ml-2">
              <Badge className="bg-green-600 text-white">Primary Admin</Badge>
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-900">{systemStats.totalRegistrations}</span>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-orange-900">{systemStats.pendingApprovals}</span>
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-900">{systemStats.approvedApplications}</span>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Today's Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-red-900">{systemStats.todayRegistrations}</span>
              <Activity className="h-6 w-6 text-red-600" />
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
            <Button onClick={handleExportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button variant="outline">
              <Globe className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system status and configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Admin User:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Access Level:</span>
                <Badge className="bg-green-600">Universal Admin</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="font-medium">Supabase Cloud</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users:</span>
                <span className="font-medium">{systemStats.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">System Status:</span>
                <Badge className="bg-green-600">Online</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
          <CardDescription>Latest 5 registration submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {registrations.slice(0, 5).map((registration) => (
              <div key={registration.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{registration.full_name}</p>
                  <p className="text-sm text-gray-600">{registration.category} • {registration.panchayath_details}</p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={
                      registration.status === 'approved' ? 'default' : 
                      registration.status === 'rejected' ? 'destructive' : 'secondary'
                    }
                  >
                    {registration.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(registration.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;