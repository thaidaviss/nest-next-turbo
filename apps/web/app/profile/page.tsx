'use client';

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch('/api/user/profile');
        // const data = await response.json();
        // setUser(data);
        
        // Mock data for now
        setUser({
          id: '1',
          name: 'John Doe',
          username: 'johndoe',
          email: 'john.doe@example.com',
          avatar: 'https://github.com/shadcn.png',
          bio: 'Software developer passionate about web technologies and open source projects.',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUser();
  }, []);

  const handleSaveProfile = async () => {
    try {
      // Replace with your actual API call
      // await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(editedUser),
      // });
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...editedUser } : null);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Profile card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">{user.bio}</p>
              <p className="text-xs text-muted-foreground mt-4">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant={isEditing ? "default" : "outline"} 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right column - Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    {isEditing 
                      ? "Update your profile information below" 
                      : "View and manage your profile information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input 
                        id="name" 
                        name="name" 
                        defaultValue={user.name}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-sm">{user.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    {isEditing ? (
                      <Input 
                        id="username" 
                        name="username" 
                        defaultValue={user.username}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-sm">@{user.username}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input 
                        id="email" 
                        type="email"
                        name="email" 
                        defaultValue={user.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-sm">{user.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <textarea 
                        id="bio" 
                        name="bio"
                        className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue={user.bio}
                        onChange={handleChange}
                      />
                    ) : (
                      <p className="text-sm">{user.bio}</p>
                    )}
                  </div>
                </CardContent>
                {isEditing && (
                  <CardFooter>
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent account activity and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-primary pl-4 py-2">
                      <p className="font-medium">Profile Updated</p>
                      <p className="text-sm text-muted-foreground">Yesterday at 12:34 PM</p>
                    </div>
                    <div className="border-l-2 border-primary pl-4 py-2">
                      <p className="font-medium">Password Changed</p>
                      <p className="text-sm text-muted-foreground">Last week at 10:15 AM</p>
                    </div>
                    <div className="border-l-2 border-primary pl-4 py-2">
                      <p className="font-medium">Account Created</p>
                      <p className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}