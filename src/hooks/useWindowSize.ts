// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

enum SCREEN_SIZE {
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
}

function pixelWidthToScreenSize(width: number): SCREEN_SIZE {
  if (width < 768) return SCREEN_SIZE.SM;
  else if (width < 1024 && width >= 768) return SCREEN_SIZE.MD;
  else if (width < 1280 && width >= 1024) return SCREEN_SIZE.LG;
  return SCREEN_SIZE.XL;
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 1024,
    height: 1024,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return pixelWidthToScreenSize(windowSize.width);
}

export { SCREEN_SIZE, useWindowSize };
