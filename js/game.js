const createDeck = (cards) => {
  return cards.flatMap((card, index) => [
    {
      ...card,
      id: `${card.pairId}-1-${index}`,
    },
    {
      ...card,
      id: `${card.pairId}-2-${index}`,
    },
  ]);
};

const shuffle = (array) => {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(
      Math.random() * (i + 1),
    );

    [shuffledArray[i], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[i],
    ];
  }

  return shuffledArray;
};

export const createShuffledDeck = (cards) => {
  const deck = createDeck(cards);

  return shuffle(deck);
};