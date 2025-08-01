export const formatDate = (dateString?: string | Date | null): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date error';
  }
};

export const formatDateInternational = (dateString?: string | Date | null): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toISOString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date error';
  }
};

export const formatOnlyDate = (dateString?: string | Date | null): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date error';
  }
};

export const getDaysBetweenDates = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
