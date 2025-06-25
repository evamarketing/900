
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Save, X, Upload, Trash2 } from "lucide-react";
import { CategoryFee, categories } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";

interface FeeManagementProps {
  categoryFees: CategoryFee[];
  editingFees: boolean;
  onEditStart: () => void;
  onEditCancel: () => void;
  onSave: () => void;
  onFeeUpdate: (category: string, field: 'actualFee' | 'offerFee' | 'hasOffer' | 'image', value: number | boolean | string) => void;
}

const FeeManagement = ({
  categoryFees,
  editingFees,
  onEditStart,
  onEditCancel,
  onSave,
  onFeeUpdate
}: FeeManagementProps) => {
  const { toast } = useToast();
  const [imageDialog, setImageDialog] = useState<{ open: boolean; category: string }>({ open: false, category: "" });
  const [imageUrl, setImageUrl] = useState("");

  const getCategoryFee = (category: string) => {
    return categoryFees.find(fee => fee.category === category) || { 
      actualFee: 0, 
      offerFee: 0, 
      hasOffer: false, 
      image: getDefaultImage(category) 
    };
  };

  const getDefaultImage = (categoryValue: string) => {
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

  const handleImageEdit = (category: string) => {
    const currentFee = getCategoryFee(category);
    setImageUrl(currentFee.image || "");
    setImageDialog({ open: true, category });
  };

  const handleImageSave = () => {
    if (imageUrl.trim()) {
      onFeeUpdate(imageDialog.category, 'image', imageUrl);
      toast({
        title: "Image Updated",
        description: "Category image has been updated successfully"
      });
    }
    setImageDialog({ open: false, category: "" });
    setImageUrl("");
  };

  const handleImageDelete = (category: string) => {
    onFeeUpdate(category, 'image', getDefaultImage(category));
    toast({
      title: "Image Reset",
      description: "Category image has been reset to default"
    });
  };

  const sampleImages = [
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl break-words">Category Fee & Image Management</CardTitle>
              <CardDescription className="text-sm mt-1">Set registration fees and manage images for each category</CardDescription>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {editingFees ? (
                <>
                  <Button onClick={onSave} className="bg-green-600 hover:bg-green-700" size="sm">
                    <Save className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                  </Button>
                  <Button variant="outline" onClick={onEditCancel} size="sm">
                    <X className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Cancel</span>
                  </Button>
                </>
              ) : (
                <Button onClick={onEditStart} size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Edit Fees</span>
                  <span className="sm:hidden">Edit</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full">
            <div className="space-y-6 pr-4">
              {categories.map((category) => {
                const currentFee = getCategoryFee(category.value);
                return (
                  <Card key={category.value} className="p-3 sm:p-4">
                    <div className="space-y-4">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg break-words">{category.label}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 break-all">{category.value}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
                          {currentFee.image && (
                            <img 
                              src={currentFee.image} 
                              alt={category.label}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-gray-200"
                            />
                          )}
                          <div className="flex flex-row sm:flex-col gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleImageEdit(category.value)}
                              className="text-xs"
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">Edit Image</span>
                              <span className="sm:hidden">Edit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleImageDelete(category.value)}
                              className="text-xs"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">Reset</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {editingFees && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm">Actual Fee (₹)</Label>
                            <Input
                              type="number"
                              value={currentFee.actualFee}
                              onChange={(e) => onFeeUpdate(category.value, 'actualFee', parseInt(e.target.value) || 0)}
                              min="0"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Offer Fee (₹)</Label>
                            <Input
                              type="number"
                              value={currentFee.offerFee}
                              onChange={(e) => onFeeUpdate(category.value, 'offerFee', parseInt(e.target.value) || 0)}
                              min="0"
                              className="text-sm"
                            />
                          </div>
                          <div className="flex items-center space-x-2 pt-4 sm:pt-6">
                            <Checkbox
                              id={`offer-${category.value}`}
                              checked={currentFee.hasOffer}
                              onCheckedChange={(checked) => onFeeUpdate(category.value, 'hasOffer', !!checked)}
                            />
                            <Label htmlFor={`offer-${category.value}`} className="text-sm">Enable Offer</Label>
                          </div>
                        </div>
                      )}
                      
                      {!editingFees && (
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="font-medium">Fee: </span>
                            {currentFee.hasOffer && currentFee.offerFee < currentFee.actualFee ? (
                              <span>
                                <del className="text-red-600">₹{currentFee.actualFee}</del>{' '}
                                <span className="text-green-600 font-bold">₹{currentFee.offerFee}</span>
                              </span>
                            ) : currentFee.actualFee === 0 ? (
                              <span className="text-green-600 font-bold">FREE</span>
                            ) : (
                              <span className="font-bold">₹{currentFee.actualFee}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Image Edit Dialog */}
      <Dialog open={imageDialog.open} onOpenChange={(open) => setImageDialog({ open, category: "" })}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Category Image</DialogTitle>
            <DialogDescription>
              Update the image for {categories.find(c => c.value === imageDialog.category)?.label}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)] w-full">
            <div className="space-y-4 pr-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Sample Images (Click to use)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {sampleImages.map((url, index) => (
                    <div 
                      key={index} 
                      className="relative group cursor-pointer" 
                      onClick={() => setImageUrl(url)}
                    >
                      <img 
                        src={url} 
                        alt={`Sample ${index + 1}`} 
                        className="w-full h-20 sm:h-24 object-cover rounded border-2 border-transparent group-hover:border-blue-500" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded flex items-center justify-center">
                        <span className="text-white text-xs opacity-0 group-hover:opacity-100">Use This</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {imageUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <img src={imageUrl} alt="Preview" className="w-full h-32 sm:h-40 object-cover rounded border" />
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button onClick={handleImageSave} className="flex-1">
                  Save Image
                </Button>
                <Button variant="outline" onClick={() => setImageDialog({ open: false, category: "" })}>
                  Cancel
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeeManagement;
