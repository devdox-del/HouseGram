// =====================================================================
// HouseGram — vanilla JS messenger
// =====================================================================

// --- DOM Elements ---
const menuView = document.getElementById('menu-view');
const chatView = document.getElementById('chat-view');
const profileView = document.getElementById('profile-view');
const settingsView = document.getElementById('settings-view');
const contactsView = document.getElementById('contacts-view');
const editProfileView = document.getElementById('edit-profile-view');

const chatList = document.getElementById('chat-list');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const micButton = document.getElementById('mic-button');
const emojiButton = document.getElementById('emoji-button');
const emojiPicker = document.getElementById('emoji-picker');
const backButtonChat = document.getElementById('back-to-menu');
const typingIndicatorContainer = document.getElementById('typing-indicator-container');
const chatHeaderAvatar = document.getElementById('chat-header-avatar');
const chatHeaderName = document.getElementById('chat-header-name');
const chatStatus = document.getElementById('chat-status');
const chatHeaderClickable = document.getElementById('chat-header-clickable');

const profileBackButton = document.getElementById('profile-back-button');
const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileStatus = document.getElementById('profile-status');
const profilePhone = document.getElementById('profile-phone');
const profileBio = document.getElementById('profile-bio');
const profileUsername = document.getElementById('profile-username');
const profileBlockButton = document.getElementById('profile-block-button');
const profileSendButton = document.getElementById('profile-send-button');
const profileShareButton = document.getElementById('profile-share-button');
const profileClearButton = document.getElementById('profile-clear-button');

// Side menu
const hamburgerButton = document.getElementById('hamburger-button');
const sideMenu = document.getElementById('side-menu');
const menuOverlay = document.getElementById('menu-overlay');
const sideMenuUserButton = document.getElementById('side-menu-user-profile-button');
const sideMenuAvatar = document.getElementById('side-menu-avatar');
const sideMenuUserName = document.getElementById('side-menu-user-name');
const sideMenuUserPhone = document.getElementById('side-menu-user-phone');

// Search
const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
const searchClose = document.getElementById('search-close');

// Floating actions
const newChatButton = document.getElementById('new-chat-button');

// Settings
const settingsBackButton = document.getElementById('settings-back-button');
const themeToggle = document.getElementById('settings-theme-toggle');
const soundToggle = document.getElementById('settings-sound-toggle');
const settingsEditProfile = document.getElementById('settings-edit-profile');
const settingsClearAll = document.getElementById('settings-clear-all');

// Contacts view
const contactsBackButton = document.getElementById('contacts-back-button');
const contactsList = document.getElementById('contacts-list');
const contactsTitle = document.getElementById('contacts-title');

// Edit profile view
const editProfileBack = document.getElementById('edit-profile-back');
const editProfileSave = document.getElementById('edit-profile-save');
const editProfileNameInput = document.getElementById('edit-profile-name');
const editProfilePhoneInput = document.getElementById('edit-profile-phone');

// Toast
const toastContainer = document.getElementById('toast-container');

// Context menu
const contextMenu = document.getElementById('context-menu');

// =====================================================================
// User profile (the local user)
// =====================================================================
const USER_KEY = 'housegram_user_v1';
const SETTINGS_KEY = 'housegram_settings_v1';
const STORAGE_KEY = 'housegram_messages_v1';
const META_KEY = 'housegram_contact_meta_v1';

const defaultUser = {
    name: 'Ваше Имя',
    phone: '+7 9XX XXX XX XX',
    initial: 'В',
    avatarColor: '#ff9800',
};

const defaultSettings = {
    theme: 'light', // 'light' | 'dark'
    sound: true,
};

let user = loadUser();
let settings = loadSettings();

function loadUser() {
    try {
        const raw = localStorage.getItem(USER_KEY);
        if (raw) return { ...defaultUser, ...JSON.parse(raw) };
    } catch (e) { /* ignore */ }
    return { ...defaultUser };
}
function saveUser() {
    try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch (e) { /* ignore */ }
}
function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
    } catch (e) { /* ignore */ }
    return { ...defaultSettings };
}
function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { /* ignore */ }
}

