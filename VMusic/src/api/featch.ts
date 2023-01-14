import axios, { AxiosInstance, type AxiosRequestConfig } from 'axios'
import { Message } from '@arco-design/web-vue'

/*-----  axios实例 START  ----*/
// const controller = new AbortController() // controller.abort() 取消请求
const isdev = location.href.indexOf('netlify.app') < 0
const instance: AxiosInstance = axios.create()
instance.defaults.baseURL =
  (isdev ? '/api' : '') + '/.netlify/functions/cld/cld'
instance.defaults.timeout = 9500
instance.defaults.headers.common['Authorization'] = ''
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'

// 添加请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    // 在发送请求之前做些什么
    config.params = {
      ...config.params
    }
    if (config.data instanceof FormData) {
      Object.assign(config.headers, config.data.getHeaders())
    }
    config.url = ''
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
      .then((result: any) => {
        const res: any = {
          success: result.code === 200,
          ...result
        }
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

interface funcInter {
  [key: string]: (data?: any, alerts?: alertConfig) => Promise<any>
}
interface alertConfig {
  loadBar?: boolean
}
export function apiFunc(apiObj: apiInter): funcInter {
  const apiWrap = Object.create(null)

  for (const [key, cfg] of Object.entries(apiObj)) {
    apiWrap[key] = (data?: any, alerts?: alertConfig) => {
      const params: AxiosRequestConfig = Object.assign({ method: 'post' }, cfg)
      params[params.method === 'post' ? 'data' : 'params'] = Object.assign(
        {
          queryPath: cfg.url
        },
        params.data,
        data
      )
      return http(params)
    }
  }

  return apiWrap
}
