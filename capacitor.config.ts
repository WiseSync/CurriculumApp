import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.play',
  appName: 'play',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
