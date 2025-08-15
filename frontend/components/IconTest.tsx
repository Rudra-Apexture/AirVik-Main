import React from 'react';
import { Button } from '@/components/ui/button';
import { FaHotel, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { Search, Home, Settings, Menu } from 'lucide-react';

/**
 * Test component to demonstrate the integration of Shadcn UI with React Icons and Lucide Icons
 */
export function IconTest() {
  return (
    <div className="p-6 space-y-6 bg-background rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-foreground mb-4">Icon Integration Test</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Shadcn UI Button with React Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button>
            <FaHotel className="mr-2 h-4 w-4" /> Hotel
          </Button>
          <Button variant="secondary">
            <FaUser className="mr-2 h-4 w-4" /> User
          </Button>
          <Button variant="outline">
            <FaCalendarAlt className="mr-2 h-4 w-4" /> Calendar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Shadcn UI Button with Lucide Icons</h3>
        <div className="flex flex-wrap gap-4">
          <Button>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          <Button variant="secondary">
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Icon Sizes Demonstration</h3>
        <div className="flex items-center gap-4">
          <Menu className="h-4 w-4 text-primary" />
          <Menu className="h-6 w-6 text-primary" />
          <Menu className="h-8 w-8 text-primary" />
          <FaUser className="h-4 w-4 text-primary" />
          <FaUser className="h-6 w-6 text-primary" />
          <FaUser className="h-8 w-8 text-primary" />
        </div>
      </div>
    </div>
  );
}

export default IconTest;