// =====================================================================
// Contact data — multiple AI personas + Saved Messages chat
// =====================================================================
const contacts = {
    saved: {
        id: 'saved',
        name: 'Избранное',
        initial: '★',
        avatarColor: '#4dabf7',
        statusOnline: 'личные заметки',
        statusOffline: 'личные заметки',
        phone: '—',
        bio: 'Заметки и сообщения для самого себя.',
        username: '@saved',
        messages: [],
        generateResponse: null, // saved messages don't auto-reply
        isTyping: false,
        typingTimeout: null,
        unread: 0,
        kind: 'saved',
    },
    durov: {
        id: 'durov',
        name: 'Pavel Durov',
        initial: 'P',
        avatarColor: '#517da2',
        statusOnline: 'в сети',
        statusOffline: 'был(а) недавно',
        phone: '+7 999 *** ****',
        bio: 'Создатель Telegram и VK.',
        username: '@durov',
        messages: [
            { type: 'received', text: 'Привет! Чем могу помочь?', time: '10:00' }
        ],
        generateResponse: generateDurovResponse,
        isTyping: false,
        typingTimeout: null,
        unread: 0,
        kind: 'bot',
    },
    musk: {
        id: 'musk',
        name: 'Elon Musk',
        initial: 'E',
        avatarColor: '#1d9bf0',
        statusOnline: 'в сети',
        statusOffline: 'был(а) недавно',
        phone: '+1 650 *** ****',
        bio: 'CEO Tesla, SpaceX. To Mars and beyond.',
        username: '@elonmusk',
        messages: [
            { type: 'received', text: 'Hey there! Working on something cool today?', time: '09:30' }
        ],
        generateResponse: generateMuskResponse,
        isTyping: false,
        typingTimeout: null,
        unread: 0,
        kind: 'bot',
    },
    jobs: {
        id: 'jobs',
        name: 'Steve Jobs',
        initial: 'S',
        avatarColor: '#212121',
        statusOnline: 'в сети',
        statusOffline: 'был(а) давно',
        phone: '+1 408 *** ****',
        bio: 'Co-founder of Apple. Stay hungry, stay foolish.',
        username: '@stevejobs',
        messages: [
            { type: 'received', text: 'Design is not just what it looks like. Design is how it works.', time: '08:45' }
        ],
        generateResponse: generateJobsResponse,
        isTyping: false,
        typingTimeout: null,
        unread: 0,
        kind: 'bot',
    },
    helper: {
        id: 'helper',
        name: 'HouseGram Bot',
        initial: 'H',
        avatarColor: '#43a047',
        statusOnline: 'в сети',
        statusOffline: 'всегда онлайн',
        phone: '—',
        bio: 'Дежурный помощник HouseGram.',
        username: '@housegram_bot',
        messages: [
            { type: 'received', text: 'Добро пожаловать в HouseGram! Я могу помочь разобраться в приложении. Спросите меня про команды или возможности.', time: '07:00' }
        ],
        generateResponse: generateHelperResponse,
        isTyping: false,
        typingTimeout: null,
        unread: 0,
        kind: 'bot',
    },
};

// Persisted per-contact metadata: blocked state, hidden (deleted) state
let contactMeta = loadContactMeta();
function loadContactMeta() {
    try {
        const raw = localStorage.getItem(META_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return {};
}
function saveContactMeta() {
    try { localStorage.setItem(META_KEY, JSON.stringify(contactMeta)); } catch (e) { /* ignore */ }
}
function getMeta(contactId) {
    if (!contactMeta[contactId]) {
        contactMeta[contactId] = { blocked: false, hidden: false };
    }
    return contactMeta[contactId];
}

// =====================================================================
// State
// =====================================================================
let currentChatId = null;
let activeView = 'menu';
let pendingChatPicker = false; // when contacts view opens via "+"

// =====================================================================
// localStorage helpers for messages
// =====================================================================
function loadMessagesFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored);
        Object.keys(parsed).forEach(contactId => {
            if (contacts[contactId]) {
                contacts[contactId].messages = parsed[contactId];
            }
        });
    } catch (e) {
        console.error('Ошибка загрузки из localStorage:', e);
    }
}
function saveMessagesToStorage() {
    try {
        const messagesToStore = {};
        Object.keys(contacts).forEach(contactId => {
            messagesToStore[contactId] = contacts[contactId].messages;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToStore));
    } catch (e) {
        console.error('Ошибка сохранения в localStorage:', e);
    }
}

// =====================================================================
// Helpers
// =====================================================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}

function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function parseTime(timeString) {
    if (!timeString) return 0;
    if (timeString.toLowerCase() === 'yesterday') {
        return new Date().setHours(0, 0, 0, 0) - 86400000;
    }
    if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        if (date > new Date()) date.setDate(date.getDate() - 1);
        return date.getTime();
    }
    if (/\d{4}/.test(timeString)) return new Date(timeString, 0, 1).getTime();
    return 0;
}

function showToast(text, kind = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (kind === 'error') toast.classList.add('toast-error');
    if (kind === 'success') toast.classList.add('toast-success');
    toast.textContent = text;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        // safety remove after delay
        setTimeout(() => toast.remove(), 600);
    }, 2200);
}

function playReceiveSound() {
    if (!settings.sound) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 720;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
    } catch (e) { /* audio unavailable */ }
}

// =====================================================================
// Theme
// =====================================================================
function applyTheme() {
    document.body.dataset.theme = settings.theme;
    if (themeToggle) themeToggle.checked = settings.theme === 'dark';
}

// =====================================================================
// Side menu
// =====================================================================
function openSideMenu() {
    sideMenu.classList.add('open');
    menuOverlay.classList.add('open');
    menuOverlay.setAttribute('aria-hidden', 'false');
}
function closeSideMenu() {
    sideMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
    menuOverlay.setAttribute('aria-hidden', 'true');
}
function toggleSideMenu() {
    if (sideMenu.classList.contains('open')) closeSideMenu();
    else openSideMenu();
}

function refreshSideMenuUser() {
    sideMenuUserName.textContent = user.name;
    sideMenuUserPhone.textContent = user.phone;
    sideMenuAvatar.dataset.initial = (user.name || ' ').trim().charAt(0).toUpperCase() || '?';
    sideMenuAvatar.style.backgroundColor = user.avatarColor;
}

