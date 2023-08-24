import { isString } from 'typechecker'
import { v4 as uuidv4 } from 'uuid'
import { Severity, LogName, LogLevel, ErrorType } from './enums'
import { HttpRequest, Common, User, ErrorParams, ToastParams, SearchParams, SearchLog, ToastLog, ErrorLog } from './interfaces'
import { moreThanOneDay } from './modules/time'
import { getUuid, setUuid } from './modules/uuidStorage'

class GogooutLogger {
  /** browserInfo */
  #ip: string = ''
  #uag: string = ''
  #user!: User

  service: string = ''
  clientType: string = ''
  host: string = ''

  constructor (browserInfo:{
      service: string,
      clientType: string,
      host: string
    }) {
    if (browserInfo.service && isString(browserInfo.service)) this.service = browserInfo.service
    if (browserInfo.clientType && isString(browserInfo.clientType)) this.clientType = browserInfo.clientType
    if (browserInfo.host && isString(browserInfo.host)) this.host = browserInfo.host
  }

  async setup () {
    await this.getBrowserInfo()
    this._setUuid()
  }

  private _setUuid () {
    const uuid = getUuid()
    const obj = {
      uuid: uuidv4(),
      ttl: new Date().getTime()
    }

    if (uuid && uuid?.ttl) {
      if (moreThanOneDay(uuid.ttl)) {
        setUuid(obj)
      }
    } else {
      setUuid(obj)
    }
  }

  private _getUuid () {
    const uuidTtl = getUuid()
    return uuidTtl?.uuid
  }

  private async _getTrace (): Promise<Record<string, string> | null> {
    try {
      const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace')
      const list = (await res.text()).split('\n')

      return list
        .map((i) => {
          const [key, value] = i.split('=')
          return { key, value }
        })
        .reduce((o, i) => ({ ...o, [i.key]: i.value }), {})
    } catch (error) {
      return null
    }
  }

  private async getBrowserInfo () {
    const { ip = '', uag = null } = { ...await this._getTrace() }

    if (ip && isString(ip)) this.#ip = ip
    if (uag && isString(uag)) this.#uag = uag
  }

  private async send (data: object) {
    await fetch(`${this.host}/log`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  setUser (id: number, language: string) {
    this.#user = {
      user_id: String(id),
      language,
      device_id: ''
    }
  }

  /** 錯誤日誌 */
  error (logLevel: LogLevel, data: ErrorParams) {
    const logData: ErrorLog = {
      /** Common */
      log_name: LogName.ERROR,
      log_level: logLevel,
      timestamp: Date.now(),
      ip: this.#ip,
      uag: this.#uag,
      host: this.host,
      service: this.service,
      client_type: this.clientType,

      /** User */
      user: {
        ...this.#user,
        device_id: this._getUuid()
      },

      /** DynamicErrorLog */
      ...data
    }

    this.send(logData)
  }

  toast (logLevel: LogLevel, data: ToastParams) {
    const logData: ToastLog = {
      /** Common */
      log_name: LogName.TOAST,
      log_level: logLevel,
      timestamp: Date.now(),
      ip: this.#ip,
      uag: this.#uag,
      host: this.host,
      service: this.service,
      client_type: this.clientType,

      /** User */
      user: {
        ...this.#user,
        device_id: this._getUuid()
      },

      /** DynamicErrorLog */
      ...data
    }

    this.send(logData)
  }

  search (logLevel: LogLevel, data: SearchParams) {
    const logData: SearchLog = {
      /** Common */
      log_name: LogName.SEARCH,
      log_level: logLevel,
      timestamp: Date.now(),
      ip: this.#ip,
      uag: this.#uag,
      host: this.host,
      service: this.service,
      client_type: this.clientType,

      /** User */
      user: {
        ...this.#user,
        device_id: this._getUuid()
      },

      /** DynamicErrorLog */
      ...data
    }

    this.send(logData)
  }
}

export { GogooutLogger, Severity, LogLevel, ErrorType, HttpRequest, Common, User, ErrorParams, ToastParams, SearchParams, SearchLog, ToastLog, ErrorLog }
