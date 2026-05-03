/* HouseGram — полнофункциональный мессенджер.
 * Vanilla JS, без сборщиков. Состояние сохраняется в localStorage.
 */

// ================================================================
// Локализация
// ================================================================
const I18N = {
    ru: {
        chats: 'Чаты',
        searchPlaceholder: 'Поиск',
        messagePlaceholder: 'Сообщение',
        info: 'Инфо',
        settings: 'Настройки',
        sendMessage: 'Отправить сообщение',
        shareContact: 'Поделиться контактом',
        block: 'Заблокировать',
        unblock: 'Разблокировать',
        blocked: 'Контакт заблокирован',
        blockedHint: 'Разблокируйте, чтобы отправлять сообщения',
        emptyTitle: 'Нет сообщений',
        emptyText: 'Напишите сообщение, чтобы начать диалог с',
        statusOffline: 'был(а) недавно',
        statusOnline: 'в сети',
        statusTyping: 'печатает...',
        sentByYou: 'Вы:',
        photo: 'Фото',
        contacts: 'Контакты',
        newGroup: 'Новая группа',
        savedMessages: 'Избранное',
        savedMessagesHint: 'Заметки и сохранённые сообщения',
        calls: 'Звонки',
        peopleNearby: 'Люди рядом',
        telegramFeatures: 'Возможности Telegram',
        about: 'О HouseGram',
        aboutBody: 'HouseGram — учебный клон Telegram. Все собеседники — AI-боты с разными личностями. Сохранение в localStorage.',
        notifications: 'Уведомления и звуки',
        privacy: 'Конфиденциальность',
        dataAndStorage: 'Данные и память',
        appearance: 'Оформление',
        language: 'Язык',
        help: 'Помощь',
        questions: 'Вопросы о Telegram',
        theme: 'Тёмная тема',
        clearData: 'Очистить все чаты',
        clearDataConfirm: 'Удалить все сообщения во всех чатах?',
        editProfile: 'Редактировать профиль',
        save: 'Сохранить',
        cancel: 'Отмена',
        create: 'Создать',
        copy: 'Копировать',
        delete: 'Удалить',
        copied: 'Скопировано',
        contactCopied: 'Контакт скопирован',
        chatsCleared: 'Все чаты очищены',
        nameLabel: 'Имя',
        phoneLabel: 'Телефон',
        bioLabel: 'О себе',
        chooseContacts: 'Выберите контакты',
        groupName: 'Название группы',
        callsEmpty: 'Нет звонков',
        peopleEmpty: 'Никого нет рядом',
        attachMenu: 'Что прикрепить?',
        attachImage: 'Изображение',
        attachEmoji: 'Эмодзи',
        today: 'Сегодня',
        yesterday: 'Вчера',
        weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
        you: 'Вы',
    },
    en: {
        chats: 'Chats',
        searchPlaceholder: 'Search',
        messagePlaceholder: 'Message',
        info: 'Info',
        settings: 'Settings',
        sendMessage: 'Send Message',
        shareContact: 'Share Contact',
        block: 'Block User',
        unblock: 'Unblock User',
        blocked: 'You blocked this contact',
        blockedHint: 'Unblock to send messages',
        emptyTitle: 'No messages yet',
        emptyText: 'Write a message to start a conversation with',
        statusOffline: 'last seen recently',
        statusOnline: 'online',
        statusTyping: 'typing...',
        sentByYou: 'You:',
        photo: 'Photo',
        contacts: 'Contacts',
        newGroup: 'New Group',
        savedMessages: 'Saved Messages',
        savedMessagesHint: 'Notes and saved messages',
        calls: 'Calls',
        peopleNearby: 'People Nearby',
        telegramFeatures: 'Telegram Features',
        about: 'About HouseGram',
        aboutBody: 'HouseGram is a Telegram-style messenger clone. All contacts are AI bots with distinct personalities. Stored in localStorage.',
        notifications: 'Notifications and Sounds',
        privacy: 'Privacy and Security',
        dataAndStorage: 'Data and Storage',
        appearance: 'Appearance',
        language: 'Language',
        help: 'Help',
        questions: 'Telegram FAQ',
        theme: 'Dark theme',
        clearData: 'Clear all chats',
        clearDataConfirm: 'Delete all messages in all chats?',
        editProfile: 'Edit profile',
        save: 'Save',
        cancel: 'Cancel',
        create: 'Create',
        copy: 'Copy',
        delete: 'Delete',
        copied: 'Copied',
        contactCopied: 'Contact copied',
        chatsCleared: 'All chats cleared',
        nameLabel: 'Name',
        phoneLabel: 'Phone',
        bioLabel: 'Bio',
        chooseContacts: 'Choose contacts',
        groupName: 'Group name',
        callsEmpty: 'No calls yet',
        peopleEmpty: 'No one nearby',
        attachMenu: 'Attach',
        attachImage: 'Image',
        attachEmoji: 'Emoji',
        today: 'Today',
        yesterday: 'Yesterday',
        weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        you: 'You',
    },
};

function t(key) {
    const lang = state.language in I18N ? state.language : 'ru';
    return I18N[lang][key] ?? key;
}

// ================================================================
// AI генераторы ответов
// ================================================================
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateDurovResponse(msg) {
    const m = msg.toLowerCase();
    if (/\b(привет|здравствуй|добрый|hello|hi)\b/.test(m)) return pick(['Привет!', 'Здравствуйте!', 'Приветствую.']);
    if (/\b(как дела|что нового|how are you)\b/.test(m)) return pick(['Всё отлично, работаем над будущим.', 'Много планов, много работы.', 'В процессе создания новых идей.']);
    if (/\b(telegram|телеграм|телега)\b/.test(m)) return 'Telegram — это символ свободы и безопасности в цифровом мире.';
    if (/\b(ton|крипто|crypto|блокчейн|blockchain)\b/.test(m)) return 'Технологии вроде TON открывают путь к децентрализованному будущему.';
    if (/\b(свобод|цензур|privacy|приватность)\b/.test(m)) return 'Защита приватности и свобода информации — не привилегия, а необходимость.';
    if (/\b(дуров|durov|павел)\b/.test(m)) return 'Да, это я. Чем могу быть полезен?';
    if (/\b(вконтакте|vk)\b/.test(m)) return 'Это был важный этап, но прошлое должно оставаться в прошлом.';
    if (/\b(деньг|бизнес|инвестиц)\b/.test(m)) return 'Фокусируйтесь на создании ценности, а не на погоне за деньгами.';
    if (/\b(спасибо|благодарю|thanks)\b/.test(m)) return 'Пожалуйста.';
    if (m.endsWith('?')) return pick(['Хороший вопрос. Мир сложнее, чем кажется.', 'Иногда ответ кроется в самом вопросе.', 'Стоит задуматься.']);
    if (m.length < 6) return pick(['Хм.', 'Ок.', 'Понятно.']);
    if (Math.random() < 0.25) {
        return pick([
            'Важно мыслить независимо.',
            'Мир меняется быстро, нужно адаптироваться.',
            'Технологии дают невероятные возможности.',
            'Сосредоточьтесь на главном.',
            'Будущее создается сегодня.',
        ]);
    }
    return pick(['Интересно. Расскажи подробнее.', 'Понял твою мысль.', 'Согласен.']);
}

