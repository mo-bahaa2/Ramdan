import React, { useState, useEffect } from 'react'
import adhkarData from '../data/adhkarData.json'

export default function Adhkar() {
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedAdhkar, setSelectedAdhkar] = useState(null)
    const [counters, setCounters] = useState({})
    const [completed, setCompleted] = useState({})

    // Load counters and completed state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('adhkar_counters')
        if (saved) setCounters(JSON.parse(saved))
        const savedCompleted = localStorage.getItem('adhkar_completed')
        if (savedCompleted) setCompleted(JSON.parse(savedCompleted))
    }, [])

    // Save counters to localStorage
    useEffect(() => {
        localStorage.setItem('adhkar_counters', JSON.stringify(counters))
    }, [counters])

    // Save completed to localStorage
    useEffect(() => {
        localStorage.setItem('adhkar_completed', JSON.stringify(completed))
    }, [completed])

    const getCounterKey = (category, index) => `${category}_${index}`

    const getCounter = (category, index) => {
        const key = getCounterKey(category, index)
        const adhkar = adhkarData[category][index]
        return counters[key] !== undefined ? counters[key] : adhkar.count
    }

    const decrementCounter = (category, index) => {
        const key = getCounterKey(category, index)
        const current = getCounter(category, index)
        const newCount = Math.max(0, current - 1)

        setCounters(prev => ({
            ...prev,
            [key]: newCount
        }))

        // Mark as completed when counter reaches 0
        if (newCount === 0) {
            setCompleted(prev => ({
                ...prev,
                [key]: true
            }))
        }
    }

    const resetCounter = (category, index) => {
        const key = getCounterKey(category, index)
        const adhkar = adhkarData[category][index]
        setCounters(prev => ({
            ...prev,
            [key]: adhkar.count
        }))
        setCompleted(prev => ({
            ...prev,
            [key]: false
        }))
    }

    const isCompleted = (category, index) => {
        const key = getCounterKey(category, index)
        return completed[key] === true
    }

    const categoryEmojis = {
        'أذكار الصباح': '🌅',
        'أذكار المساء': '🌙',
        'أذكار بعد السلام': '📿',
        'تسابيح': '🌟',
        'أذكار النوم': '😴',
        'أذكار الاستيقاظ': '🌄'
    }

    return (
        <div className="adhkar-container">
            <section className="adhkar-section">
                <h2>📿 الأذكار الإسلامية</h2>
                <p className="adhkar-desc">أذكار رمضانية تقربك من الله</p>

                {!selectedCategory ? (
                    // Categories View
                    <div className="adhkar-categories">
                        {Object.keys(adhkarData).map(category => (
                            <button
                                key={category}
                                className="adhkar-category-btn"
                                onClick={() => setSelectedCategory(category)}
                            >
                                <span className="emoji">{categoryEmojis[category] || '📿'}</span>
                                <span className="category-name">{category}</span>
                                <span className="count">{adhkarData[category].length}</span>
                            </button>
                        ))}
                    </div>
                ) : !selectedAdhkar ? (
                    // Adhkar List View
                    <div className="adhkar-list-view">
                        <button className="btn-back" onClick={() => setSelectedCategory(null)}>
                            ← عودة
                        </button>
                        <h3>{categoryEmojis[selectedCategory] || '📿'} {selectedCategory}</h3>

                        <div className="adhkar-items">
                            {adhkarData[selectedCategory].map((adhkar, idx) => {
                                const isComp = isCompleted(selectedCategory, idx)
                                const counter = getCounter(selectedCategory, idx)
                                return (
                                    <div
                                        key={idx}
                                        className={`adhkar-item-card ${isComp ? 'completed' : ''}`}
                                        onClick={() => setSelectedAdhkar(idx)}
                                    >
                                        <div className="adhkar-item-number">{idx + 1}</div>
                                        <div className="adhkar-item-content">
                                            <p className="adhkar-item-text">{adhkar.content}</p>
                                            {adhkar.description && (
                                                <p className="adhkar-description">{adhkar.description}</p>
                                            )}
                                        </div>
                                        <div className="adhkar-item-counter">
                                            {isComp ? (
                                                <span className="badge-complete">✅ مكتمل</span>
                                            ) : (
                                                <span className="badge-remaining">فاضل {counter}</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    // Adhkar Detail View
                    <div className="adhkar-detail-view">
                        <button className="btn-back" onClick={() => setSelectedAdhkar(null)}>
                            ← عودة
                        </button>

                        <div className="adhkar-detail-card">
                            <div className="detail-number">
                                الذكر {selectedAdhkar + 1}
                            </div>

                            <p className="detail-content">
                                {adhkarData[selectedCategory][selectedAdhkar].content}
                            </p>

                            {adhkarData[selectedCategory][selectedAdhkar].description && (
                                <div className="detail-benefit">
                                    <h4>💡 الفائدة:</h4>
                                    <p>{adhkarData[selectedCategory][selectedAdhkar].description}</p>
                                </div>
                            )}

                            {adhkarData[selectedCategory][selectedAdhkar].reference && (
                                <div className="detail-reference">
                                    <strong>📚 المرجع:</strong> {adhkarData[selectedCategory][selectedAdhkar].reference}
                                </div>
                            )}

                            <div className="detail-counter-section">
                                <div className="counter-display">
                                    {isCompleted(selectedCategory, selectedAdhkar) ? (
                                        <div className="counter-complete">
                                            <h3>🎉 تم إكمال هذا الذكر</h3>
                                            <button
                                                className="btn-reset"
                                                onClick={() => resetCounter(selectedCategory, selectedAdhkar)}
                                            >
                                                إعادة تعيين
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="counter-label">عدد التكرارات:</p>
                                            <div className="counter-box">
                                                {getCounter(selectedCategory, selectedAdhkar)}
                                            </div>
                                            <button
                                                className="btn-decrement"
                                                onClick={() => decrementCounter(selectedCategory, selectedAdhkar)}
                                            >
                                                ✅ قلت الذكر
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}
