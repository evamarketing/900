import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, X, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/hooks/useAdminData";

interface CategoryPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    value: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  };
  fees: {
    actualFee: number;
    offerFee: number;
    hasOffer: boolean;
    image?: string;
  };
  onConfirm: () => void;
}

const CategoryPopupModal = ({ isOpen, onClose, category, fees, onConfirm }: CategoryPopupModalProps) => {
  const { toast } = useToast();
  const { categoryFees } = useAdminData();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get the actual image from admin data
  const getCategoryImage = (categoryValue: string) => {
    const adminFee = categoryFees.find(f => f.category === categoryValue);
    if (adminFee && adminFee.image) {
      return adminFee.image;
    }
    
    // Fallback to default images
    const images = {
      'pennyekart-free': 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      'pennyekart-paid': 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      'farmelife': 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=800',
      'foodelife': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      'organelife': 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800',
      'entrelife': 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      'job-card': 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
    };
    return images[categoryValue as keyof typeof images] || images['job-card'];
  };

  const handleDownloadImage = async () => {
    try {
      const imageUrl = getCategoryImage(category.value);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${category.value}-category-image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Image Downloaded",
        description: "Category image has been downloaded successfully!"
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isJobCard = category.value === 'job-card';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            {category.icon}
            {category.label}
            {isJobCard && <Star className="h-6 w-6 text-yellow-600 fill-current" />}
          </DialogTitle>
          <DialogDescription>
            Complete registration details and fee information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={getCategoryImage(category.value)}
                  alt={category.label}
                  className="w-full h-64 object-cover"
                  onLoad={() => setImageLoaded(true)}
                />
                {imageLoaded && (
                  <Button
                    onClick={handleDownloadImage}
                    className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
                {isJobCard && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-yellow-900">
                      <Award className="h-3 w-3 mr-1" />
                      Special Offer
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Description */}
          <Card className={`${category.color} border-2`}>
            <CardContent className="p-4">
              <p className="text-sm leading-relaxed">{category.description}</p>
            </CardContent>
          </Card>

          {/* Fee Information */}
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Registration Fee</h3>
              
              {fees.hasOffer && fees.offerFee < fees.actualFee ? (
                <div className="space-y-2">
                  <div className="text-gray-600">
                    <span className="text-sm">Regular Price: </span>
                    <del className="text-lg text-red-600">₹{fees.actualFee}</del>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    Special Offer: ₹{fees.offerFee}
                  </div>
                  <div className="text-sm text-green-700">
                    You save ₹{fees.actualFee - fees.offerFee}!
                  </div>
                </div>
              ) : fees.actualFee === 0 ? (
                <div className="text-3xl font-bold text-green-600">
                  FREE Registration
                </div>
              ) : (
                <div className="text-3xl font-bold text-blue-600">
                  ₹{fees.actualFee}
                </div>
              )}

              {isJobCard && (
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                  <p className="text-sm text-yellow-800 font-medium">
                    🎯 Universal Access: Get access to ALL 6 categories with this single registration!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Special Benefits for Job Card */}
          {isJobCard && (
            <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300">
              <CardContent className="p-4">
                <h4 className="font-semibold text-yellow-800 mb-3">🌟 Exclusive Benefits:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>✅ Access to all 6 program categories</li>
                  <li>✅ Priority consideration for opportunities</li>
                  <li>✅ Comprehensive training across multiple domains</li>
                  <li>✅ Enhanced support throughout your journey</li>
                  <li>✅ Cross-category networking opportunities</li>
                  <li>✅ Flexible career path exploration</li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-lg py-6"
            >
              Confirm Registration
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryPopupModal;