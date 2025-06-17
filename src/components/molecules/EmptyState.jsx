import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'

const EmptyState = ({ 
  icon = 'Package',
  title = 'No items found',
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon 
          name={icon} 
          className="w-16 h-16 text-surface-300 mx-auto mb-4" 
        />
      </motion.div>
      
      <Text variant="h4" weight="medium" className="mb-2">
        {title}
      </Text>
      
      {description && (
        <Text color="muted" className="mb-6 max-w-md mx-auto">
          {description}
        </Text>
      )}
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState