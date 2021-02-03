// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebase: {
    databaseURL: 'https://savery-thing-default-rtdb.firebaseio.com',
    apiKey: "AIzaSyAqu0uPiQLMcsoD-whN1MZexc-nx6f2W9A",
    authDomain: "savery-thing.firebaseapp.com",
    projectId: "savery-thing",
    storageBucket: "savery-thing.appspot.com",
    messagingSenderId: "319360296341",
    appId: "1:319360296341:web:cbba2b3fd5bc090d17429c"
  },
  appShellConfig: {
    debug: false,
    networkDelay: 500
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
