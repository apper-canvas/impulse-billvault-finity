import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'

const CategoryCard = ({ category, itemCount = 0, onEdit, onDelete, onView }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${category.color}15` }}
            >
              <ApperIcon 
                name={category.icon} 
                className="w-6 h-6" 
                style={{ color: category.color }}
              />
            </div>
            <div>
              <Text variant="h5" weight="semibold" className="mb-1">
                {category.name}
              </Text>
              <Text variant="small" color="muted">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Text>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="Edit"
              onClick={() => onEdit?.(category)}
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={() => onDelete?.(category)}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-surface-100">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onView?.(category)}
          >
            View Items
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default CategoryCard