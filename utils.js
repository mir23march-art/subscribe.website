import { HOUR_8_MS, HOUR_16_MS, DAY_MS } from './config.js';

// Utility functions
export function getCountdownClass(addedTime, isDefault) {
    if (isDefault) return '';
    
    const elapsed = Date.now() - addedTime;
    if (elapsed < HOUR_8_MS) return "countdown-green";
    if (elapsed < HOUR_16_MS) return "countdown-yellow";
    return "countdown-red";
}

export function formatCountdown(addedTime, isDefault) {
    if (isDefault) return '∞';
    
    let remaining = DAY_MS - (Date.now() - addedTime);
    if (remaining < 0) remaining = 0;
    const h = Math.floor(remaining / (1000 * 60 * 60));
    const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((remaining % (1000 * 60)) / 1000);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export function getStatusBadge(linkObj) {
    if (linkObj.isDefault) {
        return `<span class="badge badge-success">Always Active</span>`;
    } else if (linkObj.clicks >= 1) {
        return `<span class="badge badge-success">Subscribed</span>`;
    } else {
        return `<span class="badge badge-warning">Pending</span>`;
    }
}

export function checkExpiry(links, blocked, userLinks) {
    const now = Date.now();
    const nextLinks = [];
    const updatedBlocked = new Set(blocked);
    const updatedUserLinks = new Set(userLinks);
    
    links.forEach(l => {
        if (l.isDefault) {
            if (now - l.addedTime >= DAY_MS) {
                l.addedTime = Date.now();
            }
            nextLinks.push(l);
        } else if (now - l.addedTime < DAY_MS) {
            nextLinks.push(l);
        } else {
            updatedBlocked.add(l.url);
            if (l.userAdded) {
                updatedUserLinks.delete(l.url);
            }
        }
    });
    
    return { nextLinks, updatedBlocked, updatedUserLinks };
}
