import axios, { AxiosInstance, type AxiosRequestConfig } from 'axios'
import { useMessage } from '@idux/components/message'

const message = useMessage()
// const controller = new AbortController() // controller.abort() 取消请求
const instance: AxiosInstance = axios.create()

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
/* axios实例 END */

interface httpParams {
  method?: 'get' | 'GET' | 'post' | 'POST' | 'options' | 'OPTIONS'
  url: string
  data?: any
}

export function http<T>(params: httpParams | any) {
  const { method = 'get', url, data, ...otherParams } = params
  return new Promise<T>((resolve, reject) => {
    instance({
      method,
      url,
      data,
      ...otherParams
    })
      .then((res) => {
        const result: any = res.data
        if (result.code == 200) {
          resolve(result)
        } else {
          resolve(result)
        }
      })
      .catch((error) => {
        const errorMsg =
          (error.response.data && error.response.data.message) ||
          (error.response.data && error.response.data.msg) ||
          '服务器异常'
        message.error(errorMsg)
        reject(error)
      })
  })
}
