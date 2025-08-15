import { USER_LINK_LIMIT } from './config.js';
import { getStatusBadge, getCountdownClass, formatCountdown } from './utils.js';

// UI manipulation functions
export function displayLinks(links) {
    const tbody = document.querySelector("#linkTable tbody");
    tbody.innerHTML = "";
    
    if (links.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">No channels added yet</td></tr>`;
        return;
    }
    
    links.forEach((linkObj, index) => {
        const tr = document.createElement("tr");
        const countdownClass = getCountdownClass(linkObj.addedTime, linkObj.isDefault);
        
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><a href="${linkObj.url}" target="_blank" class="channel-link">${linkObj.url.replace(/^https?:\/\//, '')}</a></td>
            <td>${getStatusBadge(linkObj)}</td>
            <td class="${countdownClass}">${formatCountdown(linkObj.addedTime, linkObj.isDefault)}</td>
            <td>${linkObj.clicks}/${MAX_CLICKS}</td>
            <td>
                <button class="btn btn-sm" onclick="handleChannelClick(${index})" ${linkObj.clicks >= 1 ? 'disabled' : ''}>
                    ${linkObj.clicks >= 1 ? '<i class="fas fa-check"></i> Done' : '<i class="fas fa-external-link-alt"></i> Open'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

export function updateUserProgress(userLinks) {
    const progress = (userLinks.size / USER_LINK_LIMIT) * 100;
    document.getElementById('userProgress').style.width = `${progress}%`;
    
    if (userLinks.size >= USER_LINK_LIMIT) {
        document.getElementById('addButton').disabled = true;
        document.getElementById('userLimitMessage').textContent = 'You have reached your link limit (1 link per user)';
        document.getElementById('userLimitMessage').style.color = '#dc3545';
    }
}

export function showSuccessMessage() {
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success';
    successAlert.innerHTML = '<i class="fas fa-check-circle"></i> Channel added successfully! Please subscribe to all channels in the list.';
    document.querySelector('.card').appendChild(successAlert);
    
    setTimeout(() => {
        successAlert.remove();
    }, 5000);
}
