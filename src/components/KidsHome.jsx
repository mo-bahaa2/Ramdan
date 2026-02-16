import React, { useState, useEffect } from 'react'

const kidsRewards = [
    { stars: 5, reward: '🎬 فيلم رمضاني', icon: '🎬' },
    { stars: 10, reward: '🍪 حلويات', icon: '🍪' },
    { stars: 15, reward: '🎮 لعبة جديدة', icon: '🎮' },
    { stars: 20, reward: '🎁 هدية كبيرة', icon: '🎁' }
]

export default function KidsHome({ onNavigate }) {
    const [stars, setStars] = useState(0)

    useEffect(() => {
        const storedStars = parseInt(localStorage.getItem('kids_stars') || '0')
        setStars(storedStars)
    }, [])

    const nextReward = kidsRewards.find(r => r.stars > stars) || kidsRewards[kidsRewards.length - 1]
    const progress = Math.min((stars / nextReward.stars) * 100, 100)

    return (
        <div className="kids-home-container">
            {/* Featured Video Section */}
            <section className="kids-featured-hero" onClick={() => onNavigate('videos')}>
                <div className="hero-content">
                    <span className="hero-badge">كارتون اليوم 🎬</span>
                    <h2>مغامرات بكار 🐪</h2>
                    <p>اتفرج على أجمل الحكايات وعيش جو رمضان</p>
                    <button className="play-hero-btn">▶️ شاهد الآن</button>
                </div>
                <div className="hero-image">
                    <img src="/img/bakar.png" alt="Bakar" />
                </div>
            </section>

            {/* Stars Dashboard */}
            <section className="kids-stars-dashboard">
                <div className="stars-main">
                    <div className="star-orb">
                        <span className="star-icon">⭐</span>
                        <span className="star-count">{stars}</span>
                    </div>
                    <div className="stars-info">
                        <h3>أنت بطل حكايات رمضان! 🌟</h3>
                        <p>باقي لك {nextReward.stars - stars > 0 ? nextReward.stars - stars : 0} نجوم عشان تفتح: <strong>{nextReward.reward}</strong></p>
                    </div>
                </div>

                <div className="reward-progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    <div className="gift-box-icon">🎁</div>
                </div>
            </section>


            {/* Motivational Parent Section */}
            <section className="kids-parent-msg">
                <p>💡 "برافو يا بطل.. بابا وماما فخورين بيك جداً النهاردة!" 🌟</p>
            </section>
        </div>
    )
}