// =====================================================================
// View navigation
// =====================================================================
const VIEWS = {
    menu: () => menuView,
    chat: () => chatView,
    profile: () => profileView,
    settings: () => settingsView,
    contacts: () => contactsView,
    'edit-profile': () => editProfileView,
};

function navigateToView(viewId, data = null) {
    const previousView = activeView;
    activeView = viewId;

    // hide all
    [menuView, chatView, profileView, settingsView, contactsView, editProfileView].forEach(v => {
        if (v) v.classList.add('hidden');
    });

    let target;
    switch (viewId) {
        case 'menu':
            target = menuView;
            currentChatId = null;
            resetChatInput();
            populateChatList();
            break;
        case 'chat':
            if (!data || !contacts[data]) {
                console.error('Invalid chat ID:', data);
                navigateToView('menu');
                return;
            }
            currentChatId = data;
            target = chatView;
            // entering chat clears unread
            contacts[data].unread = 0;
            saveMessagesToStorage();
            loadChat(currentChatId);
            break;
        case 'profile':
            if (!currentChatId || !contacts[currentChatId]) {
                navigateToView('menu');
                return;
            }
            target = profileView;
            loadProfile(currentChatId);
            break;
        case 'settings':
            target = settingsView;
            refreshSettingsView();
            break;
        case 'contacts':
            target = contactsView;
            populateContactsList();
            break;
        case 'edit-profile':
            target = editProfileView;
            editProfileNameInput.value = user.name;
            editProfilePhoneInput.value = user.phone;
            setTimeout(() => editProfileNameInput.focus(), 50);
            break;
        default:
            target = menuView;
            activeView = 'menu';
    }
    if (target) target.classList.remove('hidden');
}

// =====================================================================
// Chat list
// =====================================================================
function visibleContacts() {
    return Object.values(contacts).filter(c => !getMeta(c.id).hidden);
}

function populateChatList(filterText = '') {
    const fragment = document.createDocumentFragment();
    chatList.innerHTML = '';

    const filter = filterText.trim().toLowerCase();
    const sorted = visibleContacts()
        .filter(c => !filter || c.name.toLowerCase().includes(filter) ||
                     (c.username || '').toLowerCase().includes(filter))
        .sort((a, b) => {
            // pinned: saved messages first
            if (a.id === 'saved' && b.id !== 'saved') return -1;
            if (b.id === 'saved' && a.id !== 'saved') return 1;
            const tA = a.messages.length ? parseTime(a.messages[a.messages.length - 1].time) : 0;
            const tB = b.messages.length ? parseTime(b.messages[b.messages.length - 1].time) : 0;
            return tB - tA;
        });

    if (sorted.length === 0) {
        const empty = document.createElement('div');
        empty.classList.add('chat-list-empty');
        empty.textContent = filter ? 'Ничего не найдено' : 'Нет чатов. Нажмите «+» чтобы начать общение.';
        chatList.appendChild(empty);
        return;
    }

    sorted.forEach(contact => {
        const lastMessage = contact.messages[contact.messages.length - 1] || { text: '', time: '' };
        const previewText = lastMessage.type === 'sent' ? `Вы: ${lastMessage.text}` : (lastMessage.text || 'Нет сообщений');

        const item = document.createElement('div');
        item.classList.add('chat-list-item');
        item.dataset.contactId = contact.id;
        item.setAttribute('role', 'listitem');
        item.tabIndex = 0;

        const meta = getMeta(contact.id);
        const blockedBadge = meta.blocked ? '<span class="chat-list-blocked" title="Заблокировано">🚫</span>' : '';
        const pinned = contact.id === 'saved' ? '<span class="chat-list-pin" title="Закреплено">📌</span>' : '';
        const unreadBadge = contact.unread > 0
            ? `<div class="unread-count">${contact.unread}</div>`
            : '';

        item.innerHTML = `
            <div class="avatar avatar-placeholder" data-initial="${escapeHtml(contact.initial)}" style="background-color: ${escapeHtml(contact.avatarColor)};"></div>
            <div class="chat-list-info">
                <div class="chat-list-name">${escapeHtml(contact.name)} ${blockedBadge}</div>
                <div class="chat-list-preview">${escapeHtml(previewText.substring(0, 60))}${previewText.length > 60 ? '...' : ''}</div>
            </div>
            <div class="chat-list-meta">
                <div class="chat-list-time">${pinned}${escapeHtml(lastMessage.time)}</div>
                ${unreadBadge}
            </div>
        `;
        fragment.appendChild(item);
    });

    chatList.appendChild(fragment);
}

function handleChatListClick(event) {
    const chatItem = event.target.closest('.chat-list-item');
    if (chatItem) {
        const contactId = chatItem.dataset.contactId;
        navigateToView('chat', contactId);
    }
}

function handleChatListKeydown(event) {
    const chatItem = event.target.closest('.chat-list-item');
    if (!chatItem) return;
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navigateToView('chat', chatItem.dataset.contactId);
    }
}

function handleChatListContextMenu(event) {
    const chatItem = event.target.closest('.chat-list-item');
    if (!chatItem) return;
    event.preventDefault();
    showContextMenu(event.clientX, event.clientY, chatItem.dataset.contactId);
}

