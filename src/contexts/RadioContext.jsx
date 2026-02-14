import React, { createContext, useRef, useState, useEffect } from 'react'

export const RadioContext = createContext()

export function RadioProvider({ children }) {
    const [currentRadio, setCurrentRadio] = useState(null)
    const audioRef = useRef(null)

    useEffect(() => {
        if (audioRef.current) {
            if (currentRadio) {
                audioRef.current.src = currentRadio.url
                audioRef.current.play().catch(() => { })
            } else {
                audioRef.current.pause()
                audioRef.current.src = ''
            }
        }
    }, [currentRadio])

    const playRadio = (radio) => {
        setCurrentRadio(radio)
    }

    const stopRadio = () => {
        setCurrentRadio(null)
    }

    return (
        <RadioContext.Provider value={{ currentRadio, playRadio, stopRadio, audioRef }}>
            {children}
            <audio ref={audioRef} crossOrigin="anonymous" />
        </RadioContext.Provider>
    )
}

export function useRadio() {
    const context = React.useContext(RadioContext)
    if (!context) {
        throw new Error('useRadio must be used within RadioProvider')
    }
    return context
}
