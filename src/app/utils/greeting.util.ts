export type GreetingPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Greeting {
  text: string;
  period: GreetingPeriod;
}

export function getGreeting(date: Date = new Date()): Greeting {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return { text: 'Good morning', period: 'morning' };
  if (hour >= 12 && hour < 18) return { text: 'Good afternoon', period: 'afternoon' };
  if (hour >= 18 && hour < 22) return { text: 'Good evening', period: 'evening' };
  return { text: 'Good night', period: 'night' };
}
