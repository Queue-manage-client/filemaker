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
      
      <div className="container mx-auto p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Left Panel - Pink Cards (内勤) */}
          <div>
            <LeftPanel />
          </div>

          {/* Center Panel - Gray Cards (管理) */}
          <div>
            <CenterPanel />
          </div>

          {/* Right Panel - Light Pink Cards (経理+広報) */}
          <div className="md:col-span-2 lg:col-span-1">
            <RightPanel />
          </div>
        </div>
      </div>
      
      <DashboardFooter />
    </div>
  )
}



