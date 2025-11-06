
export function getStatusColor(status: string | undefined) {
  switch (status) {
    case 'open': return '#3498db';
    case 'in_progress': return '#f1c40f';
    case 'closed': return '#2ecc71';
    default: return '#bdc3c7';
  }
}
export function getStatusText(status: string | undefined) {
  switch (status) {
    case 'open': return 'Open';
    case 'in_progress': return 'In Progress';
    case 'closed': return 'Closed';
    default: return status;
  }
}

export const SUBTASK_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' }
];