import axios, { AxiosInstance, type AxiosRequestConfig } from 'axios'
import { Message } from '@arco-design/web-vue'

/*-----  axios实例 START  ----*/
// const controller = new AbortController() // controller.abort() 取消请求
const instance: AxiosInstance = axios.create()
instance.defaults.baseURL = '/api'
instance.defaults.timeout = 2500
instance.defaults.headers.common['Authorization'] = ''
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'

// 添加请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    // 在发送请求之前做些什么
    config.params = {
      ...config.params,
      t: Date.now()
    }
    if (config.data instanceof FormData) {
      Object.assign(config.headers, config.data.getHeaders())
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
instance.interceptors.response.use(
  (response: any) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
/*---- axios实例 END ----*/

export interface apiInter {
  [name: string]: AxiosRequestConfig
}

export function http<T>(params: AxiosRequestConfig) {
  return new Promise<T>((resolve, reject) => {
    instance(params)
      .then((res: any) => {
        if (res.code == 200) {
          resolve(res.result || res.data || res)
        } else {
          resolve(res)
        }
      })
      .catch((error) => {
        const errorMsg =
          (error.response?.data && error.response.data.message) ||
          (error.response?.data && error.response.data.msg) ||
          '服务器异常'
          Message.error(errorMsg)
        reject(error)
      })
  })
}

interface wrapInter {
  [key: string]: Function
}
interface alertConfig {
  loadBar?: boolean
}
export function apiFunc(apiObj: apiInter): wrapInter {
  const apiWrap = Object.create(null)

  for (const [key, cfg] of Object.entries(apiObj)) {
    apiWrap[key] = function(data: object, alerts: alertConfig = {}) {
      const { loadBar = false } = alerts
      const params: AxiosRequestConfig = Object.assign({method: 'get'}, cfg)
      params[params.method === 'post' ? 'data' : 'params'] = Object.assign({}, params.data, data)
      // const res = http(params)
      // console.log(res)
      // return res
      return http(params)
    }
  }

  return apiWrap
}