import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Users, Award, TrendingUp, Heart, Eye, Bell, Calendar, Camera, CheckCircle, ShoppingCart, Briefcase, ArrowRight } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { useState } from "react";

const AboutProgram = () => {
  const { announcements, photoGallery } = useAdminData();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const visionMission = [
    {
      title: "Our Vision",
      icon: <Eye className="h-8 w-8 text-blue-600" />,
      content: "To create a thriving ecosystem of successful entrepreneurs who contribute to economic growth and social development through innovative self-employment opportunities.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Our Mission",
      icon: <Target className="h-8 w-8 text-green-600" />,
      content: "Empowering individuals with comprehensive training, mentorship, and resources to establish and scale sustainable businesses across diverse sectors including agriculture, food processing, e-commerce, and general entrepreneurship.",
      color: "bg-green-50 border-green-200"
    }
  ];

  const whyChooseUs = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Expert Mentorship",
      description: "Learn from industry experts and successful entrepreneurs"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Comprehensive Training",
      description: "Complete skill development programs tailored to your chosen field"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Market Linkages",
      description: "Direct connections to markets and business opportunities"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Ongoing Support",
      description: "Continuous guidance throughout your entrepreneurial journey"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Proven Track Record",
      description: "Thousands of successful entrepreneurs across multiple sectors"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Goal-Oriented Approach",
      description: "Structured programs designed for measurable business outcomes"
    }
  ];

  const programCards = [
    {
      id: "pennyekart",
      title: "Pennyekart",
      description: "A hybrid direct sales and service platform integrating ecommerce, local services, and direct product delivery. Product notifications and service updates are featured here.",
      icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
      color: "bg-green-50 border-green-200 hover:border-green-400",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      id: "elife",
      title: "E-Life Self Employment Program",
      description: "A dedicated self-employment initiative supporting diverse local business models. Notifications and program updates are available.",
      icon: <Briefcase className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    }
  ];

  const activeAnnouncements = announcements.filter(a => a.isActive);

  if (selectedPage) {
    return (
      <div className="space-y-8">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => setSelectedPage(null)}
          className="mb-4"
        >
          ← Back to About Program
        </Button>

        {/* Page Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {selectedPage === 'pennyekart' ? 'Pennyekart Platform' : 'E-Life Self Employment Program'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {selectedPage === 'pennyekart' 
              ? 'Comprehensive e-commerce and service platform for entrepreneurs'
              : 'Dedicated self-employment initiative for diverse business models'
            }
          </p>
        </div>

        {/* Program Notifications */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Program Notifications</h3>
          </div>
          
          {activeAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {activeAnnouncements
                .filter(announcement => 
                  !announcement.category || 
                  announcement.category.toLowerCase().includes(selectedPage) ||
                  announcement.category.toLowerCase() === 'general'
                )
                .map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{announcement.title}</h4>
                          {announcement.category && (
                            <Badge variant="secondary">{announcement.category}</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{announcement.content}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                        </div>
                        {announcement.link && (
                          <div className="mt-3">
                            <Button variant="outline" size="sm" asChild>
                              <a href={announcement.link} target="_blank" rel="noopener noreferrer">
                                Learn More <ArrowRight className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No Notifications Yet</h4>
                <p className="text-gray-500">
                  Program notifications and updates will appear here when available.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Program Details */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-xl text-blue-800">Program Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {selectedPage === 'pennyekart' ? (
                  <>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>E-commerce platform integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Local service marketplace</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Direct product delivery system</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Real-time notifications</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Seller support and training</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Diverse business model support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Local community integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Skill development programs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Mentorship and guidance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Market linkage support</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-xl text-green-800">Success Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">500+</div>
                  <p className="text-sm text-green-700">Active Participants</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">85%</div>
                  <p className="text-sm text-blue-700">Success Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">₹2.5L</div>
                  <p className="text-sm text-purple-700">Average Annual Income</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">About Our Program</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover our comprehensive self-employment development program designed to transform 
          entrepreneurial dreams into successful business realities.
        </p>
      </div>

      {/* Program Cards */}
      <section>
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Our Program Offerings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programCards.map((card) => (
            <Card key={card.id} className={`${card.color} border-2 hover:shadow-lg transition-all duration-200`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {card.icon}
                  <CardTitle className="text-2xl">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{card.description}</p>
                <Button 
                  onClick={() => setSelectedPage(card.id)}
                  className={`${card.buttonColor} text-white`}
                >
                  Learn More <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visionMission.map((item, index) => (
          <Card key={index} className={`${item.color} border-2`}>
            <CardHeader>
              <div className="flex items-center gap-4">
                {item.icon}
                <CardTitle className="text-2xl">{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Why Choose Our Program */}
      <section>
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Why Choose Our Program?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Announcements */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">Latest Announcements</h3>
        </div>
        
        {activeAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {activeAnnouncements.slice(0, 4).map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{announcement.title}</h4>
                        {announcement.category && (
                          <Badge variant="secondary">{announcement.category}</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{announcement.content}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      </div>
                      {announcement.link && (
                        <div className="mt-3">
                          <Button variant="outline" size="sm" asChild>
                            <a href={announcement.link} target="_blank" rel="noopener noreferrer">
                              Learn More <ArrowRight className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50">
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">No Announcements Yet</h4>
              <p className="text-gray-500">
                Program announcements and updates will appear here when available.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Photo Gallery */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Camera className="h-6 w-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">Photo Gallery</h3>
        </div>
        
        {photoGallery.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photoGallery.slice(0, 6).map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">{photo.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{photo.title}</h4>
                  {photo.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{photo.description}</p>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(photo.uploadedAt).toLocaleDateString()}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="p-12 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">Photo Gallery Coming Soon</h4>
              <p className="text-gray-500">
                We're preparing an inspiring photo gallery showcasing our program activities, 
                success stories, and community events.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Contact Information */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl text-white p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of successful entrepreneurs who have transformed their lives through our program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="text-center">
              <p className="font-semibold">Program Coordinator</p>
              <p>+91 9876543210</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Email Support</p>
              <p>info@sedp-program.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutProgram;