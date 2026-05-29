import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
  standalone: true
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number | string | null | undefined, format: string = 'default'): string {
    if (value === null || value === undefined) return 'N/A';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) return 'Invalid';
    
    switch(format) {
      case 'percent':
        return `${num.toFixed(1)}%`;
      case 'currency':
        return `Ksh ${this.formatWithCommas(num.toFixed(2))}`;
      case 'decimal':
        return num.toFixed(2);
      case 'integer':
        return Math.round(num).toString();
      default:
        return this.formatWithCommas(num.toString());
    }
  }

  private formatWithCommas(value: string): string {
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
}