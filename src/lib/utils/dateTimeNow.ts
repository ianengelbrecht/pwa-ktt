export function dateTimeNow() {
  // we need the date and time at the location of the observation, not the UTC date/time
  const dateTimeNowString = new Date().toString();
  const dateTimeNowParts = dateTimeNowString.split(' ');
  const dateNow = dateTimeNowParts.slice(1, 4).join(' ');
  const correctedDateNow = new Date(dateNow + ' UTC')
    .toISOString()
    .split('T')[0]; // we need this so that Date() doesn't make any adjustments for the local timezone
  const timeNow = dateTimeNowParts[4];
  return { dateNow: correctedDateNow, timeNow };
}
