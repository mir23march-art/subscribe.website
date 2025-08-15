import { DEFAULT_CHANNEL } from './config.js';

// Storage operations
export function loadLinks() {
    try {
        const raw = localStorage.getItem("channelLinks");
        return raw ? JSON.parse(raw) : [];
    } catch(e) {
        return [];
    }
}

export function loadBlocked() {
    try {
        const raw = localStorage.getItem("blockedLinks");
        return new Set(raw ? JSON.parse(raw) : []);
    } catch(e) {
        return new Set();
    }
}

export function loadUserLinks() {
    try {
        const raw = localStorage.getItem("userLinks");
        return new Set(raw ? JSON.parse(raw) : []);
    } catch(e) {
        return new Set();
    }
}

export function saveLinks(links) {
    localStorage.setItem("channelLinks", JSON.stringify(links));
}

export function saveBlocked(blocked) {
    localStorage.setItem("blockedLinks", JSON.stringify(Array.from(blocked)));
}

export function saveUserLinks(userLinks) {
    localStorage.setItem("userLinks", JSON.stringify(Array.from(userLinks)));
}

export function initDefaultChannel() {
    let defaultChannel = {
        url: DEFAULT_CHANNEL,
        clicks: 0,
        addedTime: Date.now(),
        isDefault: true,
        userAdded: false
    };

    if (!localStorage.getItem("channelLinks")) {
        saveLinks([defaultChannel]);
    }
}

export function ensureDefaultLink(links) {
    let idx = links.findIndex(l => l.url === DEFAULT_CHANNEL);
    let updatedLinks = [...links];
    
    if (idx === -1) {
        updatedLinks.unshift({
            url: DEFAULT_CHANNEL,
            clicks: 0,
            addedTime: Date.now(),
            isDefault: true,
            userAdded: false
        });
    } else if (idx !== 0) {
        const existing = updatedLinks.splice(idx, 1)[0];
        existing.isDefault = true;
        existing.userAdded = false;
        updatedLinks.unshift(existing);
    } else {
        updatedLinks[0].isDefault = true;
        updatedLinks[0].userAdded = false;
    }
    
    saveLinks(updatedLinks);
    return updatedLinks;
}
