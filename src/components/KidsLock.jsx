import React, { useState } from 'react'
import { useMode } from '../contexts/ModeContext'

export default function KidsLock() {
    const { unlockKidsMode, isKidsLocked, showUnlockPrompt, cancelUnlockRequest } = useMode()
    const [showModal, setShowModal] = useState(false)
    const [answer, setAnswer] = useState('')
    const [question, setQuestion] = useState(null)
    const [error, setError] = useState(false)

    const generateQuestion = () => {
        const num1 = Math.floor(Math.random() * 10) + 1
        const num2 = Math.floor(Math.random() * 10) + 1
        const correctAnswer = num1 + num2
        setQuestion({
            text: `${num1} + ${num2} = ?`,
            answer: correctAnswer,
        })
        setAnswer('')
        setError(false)
    }

    const handleUnlock = () => {
        if (question && parseInt(answer) === question.answer) {
            // unlock and allow returning to adult mode
            unlockKidsMode()
            setShowModal(false)
            setQuestion(null)
        } else {
            setError(true)
            setTimeout(() => setError(false), 1500)
        }
    }

    // Show the modal only when an unlock is requested
    if (!showUnlockPrompt) return null

    return (
        <div className="kids-lock-overlay">
            <div className="kids-lock-modal">
                <h2>🔒 وضع الأطفال قيد التشغيل</h2>
                <p>لتتمكن من العودة للوضع العادي، أجب على السؤال:</p>

                {!question ? (
                    <div>
                        <div style={{ marginBottom: 12 }}>
                            <button className="lock-button" onClick={generateQuestion}>
                                ابدأ سؤالك
                            </button>
                        </div>
                        <button className="lock-button" onClick={cancelUnlockRequest} style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
                            إلغاء
                        </button>
                    </div>
                ) : (
                    <div className="lock-question">
                        <p className="question-text">{question.text}</p>
                        <input
                            type="number"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="أجب بالرقم"
                            className="question-input"
                            onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                            autoFocus
                        />
                        {error && <p className="error-message">❌ الإجابة غير صحيحة</p>}
                        <button className="lock-button verify-btn" onClick={handleUnlock}>
                            تحقق
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
