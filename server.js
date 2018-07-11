var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('方方说：含查询字符串的路径\n' + pathWithQuery)

  if(path === '/'){
    var string = fs.readFileSync('./index.html')
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end(string)
  }else if(path === '/signUp' && method === 'POST'){
  getPostData(request, function (postData) {
      let {email,password,password_confirmation} = postData
      let errors = {}
      // check email
      if(email.indexOf('@') <= 0){
        errors.email = '邮箱不合法'
      }
      if(password.length < 6){
        errors.password = '密码太短'
      }
      if(password_confirmation !== password){
        errors.password_confirmation = '两次输入密码不匹配'
      }

      response.setHeader('Content-Type', 'text/html;charset=utf-8')
      response.end(JSON.stringify(errors))
  })
  }
  else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('呜呜呜')
    response.end()
  }

  /******** 代码结束，下面不要看 ************/
})

function getPostData(request, callback) {
    data = ''
    request.on('data', (chunk) => {
        data += chunk.toString()
    })

    request.on('end', () => {
        let array = data.split('&')
        let postData = {}
        for(var i=0; i<array.length; i++){
            let parts = array[i].split('=')
            let key =parts[0]
            let value = parts[1]
            postData[key] = value
        }
        callback.call(null , postData)
    })
}

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)


