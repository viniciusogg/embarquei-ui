// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api',
  // apiUrl: 'http://192.168.2.103:8000/api',
  domain: '127.0.0.1:8000',
  // domain: '192.168.2.103:8000',
  firebase: {
    apiKey: "AIzaSyDs64iL2t1zsXBmljC30c2m8BbPP51_SxE",
    authDomain: "embarquei-app.firebaseapp.com",
    databaseURL: "https://embarquei-app.firebaseio.com",
    projectId: "embarquei-app",
    storageBucket: "embarquei-app.appspot.com",
    messagingSenderId: "990913480286"
  }
};
