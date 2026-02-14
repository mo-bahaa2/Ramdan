import React, { useState, useEffect } from 'react'
import { useRadio } from '../contexts/RadioContext'

const radios = [
    { "id": 1, "name": "إذاعة أبو بكر الشاطري", "url": "https://backup.qurango.net/radio/shaik_abu_bakr_al_shatri", "img": "https://i1.sndcdn.com/artworks-000663801097-wb0y31-t200x200.jpg" },
    { "id": 2, "name": "إذاعة أحمد خضر الطرابلسي", "url": "https://backup.qurango.net/radio/ahmad_khader_altarabulsi", "img": "https://i.pinimg.com/564x/d3/c2/9c/d3c29cc03198c3c15d380af048b2d68b.jpg" },
    { "id": 3, "name": "إذاعة إبراهيم الأخضر", "url": "https://backup.qurango.net/radio/ibrahim_alakdar", "img": "https://static.suratmp3.com/pics/reciters/thumbs/44_600_600.jpg" },
    { "id": 4, "name": "إذاعة خالد الجليل", "url": "https://backup.qurango.net/radio/khalid_aljileel", "img": "https://i1.sndcdn.com/avatars-ubX3f7yLm5eGyphJ-A4ysyA-t500x500.jpg" },
    { "id": 5, "name": "إذاعة صلاح الهاشم", "url": "https://backup.qurango.net/radio/salah_alhashim", "img": "https://i.pinimg.com/564x/e9/22/1b/e9221b5ffd484937dc70c3eabe350c6f.jpg" },
    { "id": 6, "name": "إذاعة صلاح بو خاطر", "url": "https://backup.qurango.net/radio/slaah_bukhatir", "img": "https://pbs.twimg.com/profile_images/1306502829251624960/uHKIJQpq_200x200.jpg" },
    { "id": 7, "name": "إذاعة عبدالباسط عبدالصمد", "url": "https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad", "img": "https://cdns-images.dzcdn.net/images/talk/06b711ac6da4cde0eb698e244f5e27b8/300x300.jpg" },
    { "id": 8, "name": "إذاعة عبد العزيز سحيم", "url": "https://backup.qurango.net/radio/a_sheim", "img": "https://i.pinimg.com/564x/a7/37/47/a73747375897de4897da372a0fd921a0.jpg" },
    { "id": 9, "name": "إذاعة فارس عباد", "url": "https://backup.qurango.net/radio/fares_abbad", "img": "https://static.suratmp3.com/pics/reciters/thumbs/15_600_600.jpg" },
    { "id": 10, "name": "إذاعة ماهر المعيقلي", "url": "https://backup.qurango.net/radio/maher", "img": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/4b/80/58/4b80582d-78ca-a466-0341-0869bc611745/mza_5280524847349008894.jpg/250x250bb.jpg" },
    { "id": 11, "name": "إذاعة محمد صديق المنشاوي", "url": "https://backup.qurango.net/radio/mohammed_siddiq_alminshawi_mojawwad", "img": "https://i1.sndcdn.com/artworks-000284633237-7gdg9t-t200x200.jpg" },
    { "id": 12, "name": "إذاعة محمود خليل الحصري", "url": "https://backup.qurango.net/radio/mahmoud_khalil_alhussary_mojawwad", "img": "https://watanimg.elwatannews.com/image_archive/original_lower_quality/18194265071637693809.jpg" },
    { "id": 13, "name": "إذاعة محمود علي البنا", "url": "https://backup.qurango.net/radio/mahmoud_ali__albanna_mojawwad", "img": "https://i.pinimg.com/200x/29/67/b3/2967b3fbc1ce1f5a70874288d34317bf.jpg" },
    { "id": 14, "name": "إذاعة مشاري العفاسي", "url": "https://backup.qurango.net/radio/mishary_alafasi", "img": "https://i1.sndcdn.com/artworks-000019055020-yr9cjc-t200x200.jpg" },
    { "id": 15, "name": "إذاعة ناصر القطامي", "url": "https://backup.qurango.net/radio/nasser_alqatami", "img": "https://i1.sndcdn.com/artworks-000096282703-s9wldh-t200x200.jpg" },
    { "id": 16, "name": "إذاعة نبيل الرفاعي", "url": "https://backup.qurango.net/radio/nabil_al_rifay", "img": "https://i1.sndcdn.com/artworks-000161140408-wh6nhw-t200x200.jpg" },
    { "id": 17, "name": "إذاعة هيثم الجدعاني", "url": "https://backup.qurango.net/radio/hitham_aljadani", "img": "https://ar.islamway.net/uploads/authors/3948.jpg" },
    { "id": 18, "name": "إذاعة ياسر الدوسري", "url": "https://backup.qurango.net/radio/yasser_aldosari", "img": "https://www.almowaten.net/wp-content/uploads/2022/06/%D9%8A%D8%A7%D8%B3%D8%B1-%D8%A7%D9%84%D8%AF%D9%88%D8%B3%D8%B1%D9%8A.jpg" },
    { "id": 19, "name": "إذاعة القرأن الكريم من القاهرة", "url": "https://n0e.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABjW7yROAA0TUU8cXhXIAi6g", "img": "img/download.png" },
    { "id": 20, "name": "إذاعة السنة النبوية", "url": "https://n01.radiojar.com/x0vs2vzy6k0uv?rj-ttl=5&rj-tok=AAABjW751GcA4NgCI8-5DCpCHQ", "img": "https://i.pinimg.com/564x/55/16/ab/5516abd3744c3d0b0a7b28bedd5474c0.jpg" },
    { "id": 21, "name": "إذاعة تلاوات خاشعة", "url": "https://backup.qurango.net/radio/salma", "img": "https://pbs.twimg.com/profile_images/1396812808659079169/5ft2haLD_400x400.jpg" },
    { "id": 22, "name": "إذاعة الرقية الشرعية", "url": "https://backup.qurango.net/radio/roqiah", "img": "https://i1.sndcdn.com/artworks-zygACgAd2NKwuohE-UF2Piw-t500x500.jpg" },
    { "id": 23, "name": "إذاعة تكبيرات العيد", "url": "https://backup.qurango.net/radio/eid", "img": "https://i.pinimg.com/736x/3c/b3/fc/3cb3fc494b9f8332a7b7b3256e3d9822.jpg" },
    { "id": 24, "name": "المختصر في تفسير القرآن الكريم", "url": "https://backup.qurango.net/radio/mukhtasartafsir", "img": "https://areejquran.net/wp-content/uploads/2015/12/unnamed.jpg" }
]

export default function Radio() {
    const [list, setList] = useState([])
    const { currentRadio, playRadio, stopRadio } = useRadio()

    useEffect(() => {
        // Put Quran radio (id 19) first in the list for prominence
        const quran = radios.find(r => r.id === 19)
        const others = radios.filter(r => r.id !== 19)
        setList(quran ? [quran, ...others] : radios)
    }, [])

    const handleRadioClick = (radio) => {
        if (currentRadio && currentRadio.id === radio.id) {
            // If clicking the same radio, stop it
            stopRadio()
        } else {
            // Otherwise, play the selected radio
            playRadio(radio)
        }
    }

    return (
        <div>
            <h2 className="section-title">📻 الإذاعات</h2>
            <div className="grid-layout">
                {list.map(r => (
                    <div
                        key={r.id}
                        className={`card ${currentRadio && currentRadio.id === r.id ? 'playing' : ''}`}
                        onClick={() => handleRadioClick(r)}
                    >
                        <img src={r.img} alt={r.name} className="card-thumb" />
                        <h3>{r.name}</h3>
                        {currentRadio && currentRadio.id === r.id && (
                            <div className="watch-btn">🔊 يستمع الآن</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
