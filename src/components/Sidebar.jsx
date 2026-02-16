import React, { useState } from 'react'
import { useMode } from '../contexts/ModeContext'
import ModeSwitch from './ModeSwitch'

export default function Sidebar({ active, onChange }) {
    const { isKidsMode, requestUnlock } = useMode()
    const [menuOpen, setMenuOpen] = useState(false)

    const adultNav = [
        { id: 'home', label: '🏠 الرئيسية' },
        { id: 'prayers', label: '🕌 مواقيت الصلاة' },
        { id: 'radio', label: '📻 إذاعة القرآن الكريم' },
        { id: 'adhkar', label: '📿 الأذكار' },
        { id: 'tasbih', label: '🧿 السبحة الإلكترونية' },
        { id: 'reminders', label: '📬 التذكيرات' },
    ]

    const kidsNav = [
        { id: 'home', label: '🏠 الرئيسية' },
        { id: 'videos', label: '🎬 كرتون رمضان' },
    ]

    const navItems = isKidsMode ? kidsNav : adultNav

    // Primary items for bottom nav (mobile)
    const primaryItems = navItems.slice(0, 4)
    const secondaryItems = navItems.slice(4)

    const handleNavClick = (id) => {
        onChange(id)
        setMenuOpen(false)
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`sidebar desktop-sidebar ${isKidsMode ? 'kids-sidebar' : 'adult-sidebar'}`}>
                <ModeSwitch />

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${active === item.id ? 'active' : ''}`}
                            onClick={() => handleNavClick(item.id)}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className={`bottom-nav ${isKidsMode ? 'kids-navbar' : 'adult-navbar'}`}>
                {primaryItems.map(item => (
                    <button
                        key={item.id}
                        className={`bottom-nav-item ${active === item.id ? 'active' : ''}`}
                        onClick={() => handleNavClick(item.id)}
                    >
                        <span className="nav-emoji">{item.label.split(' ')[0]}</span>
                        <span className="nav-text">{item.label.split(' ').slice(1).join(' ')}</span>
                        {active === item.id && <div className="active-indicator" />}
                    </button>
                ))}

                {isKidsMode && (
                    <button
                        className="bottom-nav-item exit-kids-nav-btn"
                        onClick={requestUnlock}
                    >
                        <span className="nav-emoji">🔓</span>
                        <span className="nav-text">وضع الكبار</span>
                    </button>
                )}

                {/* Hamburger Menu Button */}
                {secondaryItems.length > 0 && (
                    <>
                        <button
                            className={`hamburger-btn ${menuOpen ? 'active' : ''}`}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="المزيد"
                        >
                            <span className="hamburger-icon">☰</span>
                            <span className="nav-text">المزيد</span>
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="dropdown-menu">
                                <div className="menu-section mode-switcher-section">
                                    <h4 className="section-title">الوضع المفضل</h4>
                                    <div className="mode-switcher-card">
                                        <div className="mode-card-text">
                                            <p className="mode-label-text">{isKidsMode ? "تبديل لوضع الكبار" : "تبديل لوضع الأطفال"}</p>
                                            <ModeSwitch />
                                        </div>
                                    </div>
                                </div>

                                <div className="menu-section actions-section">
                                    <h4 className="section-title">خيارات إضافية</h4>
                                    {secondaryItems.map(item => (
                                        <button
                                            key={item.id}
                                            className={`dropdown-item ${active === item.id ? 'active' : ''}`}
                                            onClick={() => handleNavClick(item.id)}
                                        >
                                            <span className="item-emoji">{item.label.split(' ')[0]}</span>
                                            <span className="item-label">{item.label.split(' ').slice(1).join(' ')}</span>
                                        </button>
                                    ))}

                                    {isKidsMode && (
                                        <button
                                            className="dropdown-item exit-kids-item"
                                            onClick={() => {
                                                requestUnlock();
                                                setMenuOpen(false);
                                            }}
                                        >
                                            <span className="item-emoji">🔓</span>
                                            <span className="item-label">وضع الكبار</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </nav>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
            )}
        </>
    )
}
