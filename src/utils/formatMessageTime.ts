export function formatMessageTime(time: string): string {
  return new Date(time).toLocaleTimeString(
    'ru-RU',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );
}
