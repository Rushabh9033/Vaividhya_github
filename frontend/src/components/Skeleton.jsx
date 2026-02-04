import "./Skeleton.css";

// Generic skeleton loader
export function Skeleton({ width = "100%", height = "20px", borderRadius = "4px" }) {
    return (
        <div
            className="skeleton"
            style={{ width, height, borderRadius }}
        />
    );
}

// Event card skeleton
export function EventCardSkeleton() {
    return (
        <div className="event-card-skeleton">
            <div className="skeleton skeleton-image" />
            <div className="skeleton-content">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text short" />
                <div className="skeleton skeleton-button" />
            </div>
        </div>
    );
}

// Grid of skeleton cards
export function EventGridSkeleton({ count = 6 }) {
    return (
        <div className="event-select-grid">
            {Array.from({ length: count }).map((_, i) => (
                <EventCardSkeleton key={i} />
            ))}
        </div>
    );
}

// Receipt skeleton
export function ReceiptSkeleton() {
    return (
        <div className="receipt-skeleton">
            <div className="skeleton skeleton-header" />
            <div className="skeleton-row">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-value" />
            </div>
            <div className="skeleton-row">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-value" />
            </div>
            <div className="skeleton-row">
                <div className="skeleton skeleton-label" />
                <div className="skeleton skeleton-value" />
            </div>
            <div className="skeleton skeleton-events" />
            <div className="skeleton skeleton-total" />
        </div>
    );
}

export default Skeleton;
