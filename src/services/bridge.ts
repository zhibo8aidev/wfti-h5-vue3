import { showToast } from '@/stores/appState';

export function placeholderAction(): void {
  showToast('待开发');
}

export const bridge = {
  ensureLogin: placeholderAction,
  share: placeholderAction,
  saveImage: placeholderAction,
  openRoute: placeholderAction,
  getEnv() {
    return {
      platform: 'web',
      bridgeReady: false
    };
  }
};
