var PROTO_PATH = __dirname + '/../protos/helloworld.proto';
import * as redis from 'redis';
import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: false,
    oneofs: true
});
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function sayHello(call: { request: { name: string; }; }, callback: (arg0: any, arg1: { message: string; }) => void) {
    // call 是 gRPC 给封装好的对象
    // callback 是client要执行的回调
    // request对象中,只有 HelloRequest 中定义的字段
    console.log(call.request);
    // callback 第一个参数,如果报错可以传入 error
    let err = null;
    // callback 第二个参数,返回的字段也和 HelloReply 相同
    callback(err, {
        message: 'Hello ' + call.request.name
    });
}


interface Register {
    port: number;
    host: string;
    certificate?: string;
}

function Onlion(call, callback) {

    const value = call.request as Register;

    const RedisClient = redis.createClient(value.port, value.host, { password: value.certificate });
    callback(null, { status: 0, message: "success" });
}


var server = new grpc.Server();
server.addService(hello_proto['Greeter'].service, {
    sayHello: sayHello
});

server.addService(hello_proto["Listion"].service, {
    Onlion: Onlion
});
// 这里绑定的地址要和client请求的一致
server.bind('0.0.0.0:50055', grpc.ServerCredentials.createInsecure());
server.start();
