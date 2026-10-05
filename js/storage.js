const STORAGE_KEY = 'memoryGameResults';
const MAX_RESULTS = 10;

export const loadResults = () => {
    const savedResults = localStorage.getItem(STORAGE_KEY);

    if (!savedResults) {
        return [];
    }

    try {
        return JSON.parse(savedResults);
    } catch {
        return [];
    }
};

export const saveResult = (moves) => {
    const results = loadResults();

    results.push({
        moves,
        timestamp: Date.now(),
    });

    results.sort((a, b) => {
        if (a.moves !== b.moves) {
            return a.moves - b.moves;
        }

        return a.timestamp - b.timestamp;
    });

    const bestResults = results.slice(0, MAX_RESULTS);

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(bestResults),
    );
};