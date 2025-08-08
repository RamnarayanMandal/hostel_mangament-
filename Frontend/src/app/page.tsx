"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
 
  StaggerContainer,
  StaggerItem,
  HoverLift,
  FadeIn,
  SlideUp
} from '@/components/ui/motion'
import { 
  Building2, 
  Users, 
  Shield, 
  Wifi, 
  Utensils, 
  Car, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  ArrowRight,
  GraduationCap,
  Home as HomeIcon,
  Search,
  Calendar
} from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const features = [
    {
      icon: Building2,
      title: "Modern Facilities",
      description: "State-of-the-art buildings with modern amenities and comfortable living spaces."
    },
    {
      icon: Shield,
      title: "24/7 Security",
      description: "Round-the-clock security with CCTV surveillance and trained personnel."
    },
    {
      icon: Wifi,
      title: "High-Speed Internet",
      description: "Free high-speed WiFi throughout the campus for seamless connectivity."
    },
    {
      icon: Utensils,
      title: "Quality Dining",
      description: "Nutritious and delicious meals prepared in hygienic kitchen facilities."
    },
    {
      icon: Car,
      title: "Transportation",
      description: "Convenient transportation services to and from the campus."
    },
    {
      icon: Users,
      title: "Community Living",
      description: "Build lasting friendships in our vibrant student community."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "The hostel facilities are amazing! Clean rooms, great food, and a wonderful community. I feel right at home.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Engineering Student",
      content: "Excellent security and modern amenities. The staff is very helpful and the location is perfect for my studies.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Business Student",
      content: "I love the community atmosphere here. The facilities are top-notch and the food is delicious!",
      rating: 5
    }
  ]

  const stats = [
    { number: "500+", label: "Happy Students" },
    { number: "50+", label: "Modern Rooms" },
    { number: "24/7", label: "Security" },
    { number: "100%", label: "Satisfaction" }
  ]



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <SlideUp className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <HoverLift className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HostelHub</span>
            </HoverLift>
           
            <div className="flex items-center space-x-4">
              <HoverLift>
                <Button variant="outline" onClick={() => router.push('/auth/login')}>
                  Login
                </Button>
              </HoverLift>
              <HoverLift>
                <Button onClick={() => router.push('/auth/signup')} className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
                  Get Started
                </Button>
              </HoverLift>
            </div>
          </div>
        </div>
      </SlideUp>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="text-center">
            <StaggerItem>
              <HoverLift className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200 mb-4">
                <GraduationCap className="h-4 w-4 mr-2" />
                Welcome to Premium Student Living
              </HoverLift>
            </StaggerItem>
            <StaggerItem>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your Perfect
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Home Away</span>
                <br />From Home
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Experience modern, comfortable, and secure student accommodation with world-class facilities. 
                Join our vibrant community and make your college years unforgettable.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HoverLift>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => router.push('/hostels')}
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Browse Hostels
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </HoverLift>
                <HoverLift>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => router.push('/auth/signup')}
                  >
                    <HomeIcon className="h-5 w-5 mr-2" />
                    Book Now
                  </Button>
                </HoverLift>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 p-4">
            {stats.map((stat, index) => (
              <StaggerItem key={index} className="text-center">
                <HoverLift className='p-4 rounded-md bg-slate-50'>
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Hostels?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need for a comfortable and productive student life.
            </p>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <HoverLift>
                  <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 hover:rotate-360 transition-transform duration-600">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Don&apos;t just take our word for it - hear from our satisfied students.
            </p>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={index}>
                <HoverLift>
                  <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                    <CardContent className="pt-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          </div>
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have found their perfect home away from home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HoverLift>
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => router.push('/auth/signup')}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Your Room
                </Button>
              </HoverLift>
              <HoverLift>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={() => router.push('/hostels')}
                >
                  <Search className="h-5 w-5 mr-2" />
                  View All Hostels
                </Button>
              </HoverLift>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <FadeIn>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StaggerItem>
              <HoverLift className="flex items-center space-x-2 mb-4">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">HostelHub</span>
              </HoverLift>
              <p className="text-gray-400">
                Your trusted partner for premium student accommodation with modern facilities and a vibrant community.
              </p>
            </StaggerItem>
            <StaggerItem>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:translate-x-1 transition-transform duration-200">
                  <a href="#features" className="hover:text-white">Features</a>
                </li>
                <li className="hover:translate-x-1 transition-transform duration-200">
                  <a href="#testimonials" className="hover:text-white">Testimonials</a>
                </li>
                <li className="hover:translate-x-1 transition-transform duration-200">
                  <a href="/hostels" className="hover:text-white">Browse Hostels</a>
                </li>
                <li className="hover:translate-x-1 transition-transform duration-200">
                  <a href="/auth/signup" className="hover:text-white">Book Now</a>
                </li>
              </ul>
            </StaggerItem>
            <StaggerItem>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:translate-x-1 transition-transform duration-200">
                  <a href="/help" className="hover:text-white">Help Center</a>
                </li>
                <li className="hover:translate-x-1 transition-transform duration-200">
                  <a href="/contact" className="hover:text-white">Contact Us</a>
                </li>
                <li className="hover:translate-x-1 transition-transform duration-200">
                  <a href="/faq" className="hover:text-white">FAQ</a>
                </li>
                <li className="hover:translate-x-1 transition-transform duration-200">
                  <a href="/terms" className="hover:text-white">Terms of Service</a>
                </li>
              </ul>
            </StaggerItem>
            <StaggerItem>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>123 Campus Drive, University City</span>
                </div>
                <div className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>info@hostelhub.com</span>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
          <FadeIn className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HostelHub. All rights reserved.</p>
          </FadeIn>
        </div>
        </FadeIn>
      </footer>
    </div>
  )
}
