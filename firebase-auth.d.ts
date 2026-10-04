// firebase/auth only types its web entry; Metro resolves the react-native entry at runtime,
// which also exports getReactNativePersistence.
import type { Persistence, ReactNativeAsyncStorage } from "firebase/auth";

declare module "firebase/auth" {
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