function generateJobsResponse(msg) {
    const m = msg.toLowerCase();
    if (/\b(привет|здравствуй|hello|hi)\b/.test(m)) return pick(['Hello.', 'Привет.', 'Stay hungry, stay foolish.']);
    if (/\b(apple|айфон|iphone|mac)\b/.test(m)) return 'Дизайн — это не то, как вещь выглядит. Это то, как она работает.';
    if (/\b(дизайн|design)\b/.test(m)) return 'Простота — это высшая степень утончённости.';
    if (/\b(мотивация|совет|advice)\b/.test(m)) return 'Единственный способ делать великие вещи — любить то, что вы делаете.';
    if (/\b(работа|работ)\b/.test(m)) return 'Ваша работа займёт большую часть жизни. Делайте то, что считаете великим.';
    if (/\b(инновац|innovation)\b/.test(m)) return 'Инновации отличают лидера от догоняющего.';
    if (m.endsWith('?')) return pick(['Хороший вопрос. Думайте иначе.', 'Сначала надо отказаться от ста хороших идей, чтобы найти одну великую.']);
    if (Math.random() < 0.3) return pick(['Think different.', 'Качество важнее количества.', 'Будьте эталоном качества.']);
    return pick(['Интересно.', 'Это нужно довести до совершенства.', 'Покажите результат.']);
}

function generateMuskResponse(msg) {
    const m = msg.toLowerCase();
    if (/\b(привет|hello|hi)\b/.test(m)) return pick(['Hi.', '🚀', 'Привет.']);
    if (/\b(марс|mars|space|космос)\b/.test(m)) return 'Мы должны стать многопланетным видом. Марс ждёт.';
    if (/\b(tesla|тесла|электро)\b/.test(m)) return 'Электромобили — это не будущее, это уже настоящее.';
    if (/\b(ai|ии|искусственный)\b/.test(m)) return 'AI — самая большая возможность и самая большая угроза одновременно.';
    if (/\b(neuralink|мозг|brain)\b/.test(m)) return 'Интерфейс мозг-компьютер изменит всё.';
    if (/\b(twitter|x|tweet)\b/.test(m)) return 'X — это площадка свободы слова.';
    if (/\b(деньги|богат|money)\b/.test(m)) return 'Деньги нужны, чтобы решать большие проблемы человечества.';
    if (m.endsWith('?')) return pick(['Hmm 🤔', 'Возможно.', 'Интересный вопрос. First principles thinking.']);
    if (Math.random() < 0.3) return pick(['🚀', 'Lol', 'Concerning.', 'Excellent.', 'Ускоряем прогресс.']);
    return pick(['Cool.', 'Интересная идея.', 'Надо попробовать.']);
}

function generateGatesResponse(msg) {
    const m = msg.toLowerCase();
    if (/\b(привет|hello|hi)\b/.test(m)) return pick(['Hello.', 'Здравствуйте.']);
    if (/\b(microsoft|windows|майкрософт)\b/.test(m)) return 'Microsoft изменил мир, дав каждому человеку компьютер.';
    if (/\b(благотв|charity|фонд)\b/.test(m)) return 'Фонд Билла и Мелинды Гейтс направлен на спасение жизней через здравоохранение.';
    if (/\b(книг|book|чита)\b/.test(m)) return 'Я читаю около 50 книг в год. Чтение — лучшая инвестиция.';
    if (/\b(будущ|future)\b/.test(m)) return 'Технологии решат большинство проблем человечества, но требуют ответственности.';
    if (/\b(климат|climate)\b/.test(m)) return 'Климатический кризис — самый большой вызов нашего времени.';
    if (m.endsWith('?')) return pick(['Хороший вопрос. Нужно изучить данные.', 'Зависит от контекста.']);
    if (Math.random() < 0.3) return pick(['Согласен с этой мыслью.', 'Нужно больше данных.', 'Это требует анализа.']);
    return pick(['Интересно.', 'Хорошая мысль.', 'Стоит подумать.']);
}

function generateCookResponse(msg) {
    const m = msg.toLowerCase();
    if (/\b(привет|hello|hi)\b/.test(m)) return pick(['Hello!', 'Привет!']);
    if (/\b(privacy|приватность|конфиденциальность)\b/.test(m)) return 'Приватность — фундаментальное право человека.';
    if (/\b(apple|айфон)\b/.test(m)) return 'Apple создаёт продукты, которые обогащают жизни людей.';
    if (/\b(будущ|future)\b/.test(m)) return 'Будущее принадлежит тем, кто заботится о людях.';
    if (m.endsWith('?')) return pick(['Хороший вопрос. Нужно учитывать всё.', 'Давайте подумаем вместе.']);
    return pick(['Согласен.', 'Это важная тема.', 'Спасибо, что поделились.']);
}

// "Я" — пустой ответчик для Saved Messages — сообщения сохраняются без ответа
function generateSelfResponse() {
    return null; // null = ответа не будет
}

// ================================================================
// Состояние
// ================================================================
const STORAGE_KEY = 'housegram_state_v2';
const LEGACY_MESSAGES_KEY = 'housegram_messages_v1';

const DEFAULT_USER = {
    name: 'Ваше Имя',
    phone: '+7 9XX XXX XX XX',
    bio: 'Использую HouseGram',
    initial: 'В',
    avatarColor: '#ff9800',
};

