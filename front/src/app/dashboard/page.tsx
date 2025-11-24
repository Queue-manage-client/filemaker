'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/lib/auth'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { LeftPanel } from '@/components/dashboard/LeftPanel'
import { CenterPanel } from '@/components/dashboard/CenterPanel'
import { RightPanel } from '@/components/dashboard/RightPanel'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/')
    }
  }, [router])

  useEffect(() => {
    document.title = 'ダッシュボード - Dispatch Harmony Hub';
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Pink Cards */}
          <div className="lg:col-span-1">
            <LeftPanel />
          </div>
          
          {/* Center Panel - Gray Cards */}
          <div className="lg:col-span-1">
            <CenterPanel />
          </div>
          
          {/* Right Panel - Light Pink Cards */}
          <div className="lg:col-span-1">
            <RightPanel />
          </div>
        </div>
      </div>
      
      <DashboardFooter />
    </div>
  )
}



