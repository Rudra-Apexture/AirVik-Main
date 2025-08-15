import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Hotel, User, Mail } from 'lucide-react';

const ColorDemo = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Brand Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Primary Color */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Primary</CardTitle>
              <CardDescription>#E61E4D</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-medium">Primary Color</span>
              </div>
            </CardContent>
          </Card>

          {/* Text Color */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Text</CardTitle>
              <CardDescription>#222222</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-white border rounded-md flex items-center justify-center">
                <span className="text-text font-medium">Text Color</span>
              </div>
            </CardContent>
          </Card>

          {/* Muted Text Color */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Muted</CardTitle>
              <CardDescription>#6a6a6a</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-white border rounded-md flex items-center justify-center">
                <span className="text-muted font-medium">Muted Text</span>
              </div>
            </CardContent>
          </Card>

          {/* Neutral Color */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Neutral</CardTitle>
              <CardDescription>#dddddd</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-neutral rounded-md flex items-center justify-center">
                <span className="font-medium">Neutral Color</span>
              </div>
            </CardContent>
          </Card>

          {/* Gray Background */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Gray Background</CardTitle>
              <CardDescription>#f7f7f7</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-gray-bg rounded-md flex items-center justify-center">
                <span className="font-medium">Gray Background</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">UI Components with Brand Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Primary and neutral button examples</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button>Primary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-neutral text-text hover:bg-neutral/90">Neutral Button</Button>
                <Button className="bg-gray-bg text-text hover:bg-gray-bg/90">Gray Button</Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>Input fields with brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input type="text" placeholder="Search..." className="focus-visible:ring-primary" />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Input type="email" placeholder="Email" className="border-primary" />
                <Button className="bg-primary text-primary-foreground">Subscribe</Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Status indicators with brand colors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge className="bg-primary text-primary-foreground">Primary</Badge>
                <Badge className="bg-neutral text-text">Neutral</Badge>
                <Badge className="bg-gray-bg text-muted">Muted</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card>
            <CardHeader className="bg-gray-bg border-b">
              <CardTitle>Hotel Booking</CardTitle>
              <CardDescription className="text-muted">Luxury Suite</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-4">
                <Hotel className="text-primary h-8 w-8" />
                <div>
                  <p className="text-text font-medium">Ocean View Suite</p>
                  <p className="text-muted text-sm">Available from July 15</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <p className="text-text font-bold">$299 / night</p>
              <Button>Book Now</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ColorDemo;
