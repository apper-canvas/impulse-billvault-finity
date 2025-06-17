const Text = ({ 
  children, 
  variant = 'body',
  weight = 'normal',
  color = 'default',
  align = 'left',
  className = '',
  as: Component = 'p',
  ...props 
}) => {
  const variants = {
    display: 'text-4xl sm:text-5xl lg:text-6xl font-display',
    h1: 'text-3xl sm:text-4xl lg:text-5xl font-display',
    h2: 'text-2xl sm:text-3xl lg:text-4xl font-display',
    h3: 'text-xl sm:text-2xl lg:text-3xl font-display',
    h4: 'text-lg sm:text-xl lg:text-2xl font-display',
    h5: 'text-base sm:text-lg lg:text-xl font-display',
    h6: 'text-sm sm:text-base lg:text-lg font-display',
    body: 'text-base',
    small: 'text-sm',
    xs: 'text-xs',
    caption: 'text-xs text-surface-600'
  }
  
  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  
  const colors = {
    default: 'text-surface-900',
    muted: 'text-surface-600',
    light: 'text-surface-500',
    white: 'text-white',
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600'
  }
  
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  }
  
  return (
    <Component
      className={`${variants[variant]} ${weights[weight]} ${colors[color]} ${alignments[align]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Text