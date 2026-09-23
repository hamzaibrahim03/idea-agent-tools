import { createComputeHandler } from '../_lib/computeHandler.js';

const FALLBACK_ZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
  'Pacific/Auckland'
];

function getAvailableZones() {
  try {
    if (typeof Intl.supportedValuesOf === 'function') {
      const zones = Intl.supportedValuesOf('timeZone');
      if (zones && zones.length) return zones;
    }
  } catch {
  }
  return FALLBACK_ZONES;
}

function hourInZone(referenceDateUtc, utcHour, timeZone) {
  const probe = new Date(
    Date.UTC(
      referenceDateUtc.getUTCFullYear(),
      referenceDateUtc.getUTCMonth(),
      referenceDateUtc.getUTCDate(),
      utcHour
    )
  );
  const dtf = new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', hour12: false });
  const parts = dtf.formatToParts(probe);
  const hourPart = parts.find((p) => p.type === 'hour')?.value ?? '00';
  return Number(hourPart) % 24;
}

function isWorkHour(hour) {
  return hour >= 9 && hour < 17;
}

function compute({ zones, proposedZone, proposedHour }) {
  const referenceDate = new Date();
  const zoneList = Array.isArray(zones) ? zones : [];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  function findUtcHourForLocal(zone, localHour) {
    for (let utcHour = 0; utcHour < 24; utcHour++) {
      if (hourInZone(referenceDate, utcHour, zone) === localHour) return utcHour;
    }
    return localHour;
  }
  const proposedUtcHour = findUtcHourForLocal(proposedZone, Number(proposedHour) || 0);
  const grid = zoneList.map((z) => {
    const cells = hours.map((utcHour) => {
      const localHour = hourInZone(referenceDate, utcHour, z);
      return { utcHour, localHour, work: isWorkHour(localHour), isProposed: utcHour === proposedUtcHour };
    });
    const proposedLocalHour = hourInZone(referenceDate, proposedUtcHour, z);
    return { zone: z, cells, proposedLocalHour, proposedIsWork: isWorkHour(proposedLocalHour) };
  });
  return { availableZones: getAvailableZones(), hours, proposedUtcHour, grid };
}

export default createComputeHandler(compute);