function makeContact(overrides) {
    return {
        id: '',
        name: '',
        initial: '',
        avatarColor: '#517da2',
        statusOnline: 'в сети',
        statusOffline: 'был(а) недавно',
        phone: '',
        bio: '',
        username: '',
        messages: [],
        generateResponse: null,
        isTyping: false,
        typingTimeout: null,
        unread: 0,
        blocked: false,
        kind: 'bot',
        ...overrides,
    };
}

const DEFAULT_CONTACTS = () => ({
    saved: makeContact({
        id: 'saved',
        name: 'Избранное',
        initial: '★',
        avatarColor: '#3390ec',
        statusOnline: '',
        statusOffline: 'заметки и сохранённые сообщения',
        phone: '',
        bio: 'Сохраняйте здесь полезные сообщения. Только вы видите этот чат.',
        username: '@saved',
        kind: 'self',
        generateResponse: generateSelfResponse,
    }),
    durov: makeContact({
        id: 'durov',
        name: 'Pavel Durov',
        initial: 'P',
        avatarColor: '#517da2',
        phone: '+7 999 *** ****',
        bio: 'Создатель Telegram и VK.',
        username: '@durov',
        messages: [{ type: 'received', text: 'Привет! Чем могу помочь?', time: '10:00', date: dateKey(new Date()) }],
        generateResponse: generateDurovResponse,
    }),
    jobs: makeContact({
        id: 'jobs',
        name: 'Steve Jobs',
        initial: 'S',
        avatarColor: '#444444',
        phone: '+1 408 *** ****',
        bio: 'Co-founder of Apple. Stay hungry, stay foolish.',
        username: '@steve',
        messages: [{ type: 'received', text: 'Hello. Думайте иначе.', time: '09:30', date: dateKey(new Date()) }],
        generateResponse: generateJobsResponse,
    }),
    musk: makeContact({
        id: 'musk',
        name: 'Elon Musk',
        initial: 'E',
        avatarColor: '#0a0a0a',
        phone: '+1 650 *** ****',
        bio: 'Tesla, SpaceX, X, Neuralink. Multi-planetary species advocate.',
        username: '@elonmusk',
        messages: [{ type: 'received', text: 'Привет 🚀', time: '08:15', date: dateKey(new Date()) }],
        generateResponse: generateMuskResponse,
    }),
    gates: makeContact({
        id: 'gates',
        name: 'Bill Gates',
        initial: 'B',
        avatarColor: '#2f6fb6',
        phone: '+1 425 *** ****',
        bio: 'Co-founder of Microsoft. Co-chair of Bill & Melinda Gates Foundation.',
        username: '@billgates',
        messages: [{ type: 'received', text: 'Здравствуйте!', time: 'вчера', date: dateKey(addDays(new Date(), -1)) }],
        generateResponse: generateGatesResponse,
    }),
    cook: makeContact({
        id: 'cook',
        name: 'Tim Cook',
        initial: 'T',
        avatarColor: '#666666',
        phone: '+1 408 *** ****',
        bio: 'CEO of Apple.',
        username: '@tim_cook',
        messages: [{ type: 'received', text: 'Hello. Privacy matters.', time: 'вчера', date: dateKey(addDays(new Date(), -1)) }],
        generateResponse: generateCookResponse,
    }),
});

// Восстанавливаем функции-генераторы по id (т.к. функции в JSON не сохраняются)
const RESPONSE_MAP = {
    saved: generateSelfResponse,
    durov: generateDurovResponse,
    jobs: generateJobsResponse,
    musk: generateMuskResponse,
    gates: generateGatesResponse,
    cook: generateCookResponse,
};

const state = {
    user: { ...DEFAULT_USER },
    contacts: DEFAULT_CONTACTS(),
    groups: {},
    currentChatId: null,
    activeView: 'menu',
    theme: 'light',
    language: 'ru',
    notifications: true,
    chatOrder: [], // массив id для сохранения порядка
};

function dateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(d, days) {
    const r = new Date(d);
    r.setDate(r.getDate() + days);
    return r;
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.user) state.user = { ...DEFAULT_USER, ...parsed.user };
            if (parsed.theme) state.theme = parsed.theme;
            if (parsed.language) state.language = parsed.language;
            if (typeof parsed.notifications === 'boolean') state.notifications = parsed.notifications;
            if (parsed.contacts) {
                // Сливаем с дефолтами, чтобы новые контакты появились у тех, кто запускал старую версию
                const defaults = DEFAULT_CONTACTS();
                Object.keys(defaults).forEach(id => {
                    const stored = parsed.contacts[id];
                    if (stored) {
                        state.contacts[id] = {
                            ...defaults[id],
                            ...stored,
                            generateResponse: RESPONSE_MAP[id],
                            isTyping: false,
                            typingTimeout: null,
                        };
                    }
                });
                // Не теряем кастомные контакты (если были)
                Object.keys(parsed.contacts).forEach(id => {
                    if (!defaults[id] && parsed.contacts[id]) {
                        state.contacts[id] = {
                            ...parsed.contacts[id],
                            generateResponse: RESPONSE_MAP[id] || generateDurovResponse,
                            isTyping: false,
                            typingTimeout: null,
                        };
                    }
                });
            }
            if (parsed.groups) state.groups = parsed.groups;
            if (Array.isArray(parsed.chatOrder)) state.chatOrder = parsed.chatOrder;
        } else {
            // Миграция legacy ключа
            const legacy = localStorage.getItem(LEGACY_MESSAGES_KEY);
            if (legacy) {
                try {
                    const parsed = JSON.parse(legacy);
                    Object.keys(parsed).forEach(id => {
                        if (state.contacts[id]) state.contacts[id].messages = parsed[id];
                    });
                } catch (_) { /* ignore */ }
            }
        }
    } catch (e) {
        console.error('Ошибка загрузки состояния:', e);
    }
    if (!state.chatOrder.length) {
        state.chatOrder = Object.keys(state.contacts);
    }
}

