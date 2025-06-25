import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IconCamera, IconUser } from '@tabler/icons-react'

export default function ListenerProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your profile information and preferences
        </p>
      </div>

      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconUser size={20} />
            <span>Profile Picture</span>
          </CardTitle>
          <CardDescription>
            Upload a profile picture to personalize your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="text-lg">
                <IconUser size={24} />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" className="flex items-center space-x-2">
              <IconCamera size={16} />
              <span>Change Picture</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter your first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter your last name" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              placeholder="Tell us a bit about yourself and your music taste..."
              className="min-h-[100px]"
            />
          </div>
          
          <Button className="w-full md:w-auto">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Music Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Music Preferences</CardTitle>
          <CardDescription>
            Let us know your favorite genres and artists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="favoriteGenres">Favorite Genres</Label>
            <Input 
              id="favoriteGenres" 
              placeholder="e.g., Rock, Jazz, Electronic, Classical..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="favoriteArtists">Favorite Artists</Label>
            <Input 
              id="favoriteArtists" 
              placeholder="e.g., The Beatles, Miles Davis, Daft Punk..."
            />
          </div>
          
          <Button variant="outline" className="w-full md:w-auto">
            Update Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