// =====================================================================
// Context menu (delete chat / clear / mark read)
// =====================================================================
let contextMenuTarget = null;

function showContextMenu(x, y, contactId) {
    contextMenuTarget = contactId;
    contextMenu.style.display = 'block';
    // position
    const w = contextMenu.offsetWidth || 180;
    const h = contextMenu.offsetHeight || 120;
    contextMenu.style.left = Math.min(x, window.innerWidth - w - 10) + 'px';
    contextMenu.style.top = Math.min(y, window.innerHeight - h - 10) + 'px';
}
function hideContextMenu() {
    contextMenu.style.display = 'none';
    contextMenuTarget = null;
}

function handleContextAction(event) {
    const action = event.target.closest('[data-context-action]');
    if (!action || !contextMenuTarget) return;
    const id = contextMenuTarget;
    const a = action.dataset.contextAction;
    if (a === 'mark-read') {
        contacts[id].unread = 0;
        saveMessagesToStorage();
        populateChatList(searchInput.value || '');
        showToast('Отмечено как прочитанное');
    } else if (a === 'clear') {
        if (confirm(`Очистить переписку с ${contacts[id].name}?`)) {
            contacts[id].messages = [];
            saveMessagesToStorage();
            populateChatList(searchInput.value || '');
            showToast('Переписка очищена');
        }
    } else if (a === 'delete') {
        if (confirm(`Удалить чат с ${contacts[id].name}?`)) {
            getMeta(id).hidden = true;
            saveContactMeta();
            populateChatList(searchInput.value || '');
            showToast('Чат удалён');
        }
    }
    hideContextMenu();
}

// =====================================================================
// Chat view
// =====================================================================
function loadChat(contactId) {
    if (!contacts[contactId]) return;
    const contact = contacts[contactId];
    currentChatId = contactId;

    chatHeaderAvatar.textContent = '';
    chatHeaderAvatar.dataset.initial = contact.initial;
    chatHeaderAvatar.style.backgroundColor = contact.avatarColor;
    chatHeaderName.textContent = contact.name;
    chatStatus.textContent = contact.isTyping ? 'печатает...' : contact.statusOffline;

    chatMessages.innerHTML = '';
    chatMessages.appendChild(typingIndicatorContainer);

    if (contact.messages.length === 0) {
        showEmptyState(contact.name, contact.id);
    } else {
        contact.messages.forEach(msg => addMessageToDOM(msg.text, msg.type, msg.time));
    }

    if (contact.isTyping) {
        typingIndicatorContainer.classList.remove('hidden');
    } else {
        typingIndicatorContainer.classList.add('hidden');
    }

    // Block UI when blocked
    const blocked = getMeta(contactId).blocked;
    document.getElementById('chat-input-area').classList.toggle('blocked', blocked);
    document.getElementById('chat-blocked-banner').classList.toggle('hidden', !blocked);
    if (blocked) {
        messageInput.placeholder = 'Контакт заблокирован';
        messageInput.disabled = true;
    } else {
        messageInput.placeholder = 'Сообщение';
        messageInput.disabled = false;
    }

    scrollToBottom(true);
    toggleSendButton();
    if (!blocked) messageInput.focus();
}

function showEmptyState(contactName, contactId) {
    const isSaved = contactId === 'saved';
    const emptyState = document.createElement('div');
    emptyState.classList.add('empty-state');
    emptyState.innerHTML = `
        <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V17C3 16.4696 2.78929 15.9609 2.41421 15.5858C2.03914 15.2107 1.82843 14.702 1.82843 14.1716V7C1.82843 5.93913 2.25086 4.92172 3.00289 4.16971C3.75493 3.41771 4.77235 2.99529 5.83321 2.99529H19C20.0609 2.99529 21.0783 3.41771 21.8303 4.16971C22.5824 4.92172 23.0048 5.93913 23.0048 7V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="empty-state-title">${isSaved ? 'Заметки для себя' : 'Нет сообщений'}</div>
        <div class="empty-state-text">${isSaved ? 'Сохраняйте здесь идеи, ссылки и важное. Сообщения видны только вам.' : `Напишите сообщение, чтобы начать диалог с ${escapeHtml(contactName)}`}</div>
    `;
    chatMessages.insertBefore(emptyState, typingIndicatorContainer);
}

function addMessageToDOM(text, type, time) {
    const emptyState = chatMessages.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `message-${type}`);

    const messageTextElement = document.createElement('span');
    messageTextElement.classList.add('message-text');
    messageTextElement.textContent = text;
    messageElement.appendChild(messageTextElement);

    const timeElement = document.createElement('div');
    timeElement.classList.add('message-time');
    timeElement.textContent = time || getCurrentTime();
    messageElement.appendChild(timeElement);

    const typingIndicator = chatMessages.querySelector('#typing-indicator-container');
    if (typingIndicator) {
        chatMessages.insertBefore(messageElement, typingIndicator);
    } else {
        chatMessages.appendChild(messageElement);
    }
    scrollToBottom();
}

