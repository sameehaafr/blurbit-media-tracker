'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { FriendService, type FriendRequest } from '@/lib/friend-service'
import { UserPlus, Check, X, Clock, Search } from 'lucide-react'

interface FriendRequestProps {
  onRequestsUpdate?: () => void
}

export function FriendRequest({ onRequestsUpdate }: FriendRequestProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [showRequests, setShowRequests] = useState(false)

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setMessage('')

    try {
      await FriendService.sendFriendRequest(email.trim())
      setMessage('Friend request sent successfully!')
      setEmail('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to send friend request. Make sure the email is correct.')
    } finally {
      setLoading(false)
    }
  }

  const loadRequests = async () => {
    try {
      const pendingRequests = await FriendService.getFriendRequests()
      setRequests(pendingRequests)
    } catch (error) {
      console.error('Error loading friend requests:', error)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await FriendService.acceptFriendRequest(requestId)
      await loadRequests()
      onRequestsUpdate?.()
    } catch (error) {
      console.error('Error accepting friend request:', error)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await FriendService.rejectFriendRequest(requestId)
      await loadRequests()
    } catch (error) {
      console.error('Error rejecting friend request:', error)
    }
  }

  const toggleRequests = () => {
    if (!showRequests) {
      loadRequests()
    }
    setShowRequests(!showRequests)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-amber-800">Add Friends</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleRequests}
          className="text-amber-700"
        >
          <Clock className="h-4 w-4 mr-1" />
          Requests
          {requests.length > 0 && (
            <Badge className="ml-1 bg-amber-600 text-white">
              {requests.length}
            </Badge>
          )}
        </Button>
      </div>

      <form onSubmit={handleSendRequest} className="space-y-3">
        <div>
          <Label htmlFor="friend-email">Friend's Email</Label>
          <div className="flex gap-2">
            <Input
              id="friend-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="flex-1"
              required
            />
            <Button type="submit" disabled={loading}>
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {message && (
          <p className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>

      {showRequests && (
        <div className="space-y-3">
          <h4 className="font-medium text-amber-800">Pending Requests</h4>
          {requests.length === 0 ? (
            <p className="text-sm text-amber-600">No pending friend requests</p>
          ) : (
            <div className="space-y-2">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={request.sender_avatar} alt={request.sender_name} />
                      <AvatarFallback>
                        {request.sender_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-amber-800">{request.sender_name}</p>
                      <p className="text-sm text-amber-600">{request.sender_email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectRequest(request.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 