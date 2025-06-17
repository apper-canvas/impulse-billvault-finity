import Input from '@/components/atoms/Input'
import Text from '@/components/atoms/Text'

const FormField = ({ 
  label, 
  error, 
  required = false,
  children,
  className = '',
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Text 
          as="label" 
          variant="small" 
          weight="medium" 
          color="default"
          className="block"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Text>
      )}
      
      {children || <Input error={error} {...props} />}
      
      {error && (
        <Text variant="xs" color="error">
          {error}
        </Text>
      )}
    </div>
  )
}

export default FormField