export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function getStatusColor(status: string | undefined) {
  switch (status) {
    case 'open': return '#3498db';
    case 'in_progress': return '#f1c40f';
    case 'closed': return '#7f8c8d';
    case 'done': return '#27ae60';
    case 'cancel': return '#e74c3c';
    case 'pending': return '#f7ca18';
    case 'blocked': return '#e67e22';
    default: return '#bdc3c7';
  }
}
export function getStatusText(status: string | undefined) {
  switch (status) {
    case 'open': return 'Open';
    case 'in_progress': return 'In Progress';
    case 'closed': return 'Closed';
    case 'done': return 'DONE';
    case 'cancel': return 'CANCEL';
    case 'pending': return 'PENDING';
    case 'blocked': return 'BLOCKED';
    default: return status;
  }
}