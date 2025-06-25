import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconHeart, IconClock, IconMusic, IconBell } from '@tabler/icons-react'
import { useState } from 'react'

export default function ListeningPreferences() {
  const [notifications, setNotifications] = useState(true)
  const [autoFavorite, setAutoFavorite] = useState(false)
  const [showHistory, setShowHistory] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Listening Preferences</h2>
        <p className="text-muted-foreground">
          Customize your listening experience and discovery features
        </p>
      </div>

      {/* Favorites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconHeart size={20} />
            <span>Favorites & Collections</span>
          </CardTitle>
          <CardDescription>
            Manage how you save and organize your favorite content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="autoFavorite">Auto-favorite liked stations</Label>
              <p className="text-sm text-muted-foreground">
                Automatically add stations you listen to frequently to favorites
              </p>
            </div>
            <Switch
              id="autoFavorite"
              checked={autoFavorite}
              onCheckedChange={setAutoFavorite}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="favoriteLimit">Maximum favorites</Label>
            <Select defaultValue="100">
              <SelectTrigger>
                <SelectValue placeholder="Select limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50 stations</SelectItem>
                <SelectItem value="100">100 stations</SelectItem>
                <SelectItem value="200">200 stations</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconClock size={20} />
            <span>Listening History</span>
          </CardTitle>
          <CardDescription>
            Control how your listening history is saved and displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="showHistory">Save listening history</Label>
              <p className="text-sm text-muted-foreground">
                Keep track of stations and songs you've listened to
              </p>
            </div>
            <Switch
              id="showHistory"
              checked={showHistory}
              onCheckedChange={setShowHistory}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="historyDuration">Keep history for</Label>
            <Select defaultValue="3months">
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 month</SelectItem>
                <SelectItem value="3months">3 months</SelectItem>
                <SelectItem value="6months">6 months</SelectItem>
                <SelectItem value="1year">1 year</SelectItem>
                <SelectItem value="forever">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="sm">
            Clear History
          </Button>
        </CardContent>
      </Card>

      {/* Discovery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconMusic size={20} />
            <span>Music Discovery</span>
          </CardTitle>
          <CardDescription>
            Customize how new music and stations are recommended to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="discoveryMode">Discovery mode</Label>
            <Select defaultValue="balanced">
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative - Similar to my favorites</SelectItem>
                <SelectItem value="balanced">Balanced - Mix of familiar and new</SelectItem>
                <SelectItem value="adventurous">Adventurous - Explore new genres</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="regionFilter">Regional preferences</Label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                <SelectItem value="local">Local stations only</SelectItem>
                <SelectItem value="international">International preferred</SelectItem>
                <SelectItem value="custom">Custom regions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconBell size={20} />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>
            Choose when and how you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications">Enable notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new music and station updates
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          
          {notifications && (
            <div className="pl-4 space-y-3 border-l-2 border-muted">
              <div className="flex items-center justify-between">
                <Label htmlFor="newMusic" className="text-sm">New music from favorite stations</Label>
                <Switch id="newMusic" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="recommendations" className="text-sm">Weekly recommendations</Label>
                <Switch id="recommendations" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="updates" className="text-sm">Station updates and news</Label>
                <Switch id="updates" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  )
}
