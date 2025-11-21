'use client'

import { useAuth, SignedIn, SignedOut } from '@clerk/nextjs'
import AllAnnouncements from '@/components/pages/AllAnnouncements'
import Login from '@/components/pages/Login'
import { AppUserProvider, useAppUser } from '@/contexts/AppUserContext'
import { useRouter } from 'next/navigation'

function AllAnnouncementsContent() {
  const { user, isLoading, error } = useAppUser()
  const router = useRouter()

  const handleBackToDashboard = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className="w-32 h-4 bg-white/20 rounded-lg mx-auto animate-pulse"></div>
            <div className="w-24 h-3 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-white/80 text-lg">{error || 'Unable to load your profile. Please try signing in again.'}</p>
        </div>
      </div>
    )
  }

  return <AllAnnouncements onBackToDashboard={handleBackToDashboard} />
}

export default function AllAnnouncementsPage() {
  const { isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-32 h-4 bg-white/20 rounded-lg mx-auto animate-pulse"></div>
          <div className="w-24 h-3 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SignedIn>
        <AppUserProvider>
          <AllAnnouncementsContent />
        </AppUserProvider>
      </SignedIn>
      <SignedOut>
        <Login />
      </SignedOut>
    </>
  )
}
