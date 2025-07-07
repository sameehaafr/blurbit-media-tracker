import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { UserProvider } from "@/lib/user-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Blurbit - Media Tracker",
  description: "Track and share your media with friends",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-amber-50/30 text-amber-900`}>
        <UserProvider>
          <Navigation />
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  )
}
