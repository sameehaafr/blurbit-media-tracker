'use client'

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Home, Search, LogOut, LogIn } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"

export function Navigation() {
  const { user, loading, signOut } = useUser()

  const handleSignOut = async () => {
    await signOut()
  }

  const getUserInitials = (user: any) => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-amber-600" />
          <span className="text-xl font-semibold text-amber-800">Blurbit</span>
        </Link>

        <div className="hidden md:flex items-center relative max-w-sm w-full">
          <Search className="absolute left-3 h-4 w-4 text-amber-500" />
          <Input
            placeholder="Search for books, movies, podcasts..."
            className="pl-10 bg-amber-50 border-amber-200 focus-visible:ring-amber-500"
          />
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-amber-700 hover:text-amber-900">
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Link>
          <Link href="/explore" className="text-amber-700 hover:text-amber-900">
            <Search className="h-5 w-5 md:hidden" />
            <span className="sr-only">Search</span>
          </Link>
          
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/add" className="text-amber-700 hover:text-amber-900">
                    <span className="hidden md:inline">Add Media</span>
                    <span className="md:hidden">+</span>
                  </Link>
                  <Link href="/profile" className="text-amber-700 hover:text-amber-900">
                    <Avatar className="h-8 w-8 border border-amber-200">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt="User" />
                      <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Profile</span>
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="text-amber-700 hover:text-amber-900"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Sign Out</span>
                  </Button>
                </>
              ) : (
                <Link href="/auth" className="text-amber-700 hover:text-amber-900">
                  <LogIn className="h-5 w-5" />
                  <span className="sr-only">Sign In</span>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
