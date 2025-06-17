import { motion } from 'framer-motion'
import { format, differenceInDays } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Text from '@/components/atoms/Text'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const OfferCard = ({ offer, onEdit, onDelete, onView }) => {
  const expirationDate = new Date(offer.expirationDate)
  const today = new Date()
  const daysUntilExpiration = differenceInDays(expirationDate, today)
  
  const getExpirationStatus = () => {
    if (daysUntilExpiration < 0) return { text: 'Expired', variant: 'error' }
    if (daysUntilExpiration === 0) return { text: 'Expires Today', variant: 'error' }
    if (daysUntilExpiration <= 3) return { text: `${daysUntilExpiration} days left`, variant: 'error' }
    if (daysUntilExpiration <= 7) return { text: `${daysUntilExpiration} days left`, variant: 'warning' }
    return { text: `${daysUntilExpiration} days left`, variant: 'success' }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Electronics': 'Smartphone',
      'Jewelry': 'Gem',
      'Appliances': 'Refrigerator',
      'Furniture': 'Armchair',
      'General': 'Gift',
      'Food': 'Coffee'
    }
    return icons[category] || 'Tag'
  }

  const status = getExpirationStatus()
  const isExpired = daysUntilExpiration < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className={`relative ${isExpired ? 'opacity-75' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${daysUntilExpiration <= 3 ? 'bg-red-100' : 'bg-accent/10'}`}>
              <ApperIcon 
                name={getCategoryIcon(offer.category)} 
                className={`w-5 h-5 ${daysUntilExpiration <= 3 ? 'text-red-600' : 'text-accent'}`} 
              />
            </div>
            <div>
              <Text variant="h5" weight="semibold" className="mb-1">
                {offer.title}
              </Text>
              <Text variant="small" color="muted">
                {offer.category}
              </Text>
            </div>
          </div>
          
          <Badge variant={status.variant}>
            {status.text}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <Text color="muted">Coupon Code</Text>
            <div className="flex items-center space-x-2">
              <Text variant="small" weight="medium" className="font-mono bg-surface-100 px-2 py-1 rounded">
                {offer.code}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                icon="Copy"
                onClick={() => navigator.clipboard.writeText(offer.code)}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Text color="muted">Value</Text>
            <Text variant="small" weight="semibold" color="accent">
              {offer.value}
            </Text>
          </div>
          
          <div className="flex justify-between items-center">
            <Text color="muted">Expires</Text>
            <Text variant="small" weight="medium">
              {format(expirationDate, 'MMM dd, yyyy')}
            </Text>
          </div>
        </div>

        {offer.terms && (
          <div className="mb-4 p-3 bg-surface-50 rounded-lg">
            <Text variant="xs" color="muted" className="leading-relaxed">
              <strong>Terms:</strong> {offer.terms}
            </Text>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-surface-100">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Eye"
              onClick={() => onView?.(offer)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Edit"
              onClick={() => onEdit?.(offer)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={() => onDelete?.(offer)}
            />
          </div>
          
          {daysUntilExpiration <= 7 && daysUntilExpiration > 0 && (
            <div className="flex items-center text-amber-600">
              <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
              <Text variant="xs" weight="medium">
                Use Soon
              </Text>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default OfferCard