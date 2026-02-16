// Service Worker للتذكيرات اليومية في رمضان

self.addEventListener('install', () => {
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim())
})

// استقبال الرسائل من الـ App
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SCHEDULE_REMINDERS') {
        const reminders = event.data.reminders
        scheduleReminders(reminders)
    }
})

function scheduleReminders(reminders) {
    reminders.forEach(reminder => {
        scheduleReminder(reminder)
    })
}

function scheduleReminder(reminder) {
    const [hours, minutes] = reminder.time.split(':').map(Number)

    const now = new Date()
    const reminderTime = new Date()
    reminderTime.setHours(hours, minutes, 0, 0)

    // إذا الوقت فات اليوم، اجعلها بكرة
    if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1)
    }

    const delay = reminderTime.getTime() - now.getTime()

    // يعني أول تذكير
    scheduleNotification(reminder, delay)

    // التذكير اليومي (كل 24 ساعة)
    scheduleNotification(reminder, delay, 24 * 60 * 60 * 1000)
}

function scheduleNotification(reminder, delay, dailyRepeat = null) {
    setTimeout(() => {
        self.registration.showNotification(reminder.label, {
            body: 'حان وقت ' + reminder.label + ' ☪️',
            icon: '/img/1.png',
            badge: '/img/1.png',
            tag: reminder.id,
            requireInteraction: true,
            silent: false, // Ensure it's not silent
            sound: '/audio/notification.mp3', // Path to the sound file
            vibrate: [200, 100, 200], // Vibration pattern
            actions: [
                { action: 'open', title: 'فتح التطبيق' },
                { action: 'dismiss', title: 'إغلاق' }
            ],
            data: reminder
        })

        // إذا كان يومي، أعد جدولة التذكير
        if (dailyRepeat) {
            scheduleNotification(reminder, dailyRepeat, dailyRepeat)
        }
    }, delay)
}

// التعامل مع نقرات الإشعارات
self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(clientList => {
                // إذا كان التطبيق مفتوح، اعرضه
                if (clientList.length > 0) {
                    return clientList[0].focus()
                }
                // إذا لم يكن مفتوح، افتحه
                return clients.openWindow('/')
            })
        )
    }
})
