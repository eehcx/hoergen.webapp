import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
//import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { IconVolume, IconHeadphones, IconSettings } from '@tabler/icons-react'
import { useState } from 'react'

export default function AudioSettings() {
  const [volume, setVolume] = useState([75])
  const [autoPlay, setAutoPlay] = useState(true)
  const [crossfade, setCrossfade] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Audio Settings</h2>
        <p className="text-muted-foreground">
          Configure your audio quality and playback preferences
        </p>
      </div>

      {/* Audio Quality */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconHeadphones size={20} />
            <span>Audio Quality</span>
          </CardTitle>
          <CardDescription>
            Choose your preferred audio quality settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="audioQuality">Streaming Quality</Label>
            <Select defaultValue="high">
              <SelectTrigger>
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (96 kbps)</SelectItem>
                <SelectItem value="normal">Normal (128 kbps)</SelectItem>
                <SelectItem value="high">High (320 kbps)</SelectItem>
                <SelectItem value="lossless">Lossless</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="downloadQuality">Download Quality</Label>
            <Select defaultValue="high">
              <SelectTrigger>
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal (128 kbps)</SelectItem>
                <SelectItem value="high">High (320 kbps)</SelectItem>
                <SelectItem value="lossless">Lossless</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Volume Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconVolume size={20} />
            <span>Volume & Controls</span>
          </CardTitle>
          <CardDescription>
            Configure volume and playback controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume">Default Volume</Label>
              <span className="text-sm text-muted-foreground">{volume[0]}%</span>
            </div>
            <input
              type="range"
              id="volume"
              value={volume[0]}
              onChange={(e) => setVolume([parseInt(e.target.value)])}
              max={100}
              min={0}
              step={1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="autoPlay">Auto-play</Label>
              <p className="text-sm text-muted-foreground">
                Automatically start playing when opening stations
              </p>
            </div>
            <Switch
              id="autoPlay"
              checked={autoPlay}
              onCheckedChange={setAutoPlay}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="crossfade">Crossfade</Label>
              <p className="text-sm text-muted-foreground">
                Smooth transitions between tracks
              </p>
            </div>
            <Switch
              id="crossfade"
              checked={crossfade}
              onCheckedChange={setCrossfade}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconSettings size={20} />
            <span>Audio Devices</span>
          </CardTitle>
          <CardDescription>
            Select your preferred audio output device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="outputDevice">Output Device</Label>
            <Select defaultValue="default">
              <SelectTrigger>
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default - System Audio</SelectItem>
                <SelectItem value="speakers">Built-in Speakers</SelectItem>
                <SelectItem value="headphones">Bluetooth Headphones</SelectItem>
                <SelectItem value="usb">USB Audio Device</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" className="w-full md:w-auto">
            Test Audio
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Audio Settings</Button>
      </div>
    </div>
  )
}
