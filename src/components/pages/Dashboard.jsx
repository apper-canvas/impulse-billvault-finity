import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, differenceInDays } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Text from '@/components/atoms/Text'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import DashboardStats from '@/components/organisms/DashboardStats'
import { billService, warrantyService, offerService } from '@/services'

const Dashboard = () => {
  const [bills, setBills] = useState([])
  const [warranties, setWarranties] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [billsData, warrantiesData, offersData] = await Promise.all([
          billService.getUpcoming(30),
          warrantyService.getExpiring(30),
          offerService.getActive()
        ])
        setBills(billsData || [])
        setWarranties(warrantiesData || [])
        setOffers(offersData || [])
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data')
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const getStats = () => {
    const unpaidBills = bills.filter(bill => !bill.isPaid)
    const overdueBills = bills.filter(bill => {
      const dueDate = new Date(bill.dueDate)
      return !bill.isPaid && dueDate < new Date()
    })
    const totalAmount = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0)

    return {
      totalBills: bills.length,
      unpaidBills: unpaidBills.length,
      overdueBills: overdueBills.length,
      expiringWarranties: warranties.length,
      activeOffers: offers.length,
      totalAmount
    }
  }

  const getUrgentItems = () => {
    const urgentBills = bills
      .filter(bill => {
        const daysUntilDue = differenceInDays(new Date(bill.dueDate), new Date())
        return !bill.isPaid && daysUntilDue <= 7
      })
      .slice(0, 3)

    const urgentWarranties = warranties
      .filter(warranty => {
        const daysUntilExpiry = differenceInDays(new Date(warranty.expirationDate), new Date())
        return daysUntilExpiry <= 30
      })
      .slice(0, 3)

    return { urgentBills, urgentWarranties }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="mb-8">
          <Text variant="h2" weight="bold" className="mb-2">
            Dashboard
          </Text>
          <Text color="muted">
            Overview of your bills, warranties, and offers
          </Text>
        </div>
        <SkeletonLoader count={6} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  const stats = getStats()
  const { urgentBills, urgentWarranties } = getUrgentItems()

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-8">
        <Text variant="h2" weight="bold" className="mb-2">
          Dashboard
        </Text>
        <Text color="muted">
          Overview of your bills, warranties, and offers
        </Text>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <DashboardStats stats={stats} />
      </div>

      {/* Urgent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Urgent Bills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
                <Text variant="h4" weight="semibold">
                  Urgent Bills
                </Text>
              </div>
              <Badge variant="error">
                {urgentBills.length}
              </Badge>
            </div>

            {urgentBills.length === 0 ? (
              <EmptyState
                icon="CheckCircle"
                title="No urgent bills"
                description="All your bills are up to date!"
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {urgentBills.map((bill, index) => {
                  const daysUntilDue = differenceInDays(new Date(bill.dueDate), new Date())
                  return (
                    <motion.div
                      key={bill.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
                    >
                      <div>
                        <Text weight="medium" className="mb-1">
                          {bill.name}
                        </Text>
                        <Text variant="small" color="muted">
                          ${bill.amount.toFixed(2)} • {bill.category}
                        </Text>
                      </div>
                      <Badge variant={daysUntilDue < 0 ? 'error' : 'warning'}>
                        {daysUntilDue < 0 
                          ? `${Math.abs(daysUntilDue)} days overdue`
                          : daysUntilDue === 0 
                            ? 'Due today'
                            : `${daysUntilDue} days left`
                        }
                      </Badge>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Expiring Warranties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Shield" className="w-5 h-5 text-secondary" />
                <Text variant="h4" weight="semibold">
                  Expiring Warranties
                </Text>
              </div>
              <Badge variant="warning">
                {urgentWarranties.length}
              </Badge>
            </div>

            {urgentWarranties.length === 0 ? (
              <EmptyState
                icon="Shield"
                title="No expiring warranties"
                description="All your warranties are current."
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {urgentWarranties.map((warranty, index) => {
                  const daysUntilExpiry = differenceInDays(new Date(warranty.expirationDate), new Date())
                  return (
                    <motion.div
                      key={warranty.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-surface-50 rounded-lg"
                    >
                      <div>
                        <Text weight="medium" className="mb-1">
                          {warranty.productName}
                        </Text>
                        <Text variant="small" color="muted">
                          {warranty.vendor} • {warranty.category}
                        </Text>
                      </div>
                      <Badge variant={daysUntilExpiry <= 7 ? 'error' : 'warning'}>
                        {daysUntilExpiry <= 0 
                          ? 'Expired'
                          : `${daysUntilExpiry} days left`
                        }
                      </Badge>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Activity" className="w-5 h-5 text-primary" />
              <Text variant="h4" weight="semibold">
                Quick Actions
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              icon="Plus"
              onClick={() => window.location.href = '/bills'}
            >
              <div className="text-left">
                <Text weight="medium" className="mb-1">
                  Add Bill
                </Text>
                <Text variant="small" color="muted">
                  Track a new bill
                </Text>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              icon="Shield"
              onClick={() => window.location.href = '/warranties'}
            >
              <div className="text-left">
                <Text weight="medium" className="mb-1">
                  Add Warranty
                </Text>
                <Text variant="small" color="muted">
                  Store warranty info
                </Text>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              icon="Gift"
              onClick={() => window.location.href = '/offers'}
            >
              <div className="text-left">
                <Text weight="medium" className="mb-1">
                  Add Offer
                </Text>
                <Text variant="small" color="muted">
                  Save a coupon
                </Text>
              </div>
            </Button>

            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              icon="Tag"
              onClick={() => window.location.href = '/categories'}
            >
              <div className="text-left">
                <Text weight="medium" className="mb-1">
                  Manage Categories
                </Text>
                <Text variant="small" color="muted">
                  Organize your items
                </Text>
              </div>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard