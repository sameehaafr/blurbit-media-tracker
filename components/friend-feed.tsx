'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bookmark, MessageSquare, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { FriendService, type FriendActivity } from '@/lib/friend-service'

export function FriendFeed() {
  const [activities, setActivities] = useState<FriendActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFriendActivity()
  }, [])

  const loadFriendActivity = async () => {
    try {
      setLoading(true)
      const activity = await FriendService.getFriendActivity()
      setActivities(activity)
    } catch (error) {
      console.error('Error loading friend activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString()
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'rated':
        return <Star className="h-3 w-3 text-amber-500" />
      case 'reviewed':
        return <MessageSquare className="h-3 w-3 text-amber-600" />
      case 'saved':
        return <Bookmark className="h-3 w-3 text-amber-600" />
      case 'completed':
        return <Star className="h-3 w-3 text-green-500" />
      default:
        return <Bookmark className="h-3 w-3 text-amber-600" />
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'rated':
        return 'rated'
      case 'reviewed':
        return 'reviewed'
      case 'saved':
        return 'saved'
      case 'completed':
        return 'completed'
      default:
        return 'added'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
          <span className="ml-2 text-amber-700">Loading friend activity...</span>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-amber-600">
          <p>No friend activity yet.</p>
          <p className="text-sm mt-1">Connect with friends to see their media activity here!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="border-b border-amber-200 pb-4 last:border-b-0">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 border border-amber-200">
              <AvatarImage src={activity.user_avatar} alt={activity.user_name} />
              <AvatarFallback>
                {activity.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <Link href="#" className="font-medium text-amber-800 hover:underline">
                  {activity.user_name}
                </Link>
                <span className="text-amber-600 text-sm">{getActionText(activity.action)}</span>
                {activity.rating && activity.action === 'rated' && (
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < activity.rating! 
                            ? "fill-amber-500 text-amber-500" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
                {getActionIcon(activity.action)}
              </div>
              <p className="text-sm font-medium">{activity.media_title}</p>
              {activity.review && (
                <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                  "{activity.review}"
                </p>
              )}
              <p className="text-xs text-amber-600">{formatTimeAgo(activity.created_at)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
