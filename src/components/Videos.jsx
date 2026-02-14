import React, { useState } from 'react'
import { fetchPlaylistItems } from '../api'

const seriesData = [
    { title: "قصص الإنسان في القرآن", id: "PLJ0WU3XQoz49XWayvM7-m1N5ZgNNHL7fK", thumb: "img/el_ensan.jpg" },
    { title: "قصص النساء في القرآن", id: "PLJ0WU3XQoz4-x5FPOHh3s8nRkeal-4ED7", thumb: "img/el_nisaa.png" },
    { title: "قصص العجائب في القرآن", id: "PLJ0WU3XQoz4_vDPS0Xlaf3E2LgUz7pJsp&si=b8mvAS2jmPQaz-C_", thumb: "img/عجائب.png" },
    { title: "قصص الآيات في القرآن", id: "PLJ0WU3XQoz4-x5FPOHh3s8nRkeal-4ED7&si=3xaqp7VsydAFJwHu", thumb: "img/hqdefault.jpg" },
    { title: "بكار", id: "PLckmAn-2SivHwpWY7nHiQxxs39W0KEigu", thumb: "img/bakar.png" },
    { title: "بوجي وطمطم", id: "PL678DQfcGwUyCzPBZbbmaPqPO9sGNpA3-", thumb: "img/bogy.png" },
    { title: "ظاظا وجرجير", id: "PL678DQfcGwUz0Lq4RdaQoO-m9t6A3QWFv", thumb: "img/222.png" }
]

export default function Videos() {
    const [modalOpen, setModalOpen] = useState(false)
    const [videoId, setVideoId] = useState('')
    const [episodes, setEpisodes] = useState([])

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

    return (
        <div>
            <div className="section-title">✨ أرشيف الذكريات</div>
            <div id="series-grid" className="grid-layout">
                {seriesData.map(s => (
                    <div key={s.id} className="card" onClick={() => openModal(s.id)}>
                        <img src={s.thumb} alt={s.title} className="card-thumb" />
                        <h3>{s.title}</h3>
                        <button className="watch-btn" onClick={(e) => { e.stopPropagation(); openModal(s.id) }}>شاهد الآن</button>
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
                            {episodes.map((item, idx) => (
                                <div key={idx} className="episode-btn" onClick={() => playVideo(item.snippet.resourceId.videoId)}>حلقة {idx + 1}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
