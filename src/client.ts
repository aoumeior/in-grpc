import * as redis from 'redis';
import { promisify } from "util";


import * as grpc from 'grpc';
import { RedisClient } from 'redis';


var PROTO_PATH = __dirname + '/../protos/helloworld.proto';


import * as  protoLoader from '@grpc/proto-loader';

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: false,
    oneofs: true
});
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

// 指定地址和端口号
var client = new hello_proto['Greeter']('localhost:50055',
    grpc.credentials.createInsecure());
var user = 'world';

// client.sayHello(call,callback)
client.sayHello({
    name: user,
    age: 'no'
}, function (err: any, response: any) {
    // callback的 err 是server 来返回的 如果无 null 说明无错误
    if (err === null) {
        // 说明server端没有出现错误 (两段式请求,只能通过 err 来判断)
    }
    // server端给返回的数据 response 和 HelloReply 定义的一样
    console.log('Greeting:', response);
});

interface Register {
    port: number;
    host: string;
    certificate: string;
}

const client1 = new hello_proto['Listion']('localhost:50055',
    grpc.credentials.createInsecure());

const certificate = { port: 6379, host: "localhost" } as Register;

let redisClient: RedisClient;

client1.Onlion(certificate, function (_error: any, response: any) {

    redisClient = redis.createClient(certificate.port, certificate.host, { password: certificate.certificate });

    console.log('Listion', response);
    grpc.closeClient(client);
    grpc.closeClient(client1);
    console.log(client);
});

