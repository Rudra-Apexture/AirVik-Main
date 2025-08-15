import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// React Icons
import { FaHotel, FaUser, FaCalendarAlt, FaSearch, FaCreditCard, FaBed } from 'react-icons/fa';
import { MdEmail, MdNotifications, MdStar, MdLocationOn } from 'react-icons/md';

// Lucide Icons
import { Search, Home, Settings, Menu, Calendar, User, CreditCard, Mail, Bell, Star, MapPin } from 'lucide-react';

/**
 * Enhanced UI Demo component showcasing Shadcn UI components with React Icons and Lucide Icons
 */
export function EnhancedUIDemo() {
  return (
    <div className="space-y-10">
      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Buttons with Icons</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">React Icons</h3>
            <div className="flex flex-wrap gap-4">
              <Button>
                <FaHotel className="mr-2 h-4 w-4" /> Book Hotel
              </Button>
              <Button variant="secondary">
                <FaUser className="mr-2 h-4 w-4" /> My Account
              </Button>
              <Button variant="outline">
                <FaCalendarAlt className="mr-2 h-4 w-4" /> Check Availability
              </Button>
              <Button variant="destructive">
                <MdNotifications className="mr-2 h-4 w-4" /> Alerts
              </Button>
              <Button variant="ghost">
                <FaSearch className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Lucide Icons</h3>
            <div className="flex flex-wrap gap-4">
              <Button>
                <Home className="mr-2 h-4 w-4" /> Home
              </Button>
              <Button variant="secondary">
                <User className="mr-2 h-4 w-4" /> Profile
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" /> Schedule
              </Button>
              <Button variant="destructive">
                <Bell className="mr-2 h-4 w-4" /> Notifications
              </Button>
              <Button variant="ghost">
                <Search className="mr-2 h-4 w-4" /> Find
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Input Fields Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Input Fields with Icons</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">React Icons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input className="pl-10" placeholder="Username" />
              </div>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input className="pl-10" placeholder="Email Address" />
              </div>
              <div className="relative">
                <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input className="pl-10" placeholder="Card Number" />
              </div>
              <div className="relative">
                <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input className="pl-10" placeholder="Location" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Lucide Icons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input className="pl-10" placeholder="Full Name" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input className="pl-10" placeholder="Email" />
              </div>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input className="pl-10" placeholder="Payment Method" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input className="pl-10" placeholder="Address" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Cards with Icons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* React Icons Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Deluxe Room</CardTitle>
                <FaBed className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>Luxury accommodation with all amenities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MdLocationOn className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>5th Floor, Ocean View</span>
                </div>
                <div className="flex items-center">
                  <FaUser className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Max 2 Adults, 1 Child</span>
                </div>
                <div className="flex items-center">
                  <MdStar className="h-4 w-4 mr-2 text-amber-500" />
                  <MdStar className="h-4 w-4 mr-2 text-amber-500" />
                  <MdStar className="h-4 w-4 mr-2 text-amber-500" />
                  <MdStar className="h-4 w-4 mr-2 text-amber-500" />
                  <MdStar className="h-4 w-4 mr-2 text-amber-500" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                <Badge variant="outline">
                  <FaCreditCard className="h-3 w-3 mr-1" /> Refundable
                </Badge>
              </div>
              <Button>
                <FaCalendarAlt className="mr-2 h-4 w-4" /> Book Now
              </Button>
            </CardFooter>
          </Card>

          {/* Lucide Icons Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Executive Suite</CardTitle>
                <Home className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>Premium suite with exclusive benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>6th Floor, Mountain View</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Max 3 Adults, 2 Children</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-amber-500" />
                  <Star className="h-4 w-4 mr-2 text-amber-500" />
                  <Star className="h-4 w-4 mr-2 text-amber-500" />
                  <Star className="h-4 w-4 mr-2 text-amber-500" />
                  <Star className="h-4 w-4 mr-2 text-amber-500" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center">
                <Badge variant="outline">
                  <CreditCard className="h-3 w-3 mr-1" /> Free Cancellation
                </Badge>
              </div>
              <Button>
                <Calendar className="mr-2 h-4 w-4" /> Reserve
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default EnhancedUIDemo;