function saveState() {
    try {
        const contactsToSave = {};
        Object.keys(state.contacts).forEach(id => {
            const c = state.contacts[id];
            contactsToSave[id] = {
                ...c,
                generateResponse: undefined,
                isTyping: false,
                typingTimeout: null,
            };
        });
        const payload = {
            user: state.user,
            contacts: contactsToSave,
            groups: state.groups,
            chatOrder: state.chatOrder,
            theme: state.theme,
            language: state.language,
            notifications: state.notifications,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
        console.error('Ошибка сохранения:', e);
    }
}

// ================================================================
// DOM
// ================================================================
const $ = id => document.getElementById(id);

const menuView = $('menu-view');
const chatView = $('chat-view');
const profileView = $('profile-view');
const settingsView = $('settings-view');
const editProfileView = $('edit-profile-view');
const chatList = $('chat-list');
const chatMessages = $('chat-messages');
const messageInput = $('message-input');
const sendButton = $('send-button');
const micButton = $('mic-button');
const attachButton = $('attach-button');
const backButtonChat = $('back-to-menu');
const typingIndicatorContainer = $('typing-indicator-container');
const chatHeaderAvatar = $('chat-header-avatar');
const chatHeaderName = $('chat-header-name');
const chatStatus = $('chat-status');
const chatHeaderClickable = $('chat-header-clickable');
const profileBackButton = $('profile-back-button');
const profileAvatar = $('profile-avatar');
const profileName = $('profile-name');
const profileStatus = $('profile-status');
const profilePhone = $('profile-phone');
const profileBio = $('profile-bio');
const profileUsername = $('profile-username');
const profileSendMessageBtn = $('profile-send-message');
const profileShareContactBtn = $('profile-share-contact');
const profileBlockBtn = $('profile-block');
const blockedBanner = $('blocked-banner');

const settingsBackButton = $('settings-back-button');
const editProfileBackButton = $('edit-profile-back-button');
const editProfileSaveButton = $('edit-profile-save-button');

const hamburgerButton = $('hamburger-button');
const sideMenu = $('side-menu');
const menuOverlay = $('menu-overlay');
const sideMenuUserProfileButton = $('side-menu-user-profile-button');
const sideMenuList = document.querySelector('.side-menu-list');

const searchButton = $('search-button');
const searchBar = $('search-bar');
const searchInput = $('search-input');
const searchClose = $('search-close');

const newChatButton = $('new-chat-button');

const modalOverlay = $('modal-overlay');
const toastContainer = $('toast-container');
const contextMenu = $('context-menu');
const imageInput = $('image-input');
const emojiPicker = $('emoji-picker');
const attachMenu = $('attach-menu');

// ================================================================
// View navigation
// ================================================================
function navigateToView(viewId, data = null) {
    state.activeView = viewId;
    [menuView, chatView, profileView, settingsView, editProfileView].forEach(v => v && v.classList.add('hidden'));

    let target = menuView;
    switch (viewId) {
        case 'menu':
            state.currentChatId = null;
            resetChatInput();
            renderChatList();
            target = menuView;
            break;
        case 'chat':
            if (!data || !state.contacts[data]) {
                navigateToView('menu');
                return;
            }
            state.currentChatId = data;
            target = chatView;
            loadChat(data);
            break;
        case 'profile':
            if (!state.currentChatId) {
                navigateToView('menu');
                return;
            }
            target = profileView;
            loadProfile(state.currentChatId);
            break;
        case 'settings':
            target = settingsView;
            renderSettings();
            break;
        case 'edit-profile':
            target = editProfileView;
            renderEditProfile();
            break;
    }
    target.classList.remove('hidden');
    closeSearchBar();
}

// ================================================================
// Chat list
// ================================================================
function renderChatList(filter = '') {
    chatList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const order = state.chatOrder.length ? state.chatOrder : Object.keys(state.contacts);

    const items = order
        .map(id => state.contacts[id])
        .filter(c => !!c)
        .filter(c => {
            if (!filter) return true;
            const q = filter.toLowerCase();
            return c.name.toLowerCase().includes(q) || (c.username && c.username.toLowerCase().includes(q));
        });

    if (items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'list-empty';
        empty.textContent = filter ? 'Ничего не найдено' : 'Список пуст';
        chatList.appendChild(empty);
        return;
    }

    items.forEach(contact => {
        const lastMsg = contact.messages[contact.messages.length - 1];
        const previewRaw = lastMsg ? messagePreview(lastMsg, contact) : '';
        const item = document.createElement('div');
        item.classList.add('chat-list-item');
        item.dataset.contactId = contact.id;

        const unreadBadge = contact.unread > 0
            ? `<div class="unread-count">${contact.unread}</div>`
            : '';

        const trimmed = previewRaw.length > 40 ? previewRaw.substring(0, 40) + '...' : previewRaw;
        const time = lastMsg ? lastMsg.time : '';

        const savedBadge = contact.kind === 'self' ? '<span class="saved-badge" title="Избранное">★</span>' : '';

        item.innerHTML = `
            <div class="avatar avatar-placeholder" data-initial="${escapeAttr(contact.initial)}" style="background-color: ${escapeAttr(contact.avatarColor)};"></div>
            <div class="chat-list-info">
                <div class="chat-list-name">${savedBadge}${escapeHtml(contact.name)}</div>
                <div class="chat-list-preview">${escapeHtml(trimmed)}</div>
            </div>
            <div class="chat-list-meta">
                <div class="chat-list-time">${escapeHtml(time)}</div>
                ${unreadBadge}
            </div>
        `;
        fragment.appendChild(item);
    });

    chatList.appendChild(fragment);
}

function messagePreview(msg, contact) {
    let body = msg.text || '';
    if (msg.image && !body) body = `🖼 ${t('photo')}`;
    if (msg.type === 'sent' && contact.kind !== 'self') body = `${t('sentByYou')} ${body}`;
    return body;
}

function moveChatToTop(contactId) {
    state.chatOrder = [contactId, ...state.chatOrder.filter(id => id !== contactId)];
}

// ================================================================
// Chat view
// ================================================================
function loadChat(contactId) {
    const contact = state.contacts[contactId];
    if (!contact) return;

    chatHeaderAvatar.dataset.initial = contact.initial;
    chatHeaderAvatar.style.backgroundColor = contact.avatarColor;
    chatHeaderName.textContent = contact.name;
    chatStatus.textContent = contact.kind === 'self'
        ? ''
        : (contact.isTyping ? t('statusTyping') : contact.statusOffline);

    // Сбрасываем непрочитанные при открытии
    if (contact.unread > 0) {
        contact.unread = 0;
        saveState();
    }

    // Помечаем все sent сообщения как прочитанные (двойная галочка)
    let dirty = false;
    contact.messages.forEach(m => {
        if (m.type === 'sent' && !m.read) {
            m.read = true;
            dirty = true;
        }
    });
    if (dirty) saveState();

    chatMessages.innerHTML = '';
    chatMessages.appendChild(typingIndicatorContainer);

    if (!contact.messages.length) {
        showEmptyState(contact.name);
    } else {
        renderMessagesWithDateDividers(contact.messages);
    }

    if (contact.isTyping) typingIndicatorContainer.classList.remove('hidden');
    else typingIndicatorContainer.classList.add('hidden');

    blockedBanner.classList.toggle('hidden', !contact.blocked);
    document.querySelector('.chat-input-area').classList.toggle('disabled', !!contact.blocked);

    scrollToBottom(true);
    toggleSendButton();
    if (!contact.blocked) messageInput.focus();
}

function renderMessagesWithDateDividers(messages) {
    let lastDate = '';
    messages.forEach(m => {
        const dKey = m.date || dateKey(new Date());
        if (dKey !== lastDate) {
            addDateDividerToDOM(dKey);
            lastDate = dKey;
        }
        addMessageToDOM(m);
    });
}

function showEmptyState(contactName) {
    const empty = document.createElement('div');
    empty.classList.add('empty-state');
    empty.innerHTML = `
        <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="empty-state-title">${escapeHtml(t('emptyTitle'))}</div>
        <div class="empty-state-text">${escapeHtml(t('emptyText'))} ${escapeHtml(contactName)}</div>
    `;
    chatMessages.appendChild(empty);
}

function addDateDividerToDOM(dKey) {
    const divider = document.createElement('div');
    divider.className = 'date-divider';
    divider.textContent = humanDate(dKey);
    insertBeforeTyping(divider);
}

function addMessageToDOM(msg) {
    const empty = chatMessages.querySelector('.empty-state');
    if (empty) empty.remove();

    const el = document.createElement('div');
    el.classList.add('message', `message-${msg.type}`);
    el.dataset.messageId = msg.id || '';

    if (msg.image) {
        const img = document.createElement('img');
        img.src = msg.image;
        img.alt = 'image';
        img.className = 'message-image';
        el.appendChild(img);
    }
    if (msg.text) {
        const span = document.createElement('span');
        span.classList.add('message-text');
        span.textContent = msg.text;
        el.appendChild(span);
    }

    const meta = document.createElement('div');
    meta.classList.add('message-meta');
    const time = document.createElement('span');
    time.classList.add('message-time');
    time.textContent = msg.time || getCurrentTime();
    meta.appendChild(time);
    if (msg.type === 'sent') {
        const check = document.createElement('span');
        check.classList.add('message-read');
        check.innerHTML = readSvg(msg.read);
        meta.appendChild(check);
    }
    el.appendChild(meta);

    el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, msg);
    });
    let touchTimer = null;
    el.addEventListener('touchstart', (e) => {
        touchTimer = setTimeout(() => {
            const touch = e.touches[0];
            showContextMenu(touch.clientX, touch.clientY, msg);
        }, 500);
    }, { passive: true });
    el.addEventListener('touchend', () => clearTimeout(touchTimer));
    el.addEventListener('touchmove', () => clearTimeout(touchTimer));

    insertBeforeTyping(el);
}

