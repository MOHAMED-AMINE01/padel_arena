function getParisOffsetSmart(dateStr, timeStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    const [hour, min] = timeStr.split(':').map(Number);
    
    // We want the UTC time that Corresponds to this Local Paris Time
    const dObj = new Date(Date.UTC(year, month - 1, day));
    const testDate = new Date(Date.UTC(year, month - 1, day, hour, min));
    const parisFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Paris',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
    });
    
    const parts = parisFormatter.formatToParts(testDate);
    const pDict = {}; parts.forEach(p => pDict[p.type] = p.value);
    const parisHour = parseInt(pDict.hour);
    
    let offset = parisHour - hour;
    if (offset < -12) offset += 24;
    if (offset > 12) offset -= 24;
    
    return new Date(Date.UTC(year, month - 1, day, hour - offset, min)).toISOString();
}

console.log("Smart April:", getParisOffsetSmart("11/04/2026", "08:00"));
console.log("Smart Nov:", getParisOffsetSmart("11/11/2026", "08:00"));
