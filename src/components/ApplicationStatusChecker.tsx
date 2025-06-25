import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, Clock, XCircle } from "lucide-react";
import { useSupabaseData } from '@/hooks/useSupabaseData';

const ApplicationStatusChecker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const { checkApplicationStatus, categories } = useSupabaseData();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setNotFound(false);
    setSearchResult(null);

    try {
      const result = await checkApplicationStatus(searchQuery.trim());
      
      if (result) {
        setSearchResult(result);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          message: "Your application is under processing.",
          description: "Our team is reviewing your application. You will be notified once the review is complete.",
          icon: <Clock className="h-6 w-6 text-orange-600" />,
          variant: "secondary" as const
        };
      case 'approved':
        return {
          message: "You have successfully completed your registration.",
          description: "Congratulations! Your application has been approved. You can now access program benefits.",
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          variant: "default" as const
        };
      case 'rejected':
        return {
          message: "Application rejected. Contact support.",
          description: "Unfortunately, your application could not be approved. Please contact our support team for more information.",
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          variant: "destructive" as const
        };
      default:
        return {
          message: "Status unknown",
          description: "Please contact support for assistance.",
          icon: <Search className="h-6 w-6 text-gray-600" />,
          variant: "secondary" as const
        };
    }
  };

  const getCategoryLabel = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.label || categoryName;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Check Application Status</CardTitle>
          <CardDescription>
            Enter your registered mobile number or unique ID to check your application status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="searchQuery">Mobile Number or Unique ID</Label>
            <div className="flex gap-2">
              <Input
                id="searchQuery"
                type="text"
                placeholder="Enter mobile number (e.g., 9876543210) or Unique ID (e.g., ESP9876543210A)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="min-w-[100px] text-zinc-50 bg-[#04494a]"
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </div>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-1" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResult && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{searchResult.full_name}</CardTitle>
                <CardDescription>
                  {getCategoryLabel(searchResult.category)}
                </CardDescription>
              </div>
              <Badge variant={getStatusMessage(searchResult.status).variant} className="bg-[#078107]">
                {searchResult.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-[#d3fed1]">
              {getStatusMessage(searchResult.status).icon}
              <div>
                <h3 className="font-semibold mb-1">
                  {getStatusMessage(searchResult.status).message}
                </h3>
                <p className="text-sm text-gray-600">
                  {getStatusMessage(searchResult.status).description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Mobile:</strong> {searchResult.mobile_number}</p>
                <p><strong>Applied on:</strong> {new Date(searchResult.submitted_at).toLocaleDateString()}</p>
              </div>
              <div>
                {searchResult.unique_id && (
                  <p><strong>Unique ID:</strong> <Badge variant="outline">{searchResult.unique_id}</Badge></p>
                )}
                <p className="text-base font-bold text-[#920202]">
                  <strong>Category:</strong> {getCategoryLabel(searchResult.category)}
                </p>
              </div>
            </div>

            {searchResult.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Next Steps:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Keep your Unique ID safe for future reference</li>
                  <li>• You will receive program updates via WhatsApp</li>
                  <li>• Contact support for any questions: +91 9876543210</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {notFound && (
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600">
              <XCircle className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">No Application Found</h3>
                <p className="text-sm text-red-500">
                  No registration found with the provided mobile number or unique ID. 
                  Please check your input and try again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationStatusChecker;