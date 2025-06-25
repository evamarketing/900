import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Users, TrendingUp, Leaf, Coffee, ShoppingCart } from "lucide-react";
import QRPaymentCode from "./QRPaymentCode";
import CategoryPopupModal from "./CategoryPopupModal";

const SimpleRegistrationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    whatsappNumber: "",
    address: "",
    panchayathDetails: "",
    category: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [generatedUniqueId, setGeneratedUniqueId] = useState("");
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [selectedCategoryForPopup, setSelectedCategoryForPopup] = useState(null);
  const [panchayaths, setPanchayaths] = useState([]);
  const [categoryFees, setCategoryFees] = useState([]);

  // Load panchayaths and category fees from localStorage
  useEffect(() => {
    const storedPanchayaths = JSON.parse(localStorage.getItem('sedp_panchayaths') || '[]');
    const storedFees = JSON.parse(localStorage.getItem('sedp_category_fees') || '[]');
    
    // Initialize default panchayaths if empty
    if (storedPanchayaths.length === 0) {
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
    } else {
      setPanchayaths(storedPanchayaths);
    }

    // Initialize default category fees if empty
    if (storedFees.length === 0) {
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
    } else {
      setCategoryFees(storedFees);
    }
  }, []);

  // Transform categories for display
  const pennyekartCategories = [
    {
      value: "pennyekart-free",
      label: "Pennyekart Free Registration",
      description: "Free e-commerce platform access for small-scale sellers. Perfect for beginners wanting to start their online selling journey without any initial investment.",
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "bg-green-100 text-green-800 border-green-200"
    },
    {
      value: "pennyekart-paid",
      label: "Pennyekart Paid Registration",
      description: "Premium e-commerce features with advanced selling tools, analytics, marketing support, and priority customer service for serious sellers.",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-800 border-blue-200"
    }
  ];

  const elifeCategories = [
    {
      value: "farmelife",
      label: "FarmeLife",
      description: "Agricultural and farming business development program focusing on modern farming techniques, crop management, and agricultural entrepreneurship.",
      icon: <Leaf className="h-6 w-6" />,
      color: "bg-amber-100 text-amber-800 border-amber-200"
    },
    {
      value: "foodelife",
      label: "FoodeLife",
      description: "Food processing and culinary business opportunities including food safety, packaging, distribution, and restaurant management skills.",
      icon: <Coffee className="h-6 w-6" />,
      color: "bg-orange-100 text-orange-800 border-orange-200"
    },
    {
      value: "organelife",
      label: "OrganeLife",
      description: "Organic farming and sustainable agriculture initiatives promoting eco-friendly practices, organic certification, and premium market access.",
      icon: <Leaf className="h-6 w-6" />,
      color: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },
    {
      value: "entrelife",
      label: "EntreLife",
      description: "General entrepreneurship and business development track covering business planning, financial management, marketing, and leadership skills.",
      icon: <Users className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-800 border-purple-200"
    }
  ];

  const jobCardCategory = {
    value: "job-card",
    label: "Job Card (All Categories)",
    description: "Single registration providing comprehensive access to opportunities across all categories. This universal option allows you to explore multiple business tracks and receive benefits from the entire SEDP ecosystem with priority consideration.",
    icon: <Award className="h-6 w-6" />,
    color: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300"
  };

  const getCategoryFees = (category) => {
    const fee = categoryFees.find(f => f.category === category);
    return fee || { actualFee: 500, offerFee: 200, hasOffer: true };
  };

  const generateTempUniqueId = (mobileNumber, fullName) => {
    const firstLetter = fullName.charAt(0).toUpperCase();
    return `ESP${mobileNumber}${firstLetter}`;
  };

  const handleCategorySelect = (categoryValue) => {
    const allCategories = [...pennyekartCategories, ...elifeCategories, jobCardCategory];
    const category = allCategories.find(cat => cat.value === categoryValue);
    
    if (category) {
      setSelectedCategoryForPopup(category);
      setShowCategoryPopup(true);
    }
  };

  const handleCategoryConfirm = () => {
    if (selectedCategoryForPopup) {
      setFormData({ ...formData, category: selectedCategoryForPopup.value });
      setShowCategoryPopup(false);
      setSelectedCategoryForPopup(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.fullName || !formData.mobileNumber || !formData.whatsappNumber || 
        !formData.address || !formData.panchayathDetails || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Validate mobile number format
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (!declarationAccepted) {
      toast({
        title: "Declaration Required",
        description: "Please accept the declaration to proceed",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const tempUniqueId = generateTempUniqueId(formData.mobileNumber, formData.fullName);

      // Create registration object
      const registration = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        uniqueId: null
      };

      // Save to localStorage
      const existingRegistrations = JSON.parse(localStorage.getItem('sedp_registrations') || '[]');
      existingRegistrations.push(registration);
      localStorage.setItem('sedp_registrations', JSON.stringify(existingRegistrations));

      setGeneratedUniqueId(tempUniqueId);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        fullName: "",
        mobileNumber: "",
        whatsappNumber: "",
        address: "",
        panchayathDetails: "",
        category: ""
      });

      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted successfully!"
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allCategories = [...pennyekartCategories, ...elifeCategories];
  const selectedCategory = [...allCategories, jobCardCategory].find(cat => cat.value === formData.category);
  const categoryFeesData = formData.category ? getCategoryFees(formData.category) : { actualFee: 0, offerFee: 0, hasOffer: false };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-800">Registration Submitted Successfully!</CardTitle>
            <CardDescription className="text-green-600">
              Your application has been received and is under review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-green-200">
              <h3 className="font-semibold text-lg mb-4">Registration Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Name:</strong> {formData.fullName}</p>
                  <p><strong>Mobile:</strong> {formData.mobileNumber}</p>
                  <p><strong>Category:</strong> {selectedCategory?.label}</p>
                </div>
                <div>
                  <p><strong>Panchayath:</strong> {formData.panchayathDetails}</p>
                  <p><strong>Reference ID:</strong> <Badge variant="outline">{generatedUniqueId}</Badge></p>
                  <p><strong>Registration Fee:</strong> {categoryFeesData.offerFee === 0 ? 'FREE' : `₹${categoryFeesData.offerFee}`}</p>
                </div>
              </div>
            </div>

            {categoryFeesData.offerFee > 0 && (
              <QRPaymentCode 
                amount={categoryFeesData.offerFee} 
                category={selectedCategory?.label || ''} 
                uniqueId={generatedUniqueId} 
              />
            )}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Keep your reference ID safe for future communication</li>
                {categoryFeesData.offerFee > 0 && <li>• Complete payment using the QR code above</li>}
                <li>• You will receive updates via WhatsApp on your registered number</li>
                <li>• Check your application status using the "Check Status" section</li>
                <li>• Contact support for any queries: +91 9876543210</li>
              </ul>
            </div>

            <div className="text-center">
              <Button onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  fullName: "",
                  mobileNumber: "",
                  whatsappNumber: "",
                  address: "",
                  panchayathDetails: "",
                  category: ""
                });
                setDeclarationAccepted(false);
                setGeneratedUniqueId("");
              }} variant="outline">
                Submit Another Registration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Employment Registration</CardTitle>
            <CardDescription>
              Join our Self Employment Development Program by selecting your preferred category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    maxLength={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                  <Input
                    id="whatsappNumber"
                    type="tel"
                    placeholder="Enter WhatsApp number"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    maxLength={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panchayathDetails">Panchayath *</Label>
                  <Select 
                    value={formData.panchayathDetails} 
                    onValueChange={(value) => setFormData({ ...formData, panchayathDetails: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Panchayath" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {panchayaths.map((panchayath) => (
                        <SelectItem key={panchayath.id} value={panchayath.malayalamName}>
                          <div className="flex flex-col">
                            <span className="font-medium">{panchayath.malayalamName}</span>
                            <span className="text-xs text-gray-500">{panchayath.englishName}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Complete Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address with house name, street, pin code etc."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-4">
                <Label>Select Category *</Label>
                
                {/* Job Card - Special Category */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600 fill-current" />
                    Special Offering
                  </h4>
                  
                  <Card 
                    className={`cursor-pointer transition-all duration-200 border-2 ${
                      formData.category === jobCardCategory.value 
                        ? 'border-yellow-400 shadow-lg scale-[1.02]' 
                        : 'border-gray-200 hover:border-yellow-300 hover:shadow-md'
                    } ${jobCardCategory.color}`}
                    onClick={() => handleCategorySelect(jobCardCategory.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-yellow-200">
                          {jobCardCategory.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{jobCardCategory.label}</h3>
                            <Badge className="bg-yellow-200 text-yellow-800">Recommended</Badge>
                          </div>
                          <p className="text-sm mb-3">{jobCardCategory.description}</p>
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <p className="text-xs font-medium text-yellow-700">
                              🎯 Special Benefits: Universal access to all program categories, comprehensive training across multiple domains, priority consideration for opportunities, and enhanced support throughout your entrepreneurial journey!
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {formData.category === jobCardCategory.value && (
                            <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pennyekart Customer Registration */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-green-800">🟢 Pennyekart Customer Registration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pennyekartCategories.map((category) => (
                      <Card 
                        key={category.value}
                        className={`cursor-pointer transition-all duration-200 border-2 ${
                          formData.category === category.value 
                            ? 'border-green-400 shadow-lg scale-[1.02]' 
                            : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                        } ${category.color}`}
                        onClick={() => handleCategorySelect(category.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 p-2 rounded-lg bg-white bg-opacity-50">
                              {category.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">{category.label}</h3>
                              <p className="text-sm">{category.description}</p>
                            </div>
                            <div className="flex-shrink-0">
                              {formData.category === category.value && (
                                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                  <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* E-Life Self Employment Registration */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-blue-800">🔵 E-Life Self Employment Registration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {elifeCategories.map((category) => (
                      <Card 
                        key={category.value}
                        className={`cursor-pointer transition-all duration-200 border-2 ${
                          formData.category === category.value 
                            ? 'border-blue-400 shadow-lg scale-[1.02]' 
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        } ${category.color}`}
                        onClick={() => handleCategorySelect(category.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 p-2 rounded-lg bg-white bg-opacity-50">
                              {category.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">{category.label}</h3>
                              <p className="text-sm">{category.description}</p>
                            </div>
                            <div className="flex-shrink-0">
                              {formData.category === category.value && (
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                  <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {selectedCategory && (
                <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Badge className={selectedCategory.value === 'job-card' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'}>
                        {selectedCategory.value === 'job-card' ? 'Universal Access' : 'Selected'}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">{selectedCategory.label}</h4>
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              Registration Fee: {
                                categoryFeesData.hasOffer && categoryFeesData.offerFee < categoryFeesData.actualFee ? (
                                  <span>
                                    <del className="text-red-600">₹{categoryFeesData.actualFee}</del>{' '}
                                    <span className="text-green-600">₹{categoryFeesData.offerFee}</span>
                                  </span>
                                ) : categoryFeesData.actualFee === 0 ? (
                                  <span className="text-green-600">FREE</span>
                                ) : (
                                  <span className="text-blue-600">₹{categoryFeesData.actualFee}</span>
                                )
                              }
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{selectedCategory.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Declaration Section */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-4 bg-[#b1eaf0]">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-orange-800">Declaration & Confirmation</h4>
                    <div className="bg-white p-4 rounded-lg border border-orange-200">
                      <p className="text-sm text-gray-700 mb-4">
                        By submitting this registration, I confirm that:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        <li>• All the information provided above is true and accurate to the best of my knowledge</li>
                        <li>• I understand that providing false information may lead to rejection of my application</li>
                        <li>• I agree to abide by the program terms and conditions</li>
                        <li>• I consent to receive updates and communications via the provided contact details</li>
                        {categoryFeesData.offerFee > 0 && (
                          <li>• I understand that a registration fee of ₹{categoryFeesData.offerFee} is required to complete the process</li>
                        )}
                      </ul>
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="declaration" 
                          checked={declarationAccepted}
                          onCheckedChange={(checked) => setDeclarationAccepted(!!checked)}
                        />
                        <Label htmlFor="declaration" className="text-sm text-gray-700 leading-relaxed">
                          I have read and agree to the above declaration and terms
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg py-6"
                disabled={isSubmitting || !declarationAccepted}
              >
                {isSubmitting ? "Submitting Registration..." : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Category Popup Modal */}
      {showCategoryPopup && selectedCategoryForPopup && (
        <CategoryPopupModal
          isOpen={showCategoryPopup}
          onClose={() => {
            setShowCategoryPopup(false);
            setSelectedCategoryForPopup(null);
          }}
          category={selectedCategoryForPopup}
          fees={getCategoryFees(selectedCategoryForPopup.value)}
          onConfirm={handleCategoryConfirm}
        />
      )}
    </>
  );
};

export default SimpleRegistrationForm;