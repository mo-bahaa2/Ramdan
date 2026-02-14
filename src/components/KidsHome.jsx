import React, { useState, useEffect } from 'react'

const kidsHabits = [
    'صليت الفجر 🌅',
    'صليت الظهر ☀️',
    'صليت العصر 🌤️',
    'صليت المغرب 🌅',
    'صليت العشاء 🌙',
    'صمت اليوم 🌱',
    'قرأت القرآن 📖',
    'عملت صدقة 🤝'
]

const kidsRewards = [
    { stars: 5, reward: '🎬 فيلم رمضاني' },
    { stars: 10, reward: '🍪 حلويات' },
    { stars: 15, reward: '🎮 لعبة جديدة' },
    { stars: 20, reward: '🎁 هدية كبيرة' }
]

export default function KidsHome() {
    const [habits, setHabits] = useState({})
    const [stars, setStars] = useState(0)
    const [completionMessage, setCompletionMessage] = useState('')

    useEffect(() => {
        const stored = {}
        const today = new Date().toDateString()
        const lastDate = localStorage.getItem('kids_last_date')

        // Reset if new day
        if (lastDate !== today) {
            localStorage.setItem('kids_last_date', today)
            kidsHabits.forEach(h => {
                localStorage.setItem(`habit_kids_${h}`, 'false')
            })
        } else {
            kidsHabits.forEach(h => {
                stored[h] = localStorage.getItem(`habit_kids_${h}`) === 'true'
            })
            setHabits(stored)
        }

        const storedStars = parseInt(localStorage.getItem('kids_stars') || '0')
        setStars(storedStars)
    }, [])

    function toggleHabit(h) {
        const wasCompleted = habits[h]
        const newState = !wasCompleted
        const updated = { ...habits, [h]: newState }
        setHabits(updated)
        localStorage.setItem(`habit_kids_${h}`, newState)

        if (newState && !wasCompleted) {
            // Added a new habit
            const newStars = stars + 1
            setStars(newStars)
            localStorage.setItem('kids_stars', newStars)

            setCompletionMessage('🌟 أحسنت! أضيف لك نجمة')
            setTimeout(() => setCompletionMessage(''), 2000)

            // Check for rewards
            const nextReward = kidsRewards.find(r => newStars === r.stars)
            if (nextReward) {
                setTimeout(() => {
                    setCompletionMessage(`🎉 مبروك! الآن تستحق: ${nextReward.reward}`)
                }, 2500)
            }
        }
    }

    const nextReward = kidsRewards.find(r => r.stars > stars)

    return (
        <div className="kids-home">
            <header className="kids-header">
                <div className="kids-greeting">
                    <h1>🌟 مرحباً بك في رمضان! 🌟</h1>
                    <p>واصل بقوة، أنت تقدر! 💪</p>
                </div>
                <div className="kids-stars-display">
                    <div className="stars-counter">
                        <span className="star-icon">⭐</span>
                        <span className="star-count">{stars}</span>
                    </div>
                </div>
            </header>

            {completionMessage && (
                <div className="completion-message">
                    {completionMessage}
                </div>
            )}

            <section className="kids-daily-challenge">
                <h2>📋 تحديات اليوم</h2>
                <div className="challenges-grid">
                    {kidsHabits.map(habit => (
                        <button
                            key={habit}
                            className={`challenge-card ${habits[habit] ? 'completed' : ''}`}
                            onClick={() => toggleHabit(habit)}
                        >
                            <div className="challenge-icon">
                                {habits[habit] ? '✅' : '❌'}
                            </div>
                            <p>{habit}</p>
                        </button>
                    ))}
                </div>
            </section>

            {nextReward && (
                <section className="kids-next-reward">
                    <h2>🎁 المكافأة القادمة</h2>
                    <div className="reward-card">
                        <p className="reward-text">{nextReward.reward}</p>
                        <p className="reward-progress">
                            تحتاج {nextReward.stars - stars} نجمة أخرى! ⭐
                        </p>
                    </div>
                </section>
            )}

            <section className="kids-rewards-list">
                <h2>🏆 جميع المكافآت</h2>
                <div className="rewards-grid">
                    {kidsRewards.map((r, idx) => (
                        <div
                            key={idx}
                            className={`reward-item ${stars >= r.stars ? 'unlocked' : 'locked'}`}
                        >
                            <div className="reward-stars">{r.stars}⭐</div>
                            <p>{r.reward}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="kids-motivational">
                <h2>💡 نصيحة اليوم</h2>
                <div className="motivational-box">
                    <p>الصيام والقيام من أجمل عبادات رمضان! 🙏</p>
                </div>
            </section>
        </div>
    )
}
