// --- DOM Elements ---
const menuView = document.getElementById('menu-view');
const chatView = document.getElementById('chat-view');
const profileView = document.getElementById('profile-view');
const settingsView = document.getElementById('settings-view');
const chatList = document.getElementById('chat-list');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const micButton = document.getElementById('mic-button');
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
const settingsBackButton = document.getElementById('settings-back-button');
const searchButton = document.getElementById('search-button');
const newChatButton = document.getElementById('new-chat-button');
const chatInputForm = document.getElementById('chat-input-form');

// Side Menu Elements
const hamburgerButton = document.getElementById('hamburger-button');
const sideMenu = document.getElementById('side-menu');
const menuOverlay = document.getElementById('menu-overlay');
const sideMenuList = sideMenu ? sideMenu.querySelector('.side-menu-list') : null;

// --- Contact Data ---
const contacts = {
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
    }
};

// --- State ---
let currentChatId = null;
let activeView = 'menu';

const STORAGE_KEY = 'housegram_messages_v1';

/**
 * Загружает сохранённые сообщения из localStorage
 */
function loadMessagesFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Восстанавливаем сообщения для каждого контакта
            Object.keys(parsed).forEach(contactId => {
                if (contacts[contactId]) {
                    contacts[contactId].messages = parsed[contactId];
                }
            });
        }
    } catch (e) {
        console.error('Ошибка загрузки из localStorage:', e);
    }
}

/**
 * Сохраняет все сообщения в localStorage
 */
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

