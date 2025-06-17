import { motion } from 'framer-motion'

const SkeletonLoader = ({ count = 3, type = 'card', className = '' }) => {
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    }
  }

  const CardSkeleton = () => (
    <div className="bg-white rounded-lg border border-surface-200 p-6">
      <div className="animate-pulse space-y-4">
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-3/4 bg-[length:200%_100%]"
        />
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.1 }}
          className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-1/2 bg-[length:200%_100%]"
        />
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
          className="h-8 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-full bg-[length:200%_100%]"
        />
      </div>
    </div>
  )

  const ListSkeleton = () => (
    <div className="bg-white rounded-lg border border-surface-200 p-4">
      <div className="animate-pulse flex items-center space-x-4">
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-12 h-12 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded-full bg-[length:200%_100%]"
        />
        <div className="flex-1 space-y-2">
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.1 }}
            className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-3/4 bg-[length:200%_100%]"
          />
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
            className="h-3 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-1/2 bg-[length:200%_100%]"
          />
        </div>
      </div>
    </div>
  )

  const skeletons = Array.from({ length: count }, (_, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {type === 'card' ? <CardSkeleton /> : <ListSkeleton />}
    </motion.div>
  ))

  return (
    <div className={`space-y-4 ${className}`}>
      {skeletons}
    </div>
  )
}

export default SkeletonLoader