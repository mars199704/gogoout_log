import 'dotenv/config'
import { isString } from 'typechecker'
import { v4 as uuidv4 } from 'uuid'
import { LogLevel } from './enums/LogLevel'
import { LogName } from './enums/LogName'
import { ErrorLog, ErrorParams, User } from './interfaces/Logger'
import { moreThanOneDay } from './modules/time'
import { getUuid, setUuid } from './modules/uuidStorage'

// const fluentBitPath = `${process.env.LOG_BASE_URL}/log`
const fluentBitPath = 'https://dev.gogoout.com/log'

class GogooutLogger {
  /** browserInfo */
  ip: string = ''
  service: string = 'Nuxt'
  clientType: string = 'web'
  /** uuid 追蹤使用者的裝置 id，當登入後要將 uuid bind 進 user 中的 device_id */
  uuid: string = ''
  user!: User

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

  private async getTrace (): Promise<Record<string, string> | null> {
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
    const { ip = '' } = { ...await this.getTrace() }

    if (ip && isString(ip)) this.ip = ip
  }

  private async send (data: object) {
    await fetch(fluentBitPath, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  setUser (id: number, language: string) {
    this.user = {
      user_id: String(id),
      language,
      device_id: ''
    }
  }

  /** 測試用 */
  getThis () {
    return this
  }

  /** 錯誤日誌 */
  error (data: ErrorParams) {
    const logData: ErrorLog = {
      /** Common */
      log_name: LogName.ERROR,
      log_level: LogLevel.ERROR,
      timestamp: Date.now(),
      ip: this.ip,
      host: process.env.LOG_BASE_URL || '',
      service: this.service,
      client_type: this.clientType,

      /** User */
      user: {
        ...this.user,
        device_id: this._getUuid()
      },

      /** DynamicErrorLog */
      ...data
    }

    this.send(logData)
  }
}

const ggoLogger = new GogooutLogger()

export { ggoLogger }
