export enum Severity {
  Emergency = 0,
  Alert = 1,
  Critical = 2,
  Error = 3,
  Warning = 4,
  Notice = 5,
  Informational = 6,
  Debug = 7
}

export enum LogName {
  /** 錯誤日誌 */
  ERROR = 'ggo-error',
  /** toast 日誌 */
  TOAST = 'c-ggo-toast',
  /** 搜尋日誌 */
  SEARCH = 's-ggo-search'
}

export enum LogLevel {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

export enum ErrorType {
  API_ERROR = 'api_error',
  BIND_CARD_ERROR = 'bind_card_error',
  BROWSER_ERROR = 'browser_error',
}

export enum ToastType {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
}