function readSvg(read) {
    if (read) {
        // Двойная галочка
        return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13l4 4L15 7" stroke="#34a3eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13l4 4L21 7" stroke="#34a3eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="#9aa3ad" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function insertBeforeTyping(el) {
    const typing = chatMessages.querySelector('#typing-indicator-container');
    if (typing) chatMessages.insertBefore(el, typing);
    else chatMessages.appendChild(el);
}

function humanDate(dKey) {
    const today = dateKey(new Date());
    const yesterday = dateKey(addDays(new Date(), -1));
    if (dKey === today) return t('today');
    if (dKey === yesterday) return t('yesterday');
    const [y, m, d] = dKey.split('-').map(Number);
    return `${d} ${t('months')[m - 1]} ${y}`;
}

// ================================================================
// Sending messages
// ================================================================
function sendMessage(extras = {}) {
    const messageText = messageInput.value.trim();
    const contact = state.contacts[state.currentChatId];
    if (!contact) return;
    if (contact.blocked) return;
    if (!messageText && !extras.image) return;

    const time = getCurrentTime();
    const msg = {
        id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type: 'sent',
        text: messageText,
        time,
        date: dateKey(new Date()),
        read: false,
        ...extras,
    };
    contact.messages.push(msg);
    addMessageToDOM(msg);
    moveChatToTop(contact.id);
    saveState();
    refreshChatListItem(contact.id);

    messageInput.value = '';
    toggleSendButton();
    scrollToBottom();

    if (contact.kind === 'self') {
        // Saved Messages: помечаем "прочитанным" сразу
        msg.read = true;
        saveState();
        // Перерисуем меточку
        loadChat(contact.id);
        return;
    }
    simulateTypingAndResponse(contact.id, messageText || '[image]');
}

function simulateTypingAndResponse(contactId, userMessage) {
    const contact = state.contacts[contactId];
    if (!contact || !contact.generateResponse) return;
    contact.isTyping = true;
    if (state.currentChatId === contactId) {
        typingIndicatorContainer.classList.remove('hidden');
        chatStatus.textContent = t('statusTyping');
        scrollToBottom();
    }
    if (contact.typingTimeout) clearTimeout(contact.typingTimeout);
    const typingDelay = 800 + Math.random() * 2200;
    contact.typingTimeout = setTimeout(() => {
        const response = contact.generateResponse(userMessage);
        if (response) {
            const responseTime = getCurrentTime();
            const msg = {
                id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                type: 'received',
                text: response,
                time: responseTime,
                date: dateKey(new Date()),
            };
            contact.messages.push(msg);
            if (state.currentChatId === contactId) {
                addMessageToDOM(msg);
                // Помечаем все наши sent как прочитанные (бот "увидел")
                let dirty = false;
                contact.messages.forEach(m => {
                    if (m.type === 'sent' && !m.read) { m.read = true; dirty = true; }
                });
                if (dirty) {
                    // Обновляем индикаторы галочек
                    chatMessages.querySelectorAll('.message-sent .message-read').forEach(span => {
                        span.innerHTML = readSvg(true);
                    });
                }
            } else {
                contact.unread = (contact.unread || 0) + 1;
            }
            moveChatToTop(contact.id);
        }
        contact.isTyping = false;
        contact.typingTimeout = null;
        if (state.currentChatId === contactId) {
            typingIndicatorContainer.classList.add('hidden');
            chatStatus.textContent = contact.statusOnline || '';
            setTimeout(() => {
                if (!contact.isTyping && state.currentChatId === contactId) {
                    chatStatus.textContent = contact.statusOffline;
                }
            }, 4000);
            scrollToBottom();
        }
        saveState();
        refreshChatListItem(contact.id);
    }, typingDelay);
}

function refreshChatListItem(/* contactId */) {
    // Если меню открыто — перерисовать список целиком (порядок изменился)
    if (state.activeView === 'menu') renderChatList(searchInput.value || '');
}

// ================================================================
// Profile view
// ================================================================
function showProfileView() {
    if (state.currentChatId) navigateToView('profile');
}

function loadProfile(contactId) {
    const contact = state.contacts[contactId];
    if (!contact) return;
    profileName.textContent = contact.name;
    profileStatus.textContent = contact.statusOffline;
    profilePhone.textContent = contact.phone || '—';
    profileBio.textContent = contact.bio || '—';
    profileUsername.textContent = contact.username || '—';
    profileAvatar.style.backgroundColor = contact.avatarColor;
    profileAvatar.dataset.initial = contact.initial;
    profileAvatar.textContent = '';
    profileBlockBtn.textContent = contact.blocked ? t('unblock') : t('block');
    profileBlockBtn.classList.toggle('red', !contact.blocked);
    // Saved messages нельзя блокировать
    profileBlockBtn.style.display = contact.kind === 'self' ? 'none' : '';
}

function handleProfileSendMessage() {
    if (state.currentChatId) navigateToView('chat', state.currentChatId);
}

function handleProfileShareContact() {
    const c = state.contacts[state.currentChatId];
    if (!c) return;
    const text = `${c.name} ${c.username || ''}\n${c.phone || ''}`.trim();
    copyToClipboard(text);
    showToast(t('contactCopied'));
}

function handleProfileBlock() {
    const c = state.contacts[state.currentChatId];
    if (!c || c.kind === 'self') return;
    c.blocked = !c.blocked;
    saveState();
    loadProfile(c.id);
    showToast(c.blocked ? t('blocked') : t('unblock'));
}

// ================================================================
// Settings view
// ================================================================
function renderSettings() {
    const themeToggle = $('settings-theme-toggle');
    const langSelect = $('settings-lang-select');
    const notifToggle = $('settings-notif-toggle');
    if (themeToggle) themeToggle.checked = state.theme === 'dark';
    if (langSelect) langSelect.value = state.language;
    if (notifToggle) notifToggle.checked = state.notifications;

    const userBlockName = $('settings-user-name');
    const userBlockPhone = $('settings-user-phone');
    if (userBlockName) userBlockName.textContent = state.user.name;
    if (userBlockPhone) userBlockPhone.textContent = state.user.phone;
    const userBlockAvatar = $('settings-user-avatar');
    if (userBlockAvatar) {
        userBlockAvatar.dataset.initial = state.user.initial;
        userBlockAvatar.style.backgroundColor = state.user.avatarColor;
    }

    applyLocaleToSettings();
}

function applyLocaleToSettings() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
}

