import React from 'react'
import { useMode } from '../contexts/ModeContext'

export default function ModeSwitch() {
    const { mode, toggleMode, lockKidsMode, isKidsLocked, requestUnlock } = useMode()

    const handleKidsMode = () => {
        // quickly switch to kids mode; enable lock so returning requires unlock
        toggleMode('kids')
        lockKidsMode()
    }

    return (
        <div className="mode-switch-container">
            <div className="mode-buttons">
                <button
                    className={`mode-btn ${mode === 'adult' ? 'active' : ''}`}
                    onClick={() => {
                        // if currently in kids and lock is enabled, request unlock prompt
                        if (mode === 'kids' && isKidsLocked) {
                            requestUnlock()
                        } else {
                            toggleMode('adult')
                        }
                    }}
                    title="وضع الكبار"
                >
                    👤
                </button>
                <button
                    className={`mode-btn kids-btn ${mode === 'kids' ? 'active' : ''}`}
                    onClick={handleKidsMode}
                    title="وضع الأطفال"
                >
                    🧒
                </button>
            </div>
            {mode === 'adult' && (
                <p className="mode-suggestion">
                    💡 <span>عندك طفل؟ جرّب وضع الأطفال</span>
                </p>
            )}
        </div>
    )
}
