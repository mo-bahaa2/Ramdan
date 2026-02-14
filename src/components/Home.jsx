import React, { useEffect, useState } from 'react'
import { fetchTimingsByCity } from '../api'

const habitsList = [
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

export default function Home() {
    const [timings, setTimings] = useState(null)
    const [nextPrayer, setNextPrayer] = useState(null)
    const [habits, setHabits] = useState({})

    useEffect(() => {
        const stored = {}
        habitsList.forEach(h => { stored[h] = localStorage.getItem(h) === 'true' })
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
        return () => { mounted = false; clearInterval(id) }
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
        setNextPrayer({ ...next, remaining: getTimeRemaining(next.time), time12: convertTo12Hour(next.time) })
    }

    function toggleHabit(h) {
        const newState = !habits[h]
        const updated = { ...habits, [h]: newState }
        setHabits(updated)
        localStorage.setItem(h, newState)
    }

    return (
        <div>
            <header className="top-bar">
                <div className="greeting-container">
                    <div className="greeting-text">
                        <h1>أهلاً وسهلاً بك 👋</h1>
                        <p>رمضانك مبارك، جاهز لإنجازات النهاردة؟</p>
                    </div>
                    <img src="/img/1.png" alt="illustration" className="greeting-image" />
                </div>
            </header>

            <section className="page-section active">
                <div className="welcome-card">
                    <h2>"اللهم بلّغنا رمضان وأنت راضٍ عنا"</h2>
                </div>
                <div className="quick-stats">
                    <div className="stat-box next-prayer-box" id="next-prayer-card">
                        <span>الصلاة القادمة</span>
                        <h3 id="next-prayer-name">{nextPrayer ? nextPrayer.name : 'جاري التحميل...'}</h3>
                        <p className="prayer-time" id="next-prayer-time">{nextPrayer ? nextPrayer.time12 : ''}</p>
                        <p className="prayer-remaining" id="next-prayer-remaining">{nextPrayer ? `${nextPrayer.remaining} باقي` : ''}</p>
                    </div>


                </div>
                <div className="section-title">✨ نور يومك</div>
                <div className="habits-grid" id="habit-tracker-container">
                    {habitsList.map(h => (
                        <div key={h} className={`habit-card ${habits[h] ? 'done' : ''}`} onClick={() => toggleHabit(h)}>
                            <span>{h}</span>
                            <span className="lantern-icon">🏮</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
