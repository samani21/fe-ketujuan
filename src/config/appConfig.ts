export const appConfig = {
  apiUrl: "http://api-katujuan.local", //local
//   apiUrl: "https://api.katujuan.net", //production
  appDomain: "localhost", //local
//   appDomain: "katujuan.net", //production
  isProduction: 'production',

  // --- HELPER UNTUK REDIRECT KE SUBDOMAIN ---
  getTenantUrl: (subdomain: string, path: string = '') => {
    if (typeof window === 'undefined') return '';
    
    const protocol = window.location.protocol; // http: atau https:
    const port = window.location.port ? `:${window.location.port}` : '';
    
    // Hasilnya: http://dapur-mbm.localhost:3000/login (Local)
    // Atau: https://dapur-mbm.katujuan.net/login (Production)
    return `${protocol}//${subdomain}.${appConfig.appDomain}${port}${path}`;
  }
};