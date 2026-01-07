export function getDateRangeFromMonths(months: number, currentTime: number): { startDate: string; endDate: string } {
  const currentDate = new Date(currentTime);

  // Helper to format date as yyyy/mm/dd
  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const endDate = formatDate(currentDate);

  const pastDate = new Date(currentDate);
  pastDate.setMonth(pastDate.getMonth() - months);
  const startDate = formatDate(pastDate);

  return {
    startDate,
    endDate,
  };
}
