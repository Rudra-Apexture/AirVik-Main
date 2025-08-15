'use client';

import React, { useState } from 'react';
import IconTest from '@/components/IconTest';
import EnhancedUIDemo from '@/components/EnhancedUIDemo';
import ColorDemo from '@/components/ColorDemo';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FaExclamation } from 'react-icons/fa';

export default function UIDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-primary text-3xl font-bold mb-6">UI Components Demo</h1>
      <p className="text-muted mb-8">
        This page demonstrates the integration of Shadcn UI with React Icons and Lucide Icons.
      </p>
      
      <div className="space-y-12">
        {/* Brand Colors Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Brand Colors</h2>
          <ColorDemo />
        </section>

        {/* Basic Icon Test */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Basic Icon Integration</h2>
          <IconTest />
        </section>
        
        {/* Enhanced UI Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Enhanced UI Components</h2>
          <EnhancedUIDemo />
        </section>

        {/* Toast Notifications Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Toast Notifications</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sonner Toast</CardTitle>
                <CardDescription>Custom styled toast notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      toast.error(
                        <div className="flex items-start p-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center size-10 rounded-full bg-red-500">
                              <FaExclamation className="text-white text-lg" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">Let's try that again</h3>
                            <div className="mt-1 text-sm text-gray-500">
                              <p>Too many registration attempts. Please try again later.</p>
                            </div>
                          </div>
                        </div>,
                        {
                          duration: 4000,
                          className: 'p-4 bg-white',
                          style: {
                            border: '1px solid #DDDDDD',
                            borderRadius: '0.75rem',
                            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                            padding: '1rem',
                          },
                          icon: null,
                        }
                      );
                    }}
                  >
                    Show Error Toast
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Custom styled toast with icon and message
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Checkbox and Label Demo */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Checkbox & Label</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Checkbox</CardTitle>
                <CardDescription>Simple checkbox with label</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" checked />
                  <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="disabled" disabled />
                  <Label htmlFor="disabled" className="text-muted-foreground">Disabled checkbox</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Checkbox States</CardTitle>
                <CardDescription>Different states and variants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="required" required />
                  <Label htmlFor="required">Required field <span className="text-destructive">*</span></Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="indeterminate" disabled />
                  <Label htmlFor="indeterminate" className="text-muted-foreground">Indeterminate state (disabled)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="with-description" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="with-description" className="flex items-center">
                      Enable notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about your account activities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      
      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Shadcn UI is successfully installed and configured</li>
          <li>React Icons library is integrated and working</li>
          <li>Lucide Icons library is integrated and working</li>
          <li>All components are styled with Tailwind CSS</li>
          <li>Components installed: Button, Card, Input, Badge, Checkbox, Label, Sonner Toast</li>
          <li>Icon libraries: React Icons (FaHotel, MdEmail, FaExclamation, etc.) and Lucide (Search, Home, etc.)</li>
        </ul>
        
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="text-lg font-medium mb-2">Usage Instructions</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Import Shadcn UI components from <code>@/components/ui/[component-name]</code></li>
            <li>Import React Icons with <code>import &#123; IconName &#125; from 'react-icons/[collection]'</code></li>
            <li>Import Lucide Icons with <code>import &#123; IconName &#125; from 'lucide-react'</code></li>
            <li>Import Sonner toast with <code>import &#123; toast &#125; from 'sonner'</code></li>
            <li>Use icons within components as shown in the examples above</li>
            
          </ol>
        </div>
      </div>
    </div>
  );
}