function updateChatListPreview(contactId, text, type) {
    const contact = contacts[contactId];
    if (!contact) return;

    const timeString = getCurrentTime();
    contact.messages.push({ text, type, time: timeString });
    saveMessagesToStorage();

    if (currentChatId !== contactId && type === 'received') {
        contact.unread = (contact.unread || 0) + 1;
    }

    // Re-render the menu list cheaply (only if menu is visible to avoid disrupting chat view)
    if (activeView === 'menu') {
        populateChatList(searchInput.value || '');
    }
}

function sendMessage() {
    const messageText = messageInput.value.trim();
    const contact = contacts[currentChatId];
    if (messageText === '' || !contact) return;
    if (getMeta(currentChatId).blocked) {
        showToast('Контакт заблокирован', 'error');
        return;
    }
    if (contact.isTyping) return;

    const timeString = getCurrentTime();
    addMessageToDOM(messageText, 'sent', timeString);
    updateChatListPreview(currentChatId, messageText, 'sent');
    messageInput.value = '';
    toggleSendButton();
    closeEmojiPicker();

    if (currentChatId === 'saved') {
        // Saved messages: no auto-reply.
        return;
    }

    simulateTypingAndResponse(currentChatId, messageText);
}

function simulateTypingAndResponse(contactId, userMessage) {
    const contact = contacts[contactId];
    if (!contact || !contact.generateResponse) return;

    contact.isTyping = true;
    if (currentChatId === contactId) {
        typingIndicatorContainer.classList.remove('hidden');
        chatStatus.textContent = 'печатает...';
        scrollToBottom();
    }
    if (contact.typingTimeout) clearTimeout(contact.typingTimeout);

    const typingDelay = 800 + Math.random() * 2200;
    contact.typingTimeout = setTimeout(() => {
        const response = contact.generateResponse(userMessage);
        const responseTime = getCurrentTime();
        contact.messages.push({ type: 'received', text: response, time: responseTime });

        if (currentChatId === contactId) {
            addMessageToDOM(response, 'received', responseTime);
        } else {
            contact.unread = (contact.unread || 0) + 1;
            playReceiveSound();
        }
        saveMessagesToStorage();
        if (activeView === 'menu') {
            populateChatList(searchInput.value || '');
        }

        contact.isTyping = false;
        if (currentChatId === contactId) {
            typingIndicatorContainer.classList.add('hidden');
            chatStatus.textContent = contact.statusOnline;
            setTimeout(() => {
                if (!contact.isTyping && currentChatId === contactId) {
                    chatStatus.textContent = contact.statusOffline;
                }
            }, 5000);
        }
        contact.typingTimeout = null;
    }, typingDelay);
}

// =====================================================================
// AI response generators
// =====================================================================
function generateDurovResponse(userMessage) {
    const m = userMessage.toLowerCase();
    if (/(^|\P{L})(привет|здравствуй|добрый день|hello|hi)(\P{L}|$)/u.test(m))
        return ['Привет!', 'Здравствуйте!', 'Приветствую.'][Math.floor(Math.random() * 3)];
    if (/(как дела|что нового|how are you)/u.test(m))
        return ['Всё отлично, работаем над будущим.', 'Много планов, много работы.', 'В процессе создания новых идей.'][Math.floor(Math.random() * 3)];
    if (/(telegram|телеграм|телега)/u.test(m))
        return 'Telegram — это символ свободы и безопасности в цифровом мире.';
    if (/(ton|крипто|crypto|блокчейн|blockchain)/u.test(m))
        return 'Технологии вроде TON открывают путь к децентрализованному будущему.';
    if (/(свобод|цензур|privacy|приватность)/u.test(m))
        return 'Защита приватности и свобода информации — не привилегия, а необходимость.';
    if (/(дуров|durov|павел)/u.test(m))
        return 'Да, это я. Чем могу быть полезен?';
    if (/(инвестиции|деньги|бизнес)/u.test(m))
        return 'Фокусируйтесь на создании ценности, а не на погоне за деньгами.';
    if (/(вконтакте|vk)/u.test(m))
        return 'Это был важный этап, но прошлое должно оставаться в прошлом.';
    if (/(почему|зачем|как)/u.test(m) && m.includes('?'))
        return ['Хороший вопрос. Мир сложнее, чем кажется.', 'Иногда ответ кроется в самом вопросе.', 'Стоит задуматься.'][Math.floor(Math.random() * 3)];
    if (m.endsWith('?'))
        return ['Над этим стоит подумать.', 'Неоднозначный вопрос.', 'Что вы сами думаете по этому поводу?'][Math.floor(Math.random() * 3)];
    if (/(спасибо|благодарю|thanks)/u.test(m)) return 'Пожалуйста.';
    if (m.length < 6) return ['Хм.', 'Ок.', 'Понятно.'][Math.floor(Math.random() * 3)];
    if (Math.random() < 0.25) {
        return ['Важно мыслить независимо.', 'Мир меняется быстро, нужно адаптироваться.',
            'Технологии дают невероятные возможности.', 'Сосредоточьтесь на главном.',
            'Будущее создается сегодня.'][Math.floor(Math.random() * 5)];
    }
    return 'Интересно. Расскажи подробнее.';
}

