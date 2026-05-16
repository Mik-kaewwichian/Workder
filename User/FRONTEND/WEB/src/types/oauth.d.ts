// Google Sign-In types
interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GoogleSignInButton {
  initialize: (config: any) => void;
  renderButton: (element: HTMLElement, options: any) => void;
}

interface GoogleAccounts {
  id: GoogleSignInButton;
}

interface Google {
  accounts: GoogleAccounts;
}

// Facebook SDK types
interface FacebookAuthResponse {
  accessToken: string;
  userID: string;
  expiresIn: number;
  signedRequest: string;
  graphDomain: string;
  data_access_expiration_time: number;
}

interface FacebookLoginResponse {
  authResponse: FacebookAuthResponse | null;
  status: string;
}

interface FacebookSDK {
  init: (config: any) => void;
  login: (callback: (response: FacebookLoginResponse) => void, options: any) => void;
  getLoginStatus: (callback: (response: FacebookLoginResponse) => void) => void;
}

declare global {
  interface Window {
    google?: Google;
    FB?: FacebookSDK;
    fbAsyncInit?: () => void;
  }
}

export {};
