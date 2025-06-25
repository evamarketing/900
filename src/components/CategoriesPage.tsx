
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, TrendingUp, Leaf, Coffee, Users, Award, Star } from "lucide-react";

interface CategoriesPageProps {
  onRegisterClick: (category: string) => void;
}

const CategoriesPage = ({ onRegisterClick }: CategoriesPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const pennyekartCategories = [
    {
      value: "pennyekart-free",
      name: "Pennyekart Free Registration",
      description: "Free e-commerce platform access for small-scale sellers",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <ShoppingCart className="h-6 w-6" />,
      fullDescription: "Start your e-commerce journey with our free platform. Perfect for beginners who want to test the waters of online selling without any upfront investment. Includes basic listing tools, customer communication features, and order management system.",
      benefits: [
        "Free platform access",
        "Basic listing tools",
        "Customer communication system",
        "Order tracking",
        "Community support",
        "Basic training materials"
      ]
    },
    {
      value: "pennyekart-paid",
      name: "Pennyekart Paid Registration",
      description: "Premium e-commerce features with advanced selling tools",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <TrendingUp className="h-6 w-6" />,
      fullDescription: "Unlock the full potential of your online business with our premium features. Advanced analytics, marketing tools, priority support, and enhanced visibility to boost your sales and grow your business.",
      benefits: [
        "Advanced analytics dashboard",
        "Marketing automation tools",
        "Priority customer support",
        "Enhanced product visibility",
        "Inventory management system",
        "Professional seller badge",
        "Commission discounts",
        "Advanced training workshops"
      ]
    }
  ];

  const elifeCategories = [
    {
      value: "farmelife",
      name: "FarmeLife",
      description: "Agricultural and farming business development program",
      color: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <Leaf className="h-6 w-6" />,
      fullDescription: "Transform your agricultural knowledge into a thriving business. Learn modern farming techniques, crop management, sustainable practices, and how to market your agricultural products effectively.",
      benefits: [
        "Modern farming techniques training",
        "Crop management expertise",
        "Sustainable agriculture practices",
        "Market linkage support",
        "Equipment rental assistance",
        "Quality certification guidance",
        "Government scheme assistance"
      ]
    },
    {
      value: "foodelife",
      name: "FoodeLife",
      description: "Food processing and culinary business opportunities",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <Coffee className="h-6 w-6" />,
      fullDescription: "Enter the lucrative food industry with comprehensive training in food processing, safety standards, packaging, and distribution. Perfect for culinary enthusiasts and food entrepreneurs.",
      benefits: [
        "Food safety and hygiene training",
        "Processing techniques",
        "Packaging and branding guidance",
        "Distribution network access",
        "Kitchen setup assistance",
        "License and certification support",
        "Recipe development workshops"
      ]
    },
    {
      value: "organelife",
      name: "OrganeLife",
      description: "Organic farming and sustainable agriculture initiatives",
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: <Leaf className="h-6 w-6" />,
      fullDescription: "Join the organic revolution with training in chemical-free farming, organic certification processes, and premium market access for organic products.",
      benefits: [
        "Organic farming techniques",
        "Certification process guidance",
        "Premium market access",
        "Sustainable practices training",
        "Organic input sourcing",
        "Quality testing support",
        "Export opportunity assistance"
      ]
    },
    {
      value: "entrelife",
      name: "EntreLife",
      description: "General entrepreneurship and business development track",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: <Users className="h-6 w-6" />,
      fullDescription: "Comprehensive entrepreneurship program covering business planning, financial management, marketing strategies, and leadership skills for any type of business venture.",
      benefits: [
        "Business plan development",
        "Financial management training",
        "Marketing strategy workshops",
        "Leadership skill development",
        "Networking opportunities",
        "Mentorship programs",
        "Funding guidance",
        "Legal compliance training"
      ]
    }
  ];

  const jobCardCategory = {
    value: "job-card",
    name: "Job Card (All Categories)",
    description: "Single registration providing comprehensive access to opportunities across all categories",
    color: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300",
    icon: <Award className="h-6 w-6" />,
    fullDescription: "Get universal access to all program categories with a single registration. This comprehensive option allows you to explore multiple business tracks, receive benefits from the entire SEDP ecosystem, and get priority consideration for all opportunities.",
    benefits: [
      "Access to all 6 program categories",
      "Priority consideration for opportunities",
      "Comprehensive training across multiple domains",
      "Enhanced support throughout your journey",
      "Cross-category networking opportunities",
      "Flexible career path exploration",
      "Maximum learning and growth potential"
    ]
  };

  const allCategories = [...pennyekartCategories, ...elifeCategories];
  const selectedCategoryData = selectedCategory === "job-card" 
    ? jobCardCategory 
    : allCategories.find(cat => cat.value === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Categories</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Choose from our specialized tracks designed to support your unique entrepreneurial goals. 
          Each category offers comprehensive training, mentorship, and resources.
        </p>
      </div>

      {/* Job Card - Special Category */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-center text-yellow-800 flex items-center justify-center gap-2">
          <Star className="h-6 w-6 text-yellow-600 fill-current" />
          Special Offering
          <Star className="h-6 w-6 text-yellow-600 fill-current" />
        </h3>
        
        <Card className={`${jobCardCategory.color} border-2 hover:shadow-lg transition-shadow`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-200">
                  {jobCardCategory.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{jobCardCategory.name}</CardTitle>
                  <Badge className="bg-yellow-200 text-yellow-800 mt-1">Recommended</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-yellow-700 mb-4">
              {jobCardCategory.description}
            </CardDescription>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("job-card")}
                className="border-yellow-400 text-yellow-800 hover:bg-yellow-200"
              >
                View Details
              </Button>
              <Button
                onClick={() => onRegisterClick("job-card")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Register Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pennyekart Customer Registration */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-green-800">🟢 Pennyekart Customer Registration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pennyekartCategories.map((category) => (
            <Card key={category.value} className={`${category.color} border-2 hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white bg-opacity-50">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {category.description}
                </CardDescription>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory(category.value)}
                    className="border-current"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={() => onRegisterClick(category.value)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Register Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* E-Life Self Employment Registration */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-blue-800">🔵 E-Life Self Employment Registration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {elifeCategories.map((category) => (
            <Card key={category.value} className={`${category.color} border-2 hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white bg-opacity-50">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {category.description}
                </CardDescription>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory(category.value)}
                    className="border-current"
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={() => onRegisterClick(category.value)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Register Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Details Modal */}
      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedCategoryData?.icon}
              {selectedCategoryData?.name}
            </DialogTitle>
            <DialogDescription>
              Comprehensive details about this program category
            </DialogDescription>
          </DialogHeader>
          
          {selectedCategoryData && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">Program Overview</h4>
                <p className="text-gray-600">{selectedCategoryData.fullDescription}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-3">Key Benefits & Features</h4>
                <ul className="space-y-2">
                  {selectedCategoryData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setSelectedCategory(null);
                    onRegisterClick(selectedCategoryData.value);
                  }}
                  className="flex-1"
                >
                  Register for this Category
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