function generateMuskResponse(userMessage) {
    const m = userMessage.toLowerCase();
    if (/(hi|hello|привет)/u.test(m)) return ['Hey!', 'Hi 🚀', 'Hello there.'][Math.floor(Math.random() * 3)];
    if (/(mars|марс)/u.test(m)) return 'We need to make humans a multi-planetary species. Mars next.';
    if (/(tesla|тесла)/u.test(m)) return 'Tesla is a software company that happens to make cars.';
    if (/(spacex|ракет|rocket)/u.test(m)) return 'Reusable rockets are the key. Cost matters.';
    if (/(ai|ии|искусствен)/u.test(m)) return 'AI is the most important technology of our time. Use it wisely.';
    if (/(bitcoin|crypto|крипто|doge)/u.test(m)) return 'Crypto is interesting. Doge to the moon 🌝';
    if (/(twitter|твиттер)/u.test(m)) return 'X is the everything app.';
    if (m.endsWith('?')) return ['Good question. Think first principles.', 'Iterate fast. Build a prototype.', 'It depends on the constraints.'][Math.floor(Math.random() * 3)];
    if (/(thanks|спасибо)/u.test(m)) return 'You bet.';
    if (m.length < 5) return ['Ok.', 'Sure.', 'Cool.'][Math.floor(Math.random() * 3)];
    if (Math.random() < 0.25) {
        return ['Move fast, ship product.', 'The best part is no part.', 'Make the requirements less dumb.', 'Optimize for the long run.'][Math.floor(Math.random() * 4)];
    }
    return 'Interesting. Tell me more.';
}

function generateJobsResponse(userMessage) {
    const m = userMessage.toLowerCase();
    if (/(hi|hello|привет)/u.test(m)) return ['Hello.', 'Hi there.'][Math.floor(Math.random() * 2)];
    if (/(apple|эпл|айфон|iphone|mac)/u.test(m)) return 'Innovation distinguishes between a leader and a follower.';
    if (/(design|дизайн)/u.test(m)) return 'Design is not just what it looks like. Design is how it works.';
    if (/(simple|просто|минимализм)/u.test(m)) return 'Simplicity is the ultimate sophistication.';
    if (/(work|работ|карьер)/u.test(m)) return 'The only way to do great work is to love what you do.';
    if (m.endsWith('?')) return ['Focus is about saying no.', 'Stay hungry. Stay foolish.', 'Quality is more important than quantity.'][Math.floor(Math.random() * 3)];
    if (/(thanks|спасибо)/u.test(m)) return 'You\'re welcome.';
    if (m.length < 5) return ['Indeed.', 'Right.'][Math.floor(Math.random() * 2)];
    if (Math.random() < 0.25) {
        return ['Think different.', 'Real artists ship.', 'Your work is going to fill a large part of your life.', 'People don\'t know what they want until you show it to them.'][Math.floor(Math.random() * 4)];
    }
    return 'Tell me more about that.';
}

function generateHelperResponse(userMessage) {
    const m = userMessage.toLowerCase();
    if (/(привет|hi|hello)/u.test(m)) return 'Привет! Я помогу разобраться в HouseGram.';
    if (/(что ты можешь|команд|help|помощь)/u.test(m))
        return 'Я могу: показать список чатов, открыть настройки, сменить тему. В разделе «Контакты» бокового меню можно начать новый чат.';
    if (/(тёмн|тем|dark|theme)/u.test(m))
        return 'Включить тёмную тему: откройте «Настройки» → «Тёмная тема». Состояние сохраняется в браузере.';
    if (/(бот|bot|собеседник)/u.test(m))
        return 'Сейчас доступны: Pavel Durov, Elon Musk, Steve Jobs и я. Откройте «Контакты» в боковом меню.';
    if (/(сохран|избранн|saved)/u.test(m))
        return 'Чат «Избранное» — это заметки для себя. Сообщения не получают автоответов и хранятся локально.';
    if (/(удал|delete|clear)/u.test(m))
        return 'Чтобы удалить чат — нажмите правой кнопкой мыши (или долгое нажатие) на элемент списка.';
    if (m.endsWith('?')) return 'Хороший вопрос. Загляните в Настройки или Контакты бокового меню.';
    if (m.length < 4) return 'Слушаю.';
    return 'Понял. Если нужно — открой «Настройки» в боковом меню.';
}

// =====================================================================
// Profile view
// =====================================================================
function loadProfile(contactId) {
    if (!contacts[contactId]) return;
    const contact = contacts[contactId];

    profileName.textContent = contact.name;
    profileStatus.textContent = contact.statusOffline;
    profilePhone.textContent = contact.phone;
    profileBio.textContent = contact.bio;
    profileUsername.textContent = contact.username;
    profileAvatar.style.backgroundColor = contact.avatarColor;
    profileAvatar.dataset.initial = contact.initial;
    profileAvatar.textContent = '';

    const blocked = getMeta(contactId).blocked;
    profileBlockButton.textContent = blocked ? 'Разблокировать' : 'Заблокировать';
    profileBlockButton.classList.toggle('red', !blocked);

    // hide block/share for saved
    const isSaved = contactId === 'saved';
    profileBlockButton.style.display = isSaved ? 'none' : '';
    profileShareButton.style.display = isSaved ? 'none' : '';
    profileSendButton.textContent = 'Открыть чат';
}

