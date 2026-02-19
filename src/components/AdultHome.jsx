import React, { useEffect, useState } from 'react'
import { fetchTimingsByCity } from '../api'

const adultHabits = [
    'صلاة الفجر',
    'صلاة الظهر',
    'صلاة العصر',
    'صلاة المغرب',
    'صلاة العشاء',
    'صلاة التراويح',
    'قراءة ورد القرآن',
    'أذكار المساء',
    'صدقة اليوم'
]

function convertTo12Hour(time24) {
    if (!time24) return ''
    const [hours, minutes] = time24.split(':')
    let hour = parseInt(hours, 10)
    const period = hour >= 12 ? 'م' : 'ص'
    if (hour > 12) hour -= 12
    if (hour === 0) hour = 12
    return `${hour}:${minutes} ${period}`
}

function getTimeRemaining(prayerTime) {
    const now = new Date()
    const [pHour, pMin] = prayerTime.split(':')
    let prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(pHour), parseInt(pMin), 0)
    if (prayerDate < now) prayerDate.setDate(prayerDate.getDate() + 1)
    const diff = prayerDate - now
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    return `${hours}:${String(minutes).padStart(2, '0')}`
}

export default function AdultHome() {
    const [timings, setTimings] = useState(null)
    const [nextPrayer, setNextPrayer] = useState(null)
    const [habits, setHabits] = useState({})

    useEffect(() => {
        const stored = {}
        adultHabits.forEach(h => {
            stored[h] = localStorage.getItem(`habit_adult_${h}`) === 'true'
        })
        setHabits(stored)
    }, [])

    useEffect(() => {
        let mounted = true
        async function load() {
            try {
                const data = await fetchTimingsByCity()
                if (!mounted) return
                const t = data.data.timings
                setTimings(t)
                updateNext(t)
            } catch (e) {
                console.error(e)
            }
        }
        load()
        const id = setInterval(() => timings && updateNext(timings), 60000)
        return () => {
            mounted = false
            clearInterval(id)
        }
    }, [timings])

    function updateNext(t) {
        if (!t) return
        const now = new Date()
        const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
        const mainPrayers = [
            { name: 'الفجر', time: t.Fajr },
            { name: 'الظهر', time: t.Dhuhr },
            { name: 'العصر', time: t.Asr },
            { name: 'المغرب', time: t.Maghrib },
            { name: 'العشاء', time: t.Isha }
        ]
        let next = mainPrayers.find(p => p.time > currentTime)
        if (!next) next = mainPrayers[0]
        setNextPrayer({
            ...next,
            remaining: getTimeRemaining(next.time),
            time12: convertTo12Hour(next.time)
        })
    }

    function toggleHabit(h) {
        const newState = !habits[h]
        const updated = { ...habits, [h]: newState }
        setHabits(updated)
        localStorage.setItem(`habit_adult_${h}`, newState)
    }

    return (
        <div className="adult-home">
            <header className="top-bar">
                <div className="greeting-container">
                    <div className="greeting-text">
                        <h1>أهلاً وسهلاً بك 👋</h1>
                        <p>رمضانك مبارك، جاهز لإنجازات النهاردة؟</p>
                    </div>
                    <img src="/img/1.png" alt="illustration" className="greeting-image" />
                </div>
            </header>

            {nextPrayer && (
                <div className="quick-stats">
                    <div className="stat-box next-prayer-box">
                        <h2>الصلاة القادمة</h2>
                        <div className="prayer-name">{nextPrayer.name}</div>
                        <div className="prayer-time">{nextPrayer.time12}</div>
                        <div className="prayer-remaining">باقي: {nextPrayer.remaining}</div>
                    </div>
                </div>
            )}

            <section className="habits-section">
                <h2>عاداتك اليومية</h2>
                <div className="habits-grid">
                    {adultHabits.map(habit => (
                        <div
                            key={habit}
                            className={`habit-card ${habits[habit] ? 'completed' : ''}`}
                            onClick={() => toggleHabit(habit)}
                        >
                            <div className="habit-lantern">
                                🏮
                            </div>
                            <p>{habit}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* <section className="daily-reminder">
                <h2>تذكير اليوم</h2>
                <div className="reminder-box">
                    <p>🤲 "اللهم بلغنا رمضان ولا تحرمنا من قبوله"</p>
                </div>
            </section> */}
        </div> 
    )
}
