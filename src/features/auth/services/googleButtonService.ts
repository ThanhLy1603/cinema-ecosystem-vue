import type { GoogleAccountsId } from '@/types/auth/google';

const GOOGLE_SCRIPT_URL: string = 'https://accounts.google.com/gsi/client';
const MAX_BUTTON_WIDTH: number = 400;
const WIDE_BUTTON_MIN_WIDTH: number = 330;

let googleAccountsIdPromise: Promise<GoogleAccountsId> | null = null;

function loadGoogleAccountsId(): Promise<GoogleAccountsId> {
   if (googleAccountsIdPromise !== null) {
      return googleAccountsIdPromise;
   }

   googleAccountsIdPromise = new Promise<GoogleAccountsId>((resolve, reject): void => {
      const scriptElement: HTMLScriptElement = document.createElement('script');
      scriptElement.src = GOOGLE_SCRIPT_URL;
      scriptElement.async = true;

      function handleError(): void {
         googleAccountsIdPromise = null;
         scriptElement.remove();
         reject(new Error('Không tải được Google Identity Services'));
      }

      function handleLoad(): void {
         const googleAccountsId: GoogleAccountsId | undefined = window.google?.accounts.id;
         if (googleAccountsId) {
            resolve(googleAccountsId);
            return;
         }
         handleError();
      }

      scriptElement.addEventListener('load', handleLoad);
      scriptElement.addEventListener('error', handleError);
      document.head.appendChild(scriptElement);
   });

   return googleAccountsIdPromise;
}

export function mountGoogleButton(
   containerElement: HTMLElement,
   googleClientId: string,
   onCredential: (idToken: string) => void,
   onLoadError: () => void,
): () => void {
   let isCancelled: boolean = false;
   let resizeObserver: ResizeObserver | null = null;
   let renderedWidth: number = 0;

   function drawButton(googleAccountsId: GoogleAccountsId): void {
      const buttonWidth: number = Math.min(containerElement.clientWidth, MAX_BUTTON_WIDTH);
      if (buttonWidth === renderedWidth || buttonWidth === 0) {
         return;
      }
      renderedWidth = buttonWidth;
      containerElement.replaceChildren();
      googleAccountsId.renderButton(containerElement, {
         type: 'standard',
         theme: 'outline',
         size: 'large',
         text: buttonWidth < WIDE_BUTTON_MIN_WIDTH ? 'signin_with' : 'continue_with',
         shape: 'pill',
         locale: 'vi',
         width: buttonWidth,
      });
   }

   function handleCredential(credential: string): void {
      onCredential(credential);
   }

   function renderButton(googleAccountsId: GoogleAccountsId): void {
      if (isCancelled) {
         return;
      }
      googleAccountsId.initialize({
         client_id: googleClientId,
         callback: (googleCredentialResponse) => handleCredential(googleCredentialResponse.credential),
      });
      drawButton(googleAccountsId);
      resizeObserver = new ResizeObserver((): void => drawButton(googleAccountsId));
      resizeObserver.observe(containerElement);
   }

   function handleLoadError(): void {
      if (!isCancelled) {
         onLoadError();
      }
   }

   loadGoogleAccountsId().then(renderButton, handleLoadError);

   return (): void => {
      isCancelled = true;
      resizeObserver?.disconnect();
      containerElement.replaceChildren();
   };
}
