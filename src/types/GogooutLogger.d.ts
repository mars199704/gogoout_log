// types/my-package.d.ts
declare module 'gogoout_mars_log' {
  export class GogooutLogger {
    setup():void;
    setUser():void;
    setBrowserInfo():void;
    error():void;
    toast():void;
    search():void;
  }
}
