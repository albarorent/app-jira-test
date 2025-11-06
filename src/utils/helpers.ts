export function getStatusColor(status: string | undefined) {
  switch (status) {
    case 'open':
      return '#3498db';
    case 'in_progress':
      return '#f1c40f';
    case 'closed':
      return '#q2c3e50';
    case 'done':
      return '#43dd99'; // Verde
    case 'cancel':
      return '#ff4d4f'; // Rojo
    case 'pending':
      return '#ffd217'; // Amarillo
    case 'blocked':
      return '#ffa040'; // Naranja
    default:
      return '#000000';
  }
}
export function getStatusText(status: string | undefined) {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in_progress':
      return 'In Progress';
    case 'closed':
      return 'Closed';
    case 'done':
      return 'Done';
    case 'cancel':
      return 'Cancelled';
    case 'pending':
      return 'Pending';
    case 'blocked':
      return 'Blocked';
    default:
      return status;
  }
}

export const SUBTASK_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'cancel', label: 'Cancelled' },
  { value: 'pending', label: 'Pending' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'closed', label: 'Closed' },
];
