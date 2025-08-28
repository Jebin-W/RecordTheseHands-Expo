import { useState, useCallback, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { DEVICE_TYPE } from './DeviceProperties';

export type LayoutMode = 'default' | 'fullscreen' | 'splitscreen';

export interface LayoutState {
  mode: LayoutMode;
  previousMode: LayoutMode;
  isFullscreen: boolean;
  flexDirection: string;
  cameraStyle: any;
  videoStyle: any;
}

export interface LayoutStyles {
  cameraStyle: any;
  videoStyle: any;
  flexDirection: string;
  isFullscreen: boolean;
}

export interface WindowDimensions {
  width: number;
  height: number;
}

const videoAspectRatio = 16 / 9;

function calculateDefaultScreenStyles(dimensions: WindowDimensions): LayoutStyles {
  const { width, height } = dimensions;
  const isPortrait = height >= width;
  const aspectRatio = isPortrait ? 9 / 16 : 16 / 9;

  const cameraStyles = {
    phonePortrait: {
      aspectRatio: aspectRatio,
      height: '100%',
      borderRadius: 16,
    },
    phoneLandscape: {
      aspectRatio: aspectRatio,
      width: '100%',
      bottom: 0,
      borderRadius: 16,
    },
    tabletPortrait: {
      aspectRatio: aspectRatio,
      height: '100%',
      bottom: 0,
      borderRadius: 32,
    },
    tabletLandscape: {
      aspectRatio: aspectRatio,
      width: '80%',
      borderRadius: 32,
      bottom: 0,
    },
  };

  const videoStyles = {
    phonePortrait: {
      aspectRatio: videoAspectRatio,
      width: '50%',
      overflow: 'hidden',
      borderRadius: 16,
    },
    phoneLandscape: {
      aspectRatio: videoAspectRatio,
      width: '30%',
      overflow: 'hidden',
      borderRadius: 16,
    },
    tabletPortrait: {
      aspectRatio: videoAspectRatio,
      width: '50%',
      overflow: 'hidden',
      borderRadius: 32,
    },
    tabletLandscape: {
      aspectRatio: videoAspectRatio,
      width: '20%',
      overflow: 'hidden',
      borderRadius: 32,
    },
  };

  let cameraStyle = null;
  let videoStyle = null;
  let flexDirection = '';

  if (DEVICE_TYPE === 'Phone' && isPortrait) {
    cameraStyle = cameraStyles.phonePortrait;
    videoStyle = videoStyles.phonePortrait;
    flexDirection = 'flex-col';
  } else if (DEVICE_TYPE === 'Phone' && !isPortrait) {
    cameraStyle = cameraStyles.phoneLandscape;
    videoStyle = videoStyles.phoneLandscape;
    flexDirection = 'flex-row-reverse';
  } else if (DEVICE_TYPE === 'Tablet' && isPortrait) {
    cameraStyle = cameraStyles.tabletPortrait;
    videoStyle = videoStyles.tabletPortrait;
    flexDirection = 'flex-col';
  } else if (DEVICE_TYPE === 'Tablet' && !isPortrait) {
    cameraStyle = cameraStyles.tabletLandscape;
    videoStyle = videoStyles.tabletLandscape;
    flexDirection = 'flex-col';
  }

  return {
    cameraStyle,
    videoStyle,
    flexDirection,
    isFullscreen: false,
  };
}

function calculateFullScreenStyles(dimensions: WindowDimensions): LayoutStyles {
  const { width, height } = dimensions;
  const isPortrait = height >= width;
  const aspectRatio = isPortrait ? 9 / 16 : 16 / 9;

  const cameraStyles = {
    phonePortrait: {
      aspectRatio: aspectRatio,
      height: '0%',
      borderRadius: 16,
    },
    phoneLandscape: {
      aspectRatio: aspectRatio,
      width: '0%',
      borderRadius: 16,
    },
    tabletPortrait: {
      aspectRatio: aspectRatio,
      height: '0%',
      borderRadius: 32,
    },
    tabletLandscape: {
      aspectRatio: aspectRatio,
      width: '0%',
      borderRadius: 32,
    },
  };

  const videoStyles = {
    phonePortrait: {
      aspectRatio: videoAspectRatio,
      width: '95%',
      overflow: 'hidden',
      borderRadius: 16,
    },
    phoneLandscape: {
      aspectRatio: videoAspectRatio,
      height: '100%',
      overflow: 'hidden',
      borderRadius: 16,
    },
    tabletPortrait: {
      aspectRatio: videoAspectRatio,
      width: '90%',
      overflow: 'hidden',
      borderRadius: 32,
    },
    tabletLandscape: {
      aspectRatio: videoAspectRatio,
      width: '90%',
      overflow: 'hidden',
      borderRadius: 32,
    },
  };

  let cameraStyle = null;
  let videoStyle = null;
  let flexDirection = '';

  if (DEVICE_TYPE === 'Phone' && isPortrait) {
    cameraStyle = cameraStyles.phonePortrait;
    videoStyle = videoStyles.phonePortrait;
    flexDirection = 'flex-row';
  } else if (DEVICE_TYPE === 'Phone' && !isPortrait) {
    cameraStyle = cameraStyles.phoneLandscape;
    videoStyle = videoStyles.phoneLandscape;
    flexDirection = 'flex-col';
  } else if (DEVICE_TYPE === 'Tablet' && isPortrait) {
    cameraStyle = cameraStyles.tabletPortrait;
    videoStyle = videoStyles.tabletPortrait;
    flexDirection = 'flex-col';
  } else if (DEVICE_TYPE === 'Tablet' && !isPortrait) {
    cameraStyle = cameraStyles.tabletLandscape;
    videoStyle = videoStyles.tabletLandscape;
    flexDirection = 'flex-col';
  }

  return {
    cameraStyle,
    videoStyle,
    flexDirection,
    isFullscreen: true,
  };
}

function calculateSplitScreenStyles(dimensions: WindowDimensions): LayoutStyles {
  const { width, height } = dimensions;
  const isPortrait = height >= width;
  const aspectRatio = isPortrait ? 9 / 16 : 16 / 9;

  const cameraStyles = {
    phonePortrait: {
      aspectRatio: aspectRatio,
      height: '100%',
      borderRadius: 16,
    },
    phoneLandscape: {
      aspectRatio: aspectRatio,
      width: '100%',
      borderRadius: 16,
    },
    tabletPortrait: {
      aspectRatio: aspectRatio,
      height: '100%',
      borderRadius: 32,
    },
    tabletLandscape: {
      aspectRatio: aspectRatio,
      height: '100%',
      borderRadius: 32,
    },
  };

  const videoStyles = {
    phonePortrait: {
      aspectRatio: videoAspectRatio,
      width: '95%',
      overflow: 'hidden',
      borderRadius: 16,
    },
    phoneLandscape: {
      aspectRatio: videoAspectRatio,
      width: '50%',
      overflow: 'hidden',
      borderRadius: 16,
    },
    tabletPortrait: {
      aspectRatio: videoAspectRatio,
      width: '90%',
      overflow: 'hidden',
      borderRadius: 32,
    },
    tabletLandscape: {
      aspectRatio: videoAspectRatio,
      height: '45%',
      overflow: 'hidden',
      borderRadius: 32,
    },
  };

  let cameraStyle = null;
  let videoStyle = null;
  let flexDirection = '';

  if (DEVICE_TYPE === 'Phone' && isPortrait) {
    cameraStyle = cameraStyles.phonePortrait;
    videoStyle = videoStyles.phonePortrait;
    flexDirection = 'flex-col';
  } else if (DEVICE_TYPE === 'Phone' && !isPortrait) {
    cameraStyle = cameraStyles.phoneLandscape;
    videoStyle = videoStyles.phoneLandscape;
    flexDirection = 'flex-row-reverse';
  } else if (DEVICE_TYPE === 'Tablet' && isPortrait) {
    cameraStyle = cameraStyles.tabletPortrait;
    videoStyle = videoStyles.tabletPortrait;
    flexDirection = 'flex-col';
  } else if (DEVICE_TYPE === 'Tablet' && !isPortrait) {
    cameraStyle = cameraStyles.tabletLandscape;
    videoStyle = videoStyles.tabletLandscape;
    flexDirection = 'flex-col';
  }

  return {
    cameraStyle,
    videoStyle,
    flexDirection,
    isFullscreen: false,
  };
}

export function useLayoutManager() {
  const windowDimensions = useWindowDimensions();

  const [layoutState, setLayoutState] = useState<LayoutState>(() => {
    const defaultStyles = calculateDefaultScreenStyles(windowDimensions);
    return {
      ...defaultStyles,
      mode: 'default',
      previousMode: 'default',
    };
  });

  useEffect(() => {
    const recalculateCurrentLayout = () => {
      switch (layoutState.mode) {
        case 'fullscreen':
          return calculateFullScreenStyles(windowDimensions);
        case 'splitscreen':
          return calculateSplitScreenStyles(windowDimensions);
        case 'default':
          return calculateDefaultScreenStyles(windowDimensions);
        default:
          console.log('Defaulting to default screen style.');
          return calculateDefaultScreenStyles(windowDimensions);
      }
    };

    const newStyles = recalculateCurrentLayout();
    setLayoutState((prev) => ({
      ...prev,
      ...newStyles,
    }));
  }, [windowDimensions, layoutState.mode]);

  const getDefaultLayoutStyles = useCallback((dimensions: WindowDimensions): LayoutStyles => {
    return calculateDefaultScreenStyles(dimensions);
  }, []);

  const getFullscreenLayoutStyles = useCallback((dimensions: WindowDimensions): LayoutStyles => {
    return calculateFullScreenStyles(dimensions);
  }, []);

  const getSplitscreenLayoutStyles = useCallback((dimensions: WindowDimensions): LayoutStyles => {
    return calculateSplitScreenStyles(dimensions);
  }, []);

  // Memoize expensive layout computations
  const switchToDefault = useCallback(() => {
    const newStyles = getDefaultLayoutStyles(windowDimensions);
    setLayoutState((prev) => ({
      ...newStyles,
      mode: 'default',
      previousMode: prev.mode,
    }));
  }, [windowDimensions, getDefaultLayoutStyles]);

  const switchToFullscreen = useCallback(() => {
    const newStyles = getFullscreenLayoutStyles(windowDimensions);
    setLayoutState((prev) => ({
      ...newStyles,
      mode: 'fullscreen',
      previousMode: prev.mode,
    }));
  }, [windowDimensions, getFullscreenLayoutStyles]);

  const switchToSplitscreen = useCallback(() => {
    let newStyles = getSplitscreenLayoutStyles(windowDimensions);
    let mode = 'splitscreen' as LayoutMode;
    if (layoutState.mode === 'splitscreen') {
      switch (layoutState.previousMode) {
        case 'fullscreen':
          newStyles = getFullscreenLayoutStyles(windowDimensions);
          mode = 'fullscreen' as LayoutMode;
          break;
        case 'default':
          newStyles = getDefaultLayoutStyles(windowDimensions);
          mode = 'default' as LayoutMode;
          break;
        default:
          break;
      }
    }
    setLayoutState((prev) => ({
      ...newStyles,
      mode: mode,
      previousMode: prev.mode,
    }));
  }, [
    windowDimensions,
    getSplitscreenLayoutStyles,
    getDefaultLayoutStyles,
    getFullscreenLayoutStyles,
    layoutState.mode,
    layoutState.previousMode,
  ]);

  const restorePreviousLayout = useCallback(() => {
    switch (layoutState.previousMode) {
      case 'fullscreen':
        switchToFullscreen();
        break;
      case 'splitscreen':
        switchToSplitscreen();
        break;
      case 'default':
        switchToDefault();
        break;
      default:
        switchToDefault();
        break;
    }
  }, [layoutState.previousMode, switchToFullscreen, switchToSplitscreen, switchToDefault]);

  return {
    layoutState,
    switchToFullscreen,
    switchToSplitscreen,
    switchToDefault,
    restorePreviousLayout,
  };
}
