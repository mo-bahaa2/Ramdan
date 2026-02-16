import React, { useState } from 'react'

export default function Onboarding({ onComplete }) {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        {
            id: 1,
            title: "نورتنا في حكايات رمضان 🌙",
            description: "كل سنة وإنت طيب! جمعنا لك كل اللي تحتاجه في رمضان في مكان واحد.. من مواقيت صلاة وراديو وقصص ممتعة.",
            image: "/img/on1.png"
        },
        {
            id: 2,
            title: "وضع خاص لأطفالنا 👦👧",
            description: "عملنا وضع مخصص للأطفال، فيه ترفيه آمن وتعليم مفيد.. قصص الأنبياء، بكار، بوجي وطمطم، وكل اللي يحبوه.",
            image: "/img/on2.png"
        },
        {
            id: 3,
            title: "كل اللي تحتاجه تحت إيدك 📱",
            description: "تقدر تتنقل بسهولة بين كل حاجة (السبحة، الأذكار، الراديو) من الزراير اللي موجودة تحت خالص في الشاشة.",
            image: "/img/on3.png"
        },
        {
            id: 4,
            title: "بساطة في الاستخدام ⚡",
            description: "بكل سهولة تقدر تقلب بين وضع الكبار ووضع الأطفال بضغطة واحدة، عشان تطمن دايماً على المحتوى اللي ولادك بيشوفوه.",
            image: "/img/on4.png"
        }
    ]

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1)
        } else {
            onComplete()
        }
    }

    const { title, description, image } = slides[currentSlide]

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-card">
                <div className="onboarding-visual">
                    <img src={image} alt={title} className="onboarding-img" />
                </div>
                <h2 className="onboarding-title">{title}</h2>
                <p className="onboarding-desc">{description}</p>

                <div className="onboarding-dots">
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            className={`dot ${currentSlide === idx ? 'active' : ''}`}
                        />
                    ))}
                </div>

                <button className="onboarding-btn" onClick={nextSlide}>
                    {currentSlide === slides.length - 1 ? "يلا نبدأ" : "التالي"}
                </button>
            </div>
        </div>
    )
}