function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
}

function applyLanguage() {
    applyLocaleToSettings();
    const sideMenuName = document.querySelector('.side-menu-user-name');
    const sideMenuPhone = document.querySelector('.side-menu-user-phone');
    if (sideMenuName) sideMenuName.textContent = state.user.name;
    if (sideMenuPhone) sideMenuPhone.textContent = state.user.phone;
}

// ================================================================
// Edit profile
// ================================================================
function renderEditProfile() {
    $('edit-name').value = state.user.name;
    $('edit-phone').value = state.user.phone;
    $('edit-bio').value = state.user.bio;
}

function handleEditProfileSave() {
    const name = $('edit-name').value.trim() || DEFAULT_USER.name;
    const phone = $('edit-phone').value.trim() || DEFAULT_USER.phone;
    const bio = $('edit-bio').value.trim();
    state.user.name = name;
    state.user.phone = phone;
    state.user.bio = bio;
    state.user.initial = name[0] ? name[0].toUpperCase() : 'В';
    saveState();
    refreshUserProfileUI();
    showToast(t('save'));
    navigateToView('settings');
}

function refreshUserProfileUI() {
    const sideMenuName = document.querySelector('.side-menu-user-name');
    const sideMenuPhone = document.querySelector('.side-menu-user-phone');
    const sideMenuAvatar = document.querySelector('.side-menu-avatar');
    if (sideMenuName) sideMenuName.textContent = state.user.name;
    if (sideMenuPhone) sideMenuPhone.textContent = state.user.phone;
    if (sideMenuAvatar) {
        sideMenuAvatar.dataset.initial = state.user.initial;
        sideMenuAvatar.style.backgroundColor = state.user.avatarColor;
    }
    renderSettings();
}

// ================================================================
// Search
// ================================================================
function openSearchBar() {
    searchBar.classList.add('open');
    searchInput.value = '';
    setTimeout(() => searchInput.focus(), 80);
}

function closeSearchBar() {
    searchBar.classList.remove('open');
    searchInput.value = '';
    if (state.activeView === 'menu') renderChatList('');
}

// ================================================================
// Side menu
// ================================================================
function toggleSideMenu(open) {
    const next = typeof open === 'boolean' ? open : !sideMenu.classList.contains('open');
    sideMenu.classList.toggle('open', next);
    menuOverlay.classList.toggle('open', next);
}

function handleSideMenuAction(action) {
    toggleSideMenu(false);
    switch (action) {
        case 'settings':
            navigateToView('settings');
            break;
        case 'saved-messages':
            navigateToView('chat', 'saved');
            break;
        case 'contacts':
            openContactsModal();
            break;
        case 'new-group':
            openNewGroupModal();
            break;
        case 'calls':
            showInfoModal(t('calls'), t('callsEmpty'));
            break;
        case 'people-nearby':
            showInfoModal(t('peopleNearby'), t('peopleEmpty'));
            break;
        case 'telegram-features':
            showInfoModal(t('about'), t('aboutBody'));
            break;
    }
}

// ================================================================
// Modals
// ================================================================
function openModal(htmlContent) {
    modalOverlay.innerHTML = `<div class="modal">${htmlContent}</div>`;
    modalOverlay.classList.add('open');
}

function closeModal() {
    modalOverlay.classList.remove('open');
    setTimeout(() => { modalOverlay.innerHTML = ''; }, 200);
}

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

