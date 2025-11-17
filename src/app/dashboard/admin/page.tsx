"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboardAnalytics, useApplications, useReferralPartners, usePendingCommissions } from "@/hooks/useAnalytics"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { 
  Users, 
  Building2,
  Banknote, 
  TrendingUp, 
  Eye,
  Wallet,
  Award,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Download,
  BarChart3,
  PieChart,
  DollarSign,
  Target,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Settings,
  Filter,
  Search,
  UserCheck,
  UserX,
  Activity
} from "lucide-react"

interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  applicationDate: string
  referralCode?: string
  referralType: 'institution' | 'individual' | 'direct'
  course: string
  amount: number
}

interface ReferralPartner {
  id: string
  name: string
  type: 'institution' | 'individual'
  email: string
  phone: string
  totalReferrals: number
  confirmedReferrals: number
  totalCommission: number
  paidCommission: number
  status: 'active' | 'inactive'
  joinDate: string
}

interface Analytics {
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
  totalRevenue: number
  totalCommissions: number
  paidCommissions: number
  pendingCommissions: number
  totalReferralPartners: number
  activeReferralPartners: number
  conversionRate: number
}

export default function AdminDashboard() {
  const analytics = useDashboardAnalytics()
  const applications = useApplications()
  const referralPartners = useReferralPartners()
  const pendingCommissions = usePendingCommissions()
  
  const updateApplicationStatus = useMutation(api.crud.updateApplicationStatus)
  const updatePartnerStatus = useMutation(api.crud.updateReferralPartnerStatus)
  const createDisbursement = useMutation(api.crud.createDisbursement)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'paid': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleUpdateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateApplicationStatus({ applicationId: id as any, status })
    } catch (error) {
      console.error('Error updating application status:', error)
    }
  }

  const handleMarkAsPaid = async (id: string) => {
    try {
      await updateApplicationStatus({ applicationId: id as any, status: 'approved' })
    } catch (error) {
      console.error('Error marking as paid:', error)
    }
  }

  const handleUpdatePartnerStatus = async (partnerId: string, status: 'active' | 'inactive', isApproved: boolean) => {
    try {
      await updatePartnerStatus({ partnerId: partnerId as any, status, isApproved })
    } catch (error) {
      console.error('Error updating partner status:', error)
    }
  }

  const handleCreateDisbursement = async (partnerId: string, amount: number) => {
    try {
      const bankReference = `DISB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      await createDisbursement({ partnerId: partnerId as any, amount, bankReference })
    } catch (error) {
      console.error('Error creating disbursement:', error)
    }
  }

  const exportData = (type: 'applications' | 'referrals' | 'commissions') => {
    console.log(`Exporting ${type} data...`)
    // Implement export functionality
  }

  if (!analytics || !applications || !referralPartners) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Settings className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Akademyx Masterclass Programme - Management Portal</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => exportData('applications')}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Applications
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <Activity className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <h3 className="text-2xl font-bold">{analytics.totalApplications}</h3>
                  <p className="text-purple-100">Total Applications</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">â‚¦{analytics.totalRevenue.toLocaleString()}</h3>
                  <p className="text-purple-100">Total Revenue</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">â‚¦{analytics.totalCommissions.toLocaleString()}</h3>
                  <p className="text-purple-100">Total Commissions</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{analytics.totalReferralPartners}</h3>
                  <p className="text-purple-100">Referral Partners</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Referral Partners
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="commissions" className="flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              Commissions
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Application Management</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-1" />
                  Search
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">ID</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Phone</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Referral</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications?.map((application) => (
                        <tr key={application._id} className="border-b">
                          <td className="p-2 font-medium">{application._id.slice(-6)}</td>
                          <td className="p-2 font-medium">{application.firstName} {application.lastName}</td>
                          <td className="p-2">{application.email}</td>
                          <td className="p-2">{application.phone}</td>
                          <td className="p-2">
                            <Badge className={getStatusColor(application.status)}>
                              {application.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-2">
                            {application.referralCode ? (
                              <span className="text-sm">{application.referralCode}</span>
                            ) : (
                              <span className="text-sm text-gray-500">Direct</span>
                            )}
                          </td>
                          <td className="p-2 font-semibold">â‚¦{application.amount?.toLocaleString() || 3000}</td>
                          <td className="p-2">{new Date(application.createdAt).toLocaleDateString()}</td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              {application.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleUpdateApplicationStatus(application._id, 'approved')}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleUpdateApplicationStatus(application._id, 'rejected')}
                                    className="text-red-600"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              {application.status === 'approved' && (
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleMarkAsPaid(application._id)}
                                  className="text-blue-600"
                                >
                                  <DollarSign className="w-4 h-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referral Partners Tab */}
          <TabsContent value="referrals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Referral Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Phone</th>
                        <th className="text-left p-2">Total Referrals</th>
                        <th className="text-left p-2">Confirmed</th>
                        <th className="text-left p-2">Commission</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralPartners?.map((partner) => (
                        <tr key={partner._id} className="border-b">
                          <td className="p-2 font-medium">{partner.name}</td>
                          <td className="p-2">
                            <Badge variant="outline" className="text-xs">
                              {partner.type.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-2">{partner.email}</td>
                          <td className="p-2">{partner.phone}</td>
                          <td className="p-2 font-semibold">{partner.totalReferrals}</td>
                          <td className="p-2 text-green-600 font-semibold">{partner.confirmedReferrals}</td>
                          <td className="p-2 font-semibold">â‚¦{partner.totalCommission.toLocaleString()}</td>
                          <td className="p-2">
                            <Badge className={getStatusColor(partner.status)}>
                              {partner.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
                  <p className="text-xs text-gray-500">Applications to paid</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">â‚¦156,000</div>
                  <p className="text-xs text-gray-500">+23% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
                  <UserCheck className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.activeReferralPartners}</div>
                  <p className="text-xs text-gray-500">Out of {analytics.totalReferralPartners}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Commissions</CardTitle>
                  <Clock className="w-4 h-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">â‚¦{analytics.pendingCommissions.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">Awaiting disbursement</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Application Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Approved</span>
                        <span className="text-sm text-gray-500">{analytics.approvedApplications}/{analytics.totalApplications}</span>
                      </div>
                      <Progress value={(analytics.approvedApplications / analytics.totalApplications) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Pending</span>
                        <span className="text-sm text-gray-500">{analytics.pendingApplications}/{analytics.totalApplications}</span>
                      </div>
                      <Progress value={(analytics.pendingApplications / analytics.totalApplications) * 100} className="h-2 bg-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Revenue vs Commissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Revenue</span>
                      <span className="font-semibold">â‚¦{analytics.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Commissions</span>
                      <span className="font-semibold">â‚¦{analytics.totalCommissions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Commission Rate</span>
                      <span className="font-semibold text-purple-600">25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Commissions Tab */}
          <TabsContent value="commissions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 mb-1">Paid Commissions</p>
                      <h3 className="text-3xl font-bold">â‚¦{analytics.paidCommissions.toLocaleString()}</h3>
                    </div>
                    <CheckCircle className="w-12 h-12 text-green-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 mb-1">Pending Commissions</p>
                      <h3 className="text-3xl font-bold">â‚¦{analytics.pendingCommissions.toLocaleString()}</h3>
                    </div>
                    <Clock className="w-12 h-12 text-orange-100" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 mb-1">Total Commissions</p>
                      <h3 className="text-3xl font-bold">â‚¦{analytics.totalCommissions.toLocaleString()}</h3>
                    </div>
                    <Banknote className="w-12 h-12 text-purple-100" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Commission Disbursement</span>
                  <Button className="bg-green-600 text-white">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Process Payments
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingCommissions?.slice(0, 5).map((commission) => (
                    <div key={commission._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Commission ID: {commission._id.slice(-6)}</h4>
                        <p className="text-sm text-gray-500">Pending: â‚¦{commission.amount.toLocaleString()}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCreateDisbursement(commission.partnerId, commission.amount)}
                      >
                        Disburse
                      </Button>
                    </div>
                  ))}
                  {pendingCommissions?.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No pending commissions</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Commission Rate</span>
                    <Badge variant="outline">25%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Course Price</span>
                    <Badge variant="outline">â‚¦3,000</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Program Duration</span>
                    <Badge variant="outline">21 Days</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Database Status</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment Gateway</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email Service</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Bulk Email
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Backup Database
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}