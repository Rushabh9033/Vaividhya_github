import { useState, useEffect } from "react";
import "./Countdown.css";

function Countdown({ targetDate = "2026-02-15T09:00:00" }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(targetDate) - new Date();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            expired: false
        };
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line
    }, [timeLeft]);

    if (timeLeft.expired) {
        return (
            <div className="countdown-container">
                <div className="countdown-live">
                    <span className="live-dot"></span>
                    EVENT IS LIVE!
                </div>
            </div>
        );
    }

    return (
        <div className="countdown-container">
            <div className="countdown-label">Event Starts In</div>
            <div className="countdown-grid">
                <div className="countdown-item">
                    <div className="countdown-value">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="countdown-unit">Days</div>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                    <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="countdown-unit">Hours</div>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                    <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="countdown-unit">Minutes</div>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                    <div className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="countdown-unit">Seconds</div>
                </div>
            </div>
        </div>
    );
}

export default Countdown;
