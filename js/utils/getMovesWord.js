export const getMovesWord = (moves) => {
    if (moves % 10 === 1 && moves % 100 !== 11) {
        return 'ход';
    }

    if (
        moves % 10 >= 2
        && moves % 10 <= 4
        && (moves % 100 < 10 || moves % 100 >= 20)
    ) {
        return 'хода';
    }

    return 'ходов';
};