// --- Helper Functions ---
/**
 * Экранирует HTML-символы для предотвращения XSS-атак
 * @param {string} text - Текст для экранирования
 * @returns {string} - Безопасный HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- Event Listeners ---
sendButton.addEventListener('click', sendMessage);
sendButton.addEventListener('keydown', handleActivationKey(sendMessage));
messageInput.addEventListener('keypress', handleInputKeypress);
messageInput.addEventListener('input', toggleSendButton);
if (chatInputForm) {
    chatInputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage();
    });
}
backButtonChat.addEventListener('click', () => navigateToView('menu'));
backButtonChat.addEventListener('keydown', handleActivationKey(() => navigateToView('menu')));
chatList.addEventListener('click', handleChatListClick);
chatList.addEventListener('keydown', handleChatListKeydown);
chatHeaderClickable.addEventListener('click', showProfileView);
chatHeaderClickable.addEventListener('keydown', handleActivationKey(showProfileView));
profileBackButton.addEventListener('click', handleProfileBack);
profileBackButton.addEventListener('keydown', handleActivationKey(handleProfileBack));
hamburgerButton.addEventListener('click', toggleSideMenu);
hamburgerButton.addEventListener('keydown', handleActivationKey(toggleSideMenu));
menuOverlay.addEventListener('click', closeSideMenu); // Close menu on overlay click
if (sideMenuList) {
    sideMenuList.addEventListener('click', handleSideMenuClick);
    sideMenuList.addEventListener('keydown', handleSideMenuKeydown);
    // Make side menu items keyboard-focusable
    sideMenuList.querySelectorAll('li[data-action]').forEach((li) => {
        li.setAttribute('tabindex', '0');
        li.setAttribute('role', 'menuitem');
    });
}
if (settingsBackButton) {
    settingsBackButton.addEventListener('click', () => navigateToView('menu'));
    settingsBackButton.addEventListener('keydown', handleActivationKey(() => navigateToView('menu')));
}
if (searchButton) {
    searchButton.addEventListener('click', handleSearchClick);
    searchButton.addEventListener('keydown', handleActivationKey(handleSearchClick));
}
if (newChatButton) {
    newChatButton.addEventListener('click', handleNewChatClick);
}
// Close side menu on Escape key for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
        closeSideMenu();
    }
});

// --- Initial Setup ---
loadMessagesFromStorage();
populateChatList();
navigateToView('menu');

// --- Side Menu ---
function toggleSideMenu() {
    const isOpen = sideMenu.classList.contains('open');
    if (isOpen) {
        closeSideMenu();
    } else {
        openSideMenu();
    }
}

function openSideMenu() {
    sideMenu.classList.add('open');
    menuOverlay.classList.add('open');
}

function closeSideMenu() {
    sideMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
}

function handleSideMenuClick(event) {
    const item = event.target.closest('li[data-action]');
    if (!item) return;
    handleSideMenuAction(item.dataset.action);
}

function handleSideMenuKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const item = event.target.closest('li[data-action]');
    if (!item) return;
    event.preventDefault();
    handleSideMenuAction(item.dataset.action);
}

function handleSideMenuAction(action) {
    closeSideMenu();
    switch (action) {
        case 'settings':
            navigateToView('settings');
            break;
        case 'saved-messages':
            // Open chat with the only available contact as a placeholder for "Saved Messages".
            if (contacts.durov) {
                navigateToView('chat', 'durov');
            }
            break;
        case 'new-group':
        case 'contacts':
        case 'calls':
        case 'people-nearby':
        case 'telegram-features':
            showToast('Скоро будет доступно');
            break;
        default:
            // No-op for unknown actions
            break;
    }
}

function handleProfileBack() {
    if (currentChatId && contacts[currentChatId]) {
        navigateToView('chat', currentChatId);
    } else {
        navigateToView('menu');
    }
}

function handleSearchClick() {
    showToast('Поиск пока не реализован');
}

function handleNewChatClick() {
    showToast('Новый чат пока не доступен');
}

function handleActivationKey(action) {
    return (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    };
}

function handleChatListKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const item = event.target.closest('.chat-list-item');
    if (!item) return;
    event.preventDefault();
    const contactId = item.dataset.contactId;
    if (contactId) navigateToView('chat', contactId);
}

// --- Lightweight toast notification (no external deps) ---
let toastTimeoutId = null;
function showToast(message) {
    let toast = document.getElementById('hg-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'hg-toast';
        toast.className = 'hg-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    toastTimeoutId = setTimeout(() => {
        toast.classList.remove('visible');
    }, 2200);
}

// --- View Navigation ---
function navigateToView(viewId, data = null) {
    activeView = viewId;

    // Скрываем все виды сразу
    menuView.classList.add('hidden');
    chatView.classList.add('hidden');
    profileView.classList.add('hidden');
    if (settingsView) settingsView.classList.add('hidden');

    let targetView;
    switch (viewId) {
        case 'menu':
            targetView = menuView;
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
            // Mark messages as read when entering the chat
            if (contacts[data].unread) {
                contacts[data].unread = 0;
                updateUnreadBadge(data);
            }
            targetView = chatView;
            loadChat(currentChatId);
            break;
        case 'profile':
            if (!currentChatId || !contacts[currentChatId]) {
                console.error('Cannot open profile without active chat:', currentChatId);
                navigateToView('menu');
                return;
            }
            targetView = profileView;
            loadProfile(currentChatId);
            break;
        case 'settings':
            if (!settingsView) {
                navigateToView('menu');
                return;
            }
            targetView = settingsView;
            break;
        default:
            targetView = menuView;
            activeView = 'menu';
    }

    targetView.classList.remove('hidden');
}

/**
 * Updates only the unread badge for a chat list item without rebuilding the list.
 * @param {string} contactId - ID of the contact whose badge to update.
 */
function updateUnreadBadge(contactId) {
    const contact = contacts[contactId];
    if (!contact) return;
    const listItem = chatList.querySelector(`.chat-list-item[data-contact-id="${contactId}"]`);
    if (!listItem) return;
    const metaElement = listItem.querySelector('.chat-list-meta');
    if (!metaElement) return;
    let unreadElement = metaElement.querySelector('.unread-count');
    if (contact.unread > 0) {
        if (!unreadElement) {
            unreadElement = document.createElement('div');
            unreadElement.classList.add('unread-count');
            metaElement.appendChild(unreadElement);
        }
        unreadElement.textContent = contact.unread;
    } else if (unreadElement) {
        unreadElement.remove();
    }
}

