const Koa = require('koa');
const koaBody = require('koa-body');
const error  = require('koa-json-error');
const parameter = require('koa-parameter');
const mongoose = require('mongoose');
const app = new Koa();
const routing  = require('./routes');
const static = require('koa-static');
const path = require('path');
const { connectionStr } = require('./config');
const cors = require('koa2-cors');

mongoose.connect(connectionStr,{ useNewUrlParser: true },()=>console.log('mongodb启动啦！'));
mongoose.connection.on('error',console.error);

// app.use(cors());

const staticPath = './dist'
// app.use(static(
//     path.join( __dirname,'..', staticPath)
// ))
app.use(static(
    path.join(__dirname,'publics')
))

console.log(path)

app.use(error({
    postFormat: (e, {stack,...rest})=>process.env.NODE_ENV === 'production' ? rest: {stack,...rest}
}));
app.use(koaBody({
    multipart:true,
    formidable:{
        uploadDir:path.join(__dirname,'./publics/uploads'),
        keepExtensions: true
    }
}));
app.use(parameter(app));
routing(app);

app.listen(3000,() => console.log('程序启动在 3000 端口啦'));