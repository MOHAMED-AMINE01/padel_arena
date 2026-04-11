const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/Reservations.tsx', 'utf8');

c = c.replace(
    /const d = new Date\(b\.startTime\);\s*return d\.getDate\(\) === day\.getDate\(\) && d\.getMonth\(\) === day\.getMonth\(\) && d\.getFullYear\(\) === day\.getFullYear\(\);/g,
    `if (b.dateStr) {
                const parts = b.dateStr.split('/');
                if (parts.length === 3) {
                    return parseInt(parts[0]) === day.getDate() && (parseInt(parts[1]) - 1) === day.getMonth() && parseInt(parts[2]) === day.getFullYear();
                }
            }
            const d = new Date(b.startTime);
            return d.getUTCDate() === day.getDate() && d.getUTCMonth() === day.getMonth() && d.getUTCFullYear() === day.getFullYear();`
);

c = c.replace(
    /bStart\.getHours\(\) \+ bStart\.getMinutes\(\) \/ 60/g,
    'bStart.getUTCHours() + bStart.getUTCMinutes() / 60'
);

fs.writeFileSync('src/pages/admin/Reservations.tsx', c);
