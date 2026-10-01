import { cardImages } from './cardsData.js';
import { createShuffledDeck } from './game.js';

const createElement = (tag, className, textContent = '') => {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
};

const createButton = (text, className, ariaLabel) => {
    const button = createElement('button', className, text);
    button.type = 'button';
    if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
    }
    return button;
};

const createHeader = () => {
    const header = createElement('header', 'game-header');
    const logo = createElement('h1', 'logo', 'Memory Game');
    const actions = createElement('div', 'header-actions');
    const newGameButton = createButton(
        'Новая игра',
        'new-game-button',
    );
    const leaderboardButton = createButton(
        'Таблица лидеров',
        'leaderboard-button',
    );

    actions.append(newGameButton, leaderboardButton);
    header.append(logo, actions);
    return header;
};

const createStat = (label, value, className) => {
    const stat = createElement('div', `stat ${className}`);
    const labelElement = createElement(
        'span',
        'stat-label',
        label,
    );
    const valueElement = createElement(
        'strong',
        'stat-value',
        value,
    );

    stat.append(labelElement, valueElement);

    return {
        container: stat,
        valueElement,
    };
};

const createGameInfo = () => {
    const gameInfo = createElement('section', 'game-info');

    const moves = createStat(
        'Ходы',
        '0',
        'moves-stat',
    );

    const pairs = createStat(
        'Пары',
        '0 / 8',
        'pairs-stat',
    );

    gameInfo.append(
        moves.container,
        pairs.container,
    );

    return {
        container: gameInfo,
        movesValue: moves.valueElement,
        pairsValue: pairs.valueElement,
    };
};

const createCard = (cardData) => {
    const card = createButton(
        '',
        'card',
        `Открыть карту: ${cardData.name}`,
    );

    card.dataset.cardId = cardData.id;
    card.dataset.pairId = cardData.pairId;

    const cardInner = createElement(
        'span',
        'card-inner',
    );

    const cardBack = createElement(
        'span',
        'card-back',
    );

    const cardFront = createElement(
        'span',
        'card-front',
    );

    const image = document.createElement('img');

    image.src = cardData.src;
    image.alt = cardData.name;

    cardFront.append(image);
    cardInner.append(cardBack, cardFront);
    card.append(cardInner);

    return card;
};

const createGameBoard = (deck) => {
    const board = createElement(
        'section',
        'game-board',
    );

    board.setAttribute(
        'aria-label',
        'Игровое поле',
    );

    deck.forEach((cardData) => {
        board.append(createCard(cardData));
    });

    return board;
};

const createFooter = () => {
    const footer = createElement(
        'footer',
        'game-footer',
    );

    const text = createElement(
        'p',
        '',
        'Icons by ',
    );

    const link = createElement('a', '', 'Icons8');

    link.href = 'https://icons8.ru/';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    text.append(link);
    footer.append(text);

    return footer;
};

const createApp = (deck) => {
    const app = createElement('div', 'app');

    const header = createHeader();
    const main = createElement('main', 'game');

    const gameInfo = createGameInfo();
    const gameBoard = createGameBoard(deck);

    main.append(
        gameInfo.container,
        gameBoard,
    );

    const footer = createFooter();

    app.append(
        header,
        main,
        footer,
    );

    return {
        app,
        elements: {
            movesValue: gameInfo.movesValue,
            pairsValue: gameInfo.pairsValue,
            gameBoard,
        },
    };
};

const deck = createShuffledDeck(cardImages);

const { app, elements } = createApp(deck);

document.body.append(app);