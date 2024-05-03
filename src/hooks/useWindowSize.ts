// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { SCREEN_SIZE, pixelWidthToScreenSize } from '@/utils/windowSize';
import { useEffect, useState } from 'react';

function useWindowSize(): SCREEN_SIZE {
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
