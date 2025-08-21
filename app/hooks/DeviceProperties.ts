import { useWindowDimensions, Platform } from 'react-native';
import * as Device from 'expo-device';

export const DEVICE_NAME = Device.modelName;
export const DEVICE_BRAND = Device.brand;

const getDeviceType = (type: Device.DeviceType | null) => {
  switch (type) {
    case Device.DeviceType.PHONE:
      return 'Phone';
    case Device.DeviceType.TABLET:
      return 'Tablet';
    case Device.DeviceType.DESKTOP:
      return 'Desktop';
    case Device.DeviceType.TV:
      return 'TV';
    default:
      return 'Unknown';
  }
};
export const DEVICE_TYPE = getDeviceType(Device.deviceType);

export const DEVICE_OS = Device.osName;
export const DEVICE_OS_VER = Device.osVersion;

/**
 * Uses a useWindowDimensions hook to dynamically acquire device width and height in density independent pixels at runtime.
 * @returns {boolean} True if the device is in portrait mode, false if in landscape.
 */
export function useIsPortrait() {
  const { width, height } = useWindowDimensions();
  return height >= width;
}
