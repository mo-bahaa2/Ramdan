import React, { useState, useEffect } from 'react'

export default function Reminders() {
    const [subscriptions, setSubscriptions] = useState({})
    const [saveStatus, setSaveStatus] = useState('')
    const [notificationPermission, setNotificationPermission] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'denied'
    )
    const [serviceWorkerReady, setServiceWorkerReady] = useState(false)
    const [prayerTimes, setPrayerTimes] = useState({
        fajr: '05:00',
        dhuhr: '12:00',
        asr: '15:30',
        maghrib: '17:30',
        isha: '19:30'
    })
    const [showPrayerInput, setShowPrayerInput] = useState(false)
    const [tempPrayerTimes, setTempPrayerTimes] = useState({ ...prayerTimes })

    // حساب أوقات التذكيرات بناءً على أوقات الصلاة
    const calculateReminderTimes = (times) => {
        const timeToMinutes = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number)
            return h * 60 + m
        }

        const minutesToTime = (mins) => {
            const h = Math.floor(mins / 60)
            const m = mins % 60
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        }

        const fajrMins = timeToMinutes(times.fajr)
        const dhirMins = timeToMinutes(times.dhuhr)
        const asrMins = timeToMinutes(times.asr)
        const maghribMins = timeToMinutes(times.maghrib)
        const ishaMins = timeToMinutes(times.isha)

        return [
            { id: 'suhoor', label: '🌙 تذكير السحور', time: minutesToTime(fajrMins - 120) },
            { id: 'fajr', label: '🌅 تذكير الفجر', time: minutesToTime(fajrMins - 60) },
            { id: 'dhuhr', label: '☀️ تذكير الظهر', time: minutesToTime(dhirMins - 30) },
            { id: 'asr', label: '🌤️ تذكير العصر', time: minutesToTime(asrMins - 30) },
            { id: 'maghrib', label: '🌅 تذكير المغرب', time: minutesToTime(maghribMins - 30) },
            { id: 'isha', label: '🌙 تذكير العشاء', time: minutesToTime(ishaMins - 30) },
            { id: 'durood', label: '📿 صلي على النبي', time: '09:00', repeat: 'hourly' },
        ]
    }

    const [reminderOptions, setReminderOptions] = useState(() => calculateReminderTimes(prayerTimes))

    useEffect(() => {
        const saved = localStorage.getItem('reminders_subscriptions')
        if (saved) setSubscriptions(JSON.parse(saved))

        // تسجيل Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => {
                    console.log('✅ Service Worker registered')
                    setServiceWorkerReady(true)
                })
                .catch(err => console.log('❌ Service Worker error:', err))
        }
    }, [])

    const toggleReminder = (id) => {
        const updated = { ...subscriptions, [id]: !subscriptions[id] }
        setSubscriptions(updated)
        localStorage.setItem('reminders_subscriptions', JSON.stringify(updated))
    }

    const handleSave = () => {
        const activeReminders = Object.keys(subscriptions)
            .filter(k => subscriptions[k])
            .map(id => reminderOptions.find(r => r.id === id))

        if (activeReminders.length === 0) {
            setSaveStatus('⚠️ اختر تذكيراً واحداً على الأقل')
            setTimeout(() => setSaveStatus(''), 3000)
            return
        }

        localStorage.setItem('reminders_subscriptions', JSON.stringify(subscriptions))

        // إرسال التذكيرات للـ Service Worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'SCHEDULE_REMINDERS',
                reminders: activeReminders
            })
            setSaveStatus('✅ تم تفعيل التذكيرات! ستصل لك الإشعارات كل يوم')
        } else {
            setSaveStatus('⚠️ Service Worker لم يتم تفعيله بعد، حاول تحديث الصفحة')
        }

        setTimeout(() => setSaveStatus(''), 4000)
    }

    const requestNotificationPermission = () => {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                setSaveStatus('✅ الإشعارات مفعلة بالفعل')
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    setNotificationPermission(permission)
                    if (permission === 'granted') {
                        setSaveStatus('✅ تم تفعيل الإشعارات بنجاح!')
                    } else {
                        setSaveStatus('❌ تم رفض الإشعارات، يمكنك تفعيلها من إعدادات المتصفح')
                    }
                    setTimeout(() => setSaveStatus(''), 3000)
                })
            } else {
                setSaveStatus('❌ الإشعارات معطلة في المتصفح')
            }
        }
    }

    return (
        <div className="reminders-container">
            <section className="reminder-section">
                <h2>📬 التذكيرات اليومية</h2>
                <p className="reminder-desc">اختر التذكيرات التي تريد تلقيها كل يوم خلال رمضان</p>

                {!serviceWorkerReady && (
                    <div className="warning-banner">
                        ⏳ جاري تحضير نظام التذكيرات...
                    </div>
                )}

                <div className="reminders-grid">
                    {reminderOptions.map(reminder => (
                        <div key={reminder.id} className="reminder-card">
                            <label className="reminder-label">
                                <input
                                    type="checkbox"
                                    checked={subscriptions[reminder.id] || false}
                                    onChange={() => toggleReminder(reminder.id)}
                                    className="reminder-checkbox"
                                />
                                <span className="reminder-content">
                                    <strong>{reminder.label}</strong>
                                    <small>الوقت: {reminder.time}</small>
                                </span>
                            </label>
                        </div>
                    ))}
                </div>

                <div className="contact-section">
                    <h3>🔔 التذكيرات</h3>
                    <p style={{ color: '#aaa', marginBottom: '15px', fontSize: '0.9rem' }}>
                        التذكيرات ستصل لك حتى لو كان المتصفح مغلقاً عن طريق إشعارات النظام
                    </p>

                    <div className="button-group">
                        <button
                            onClick={handleSave}
                            className="btn-save"
                            disabled={!serviceWorkerReady}
                        >
                            💾 تفعيل التذكيرات
                        </button>
                        <button
                            onClick={requestNotificationPermission}
                            className="btn-notify"
                            style={{
                                opacity: notificationPermission === 'granted' ? 0.6 : 1,
                                cursor: notificationPermission === 'granted' ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {notificationPermission === 'granted' ? '✅ الإشعارات مفعلة' : '🔔 السماح بالإشعارات'}
                        </button>
                    </div>

                    {saveStatus && <p className="save-status">{saveStatus}</p>}
                </div>
            </section>
        </div>
    )
}
