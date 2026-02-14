import React, { useState, useEffect } from 'react'

const tasbihTypes = [
    { id: 'subhanallah', label: 'سبحان الله', color: '#9d4edd', goal: 33 },
    { id: 'alhamdulillah', label: 'الحمد لله', color: '#ffcc00', goal: 33 },
    { id: 'allahuakbar', label: 'الله أكبر', color: '#00d4ff', goal: 34 },
    { id: 'lahaula', label: 'لا حول ولا قوةإلا بالله', color: '#ff6b6b', goal: 0 }
]

export default function Tasbih() {
    const [counts, setCounts] = useState({})
    const [selectedType, setSelectedType] = useState('subhanallah')
    const [session, setSession] = useState(null)
    const [sound, setSound] = useState(true)

    useEffect(() => {
        const saved = localStorage.getItem('tasbih_counts')
        if (saved) setCounts(JSON.parse(saved))

        // Initialize counts if empty
        if (Object.keys(counts).length === 0) {
            const initial = {}
            tasbihTypes.forEach(t => {
                initial[t.id] = 0
            })
            setCounts(initial)
        }
    }, [])

    const playSound = () => {
        if (!sound) return
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 800
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
    }

    const triggerHaptic = () => {
        if (navigator.vibrate) {
            navigator.vibrate(20)
        }
    }

    const handleTasbihClick = () => {
        const newCount = (counts[selectedType] || 0) + 1
        const newCounts = { ...counts, [selectedType]: newCount }

        setCounts(newCounts)
        localStorage.setItem('tasbih_counts', JSON.stringify(newCounts))

        playSound()
        triggerHaptic()

        // Check if reached goal
        const type = tasbihTypes.find(t => t.id === selectedType)
        if (type.goal > 0 && newCount === type.goal) {
            celebrateMilestone()
        }
    }

    const celebrateMilestone = () => {
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 100])
        }
    }

    const resetCurrent = () => {
        const newCounts = { ...counts, [selectedType]: 0 }
        setCounts(newCounts)
        localStorage.setItem('tasbih_counts', JSON.stringify(newCounts))
    }

    const resetAll = () => {
        if (confirm('هل متأكد من حذف جميع العدادات؟')) {
            const initial = {}
            tasbihTypes.forEach(t => {
                initial[t.id] = 0
            })
            setCounts(initial)
            localStorage.setItem('tasbih_counts', JSON.stringify(initial))
        }
    }

    const currentType = tasbihTypes.find(t => t.id === selectedType)
    const currentCount = counts[selectedType] || 0
    const progress = currentType.goal > 0 ? (currentCount / currentType.goal) * 100 : 0
    const isCompleted = currentType.goal > 0 && currentCount >= currentType.goal

    return (
        <div className="tasbih-container">
            <section className="tasbih-section">
                <h2>📿 السبحة الإلكترونية</h2>
                <p className="tasbih-desc">احسب تسبيحاتك بسهولة مع تذكير لطيف</p>

                {/* Main Counter */}
                <div className="tasbih-counter" style={{ borderColor: currentType.color }}>
                    <div className="counter-display">
                        <div className="count-number">{currentCount}</div>
                        <div className="count-label">{currentType.label}</div>
                    </div>

                    {currentType.goal > 0 && (
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${Math.min(progress, 100)}%`,
                                    backgroundColor: currentType.color
                                }}
                            />
                        </div>
                    )}

                    {currentType.goal > 0 && (
                        <div className="progress-text">
                            {currentCount} / {currentType.goal}
                            {isCompleted && <span className="completed-badge">✅ اكتمل!</span>}
                        </div>
                    )}

                    <button
                        className="tasbih-button"
                        style={{ backgroundColor: currentType.color }}
                        onClick={handleTasbihClick}
                    >
                        اضغط لتسبيح
                    </button>
                </div>

                {/* Type Selection */}
                <div className="tasbih-types">
                    <h3>اختر التسبيح</h3>
                    <div className="types-grid">
                        {tasbihTypes.map(type => (
                            <button
                                key={type.id}
                                className={`type-btn ${selectedType === type.id ? 'active' : ''}`}
                                style={{
                                    borderColor: type.color,
                                    backgroundColor: selectedType === type.id ? type.color : 'transparent',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setSelectedType(type.id)}
                            >
                                <div>{type.label}</div>
                                <small>{counts[type.id] || 0}</small>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Statistics */}
                <div className="tasbih-stats">
                    <h3>📊 الإحصائيات</h3>
                    <div className="stats-grid">
                        {tasbihTypes.map(type => (
                            <div key={type.id} className="stat-card" style={{ borderLeftColor: type.color }}>
                                <div className="stat-label">{type.label}</div>
                                <div className="stat-value">{counts[type.id] || 0}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="tasbih-controls">
                    <label className="sound-toggle">
                        <input
                            type="checkbox"
                            checked={sound}
                            onChange={(e) => setSound(e.target.checked)}
                        />
                        <span>تفعيل الصوت والاهتزاز</span>
                    </label>

                    <div className="button-group">
                        <button onClick={resetCurrent} className="btn-reset">
                            ↻ إعادة تعيين الحالي
                        </button>
                        <button onClick={resetAll} className="btn-reset-all">
                            🗑️ حذف الكل
                        </button>
                    </div>
                </div>

                <div className="tasbih-tips">
                    <h3>💡 نصائح</h3>
                    <ul>
                        <li>استخدم التسبيح للأذكار والدعاء</li>
                        <li>أهداف السبحة تساعد في الانتظام والتركيز</li>
                        <li>البيانات تُحفظ تلقائياً على جهازك</li>
                        <li>فعّل الاهتزاز لتجربة أفضل</li>
                    </ul>
                </div>
            </section>
        </div>
    )
}
