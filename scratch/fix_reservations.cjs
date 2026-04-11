const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'admin', 'Reservations.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Planning card positioning - use timeStr instead of getHours()
content = content.replace(
  'const startHour = bStart.getHours() + bStart.getMinutes() / 60;',
  `const startHour = booking.timeStr
                                                                     ? parseInt(booking.timeStr.split(':')[0]) + parseInt(booking.timeStr.split(':')[1] || '0') / 60
                                                                     : bStart.getHours() + bStart.getMinutes() / 60;`
);

// Fix 2: Special requests table - date display
content = content.replace(
  "{new Date(request.startTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}",
  "{request.dateStr || new Date(request.startTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}"
);

// Fix 3: Special requests table - time display
content = content.replace(
  "{new Date(request.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')}",
  "{request.timeStr ? request.timeStr.replace(':', 'h') : new Date(request.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')}"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ All 3 fixes applied to Reservations.tsx');
