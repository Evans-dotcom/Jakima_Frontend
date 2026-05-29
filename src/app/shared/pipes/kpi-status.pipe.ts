import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kpiStatus',
  standalone: true
})
export class KPIStatusPipe implements PipeTransform {
  transform(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'Pending',
      'InProgress': 'In Progress',
      'Completed': 'Completed',
      'Lagging': 'Lagging'
    };
    return statusMap[status] || status;
  }
}