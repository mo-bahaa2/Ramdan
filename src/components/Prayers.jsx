import React, { useEffect, useState } from 'react'
import { fetchTimingsByCity } from '../api'

function convertTo12Hour(time24) {
    if (!time24) return ''
    const [hours, minutes] = time24.split(':')
    let hour = parseInt(hours, 10)
    const period = hour >= 12 ? 'م' : 'ص'
    if (hour > 12) hour -= 12
    if (hour === 0) hour = 12
    return `${hour}:${minutes} ${period}`
}

export default function Prayers() {
    const [timings, setTimings] = useState(null)

    useEffect(() => {
        let mounted = true
        async function load() {
            try {
                const data = await fetchTimingsByCity()
                if (!mounted) return
                setTimings(data.data.timings)
            } catch (e) {
                console.error(e)
            }
        }
        load()
        return () => { mounted = false }
    }, [])

    const fullDisplayArabic = {
        Imsak: 'الإمساك',
        Fajr: 'الفجر',
        Sunrise: 'شروق الشمس',
        Dhuhr: 'الظهر',
        Asr: 'العصر',
        Sunset: 'الغروب',
        Maghrib: 'المغرب',
        Isha: 'العشاء',
        Midnight: 'منتصف الليل'
    }

    return (
        <div>
            <div className="section-title">🕌 مواقيت الصلاة (القاهرة)</div>
            <div className="prayer-grid" id="prayer-times-container">
                {timings ? Object.keys(fullDisplayArabic).map(key => (
                    timings[key] ? (
                        <div className="prayer-box" key={key}>
                            <h4>{fullDisplayArabic[key]}</h4>
                            <p>{convertTo12Hour(timings[key])}</p>
                        </div>
                    ) : null
                )) : <p>جاري التحميل...</p>}
            </div>
        </div>
    )
}
