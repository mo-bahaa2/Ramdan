import React, { useState } from 'react'
import { fetchPlaylistItems } from '../api'

const seriesData = [
    { title: "قصص العجائب في القرآن", id: "PLJ0WU3XQoz4_vDPS0Xlaf3E2LgUz7pJsp&si=b8mvAS2jmPQaz-C_", thumb: "/img/عجائب.png" },
    { title: "قصص النساء في القرآن", id: "PLJ0WU3XQoz4-x5FPOHh3s8nRkeal-4ED7", thumb: "/img/el_nisaa.png" },
    { title: "قصص الإنسان في القرآن", id: "PLJ0WU3XQoz49XWayvM7-m1N5ZgNNHL7fK", thumb: "/img/el_ensan.jpg" },
    { title: "قصص الآيات في القرآن", id: "PLJ0WU3XQoz4-x5FPOHh3s8nRkeal-4ED7&si=3xaqp7VsydAFJwHu", thumb: "/img/hqdefault.jpg" },
    { title: "بكار", id: "PLckmAn-2SivHwpWY7nHiQxxs39W0KEigu", thumb: "/img/bakar.png" },
    { title: "بوجي وطمطم", id: "PL678DQfcGwUyCzPBZbbmaPqPO9sGNpA3-", thumb: "/img/bogy.png" },
    { title: "ظاظا وجرجير", id: "PL678DQfcGwUz0Lq4RdaQoO-m9t6A3QWFv", thumb: "/img/222.png" },
    { title: "الفاوكه", id: "PL7pYJ_OPjX1H8KhI-X-Gse3fgtrwfQnV0&si=0uc4egjoHQDLnc5P", thumb: "/img/كرتون_الفواكه.jpg" }
]

const kidsTips = [
    "ابتسم في وجه أصحابك.. الابتسامة صدقة وتخلي كل الناس تحبك! 😊",
    "ساعد ماما وبابا في تحضير الفطار أو السحور، هيفرحوا بيك جداً! 🥗",
    "قبل ما تبدأ تاكل، قول 'بسم الله' عشان البركة تزيد في أكلك. 🍽️",
    "حافظ على نظافة غرفتك ومكانك.. البطل دايماً شاطر ومنظم. ✨",
    "صلّي على النبي كل ما تفتكره، عشان يومك يكون كله بركة وحسنات. ❤️",
    "لو شفت حد محتاج مساعدة، بادر وساعده.. الخير بيرجع لصاحبه دايماً. 🤝",
    "ادعي لبابا وماما النهاردة من قلبك، هما أكتر ناس بيحبوك في الدنيا. 🤲",
    "اقرأ ولو صفحة واحدة من القرآن كل يوم، القرآن بينوّر قلبك وحياتك. 📖",
    "كلمة 'شكراً' و'لو سمحت' كلمات سحرية بتخلي الناس تحترمك وتحبك. ✨",
    "حاول تنام بدري عشان تصحى نشيط لصلاة الفجر وتبدأ يومك ببركة. 🌅",
    "لو غلطت، الاعتذار شجاعة.. قولي 'أنا آسف' ودايماً خلي قلبك أبيض. 🤍",
    "الصلاة هي صلتنا بربنا.. حافظ على مواعيدها عشان تكون دايمًا قريب منه. 🕌",
    "اتعلم معلومة جديدة النهاردة واحكيها لبابا وماما على الفطار. 💡",
    "خليك دايماً صادق في كلامك.. الصدق هو صفة الأبطال والأقوياء. ✅",
    "اغسل إيدك كويس بالصابون قبل وبعد الأكل عشان صحتك تفضل حديد. 🧼",
    "شجع صحابك على فعل الخير، وكونوا دايماً قدوة لبعض في البر. ✨",
    "قول 'الحمد لله' على كل النعم اللي عندك.. الحمد بيخلي النعم تزيد وتفضل. 🌟",
    "كون رحيم بالحيوانات والطيور، الرفق بيهم له أجر كبير جداً عند ربنا. 🐱",
    "لما تسمع الأذان، ردد وراه بهدوء وتركيز عشان تاخد ثواب كبير. 🕌",
    "خليك دايماً متفائل ومبتسم.. ربنا دايماً معاك وبيحب الأشخاص المتفائلين. 🌈"
]

export default function KidsHome() {
    const [searchTerm, setSearchTerm] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [videoId, setVideoId] = useState('')
    const [episodes, setEpisodes] = useState([])

    // Calculate daily tip index based on date
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const tipIndex = dayOfYear % kidsTips.length;
    const dailyTip = kidsTips[tipIndex];

    async function openModal(playlistId) {
        setModalOpen(true)
        try {
            const data = await fetchPlaylistItems(playlistId)
            setEpisodes(data.items || [])
            if (data.items && data.items.length) {
                setVideoId(data.items[0].snippet.resourceId.videoId)
            }
        } catch (e) {
            console.error('YouTube API Error', e)
            setEpisodes([])
        }
    }

    function playVideo(id) {
        setVideoId(id)
    }

    function closeModal() {
        setModalOpen(false)
        setVideoId('')
        setEpisodes([])
    }

    const filteredSeries = seriesData.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="kids-home-container">
            <div className="kids-daily-tip">
                <div className="tip-header">
                    <span className="tip-icon">💡</span>
                    <h4>نصيحة اليوم للبطل</h4>
                </div>
                <p className="tip-text">{dailyTip}</p>
            </div>

            <div className="kids-search-container">
                <input
                    type="text"
                    placeholder="ابحث عن الكرتون المفضل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="kids-search-input"
                />
                <span className="search-icon">🔍</span>
            </div>

            <div className="grid-layout">
                {filteredSeries.map(s => (
                    <div key={s.id} className="card radio-card" onClick={() => openModal(s.id)}>
                        <img src={s.thumb} alt={s.title} className="card-thumb" />
                        <h3>{s.title}</h3>
                        <div className="radio-controls">
                            <button className="btn-play-radio" onClick={(e) => { e.stopPropagation(); openModal(s.id) }}>
                                ▶️ شاهد الآن
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-body">
                        <span className="close-modal" onClick={closeModal} style={{ cursor: 'pointer', fontSize: 30 }}>&times;</span>
                        <div className="video-wrapper">
                            <iframe id="youtube-iframe" src={videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : ''} frameBorder="0" allowFullScreen></iframe>
                        </div>
                        <div id="episodes-tray" className="episodes-tray">
                            {episodes.map((item, idx) => {
                                const isCurrent = videoId === item.snippet.resourceId.videoId;
                                return (
                                    <div
                                        key={idx}
                                        className={`episode-btn ${isCurrent ? 'active' : ''}`}
                                        onClick={() => playVideo(item.snippet.resourceId.videoId)}
                                    >
                                        حلقة {idx + 1}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
