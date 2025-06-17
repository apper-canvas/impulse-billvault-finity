import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  hover = false,
  padding = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg border border-surface-200 shadow-sm'
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const cardClasses = `${baseClasses} ${paddings[padding]} ${className}`

  if (hover) {
    return (
      <motion.div
        whileHover={{ 
          scale: 1.02,
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
        transition={{ duration: 0.15 }}
        className={cardClasses}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  )
}

export default Card