function populateChatList() {
    const fragment = document.createDocumentFragment();
    chatList.innerHTML = '';

    const sortedContacts = Object.values(contacts).sort((a, b) => {
        const timeA = a.messages.length > 0 ? parseTime(a.messages[a.messages.length - 1].time) : 0;
        const timeB = b.messages.length > 0 ? parseTime(b.messages[b.messages.length - 1].time) : 0;
        return timeB - timeA;
    });

    sortedContacts.forEach(contact => {
        const lastMessage = contact.messages[contact.messages.length - 1] || { text: '', time: '' };
        const previewText = lastMessage.type === 'sent' ? `Вы: ${lastMessage.text}` : lastMessage.text;

        const item = document.createElement('div');
        item.classList.add('chat-list-item');
        item.dataset.contactId = contact.id;
        item.setAttribute('role', 'listitem');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Открыть чат с ${contact.name}`);

        const unreadBadge = contact.unread > 0
            ? `<div class="unread-count">${contact.unread}</div>`
            : '';

        item.innerHTML = `
            <div class="avatar avatar-placeholder" data-initial="${contact.initial}" style="background-color: ${contact.avatarColor};"></div>
            <div class="chat-list-info">
                <div class="chat-list-name">${escapeHtml(contact.name)}</div>
                <div class="chat-list-preview">${escapeHtml(previewText.substring(0, 40))}${previewText.length > 40 ? '...' : ''}</div>
            </div>
            <div class="chat-list-meta">
                <div class="chat-list-time">${escapeHtml(lastMessage.time)}</div>
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

function handleInputKeypress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
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

// --- Chat Functions ---
function loadChat(contactId) {
    if (!contacts[contactId]) {
        console.error('Contact not found:', contactId);
        return;
    }
    const contact = contacts[contactId];
    currentChatId = contactId;

    chatHeaderAvatar.textContent = '';
    chatHeaderAvatar.dataset.initial = contact.initial;
    chatHeaderAvatar.style.backgroundColor = contact.avatarColor;
    chatHeaderName.textContent = contact.name;
    chatStatus.textContent = contact.isTyping ? 'печатает...' : contact.statusOffline;

    // Полная очистка и пересоздание содержимого
    chatMessages.innerHTML = '';

    // Сразу добавляем индикатор набора в DOM
    chatMessages.appendChild(typingIndicatorContainer);

    // Показываем пустое состояние если нет сообщений
    if (contact.messages.length === 0) {
        showEmptyState(contact.name);
    } else {
        contact.messages.forEach(msg => addMessageToDOM(msg.text, msg.type, msg.time));
    }

    if (contact.isTyping) {
        typingIndicatorContainer.classList.remove('hidden');
    } else {
        typingIndicatorContainer.classList.add('hidden');
    }

    scrollToBottom(true);
    toggleSendButton();
    messageInput.focus();
}

/**
 * Отображает пустое состояние чата
 * @param {string} contactName - Имя собеседника
 */
function showEmptyState(contactName) {
    const emptyState = document.createElement('div');
    emptyState.classList.add('empty-state');
    emptyState.innerHTML = `
        <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V17C3 16.4696 2.78929 15.9609 2.41421 15.5858C2.03914 15.2107 1.82843 14.702 1.82843 14.1716V7C1.82843 5.93913 2.25086 4.92172 3.00289 4.16971C3.75493 3.41771 4.77235 2.99529 5.83321 2.99529H19C20.0609 2.99529 21.0783 3.41771 21.8303 4.16971C22.5824 4.92172 23.0048 5.93913 23.0048 7V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="empty-state-title">Нет сообщений</div>
        <div class="empty-state-text">Напишите сообщение, чтобы начать диалог с ${escapeHtml(contactName)}</div>
    `;
    chatMessages.appendChild(emptyState);
}

function addMessageToDOM(text, type, time) {
    // Скрываем пустое состояние если оно есть
    const emptyState = chatMessages.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

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

    // Всегда добавляем в конец, перед индикатором набора
    const typingIndicator = chatMessages.querySelector('#typing-indicator-container');
    if (typingIndicator) {
        chatMessages.insertBefore(messageElement, typingIndicator);
    } else {
        chatMessages.appendChild(messageElement);
    }

    scrollToBottom();
}

/**
 * Appends a message to a contact's history and persists it.
 * @param {string} contactId
 * @param {string} text
 * @param {'sent'|'received'} type
 * @param {string} time
 */
function pushMessage(contactId, text, type, time) {
    const contact = contacts[contactId];
    if (!contact) return;
    contact.messages.push({ text, type, time });
    saveMessagesToStorage();
}

/**
 * Updates the visual chat-list item (preview/time/unread badge) for a contact.
 * Does NOT modify the contact's messages array — callers should call pushMessage first.
 */
function updateChatListPreview(contactId, text, type, time) {
    const contact = contacts[contactId];
    if (!contact) return;

    const timeString = time || getCurrentTime();
    const previewText = type === 'sent' ? `Вы: ${text}` : text;

    // Find the list item
    const listItem = chatList.querySelector(`.chat-list-item[data-contact-id="${contactId}"]`);

    if (listItem) {
        const previewElement = listItem.querySelector('.chat-list-preview');
        const timeElement = listItem.querySelector('.chat-list-time');
        const metaElement = listItem.querySelector('.chat-list-meta');

        if (previewElement) {
            previewElement.textContent = previewText.substring(0, 40) + (previewText.length > 40 ? '...' : '');
        }
        if (timeElement) {
            timeElement.textContent = timeString;
        }

        // Update or add unread badge
        if (metaElement) {
            let unreadElement = metaElement.querySelector('.unread-count');
            if (contact.unread > 0) {
                if (!unreadElement) {
                    unreadElement = document.createElement('div');
                    unreadElement.classList.add('unread-count');
                    metaElement.appendChild(unreadElement);
                }
                unreadElement.textContent = contact.unread;
            } else if (unreadElement) {
                unreadElement.remove();
            }
        }

        // Move the updated item to the top
        chatList.prepend(listItem);
    } else {
        // Regenerate the list if item wasn't found (less efficient but ensures consistency)
        populateChatList();
    }
}

function sendMessage() {
    const messageText = messageInput.value.trim();
    const contact = contacts[currentChatId];

    if (messageText === '' || !contact || contact.isTyping) {
        return;
    }

    const timeString = getCurrentTime();
    addMessageToDOM(messageText, 'sent', timeString);
    pushMessage(currentChatId, messageText, 'sent', timeString);
    updateChatListPreview(currentChatId, messageText, 'sent', timeString);
    messageInput.value = '';
    toggleSendButton();

    simulateTypingAndResponse(currentChatId, messageText);
}

function simulateTypingAndResponse(contactId, userMessage) {
    const contact = contacts[contactId];
    if (!contact) return;

    contact.isTyping = true;
    if (currentChatId === contactId) {
        typingIndicatorContainer.classList.remove('hidden');
        chatStatus.textContent = 'печатает...';
        scrollToBottom();
    }

    if (contact.typingTimeout) {
        clearTimeout(contact.typingTimeout);
    }

    const typingDelay = 800 + Math.random() * 2500;

    contact.typingTimeout = setTimeout(() => {
        const response = contact.generateResponse(userMessage);
        const responseTime = getCurrentTime();

        // Persist message exactly once
        pushMessage(contactId, response, 'received', responseTime);

        if (currentChatId === contactId) {
            addMessageToDOM(response, 'received', responseTime);
        } else {
            // Only increment unread when chat is not currently open
            contact.unread = (contact.unread || 0) + 1;
        }
        updateChatListPreview(contactId, response, 'received', responseTime);

        contact.isTyping = false;
        if (currentChatId === contactId) {
            typingIndicatorContainer.classList.add('hidden');
            chatStatus.textContent = contact.statusOnline; // Show 'online' briefly

            setTimeout(() => {
                // Revert to offline status only if still in the same chat and not typing again
                if (!contact.isTyping && currentChatId === contactId) {
                    chatStatus.textContent = contact.statusOffline;
                }
            }, 5000); // Revert after 5 seconds
        }

        contact.typingTimeout = null;
    }, typingDelay);
}

// --- Specific AI Response Generators ---
function generateDurovResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();
    let response = "Интересно. Расскажи подробнее.";

    if (/\b(привет|здравствуй|добрый день|hello|hi)\b/.test(lowerCaseMessage)) {
        response = ["Привет!", "Здравствуйте!", "Приветствую."][Math.floor(Math.random() * 3)];
    } else if (/\b(как дела|что нового|how are you)\b/.test(lowerCaseMessage)) {
        response = ["Всё отлично, работаем над будущим.", "Много планов, много работы.", "В процессе создания новых идей."][Math.floor(Math.random() * 3)];
    } else if (/\b(telegram|телеграм|телега)\b/.test(lowerCaseMessage)) {
        response = "Telegram — это символ свободы и безопасности в цифровом мире.";
    } else if (/\b(ton|крипто|crypto|блокчейн|blockchain)\b/.test(lowerCaseMessage)) {
        response = "Технологии вроде TON открывают путь к децентрализованному будущему.";
    } else if (/\b(свобод|цензур|privacy|приватность)\b/.test(lowerCaseMessage)) {
        response = "Защита приватности и свобода информации — не привилегия, а необходимость.";
    } else if (/\b(дуров|durov|павел)\b/.test(lowerCaseMessage)) {
        response = "Да, это я. Чем могу быть полезен?";
    } else if (/\b(инвестиции|деньги|бизнес)\b/.test(lowerCaseMessage)) {
        response = "Фокусируйтесь на создании ценности, а не на погоне за деньгами.";
    } else if (/\b(вконтакте|vk)\b/.test(lowerCaseMessage)) {
        response = "Это был важный этап, но прошлое должно оставаться в прошлом.";
    } else if (/\b(россия|russia)\b/.test(lowerCaseMessage)) {
        response = "Ситуация сложная. Важно сохранять независимость мышления.";
    } else if (/\b(почему|зачем|как)\b/.test(lowerCaseMessage) && lowerCaseMessage.includes("?")) {
        response = ["Хороший вопрос. Мир сложнее, чем кажется.", "Иногда ответ кроется в самом вопросе.", "Стоит задуматься."][Math.floor(Math.random() * 3)];
    } else if (lowerCaseMessage.endsWith("?")) {
        response = ["Над этим стоит подумать.", "Неоднозначный вопрос.", "Что вы сами думаете по этому поводу?"][Math.floor(Math.random() * 3)];
    } else if (/\b(спасибо|благодарю|thanks)\b/.test(lowerCaseMessage)) {
        response = "Пожалуйста.";
    } else if (lowerCaseMessage.length < 6) {
        response = ["Хм.", "Ок.", "Понятно."][Math.floor(Math.random() * 3)];
    } else if (Math.random() < 0.2) {
        response = [
            "Важно мыслить независимо.",
            "Мир меняется быстро, нужно адаптироваться.",
            "Технологии дают невероятные возможности.",
            "Сосредоточьтесь на главном.",
            "Будущее создается сегодня."
        ][Math.floor(Math.random() * 5)];
    }

    return response;
}

// --- Profile Functions ---
function showProfileView() {
    if (currentChatId) {
        navigateToView('profile');
    }
}

function loadProfile(contactId) {
    if (!contacts[contactId]) return;
    const contact = contacts[contactId];

    profileName.textContent = contact.name;
    // Adjust status display for profile view
    let profileStatusText = contact.statusOffline;
    if (contact.statusOffline.startsWith('был(а) в')) { // Handle historical status
       profileStatusText = contact.statusOffline;
    } else if (contact.statusOffline.startsWith('last seen')) { // Handle English status
        profileStatusText = `был(а) ${contact.statusOffline.replace('last seen ', '')}`;
    } else {
        profileStatusText = contact.statusOffline; // Use as is if already Russian
    }
    profileStatus.textContent = profileStatusText;

    profilePhone.textContent = contact.phone;
    profileBio.textContent = contact.bio;
    profileUsername.textContent = contact.username;
    profileAvatar.style.backgroundColor = contact.avatarColor;
    profileAvatar.dataset.initial = contact.initial;
    profileAvatar.textContent = ''; // Ensure no text content if using data-initial
}

// --- Helper Functions ---
function scrollToBottom(force) {
    if (force) {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
    } else {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function getCurrentTime() {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return timeString;
}

// Helper function to parse time for sorting (basic implementation)
function parseTime(timeString) {
    if (!timeString) return 0;
    const lower = timeString.toLowerCase();
    if (lower === 'yesterday' || lower === 'вчера') {
        return new Date().setHours(0, 0, 0, 0) - 86400000; // Approx yesterday midnight
    }
    if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':').map(Number);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        // If the time is in the future compared to now, assume it's from yesterday
        if (date > new Date()) {
            date.setDate(date.getDate() - 1);
        }
        return date.getTime();
    }
    // Handle historical dates or other formats crudely
    if (/^\d{4}$/.test(timeString)) { // If it looks like a year
        return new Date(parseInt(timeString, 10), 0, 1).getTime();
    }
    return 0; // Default for unparseable formats
}

function resetChatInput() {
    messageInput.value = '';
    toggleSendButton();
}