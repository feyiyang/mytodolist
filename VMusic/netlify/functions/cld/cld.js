// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
import https from "node:https"
import querystring from 'node:querystring'
exports.handler = function(event, context, callback) {  
  try {
    let bodydata = querystring.parse(event.body)
    let queryPath = bodydata.queryPath || event.queryStringParameters.queryPath
    let retdata = ''
    let { queryPath : qpath, ...queryData} = event.httpMethod === 'GET' ? event.queryStringParameters : {}
    console.log(queryPath + `?${querystring.stringify(queryData) + '&'}_t=${Date.now()}`)
    const options = {
      hostname: 'service-acvb5yn4-1253457920.nj.tencentapigw.com',
      path: '/release' + queryPath + `?_t=${Date.now()}&${querystring.stringify(queryData)}`,
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    delete bodydata.queryPath
    const req = https.request(options, (res) => {
      console.log(`状态码: ${res.statusCode}`);
      // console.log(`响应头: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        // console.log(`响应主体: ${chunk}`);
        retdata += chunk
        // console.log(retdata)
      });
      res.on('end', () => {
        console.log('响应中已无数据。');
        try {
          switch(res.statusCode) {
            case 200:
              JSON.parse(retdata)
              callback(null, {
                statusCode: res.statusCode,
                headers: {
                  // "Access-Control-Allow-Origin" : "*",
                  'Content-Type': 'application/json'
                },
                body: retdata
              })
              return
            default:
              console.log('bodydata::' + querystring.stringify(bodydata))
              throw Error(res)
          }
          
        } catch(e) {
          console.error('May Error Code::' + JSON.stringify(e))
          callback(null, {
            statusCode: res.statusCode,
            headers: {
              'Content-Type': 'application/json'
            },
            body: retdata
          })
        }
      });
    });
    req.on('error', (e) => {
      console.error(e);
    });
    req.write(JSON.stringify(bodydata))
    req.end()
  } catch(err) {
    console.error(err)
    callback(null, {
      statusCode: 500,
      message: '服务器错误'
    })
  }
}
