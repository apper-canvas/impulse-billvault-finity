import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'

const ErrorState = ({ 
  message = 'Something went wrong',
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
      </div>
      
      <Text variant="h4" weight="medium" className="mb-2">
        Oops! Something went wrong
      </Text>
      
      <Text color="muted" className="mb-6 max-w-md mx-auto">
        {message}
      </Text>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          icon="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default ErrorState