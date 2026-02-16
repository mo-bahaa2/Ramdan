import React, { useState, useEffect } from 'react'
import { ModeProvider, useMode } from './contexts/ModeContext'
import { RadioProvider } from './contexts/RadioContext'
import Sidebar from './components/Sidebar'
import AdultHome from './components/AdultHome'
import KidsHome from './components/KidsHome'
import Videos from './components/Videos'
import Radio from './components/Radio'
import Prayers from './components/Prayers'
import Reminders from './components/Reminders'
import Adhkar from './components/Adhkar'
import Tasbih from './components/Tasbih'
import KidsLock from './components/KidsLock'
import Onboarding from './components/Onboarding'

function AppContent() {
    const [section, setSection] = useState('home')
    const { isKidsMode } = useMode()
    const [showOnboarding, setShowOnboarding] = useState(false)

    useEffect(() => {
        const hasVisited = localStorage.getItem('ramadan_onboarding_visited')
        if (!hasVisited) {
            setShowOnboarding(true)
        }
    }, [])

    const completeOnboarding = () => {
        localStorage.setItem('ramadan_onboarding_visited', 'true')
        setShowOnboarding(false)
    }

    return (
        <>
            {showOnboarding && <Onboarding onComplete={completeOnboarding} />}
            <KidsLock />
            <div className="app-container">
                <Sidebar active={section} onChange={setSection} />
                <main className="main-content">
                    {section === 'home' && (isKidsMode ? <KidsHome onNavigate={setSection} /> : <AdultHome />)}
                    {section === 'videos' && <Videos />}
                    {section === 'radio' && <Radio />}
                    {section === 'prayers' && <Prayers />}
                    {section === 'reminders' && <Reminders />}
                    {section === 'adhkar' && <Adhkar />}
                    {section === 'tasbih' && <Tasbih />}
                </main>
            </div>
        </>
    )
}

export default function App() {
    return (
        <ModeProvider>
            <RadioProvider>
                <AppContent />
            </RadioProvider>
        </ModeProvider>
    )
}
