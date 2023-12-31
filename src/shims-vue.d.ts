declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const content: any;
  export default content;
}
