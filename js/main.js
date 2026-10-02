import { cardImages } from './cardsData.js';
import { createElement } from './utils/createElement.js';
import { createButton } from './utils/createButton.js';
import { createModal } from './modal.js';
import { loadResults, saveResult } from './storage.js';
import { getMovesWord } from './utils/getMovesWord.js';
import { createGameState, createShuffledDeck } from './game.js';

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
    return {
        container: header,
        newGameButton,
        leaderboardButton,
    };
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

const modal = createModal();

const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
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
        'Открыть карту',
    );

    card.dataset.cardId = cardData.id;
    card.dataset.pairId = cardData.pairId;
    card.dataset.cardName = cardData.name;

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
    image.alt = '';

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
        header.container,
        main,
        footer,
    );

    return {
        app,
        elements: {
            movesValue: gameInfo.movesValue,
            pairsValue: gameInfo.pairsValue,
            gameBoard,
            newGameButton: header.newGameButton,
            leaderboardButton: header.leaderboardButton,
        },
    };
};

const createLeaderboard = (results) => {
    const container = createElement(
        'div',
        'leaderboard-container',
    );

    const title = createElement(
        'h2',
        'modal-title',
        'Таблица лидеров',
    );

    container.append(title);

    if (results.length === 0) {
        const emptyMessage = createElement(
            'p',
            'leaderboard-empty',
            'Пока нет результатов',
        );

        container.append(emptyMessage);

        return container;
    }

    const table = createElement('table', 'leaderboard');

    const thead = createElement('thead');
    const headerRow = createElement('tr');

    const rankHeader = createElement('th', '', 'Место');
    const movesHeader = createElement('th', '', 'Ходы');
    const dateHeader = createElement('th', '', 'Дата');

    headerRow.append(
        rankHeader,
        movesHeader,
        dateHeader,
    );

    thead.append(headerRow);

    const tbody = createElement('tbody');

    results.forEach((result, index) => {
        const row = createElement('tr');

        const rank = createElement(
            'td',
            '',
            String(index + 1),
        );

        const moves = createElement(
            'td',
            '',
            String(result.moves),
        );

        const date = createElement(
            'td',
            '',
            formatDate(result.timestamp),
        );

        row.append(rank, moves, date);
        tbody.append(row);
    });

    table.append(thead, tbody);
    container.append(table);

    return container;
};

const showLeaderboardModal = () => {
    const results = loadResults();

    const leaderboard = createLeaderboard(results);

    const closeButton = createButton(
        'Закрыть',
        'modal-close-button',
    );

    modal.content.replaceChildren(
        leaderboard,
        closeButton,
    );

    closeButton.addEventListener(
        'click',
        modal.close,
    );

    modal.open();
};

const showVictoryModal = () => {
    const title = createElement(
        'h2',
        'modal-title',
        'Поздравляем!',
    );

    const message = createElement(
        'p',
        'modal-message',
        `Вы нашли все пары за ${gameState.moves} ${getMovesWord(gameState.moves)}`,
    );

    const actions = createElement(
        'div',
        'modal-actions',
    );

    const newGameButton = createButton(
        'Новая игра',
        'modal-new-game-button',
    );

    const closeButton = createButton(
        'Закрыть',
        'modal-close-button',
    );

    actions.append(
        newGameButton,
        closeButton,
    );

    modal.content.replaceChildren(
        title,
        message,
        actions,
    );

    newGameButton.addEventListener(
        'click',
        startNewGame,
    );

    closeButton.addEventListener(
        'click',
        modal.close,
    );

    modal.open();
};

const handleMatch = () => {
    gameState.firstCard.classList.add('matched');
    gameState.secondCard.classList.add('matched');

    gameState.firstCard.setAttribute(
        'aria-label',
        `Найденная пара: ${gameState.firstCard.dataset.cardName}`,
    );

    gameState.secondCard.setAttribute(
        'aria-label',
        `Найденная пара: ${gameState.secondCard.dataset.cardName}`,
    );

    gameState.pairs += 1;

    elements.pairsValue.textContent = `${gameState.pairs} / 8`;

    resetSelectedCards();

    if (gameState.pairs === 8) {
        gameState.isGameOver = true;

        if (!gameState.resultSaved) {
            saveResult(gameState.moves);
            gameState.resultSaved = true;
        }

        showVictoryModal();
    }
};

const resetSelectedCards = () => {
    gameState.firstCard = null;
    gameState.secondCard = null;
};

const handleMismatch = () => {
    gameState.isLocked = true;

    gameState.hideTimeoutId = setTimeout(() => {
        gameState.firstCard.classList.remove('flipped');
        gameState.secondCard.classList.remove('flipped');

        gameState.firstCard.setAttribute(
            'aria-label',
            'Открыть карту',
        );

        gameState.secondCard.setAttribute(
            'aria-label',
            'Открыть карту',
        );

        resetSelectedCards();

        gameState.isLocked = false;
        gameState.hideTimeoutId = null;
    }, 1000);
};
const checkCards = () => {
    const { firstCard, secondCard } = gameState;

    if (firstCard.dataset.pairId === secondCard.dataset.pairId) {
        handleMatch();
        return;
    }

    handleMismatch();
};

const handleCardClick = (card) => {
    if (
        gameState.isLocked
        || gameState.isGameOver
        || card.classList.contains('flipped')
        || card.classList.contains('matched')
    ) {
        return;
    }

    flipCard(card);

    if (!gameState.firstCard) {
        gameState.firstCard = card;
        return;
    }

    gameState.secondCard = card;
    gameState.moves += 1;

    elements.movesValue.textContent = gameState.moves;

    checkCards();
};

const flipCard = (card) => {
    card.classList.add('flipped');

    card.setAttribute(
        'aria-label',
        `Закрыть карту: ${card.dataset.cardName}`,
    );
};

const resetGameState = () => {
    if (gameState.hideTimeoutId) {
        clearTimeout(gameState.hideTimeoutId);
    }

    gameState.firstCard = null;
    gameState.secondCard = null;
    gameState.moves = 0;
    gameState.pairs = 0;
    gameState.isLocked = false;
    gameState.isGameOver = false;
    gameState.resultSaved = false;
    gameState.hideTimeoutId = null;
};

const resetGameInfo = () => {
    elements.movesValue.textContent = '0';
    elements.pairsValue.textContent = '0 / 8';
};

const deck = createShuffledDeck(cardImages);
const gameState = createGameState();

const resetGameBoard = () => {
    elements.gameBoard.replaceChildren();

    const newDeck = createShuffledDeck(cardImages);

    newDeck.forEach((cardData) => {
        elements.gameBoard.append(createCard(cardData));
    });
};

const startNewGame = () => {
    modal.close();

    resetGameState();
    resetGameInfo();
    resetGameBoard();
};

const { app, elements } = createApp(deck);

document.body.append(
    app,
    modal.dialog,
);

elements.gameBoard.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) {
        return;
    }
    handleCardClick(card);
});

elements.newGameButton.addEventListener(
    'click',
    startNewGame,
);

elements.leaderboardButton.addEventListener(
    'click',
    showLeaderboardModal,
);