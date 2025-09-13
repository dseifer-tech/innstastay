import type { Hours } from '@/app/components/OpenNow';

// NOTE: Sample/default hours. Always verify on official sites; hours can vary by season/holiday.
export const HOURS: Record<string, Hours> = {
  'CN Tower': { 0:[{open:'10:00',close:'22:00'}], 1:[{open:'10:00',close:'22:00'}], 2:[{open:'10:00',close:'22:00'}], 3:[{open:'10:00',close:'22:00'}], 4:[{open:'10:00',close:'22:00'}], 5:[{open:'10:00',close:'22:00'}], 6:[{open:'10:00',close:'22:00'}] },
  "Ripley's Aquarium of Canada": { 0:[{open:'09:00',close:'23:00'}], 1:[{open:'09:00',close:'23:00'}], 2:[{open:'09:00',close:'23:00'}], 3:[{open:'09:00',close:'23:00'}], 4:[{open:'09:00',close:'23:00'}], 5:[{open:'09:00',close:'23:00'}], 6:[{open:'09:00',close:'23:00'}] },
  'St. Lawrence Market': { 0:[{open:'10:00',close:'17:00'}], 1:[], 2:[{open:'09:00',close:'19:00'}], 3:[{open:'09:00',close:'19:00'}], 4:[{open:'09:00',close:'19:00'}], 5:[{open:'09:00',close:'19:00'}], 6:[{open:'07:00',close:'17:00'}] },
  'Royal Ontario Museum (ROM)': { 0:[{open:'10:00',close:'17:30'}], 1:[], 2:[{open:'10:00',close:'17:30'}], 3:[{open:'10:00',close:'17:30'}], 4:[{open:'10:00',close:'17:30'}], 5:[{open:'10:00',close:'17:30'}], 6:[{open:'10:00',close:'17:30'}] },
};
