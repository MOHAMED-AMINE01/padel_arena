const http = require('http');

// Test 1: Create a pack booking (no auth needed for guest bookings)
const packData = JSON.stringify({
    guestName: "Test Pack Client",
    guestPhone: "0600112233",
    guestEmail: "testpack@example.com",
    startTime: "2026-03-25T10:00:00",
    endTime: "2026-03-25T11:00:00",
    bookingType: "PACK",
    packName: "Pack Découverte",
    players: 4
});

const subData = JSON.stringify({
    guestName: "Test Sub Client",
    guestPhone: "0600445566",
    guestEmail: "testsub@example.com",
    startTime: "2026-03-26T14:00:00",
    endTime: "2026-03-26T15:00:00",
    bookingType: "SUBSCRIPTION",
    packName: "Starter",
    players: 4
});

function postBooking(data, label) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/bookings',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log(`\n--- ${label} ---`);
                console.log('Status:', res.statusCode);
                try {
                    const parsed = JSON.parse(body);
                    console.log('Success:', parsed.success);
                    if (parsed.data) {
                        console.log('Booking ID:', parsed.data._id);
                        console.log('Type:', parsed.data.bookingType);
                        console.log('Pack:', parsed.data.packName);
                        console.log('Guest:', parsed.data.guestName);
                    } else {
                        console.log('Response:', body);
                    }
                } catch(e) {
                    console.log('Raw response:', body);
                }
                resolve();
            });
        });
        req.on('error', (e) => { console.error(`Error ${label}:`, e.message); reject(e); });
        req.write(data);
        req.end();
    });
}

(async () => {
    await postBooking(packData, 'PACK BOOKING');
    await postBooking(subData, 'SUBSCRIPTION BOOKING');
    console.log('\nDone! Check admin panel.');
})();
