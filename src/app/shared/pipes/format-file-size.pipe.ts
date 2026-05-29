import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatFileSize',
  standalone: true
})
export class FormatFileSizePipe implements PipeTransform {
  transform(bytes: number): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) return '0 Bytes';
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const number = Math.floor(Math.log(bytes) / Math.log(1024));

    return (bytes / Math.pow(1024, number)).toFixed(2) + ' ' + units[number];
  }
}