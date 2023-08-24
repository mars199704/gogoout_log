/* eslint-disable camelcase */
import { Severity, LogName, LogLevel, ErrorType, ToastType } from '../enums'

export interface HttpRequest {
  /** 請求完整 url e.g. 'https://gogoout.com/search' */
  url: string;
  /** 請求方法 e.g. 'GET' */
  method: string;
  /** 請求 Headers */
  headers?: Record<string, string | number | boolean>;
  /** 請求參數 query string */
  params?: Record<string, string | number | boolean>;
  /** 請求參數 request body */
  data?: Record<string, string | number | boolean>;
}

export interface Common {
  /** 日誌名 (用於在 OpenSearch 建立 index) */
  log_name: LogName;
  /** 日誌等級 */
  log_level: LogLevel;
  /** 日誌記錄當下的時間戳 */
  timestamp: number;
  /** 發起請求的ip */
  ip: string;
  /** user agent */
  uag: string,
  /** 請求的 host e.g. 'https://gogoout.com' */
  host: string;
  /** 瀏覽器資訊 */
  service: string;
  /** 客戶端類型 e.g. web */
  client_type: string;
}

export interface User {
  /** 用戶id, 未登入為 '-1' */
  user_id: string;
  /** 用戶當前語言配置 */
  language: string;
  /** 裝置 id */
  device_id: string;
}

export interface ErrorParams {
  /** 錯誤嚴重等級 */
  severity: Severity;
  /** 錯誤類型 */
  error_type: ErrorType;
  /** http 請求相關 */
  http_request?: HttpRequest;
  /** 錯誤碼 */
  status_code: number;
  /** 錯誤訊息 */
  message: string;
  /** 錯誤詳情 */
  error_stack: string;
  /** 錯誤發生位置 */
  location: string;
  /** 其他資料 */
  data?: Record<string, any>;
}

export interface ToastParams {
  /** 錯誤訊息 */
  message: string;
  /** 錯誤發生位置 */
  location: string;
  /** 類型
   * success/warning/danger
  */
  type: ToastType;
}

export interface SearchParams {
  /** 時間相關 */
  /** 2023-01-01 */
  start_date: string;
  /** 10:00 */
  start_time: string;
  /** 2023-01-01 */
  end_date: string;
  /** 10:00 */
  end_time: string;

  /** 地點相關 */
  latitude: number;
  longitude: number;
  location_name: string;

  /** 篩選相關 */
  /** 車型 */
  model: number[];
  /** 品牌 */
  brand: number[];
  /** 保險 */
  insurance: number[];
  /** 國際駕照 */
  idp: number[];
  /** 排序方式 */
  order_by: number[];
  /** 搜尋結果 */
  count: number;
}

export interface ErrorLog extends Common, ErrorParams{
  user: User
}

export interface ToastLog extends Common, ToastParams {
  user: User;
}

export interface SearchLog extends Common, SearchParams {
  user: User;
}