function showInfoModal(title, body) {
    openModal(`
        <div class="modal-header">${escapeHtml(title)}</div>
        <div class="modal-body">${escapeHtml(body)}</div>
        <div class="modal-actions">
            <button class="modal-btn primary" id="modal-ok">OK</button>
        </div>
    `);
    $('modal-ok').addEventListener('click', closeModal);
}

function showConfirmModal(title, body, onConfirm) {
    openModal(`
        <div class="modal-header">${escapeHtml(title)}</div>
        <div class="modal-body">${escapeHtml(body)}</div>
        <div class="modal-actions">
            <button class="modal-btn" id="modal-cancel">${escapeHtml(t('cancel'))}</button>
            <button class="modal-btn red" id="modal-confirm">${escapeHtml(t('delete'))}</button>
        </div>
    `);
    $('modal-cancel').addEventListener('click', closeModal);
    $('modal-confirm').addEventListener('click', () => {
        closeModal();
        onConfirm();
    });
}

function openContactsModal() {
    const items = Object.values(state.contacts)
        .filter(c => c.kind !== 'self')
        .map(c => `
            <div class="contacts-item" data-contact-id="${escapeAttr(c.id)}">
                <div class="avatar avatar-placeholder" data-initial="${escapeAttr(c.initial)}" style="background-color: ${escapeAttr(c.avatarColor)};"></div>
                <div class="contacts-item-info">
                    <div class="contacts-item-name">${escapeHtml(c.name)}</div>
                    <div class="contacts-item-username">${escapeHtml(c.username || '')}</div>
                </div>
            </div>
        `).join('');
    openModal(`
        <div class="modal-header">${escapeHtml(t('contacts'))}</div>
        <div class="modal-body modal-body--list">
            ${items || '<div class="list-empty">—</div>'}
        </div>
        <div class="modal-actions">
            <button class="modal-btn primary" id="modal-close">${escapeHtml(t('cancel'))}</button>
        </div>
    `);
    $('modal-close').addEventListener('click', closeModal);
    modalOverlay.querySelectorAll('.contacts-item').forEach(it => {
        it.addEventListener('click', () => {
            const id = it.dataset.contactId;
            closeModal();
            navigateToView('chat', id);
        });
    });
}

function openNewGroupModal() {
    const items = Object.values(state.contacts)
        .filter(c => c.kind !== 'self')
        .map(c => `
            <label class="contacts-item">
                <input type="checkbox" class="group-pick" value="${escapeAttr(c.id)}">
                <div class="avatar avatar-placeholder" data-initial="${escapeAttr(c.initial)}" style="background-color: ${escapeAttr(c.avatarColor)};"></div>
                <div class="contacts-item-info">
                    <div class="contacts-item-name">${escapeHtml(c.name)}</div>
                    <div class="contacts-item-username">${escapeHtml(c.username || '')}</div>
                </div>
            </label>
        `).join('');
    openModal(`
        <div class="modal-header">${escapeHtml(t('newGroup'))}</div>
        <div class="modal-body">
            <input id="group-name-input" class="modal-input" placeholder="${escapeAttr(t('groupName'))}" />
            <div class="modal-subtitle">${escapeHtml(t('chooseContacts'))}</div>
            <div class="modal-body--list">${items}</div>
        </div>
        <div class="modal-actions">
            <button class="modal-btn" id="modal-cancel">${escapeHtml(t('cancel'))}</button>
            <button class="modal-btn primary" id="modal-create">${escapeHtml(t('create'))}</button>
        </div>
    `);
    $('modal-cancel').addEventListener('click', closeModal);
    $('modal-create').addEventListener('click', () => {
        const name = $('group-name-input').value.trim();
        const picks = Array.from(modalOverlay.querySelectorAll('.group-pick:checked')).map(i => i.value);
        if (!name || picks.length === 0) {
            showToast(t('chooseContacts'));
            return;
        }
        const groupId = `group_${Date.now()}`;
        const initial = name[0] ? name[0].toUpperCase() : '#';
        state.contacts[groupId] = makeContact({
            id: groupId,
            name,
            initial,
            avatarColor: '#9b59b6',
            phone: '—',
            bio: `Группа • ${picks.length + 1} участник(а)`,
            username: '@group',
            kind: 'group',
            members: picks,
            generateResponse: makeGroupResponder(picks),
            messages: [{
                type: 'received',
                text: `Группа "${name}" создана. Участники: ${picks.map(id => state.contacts[id].name).join(', ')}.`,
                time: getCurrentTime(),
                date: dateKey(new Date()),
            }],
        });
        state.chatOrder = [groupId, ...state.chatOrder];
        RESPONSE_MAP[groupId] = state.contacts[groupId].generateResponse;
        saveState();
        closeModal();
        navigateToView('chat', groupId);
    });
}

function makeGroupResponder(memberIds) {
    return function (msg) {
        const validMembers = memberIds.filter(id => state.contacts[id]);
        if (!validMembers.length) return null;
        const memberId = pick(validMembers);
        const member = state.contacts[memberId];
        const reply = member.generateResponse ? member.generateResponse(msg) : '...';
        return `${member.name}: ${reply}`;
    };
}

// ================================================================
// Context menu (long press / right click on message)
// ================================================================
function showContextMenu(x, y, msg) {
    contextMenu.innerHTML = `
        <button class="context-menu-item" data-action="copy">${escapeHtml(t('copy'))}</button>
        <button class="context-menu-item red" data-action="delete">${escapeHtml(t('delete'))}</button>
    `;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.classList.add('open');
    contextMenu.querySelectorAll('.context-menu-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            hideContextMenu();
            if (action === 'copy') {
                copyToClipboard(msg.text || '');
                showToast(t('copied'));
            } else if (action === 'delete') {
                deleteMessage(msg);
            }
        });
    });
    setTimeout(() => {
        const r = contextMenu.getBoundingClientRect();
        const w = window.innerWidth, h = window.innerHeight;
        if (r.right > w) contextMenu.style.left = `${w - r.width - 8}px`;
        if (r.bottom > h) contextMenu.style.top = `${h - r.height - 8}px`;
    }, 0);
}

function hideContextMenu() {
    contextMenu.classList.remove('open');
}

document.addEventListener('click', (e) => {
    if (contextMenu.classList.contains('open') && !contextMenu.contains(e.target)) hideContextMenu();
});

