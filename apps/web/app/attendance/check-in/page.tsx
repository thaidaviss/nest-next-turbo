'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, MapPin, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns'; 
import { useRouter } from 'next/navigation';
import { SITE_MAP } from '@/constants';

export default function CheckInPage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error' | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus('loading');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus('success');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationStatus('error');
        }
      );
    } else {
      setLocationStatus('error');
    }
  }, []);

  const handleCheckIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      // In a real app, you would send this data to your API
      const checkInData = {
        timestamp: currentTime.toISOString(),
        notes,
        location,
      };

      console.log('Check-in data:', checkInData);
      
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsCheckedIn(true);
      
      // After successful check-in, redirect to attendance page after 2 seconds
      setTimeout(() => {
        router.push('/attendance');
      }, 2000);
    } catch (err) {
      setError('Failed to record check-in. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationStatusMessage = () => {
    switch (locationStatus) {
      case 'loading':
        return 'Getting your location...';
      case 'success':
        return `Location captured: ${location?.lat.toFixed(6)}, ${location?.lng.toFixed(6)}`;
      case 'error':
        return 'Could not get your location. Check your browser settings.';
      default:
        return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Check In</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Record Attendance</CardTitle>
              <CardDescription>
                Check in for today, {format(currentTime, 'EEEE, MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {isCheckedIn ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-green-600">Successfully Checked In!</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    You have checked in at {format(currentTime, 'h:mm:ss a')}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Redirecting to attendance page...
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">
                        {format(currentTime, 'h:mm:ss')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(currentTime, 'a')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{format(currentTime, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      placeholder="Any notes for today's check-in?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className={`h-4 w-4 ${locationStatus === 'error' ? 'text-red-500' : locationStatus === 'success' ? 'text-green-500' : 'text-gray-500'}`} />
                    <span className={locationStatus === 'error' ? 'text-red-500' : locationStatus === 'success' ? 'text-green-500' : 'text-gray-500'}>
                      {getLocationStatusMessage()}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
            {!isCheckedIn && (
              <CardFooter className="flex justify-between">
                <Link href={SITE_MAP.ATTENDANCE}>
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button 
                  onClick={handleCheckIn} 
                  disabled={isLoading || locationStatus === 'loading'}
                >
                  {isLoading ? 'Checking in...' : 'Check In Now'}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
