import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserPlus, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const { user, makeUserAdmin } = useAuth();

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await makeUserAdmin(email);
      setEmail('');
      if (email === 'evamarketingsolutions@gmail.com') {
        setSetupComplete(true);
      }
    } catch (error) {
      console.error('Error making user admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeSelfAdmin = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      await makeUserAdmin(user.email);
      if (user.email === 'evamarketingsolutions@gmail.com') {
        setSetupComplete(true);
      }
    } catch (error) {
      console.error('Error making self admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupMainAdmin = async () => {
    setLoading(true);
    try {
      await makeUserAdmin('evamarketingsolutions@gmail.com');
      setSetupComplete(true);
    } catch (error) {
      console.error('Error setting up main admin:', error);
    } finally {
      setLoading(false);
    }
  };

  if (setupComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Admin Setup Complete
            </CardTitle>
            <CardDescription className="text-green-700">
              The admin system has been successfully configured.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Admin user <strong>evamarketingsolutions@gmail.com</strong> has been set up with full system access.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Admin Access Details:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <strong>Email:</strong> evamarketingsolutions@gmail.com</li>
                <li>• <strong>Password:</strong> admin919123</li>
                <li>• <strong>Access Level:</strong> Full Admin (Universal Access)</li>
                <li>• <strong>Permissions:</strong> All registration data, system management</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Security Recommendations:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Change the default password after first login</li>
                <li>• Enable two-factor authentication if available</li>
                <li>• Regularly monitor admin access logs</li>
                <li>• Keep admin credentials secure and confidential</li>
              </ul>
            </div>

            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue to Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Shield className="h-5 w-5" />
            Admin Access Setup
          </CardTitle>
          <CardDescription className="text-orange-700">
            Set up admin access for the SEDP system. This is required for first-time setup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              No admin users found in the system. You need to assign admin role to access the admin panel.
            </AlertDescription>
          </Alert>

          {/* Main Admin Setup */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Primary Admin Setup</h4>
              <p className="text-sm text-blue-700 mb-3">
                Set up the main admin account for universal system access:
              </p>
              <div className="text-sm text-blue-600 mb-3 font-mono bg-white p-2 rounded border">
                <strong>Email:</strong> evamarketingsolutions@gmail.com<br/>
                <strong>Password:</strong> admin919123
              </div>
              <Button 
                onClick={handleSetupMainAdmin}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {loading ? 'Setting up...' : 'Setup Main Admin'}
              </Button>
            </div>

            {user && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-orange-50 px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Quick Setup</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Make your current account ({user.email}) an administrator:
                  </p>
                  <Button 
                    onClick={handleMakeSelfAdmin}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {loading ? 'Setting up...' : 'Make Me Admin'}
                  </Button>
                </div>

                <form onSubmit={handleMakeAdmin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Make Another User Admin</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="Enter user email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading || !email.trim()}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {loading ? 'Assigning...' : 'Assign Admin Role'}
                  </Button>
                </form>
              </>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• The admin user will be granted full system privileges</li>
              <li>• They can access all registration data from anywhere</li>
              <li>• Admin users can approve/reject applications</li>
              <li>• They can manage categories, announcements, and system settings</li>
              <li>• Universal access to all system features and data</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;