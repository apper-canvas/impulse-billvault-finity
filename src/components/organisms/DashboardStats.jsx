import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Text from '@/components/atoms/Text'

const DashboardStats = ({ stats = {} }) => {
  const {
    totalBills = 0,
    unpaidBills = 0,
    overdueBills = 0,
    expiringWarranties = 0,
    activeOffers = 0,
    totalAmount = 0
  } = stats

  const statCards = [
    {
      title: 'Total Bills',
      value: totalBills,
      icon: 'Receipt',
      color: 'primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Unpaid Bills',
      value: unpaidBills,
      icon: 'Clock',
      color: 'amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      title: 'Overdue',
      value: overdueBills,
      icon: 'AlertTriangle',
      color: 'red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Expiring Soon',
      value: expiringWarranties,
      icon: 'Shield',
      color: 'secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Active Offers',
      value: activeOffers,
      icon: 'Gift',
      color: 'accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Total Amount Due',
      value: `$${totalAmount.toFixed(2)}`,
      icon: 'DollarSign',
      color: 'green-600',
      bgColor: 'bg-green-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <Text color="muted" variant="small" className="mb-1">
                  {stat.title}
                </Text>
                <Text variant="h3" weight="bold" style={{ color: `var(--color-${stat.color}, #${stat.color.replace('-', '')})` }}>
                  {stat.value}
                </Text>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <ApperIcon 
                  name={stat.icon} 
                  className={`w-6 h-6 text-${stat.color}`} 
                />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default DashboardStats