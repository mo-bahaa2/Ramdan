import React, { createContext, useState, useEffect } from 'react'

export const ModeContext = createContext()

export function ModeProvider({ children }) {
    const [mode, setMode] = useState('adult')
    const [isKidsLocked, setIsKidsLocked] = useState(false)
    const [showUnlockPrompt, setShowUnlockPrompt] = useState(false)

    // Load mode from localStorage on mount
    useEffect(() => {
        const storedMode = localStorage.getItem('userMode') || 'adult'
        const storedLocked = localStorage.getItem('isKidsLocked') === 'true'
        setMode(storedMode)
        setIsKidsLocked(storedLocked)

        // Update document class for CSS
        document.documentElement.className = `mode-${storedMode}`
    }, [])

    const toggleMode = (newMode) => {
        setMode(newMode)
        localStorage.setItem('userMode', newMode)
        document.documentElement.className = `mode-${newMode}`
        // If switching into kids mode, enable lock by default so children can't switch back
        if (newMode === 'kids') {
            setIsKidsLocked(true)
            localStorage.setItem('isKidsLocked', 'true')
        }
    }

    const lockKidsMode = () => {
        setIsKidsLocked(true)
        localStorage.setItem('isKidsLocked', 'true')
    }

    const unlockKidsMode = () => {
        setIsKidsLocked(false)
        localStorage.setItem('isKidsLocked', 'false')
        setShowUnlockPrompt(false)
        // switch back to adult mode when unlocked
        setMode('adult')
        localStorage.setItem('userMode', 'adult')
        document.documentElement.className = `mode-adult`
    }

    const requestUnlock = () => {
        setShowUnlockPrompt(true)
    }

    const cancelUnlockRequest = () => {
        setShowUnlockPrompt(false)
    }

    return (
        <ModeContext.Provider
            value={{
                mode,
                toggleMode,
                isKidsLocked,
                lockKidsMode,
                unlockKidsMode,
                requestUnlock,
                cancelUnlockRequest,
                showUnlockPrompt,
                isKidsMode: mode === 'kids',
            }}
        >
            {children}
        </ModeContext.Provider>
    )
}

export function useMode() {
    const context = React.useContext(ModeContext)
    if (!context) {
        throw new Error('useMode must be used within ModeProvider')
    }
    return context
}
