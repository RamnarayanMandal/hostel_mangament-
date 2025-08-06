import Swal from 'sweetalert2'

// SweetAlert utility functions
export const showSuccess = (title: string, message?: string) => {
  Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#10b981',
    timer: 3000,
    timerProgressBar: true,
    toast: true,
    position: 'top-end',
    showConfirmButton: false
  })
}

export const showError = (title: string, message?: string) => {
  Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#ef4444',
    timer: 5000,
    timerProgressBar: true,
    toast: true,
    position: 'top-end',
    showConfirmButton: false
  })
}

export const showWarning = (title: string, message?: string) => {
  Swal.fire({
    title,
    text: message,
    icon: 'warning',
    confirmButtonText: 'OK',
    confirmButtonColor: '#f59e0b',
    timer: 4000,
    timerProgressBar: true,
    toast: true,
    position: 'top-end',
    showConfirmButton: false
  })
}

export const showInfo = (title: string, message?: string) => {
  Swal.fire({
    title,
    text: message,
    icon: 'info',
    confirmButtonText: 'OK',
    confirmButtonColor: '#3b82f6',
    timer: 4000,
    timerProgressBar: true,
    toast: true,
    position: 'top-end',
    showConfirmButton: false
  })
}

export const showConfirm = (title: string, message?: string): Promise<boolean> => {
  return Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  }).then((result) => {
    return result.isConfirmed
  })
} 