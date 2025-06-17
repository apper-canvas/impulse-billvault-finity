import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import ApperIcon from '@/components/ApperIcon'

const FileUpload = ({ 
  files = [], 
  onFilesChange, 
  accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach(error => {
        if (error.code === 'file-too-large') {
          toast.error(`${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`)
        } else if (error.code === 'file-invalid-type') {
          toast.error(`${file.name} is not a supported image format`)
        } else if (error.code === 'too-many-files') {
          toast.error(`Maximum ${maxFiles} files allowed`)
        } else {
          toast.error(`Error uploading ${file.name}: ${error.message}`)
        }
      })
    })

    if (acceptedFiles.length === 0) return

    // Check if adding these files would exceed the limit
    if (files.length + acceptedFiles.length > maxFiles) {
      toast.error(`Cannot upload ${acceptedFiles.length} files. Maximum ${maxFiles} files allowed.`)
      return
    }

    setUploading(true)
    try {
      const newFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = () => {
              resolve({
                id: Date.now() + Math.random(), // Temporary ID for UI
                name: file.name,
                size: file.size,
                type: file.type,
                url: reader.result, // Base64 data URL for preview
                file: file // Keep original file object
              })
            }
            reader.readAsDataURL(file)
          })
        })
      )

      onFilesChange([...files, ...newFiles])
      toast.success(`${acceptedFiles.length} file(s) uploaded successfully`)
    } catch (error) {
      toast.error('Failed to process uploaded files')
    } finally {
      setUploading(false)
    }
  }, [files, onFilesChange, maxSize, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: maxFiles - files.length,
    disabled: uploading || files.length >= maxFiles
  })

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(file => file.id !== fileId)
    onFilesChange(updatedFiles)
    toast.info('File removed')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-surface-300 hover:border-surface-400'
          }
          ${uploading || files.length >= maxFiles 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <ApperIcon 
            name={uploading ? "Loader2" : "Upload"} 
            className={`w-8 h-8 text-surface-400 ${uploading ? 'animate-spin' : ''}`}
          />
          <div>
            <Text weight="medium" className="text-surface-900">
              {uploading 
                ? 'Processing files...'
                : isDragActive 
                  ? 'Drop files here'
                  : files.length >= maxFiles
                    ? `Maximum ${maxFiles} files reached`
                    : 'Drop warranty cards or receipts here'
              }
            </Text>
            {!uploading && files.length < maxFiles && (
              <Text size="sm" color="muted" className="mt-1">
                or click to browse (max {maxSize / (1024 * 1024)}MB each)
              </Text>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <Text size="sm" weight="medium" color="muted">
              Uploaded Files ({files.length}/{maxFiles})
            </Text>
            <div className="space-y-2">
              {files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg border border-surface-200"
                >
                  {/* Image Preview */}
                  <div className="flex-shrink-0">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded border border-surface-200"
                    />
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <Text size="sm" weight="medium" className="truncate">
                      {file.name}
                    </Text>
                    <Text size="xs" color="muted">
                      {formatFileSize(file.size)}
                    </Text>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={() => removeFile(file.id)}
                    className="text-surface-400 hover:text-red-600"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FileUpload