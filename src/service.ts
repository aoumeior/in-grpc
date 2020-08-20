var PROTO_PATH = __dirname + '/../protos/Onlion.proto';
import * as redis from 'redis';
import * as grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import { ServerUnaryCall } from 'grpc';
import { Register, Request } from './option';

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: false,
    oneofs: true
});

const Onlion = grpc.loadPackageDefinition(packageDefinition).Onlion;
const certificate = { port: 6379, host: "localhost", channel: "cc in grpc" } as Register;
const RedisClient = redis.createClient(certificate.port, certificate.host, { password: certificate.certificate });

function onlion(call, callback) {
    callback(null, certificate);
}
const request = { status: 1 } as Request;

function notic(call, callback) {
    callback(null, request);
}

function publish(call: ServerUnaryCall<Request>, callback) {
    RedisClient.publish(certificate.channel, call.request.data,
        function (error: Error, reply: number) { });
    callback(null, request);
}

const server = new grpc.Server();

server.addService(Onlion["Listion"].service, {
    Register: onlion,
    Notic: notic,
    Publish: publish,
});

server.bind('0.0.0.0:50055', grpc.ServerCredentials.createInsecure());
server.start();