function showProfileView() {
    if (currentChatId) navigateToView('profile');
}

// =====================================================================
// Settings view
// =====================================================================
function refreshSettingsView() {
    if (themeToggle) themeToggle.checked = settings.theme === 'dark';
    if (soundToggle) soundToggle.checked = !!settings.sound;
}

// =====================================================================
// Contacts view
// =====================================================================
function populateContactsList() {
    contactsList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    contactsTitle.textContent = pendingChatPicker ? 'Начать новый чат' : 'Контакты';

    Object.values(contacts)
        .filter(c => c.id !== 'saved' || pendingChatPicker)
        .forEach(contact => {
            const item = document.createElement('div');
            item.classList.add('contacts-list-item');
            item.dataset.contactId = contact.id;
            item.tabIndex = 0;
            item.innerHTML = `
                <div class="avatar avatar-placeholder" data-initial="${escapeHtml(contact.initial)}" style="background-color: ${escapeHtml(contact.avatarColor)};"></div>
                <div class="contacts-list-info">
                    <div class="contacts-list-name">${escapeHtml(contact.name)}</div>
                    <div class="contacts-list-status">${escapeHtml(contact.statusOnline)}</div>
                </div>
            `;
            fragment.appendChild(item);
        });
    contactsList.appendChild(fragment);
}

// =====================================================================
// Search
// =====================================================================
function openSearch() {
    searchBar.classList.remove('hidden');
    searchInput.value = '';
    setTimeout(() => searchInput.focus(), 50);
}
function closeSearch() {
    searchBar.classList.add('hidden');
    searchInput.value = '';
    populateChatList('');
}

// =====================================================================
// Emoji picker
// =====================================================================
const EMOJIS = ['😀','😁','😂','🤣','😊','😍','😎','🤔','😉','🙃','😴','🥳',
                '🥺','😭','😡','👍','👎','👏','🙏','🔥','✨','❤️','💔','🎉',
                '🚀','💡','📌','💬','👀','🤝','🎁','☕','🍕','⚡','🌟','🌈'];

function buildEmojiPicker() {
    if (emojiPicker.dataset.built === '1') return;
    EMOJIS.forEach(em => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.classList.add('emoji-button-cell');
        btn.textContent = em;
        btn.addEventListener('click', () => {
            insertAtCursor(messageInput, em);
            toggleSendButton();
            messageInput.focus();
        });
        emojiPicker.appendChild(btn);
    });
    emojiPicker.dataset.built = '1';
}
function insertAtCursor(input, text) {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.value = input.value.slice(0, start) + text + input.value.slice(end);
    input.selectionStart = input.selectionEnd = start + text.length;
}
function toggleEmojiPicker() {
    emojiPicker.classList.toggle('hidden');
}
function closeEmojiPicker() {
    emojiPicker.classList.add('hidden');
}

