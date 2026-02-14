const API_KEY = '';

const seriesData = [
    { title: "قصص الإنسان في القرآن", id: "PLJ0WU3XQoz49XWayvM7-m1N5ZgNNHL7fK", thumb: "img/el_ensan.jpg" },
    { title: "قصص النساء في القرآن", id: "PLJ0WU3XQoz4-x5FPOHh3s8nRkeal-4ED7", thumb: "img/el_nisaa.png" },
    { title: "قصص العجائب في القرآن", id: "PLJ0WU3XQoz4_vDPS0Xlaf3E2LgUz7pJsp&si=b8mvAS2jmPQaz-C_", thumb: "./img/عجائب.png " },
    { title: "قصص الآيات في القرآن", id: "PLJ0WU3XQoz4-x5FPOHh3s8nRkeal-4ED7&si=3xaqp7VsydAFJwHu", thumb: "./img/hqdefault.jpg" },
    { title: "بكار", id: "PLckmAn-2SivHwpWY7nHiQxxs39W0KEigu", thumb: "./img/bakar.png" },
    { title: "بوجي وطمطم", id: "PL678DQfcGwUyCzPBZbbmaPqPO9sGNpA3-", thumb: "./img/bogy.png" },
    { title: "ظاظا وجرجير", id: "PL678DQfcGwUz0Lq4RdaQoO-m9t6A3QWFv", thumb: "./img/222.png" }
];

const habits = ["صلاة الفجر", "صلاة الظهر", "صلاة العصر", "صلاة المغرب", "صلاة العشاء", "صلاة التراويح", "قراءة ورد القرآن", "أذكار المساء", "صدقة اليوم"];

// 1. التنقل بين الأقسام
function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    if (event) event.currentTarget.classList.add('active');
}

// 2. تتبع العادات
function loadHabits() {
    const container = document.getElementById('habit-tracker-container');
    if (!container) return;
    container.innerHTML = '';
    habits.forEach(habit => {
        const isDone = localStorage.getItem(habit) === 'true';
        const card = document.createElement('div');
        card.className = `habit-card ${isDone ? 'done' : ''}`;
        card.innerHTML = `
            <span>${habit}</span>
            <span class="lantern-icon">🏮</span>
        `;
        card.onclick = () => {
            const newState = !card.classList.contains('done');
            card.classList.toggle('done');
            localStorage.setItem(habit, newState);
        };
        container.appendChild(card);
    });
}

// دالة تحويل الوقت لـ 12 ساعة
function convertTo12Hour(time24) {
    if (!time24) return "";
    const [hours, minutes] = time24.split(':');
    let hour = parseInt(hours);
    const period = hour >= 12 ? 'م' : 'ص';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minutes} ${period}`;
}

// 3. مواقيت الصلاة (تعديل شامل)
async function loadPrayers() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=8');
        const data = await res.json();
        const timings = data.data.timings;

        // القائمة الكاملة للعرض في صفحة "مواقيت الصلاة" (9 توقيتات)
        const fullDisplayArabic = {
            Imsak: "الإمساك",
            Fajr: "الفجر",
            Sunrise: "شروق الشمس",
            Dhuhr: "الظهر",
            Asr: "العصر",
            Sunset: "الغروب",
            Maghrib: "المغرب",
            Isha: "العشاء",
            Midnight: "منتصف الليل"
        };

        const container = document.getElementById('prayer-times-container');
        if (container) {
            container.innerHTML = '';
            Object.keys(fullDisplayArabic).forEach(key => {
                if (timings[key]) {
                    const box = document.createElement('div');
                    box.className = 'prayer-box';
                    const time12 = convertTo12Hour(timings[key]);
                    box.innerHTML = `<h4>${fullDisplayArabic[key]}</h4><p>${time12}</p>`;
                    container.appendChild(box);
                }
            });
        }

        // تحديث كارت "الصلاة القادمة" في الرئيسية (5 صلوات فقط)
        updateNextPrayerOnly(timings);

    } catch (error) {
        console.error("خطأ في جلب المواقيت:", error);
    }
}

// دالة مقارنة الصلوات الخمس فقط
function updateNextPrayerOnly(timings) {
    const now = new Date();
    const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

    // الصلوات الخمس المفروضة فقط
    const mainPrayers = [
        { name: "الفجر", time: timings.Fajr },
        { name: "الظهر", time: timings.Dhuhr },
        { name: "العصر", time: timings.Asr },
        { name: "المغرب", time: timings.Maghrib },
        { name: "العشاء", time: timings.Isha }
    ];

    // البحث عن الصلاة القادمة من بين الـ 5
    let next = mainPrayers.find(p => p.time > currentTime);

    // إذا انتهت صلوات اليوم، الصلاة القادمة هي الفجر
    if (!next) {
        next = mainPrayers[0];
    }

    const remaining = getTimeRemaining(next.time);
    const time12 = convertTo12Hour(next.time);

    const nameElem = document.getElementById('next-prayer-name');
    const timeElem = document.getElementById('next-prayer-time');
    const remainElem = document.getElementById('next-prayer-remaining');

    if (nameElem) nameElem.textContent = next.name;
    if (timeElem) timeElem.textContent = time12;
    if (remainElem) remainElem.textContent = `${remaining} باقي`;

    // تحديث كل دقيقة
    setTimeout(() => updateNextPrayerOnly(timings), 60000);
}

function getTimeRemaining(prayerTime) {
    const now = new Date();
    const [pHour, pMin] = prayerTime.split(':');
    let prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(pHour), parseInt(pMin), 0);

    if (prayerDate < now) {
        prayerDate.setDate(prayerDate.getDate() + 1);
    }

    const diff = prayerDate - now;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    return `${hours}:${String(minutes).padStart(2, '0')}`;
}

// 4. الفيديوهات واليوتيوب
function loadSeries() {
    const grid = document.getElementById('series-grid');
    if (!grid) return;
    grid.innerHTML = '';
    seriesData.forEach(s => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${s.thumb}" alt="${s.title}" class="card-thumb">
            <h3>${s.title}</h3>
            <button class="watch-btn" onclick="event.stopPropagation(); openModal('${s.id}')">شاهد الآن</button>
        `;
        card.onclick = () => openModal(s.id);
        grid.appendChild(card);
    });
}

async function openModal(playlistId) {
    const modal = document.getElementById('video-modal');
    modal.style.display = 'flex';

    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=15&playlistId=${playlistId}&key=${API_KEY}`);
        const data = await res.json();

        const tray = document.getElementById('episodes-tray');
        tray.innerHTML = data.items.map((item, index) => `
            <div class="episode-btn" onclick="playVideo('${item.snippet.resourceId.videoId}')">حلقة ${index + 1}</div>
        `).join('');

        if (data.items.length) playVideo(data.items[0].snippet.resourceId.videoId);
    } catch (e) {
        console.error("YouTube API Error");
    }
}

function playVideo(id) {
    document.getElementById('youtube-iframe').src = `https://www.youtube.com/embed/${id}?autoplay=1`;
}

function closeModal() {
    document.getElementById('video-modal').style.display = 'none';
    document.getElementById('youtube-iframe').src = "";
}

// تشغيل عند التحميل
window.onload = () => {
    loadSeries();
    loadPrayers();
    loadHabits();
};