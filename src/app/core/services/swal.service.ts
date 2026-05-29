import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  
  // Success notification
  success(title: string, text?: string, timer: number = 2000) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      timer,
      showConfirmButton: false,
      timerProgressBar: true,
      position: 'top-end',
      toast: true,
    });
  }

  // Error notification
  error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#d32f2f',
    });
  }

  // Warning notification
  warning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#f57c00',
    });
  }

  // Info notification
  info(title: string, text?: string) {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: '#1976d2',
    });
  }

  // Confirmation dialog
  confirm(title: string, text: string, confirmButtonText: string = 'Yes', cancelButtonText: string = 'No') {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1976d2',
      cancelButtonColor: '#d32f2f',
      confirmButtonText,
      cancelButtonText,
    });
  }

  // Loading alert
  loading(title: string = 'Loading...') {
    Swal.fire({
      title,
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
  }

  // Close current alert
  close() {
    Swal.close();
  }
}