function deleteMessage(msg) {
    const c = state.contacts[state.currentChatId];
    if (!c) return;
    c.messages = c.messages.filter(m => m.id !== msg.id);
    saveState();
    loadChat(c.id);
}

// ================================================================
// Toast
// ================================================================
function showToast(text) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    toastContainer.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 300);
    }, 2000);
}

// ================================================================
// Attachments / emoji
// ================================================================
function toggleAttachMenu() {
    attachMenu.classList.toggle('open');
    emojiPicker.classList.remove('open');
}

function toggleEmojiPicker() {
    emojiPicker.classList.toggle('open');
    attachMenu.classList.remove('open');
}

function buildEmojiPicker() {
    const emojis = ['😀','😁','😂','🤣','😊','😍','😘','🤔','😎','🥳','😢','😭','😡','🤝','👍','👎','👏','🙏','💪','🎉','❤️','💔','💯','🔥','✨','🎁','📸','🚀','🌟','😴','🤯','🤖','👀','✅','❗','🤷‍♂️','💬','📌','🍕','☕'];
    emojiPicker.innerHTML = emojis.map(e => `<button class="emoji-item" type="button">${e}</button>`).join('');
    emojiPicker.querySelectorAll('.emoji-item').forEach(btn => {
        btn.addEventListener('click', () => {
            messageInput.value += btn.textContent;
            toggleSendButton();
            messageInput.focus();
        });
    });
}

function handleImageInput(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        sendMessage({ image: reader.result });
    };
    reader.readAsDataURL(file);
    // сбросить input, чтобы повторно тот же файл сработал
    e.target.value = '';
    attachMenu.classList.remove('open');
}

// ================================================================
// Helpers
// ================================================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}

function escapeAttr(text) {
    return escapeHtml(text).replace(/"/g, '&quot;');
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) { /* ignore */ }
    document.body.removeChild(ta);
}

function scrollToBottom(force) {
    if (force) {
        setTimeout(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }, 50);
    } else {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
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

function resetChatInput() {
    messageInput.value = '';
    toggleSendButton();
    attachMenu.classList.remove('open');
    emojiPicker.classList.remove('open');
}

// ================================================================
// Wire up listeners
// ================================================================
function wireUp() {
    sendButton.addEventListener('click', () => sendMessage());
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    messageInput.addEventListener('input', toggleSendButton);
    backButtonChat.addEventListener('click', () => navigateToView('menu'));
    chatList.addEventListener('click', (e) => {
        const item = e.target.closest('.chat-list-item');
        if (item) navigateToView('chat', item.dataset.contactId);
    });
    chatHeaderClickable.addEventListener('click', showProfileView);
    profileBackButton.addEventListener('click', () => navigateToView('chat', state.currentChatId));
    profileSendMessageBtn.addEventListener('click', handleProfileSendMessage);
    profileShareContactBtn.addEventListener('click', handleProfileShareContact);
    profileBlockBtn.addEventListener('click', handleProfileBlock);

    settingsBackButton.addEventListener('click', () => navigateToView('menu'));
    editProfileBackButton.addEventListener('click', () => navigateToView('settings'));
    editProfileSaveButton.addEventListener('click', handleEditProfileSave);

    hamburgerButton.addEventListener('click', () => toggleSideMenu(true));
    menuOverlay.addEventListener('click', () => toggleSideMenu(false));
    sideMenuList.addEventListener('click', (e) => {
        const li = e.target.closest('li[data-action]');
        if (li) handleSideMenuAction(li.dataset.action);
    });
    sideMenuUserProfileButton.addEventListener('click', () => {
        toggleSideMenu(false);
        navigateToView('edit-profile');
    });

    searchButton.addEventListener('click', openSearchBar);
    searchClose.addEventListener('click', closeSearchBar);
    searchInput.addEventListener('input', () => renderChatList(searchInput.value));

    newChatButton.addEventListener('click', openContactsModal);

    attachButton.addEventListener('click', toggleAttachMenu);
    document.addEventListener('click', (e) => {
        if (!attachMenu.contains(e.target) && !attachButton.contains(e.target)) attachMenu.classList.remove('open');
        if (!emojiPicker.contains(e.target) && !attachMenu.contains(e.target) && !attachButton.contains(e.target)) {
            // emoji остаётся открытым только если кликнули по нему
        }
    });

    $('attach-image-btn').addEventListener('click', () => imageInput.click());
    $('attach-emoji-btn').addEventListener('click', toggleEmojiPicker);
    imageInput.addEventListener('change', handleImageInput);

    const themeToggle = $('settings-theme-toggle');
    if (themeToggle) themeToggle.addEventListener('change', () => {
        state.theme = themeToggle.checked ? 'dark' : 'light';
        applyTheme();
        saveState();
    });
    const langSelect = $('settings-lang-select');
    if (langSelect) langSelect.addEventListener('change', () => {
        state.language = langSelect.value;
        applyLanguage();
        saveState();
    });
    const notifToggle = $('settings-notif-toggle');
    if (notifToggle) notifToggle.addEventListener('change', () => {
        state.notifications = notifToggle.checked;
        saveState();
    });
    const editProfileBtn = $('settings-edit-profile');
    if (editProfileBtn) editProfileBtn.addEventListener('click', () => navigateToView('edit-profile'));
    const clearDataBtn = $('settings-clear-data');
    if (clearDataBtn) clearDataBtn.addEventListener('click', () => {
        showConfirmModal(t('clearData'), t('clearDataConfirm'), () => {
            Object.values(state.contacts).forEach(c => { c.messages = []; c.unread = 0; });
            saveState();
            showToast(t('chatsCleared'));
            renderSettings();
            if (state.activeView === 'chat') loadChat(state.currentChatId);
        });
    });

    // Keyboard shortcut: Esc closes side menu / search / modal / context menu
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (contextMenu.classList.contains('open')) hideContextMenu();
        else if (modalOverlay.classList.contains('open')) closeModal();
        else if (searchBar.classList.contains('open')) closeSearchBar();
        else if (sideMenu.classList.contains('open')) toggleSideMenu(false);
        else if (state.activeView === 'chat') navigateToView('menu');
    });

    chatHeaderClickable.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showProfileView();
        }
    });
}

// ================================================================
// Init
// ================================================================
function init() {
    loadState();
    applyTheme();
    refreshUserProfileUI();
    applyLanguage();
    buildEmojiPicker();
    wireUp();
    renderChatList();
    navigateToView('menu');
}

// DOM может быть уже готов т.к. defer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
