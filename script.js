let currentEmail = localStorage.getItem('temp_email') || '';
let refreshInterval;

// Initialize
window.onload = () => {
    if (!currentEmail) {
        generateNewEmail();
    } else {
        document.getElementById('emailAddr').value = currentEmail;
        fetchMessages();
    }
    startAutoRefresh();
};

async function generateNewEmail() {
    try {
        const res = await fetch('/api/generate');
        const data = await res.json();
        currentEmail = data.email;
        localStorage.setItem('temp_email', currentEmail);
        document.getElementById('emailAddr').value = currentEmail;
        document.getElementById('inboxList').innerHTML = '<div class="empty-state">Inbox cleared. Waiting for new messages...</div>';
        fetchMessages();
    } catch (err) {
        alert('Error generating email');
    }
}

async function fetchMessages() {
    if (!currentEmail) return;
    try {
        const res = await fetch(`/api/messages?email=${currentEmail}`);
        const messages = await res.json();
        renderInbox(messages);
    } catch (err) {
        console.error('Error fetching messages');
    }
}

function renderInbox(messages) {
    const list = document.getElementById('inboxList');
    if (messages.length === 0) {
        list.innerHTML = '<div class="empty-state">No messages yet. Waiting for incoming emails...</div>';
        return;
    }

    list.innerHTML = messages.map(msg => `
        <div class="mail-item" onclick="readMail(${msg.id})">
            <span class="from">${msg.from}</span>
            <span class="subj">${msg.subject}</span>
            <span class="date">${msg.date.split(' ')[1]}</span>
        </div>
    `).join('');
}

async function readMail(id) {
    try {
        const res = await fetch(`/api/read?email=${currentEmail}&id=${id}`);
        const data = await res.json();
        
        document.getElementById('mailSubject').innerText = data.subject;
        document.getElementById('mailMeta').innerHTML = `<strong>From:</strong> ${data.from} <br> <strong>Date:</strong> ${data.date}`;
        document.getElementById('mailBody').innerHTML = data.htmlBody || data.textBody.replace(/\n/g, '<br>');
        document.getElementById('mailModal').style.display = 'block';
    } catch (err) {
        alert('Error reading email');
    }
}

function copyEmail() {
    const el = document.getElementById('emailAddr');
    el.select();
    navigator.clipboard.writeText(el.value);
    
    const btn = event.currentTarget;
    const icon = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => btn.innerHTML = icon, 2000);
}

function refreshEmail() {
    if(confirm("Generate new email? Current inbox will be lost.")) {
        generateNewEmail();
    }
}

function closeModal() {
    document.getElementById('mailModal').style.display = 'none';
}

function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(fetchMessages, 5000);
}

// Close modal when clicking outside
window.onclick = (event) => {
    const modal = document.getElementById('mailModal');
    if (event.target == modal) closeModal();
};