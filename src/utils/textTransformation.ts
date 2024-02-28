const SCREEN_SIZE_TO_MAX_WORDS = {
  XL: 100,
  LG: 70,
  MD: 40,
  SM: 30,
};

function getMaxWordsForScreenSize(width: number) {
  if (width < 640) return SCREEN_SIZE_TO_MAX_WORDS.SM;
  else if (width < 768 && width >= 640) return SCREEN_SIZE_TO_MAX_WORDS.MD;
  else if (width < 1024 && width >= 768) return SCREEN_SIZE_TO_MAX_WORDS.LG;
  return SCREEN_SIZE_TO_MAX_WORDS.XL;
}

function truncateDescription(description: string, width: number) {
  const maxWords = getMaxWordsForScreenSize(width);
  const words = description.split(' ');
  if (words.length > maxWords) {
    return (words.slice(0, maxWords).join(' ') + '...').replace('....', '...');
  }
  return description;
}

export { truncateDescription };