// =====================================================================
// Other helpers
// =====================================================================
function scrollToBottom(force) {
    if (force) {
        setTimeout(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }, 50);
    } else {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function resetChatInput() {
    messageInput.value = '';
    toggleSendButton();
}

function toggleSendButton() {
    if (messageInput.value.trim() !== '') {
        sendButton.classList.remove('hidden');
        micButton.classList.add('hidden');
    } else {
        sendButton.classList.add('hidden');
        micButton.classList.remove('hidden');
    }
}

function handleInputKeypress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// =====================================================================
// Wire up event listeners
// =====================================================================
function setupEventListeners() {
    // input/send
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', handleInputKeypress);
    messageInput.addEventListener('input', toggleSendButton);
    micButton.addEventListener('click', () => showToast('Голосовые сообщения скоро появятся'));
    document.getElementById('attach-button').addEventListener('click', () =>
        showToast('Прикрепление файлов скоро появится'));
    emojiButton.addEventListener('click', toggleEmojiPicker);

    backButtonChat.addEventListener('click', () => navigateToView('menu'));
    chatList.addEventListener('click', handleChatListClick);
    chatList.addEventListener('keydown', handleChatListKeydown);
    chatList.addEventListener('contextmenu', handleChatListContextMenu);
    chatHeaderClickable.addEventListener('click', showProfileView);
    chatHeaderClickable.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showProfileView(); }
    });

    // Profile actions
    profileBackButton.addEventListener('click', () => navigateToView('chat', currentChatId));
    profileSendButton.addEventListener('click', () => navigateToView('chat', currentChatId));
    profileShareButton.addEventListener('click', () => {
        const c = contacts[currentChatId];
        if (!c) return;
        const text = `${c.name} (${c.username})`;
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(
                () => showToast('Контакт скопирован в буфер'),
                () => showToast('Не удалось скопировать', 'error')
            );
        } else {
            showToast(`Поделиться: ${text}`);
        }
    });
    profileBlockButton.addEventListener('click', () => {
        const id = currentChatId;
        if (!id) return;
        const meta = getMeta(id);
        meta.blocked = !meta.blocked;
        saveContactMeta();
        showToast(meta.blocked ? 'Контакт заблокирован' : 'Контакт разблокирован');
        loadProfile(id);
    });
    profileClearButton.addEventListener('click', () => {
        const id = currentChatId;
        if (!id) return;
        if (confirm(`Очистить переписку с ${contacts[id].name}?`)) {
            contacts[id].messages = [];
            saveMessagesToStorage();
            showToast('Переписка очищена');
        }
    });

    // Side menu
    hamburgerButton.addEventListener('click', toggleSideMenu);
    hamburgerButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSideMenu(); }
    });
    menuOverlay.addEventListener('click', closeSideMenu);

    sideMenuUserButton.addEventListener('click', () => {
        closeSideMenu();
        navigateToView('edit-profile');
    });

    document.querySelectorAll('.side-menu-list li[data-action]').forEach(li => {
        li.tabIndex = 0;
        const trigger = () => {
            const action = li.dataset.action;
            closeSideMenu();
            switch (action) {
                case 'new-group':
                    showToast('Группы появятся в следующей версии');
                    break;
                case 'contacts':
                    pendingChatPicker = false;
                    navigateToView('contacts');
                    break;
                case 'calls':
                    showToast('Звонки скоро будут доступны');
                    break;
                case 'people-nearby':
                    showToast('Геолокация недоступна в демо');
                    break;
                case 'saved-messages':
                    navigateToView('chat', 'saved');
                    break;
                case 'settings':
                    navigateToView('settings');
                    break;
                case 'telegram-features':
                    showToast('Откройте чат с HouseGram Bot и спросите!');
                    navigateToView('chat', 'helper');
                    break;
                default:
                    showToast('Скоро будет доступно');
            }
        };
        li.addEventListener('click', trigger);
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
        });
    });

    // Search
    searchIcon.addEventListener('click', openSearch);
    searchClose.addEventListener('click', closeSearch);
    searchInput.addEventListener('input', () => populateChatList(searchInput.value));
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
    });

    // New chat
    newChatButton.addEventListener('click', () => {
        pendingChatPicker = true;
        navigateToView('contacts');
    });

    // Contacts
    contactsBackButton.addEventListener('click', () => {
        pendingChatPicker = false;
        navigateToView('menu');
    });
    contactsList.addEventListener('click', (e) => {
        const item = e.target.closest('.contacts-list-item');
        if (!item) return;
        const id = item.dataset.contactId;
        pendingChatPicker = false;
        // un-hide if previously hidden
        if (getMeta(id).hidden) {
            getMeta(id).hidden = false;
            saveContactMeta();
        }
        navigateToView('chat', id);
    });
    contactsList.addEventListener('keydown', (e) => {
        const item = e.target.closest('.contacts-list-item');
        if (!item) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pendingChatPicker = false;
            navigateToView('chat', item.dataset.contactId);
        }
    });

    // Settings
    settingsBackButton.addEventListener('click', () => navigateToView('menu'));
    themeToggle.addEventListener('change', () => {
        settings.theme = themeToggle.checked ? 'dark' : 'light';
        saveSettings();
        applyTheme();
        showToast(`Тема: ${settings.theme === 'dark' ? 'тёмная' : 'светлая'}`);
    });
    soundToggle.addEventListener('change', () => {
        settings.sound = soundToggle.checked;
        saveSettings();
        showToast(`Звук уведомлений: ${settings.sound ? 'вкл' : 'выкл'}`);
    });
    settingsEditProfile.addEventListener('click', () => navigateToView('edit-profile'));
    settingsClearAll.addEventListener('click', () => {
        if (!confirm('Удалить ВСЕ переписки?')) return;
        Object.values(contacts).forEach(c => { c.messages = []; c.unread = 0; });
        saveMessagesToStorage();
        showToast('Все переписки очищены');
    });

    // Edit profile
    editProfileBack.addEventListener('click', () => navigateToView('menu'));
    editProfileSave.addEventListener('click', () => {
        const newName = editProfileNameInput.value.trim();
        const newPhone = editProfilePhoneInput.value.trim();
        if (!newName) {
            showToast('Имя не может быть пустым', 'error');
            return;
        }
        user.name = newName;
        user.phone = newPhone || user.phone;
        user.initial = (newName.charAt(0) || '?').toUpperCase();
        saveUser();
        refreshSideMenuUser();
        showToast('Профиль сохранён', 'success');
        navigateToView('menu');
    });

    // Context menu global hide
    document.addEventListener('click', (e) => {
        if (contextMenu.style.display === 'block' && !contextMenu.contains(e.target)) {
            hideContextMenu();
        }
        // close emoji picker if click outside
        if (!emojiPicker.classList.contains('hidden') &&
            !emojiPicker.contains(e.target) && e.target !== emojiButton &&
            !emojiButton.contains(e.target)) {
            closeEmojiPicker();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideContextMenu();
            closeEmojiPicker();
            if (sideMenu.classList.contains('open')) closeSideMenu();
        }
    });
    contextMenu.addEventListener('click', handleContextAction);
}

// =====================================================================
// Init
// =====================================================================
function init() {
    loadMessagesFromStorage();
    applyTheme();
    refreshSideMenuUser();
    buildEmojiPicker();
    setupEventListeners();
    populateChatList();
    navigateToView('menu');
}

init();
