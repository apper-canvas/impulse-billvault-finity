import { motion } from 'framer-motion'
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Text from '@/components/atoms/Text'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const BillCard = ({ bill, onEdit, onDelete, onMarkPaid, onView }) => {
  const dueDate = new Date(bill.dueDate)
  const today = new Date()
  const daysUntilDue = differenceInDays(dueDate, today)
  
  const formatDueDate = () => {
    if (isToday(dueDate)) return 'Due Today'
    if (isTomorrow(dueDate)) return 'Due Tomorrow'
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`
    if (daysUntilDue <= 7) return `Due in ${daysUntilDue} days`
    return format(dueDate, 'MMM dd, yyyy')
  }

  const getDueDateColor = () => {
    if (bill.isPaid) return 'success'
    if (daysUntilDue < 0) return 'error'
    if (daysUntilDue <= 7) return 'warning'
    return 'default'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Utilities': 'Zap',
      'Insurance': 'Shield',
      'Housing': 'Home',
      'Transportation': 'Car',
      'Healthcare': 'Heart',
      'Entertainment': 'Play'
    }
    return icons[category] || 'Receipt'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${bill.isPaid ? 'bg-green-100' : 'bg-primary/10'}`}>
              <ApperIcon 
                name={getCategoryIcon(bill.category)} 
                className={`w-5 h-5 ${bill.isPaid ? 'text-green-600' : 'text-primary'}`} 
              />
            </div>
            <div>
              <Text variant="h5" weight="semibold" className="mb-1">
                {bill.name}
              </Text>
              <Text variant="small" color="muted">
                {bill.category}
              </Text>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={bill.isPaid ? 'success' : 'default'}>
              {bill.isPaid ? 'Paid' : 'Pending'}
            </Badge>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <Text color="muted">Amount</Text>
            <Text variant="h5" weight="semibold" color="primary">
              ${bill.amount.toFixed(2)}
            </Text>
          </div>
          
          <div className="flex justify-between items-center">
            <Text color="muted">Due Date</Text>
            <Badge variant={getDueDateColor()}>
              {formatDueDate()}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <Text color="muted">Frequency</Text>
            <Text variant="small" className="capitalize">
              {bill.frequency}
            </Text>
          </div>
        </div>

        {bill.notes && (
          <div className="mb-4 p-3 bg-surface-50 rounded-lg">
            <Text variant="small" color="muted">
              {bill.notes}
            </Text>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-surface-100">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Eye"
              onClick={() => onView?.(bill)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Edit"
              onClick={() => onEdit?.(bill)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={() => onDelete?.(bill)}
            />
          </div>
          
          {!bill.isPaid && (
            <Button
              size="sm"
              icon="Check"
              onClick={() => onMarkPaid?.(bill)}
            >
              Mark Paid
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default BillCard