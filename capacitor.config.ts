import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.softvision.app',
  appName: 'Softvision',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
