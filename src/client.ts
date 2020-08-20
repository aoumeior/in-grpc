import * as redis from 'redis';
import * as grpc from 'grpc';
import { RedisClient } from 'redis';
import { EventEmitter } from 'events';
import * as  protoLoader from '@grpc/proto-loader';

import { Register, Request, RequestType, logger } from './option';
import * as times from "timers";


export namespace Client {

    export enum MessageType {
        Person = "PersonMessage",
        Group = "GropMessage",
        Other = "Other"
    }

    const PROTO_PATH = __dirname + '/../protos/Onlion.proto';



    const packageDefinition = protoLoader.loadSync(
        PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: false,
        oneofs: true
    });
    const Onlion = grpc.loadPackageDefinition(packageDefinition).Onlion;


    let redisClient: RedisClient;
    let redisClient1: RedisClient;

    class MyEmitter extends EventEmitter { }


    const myEmitter = new MyEmitter();

    myEmitter.on("Startup", function (channel: string, client) {
        myEmitter.on("Message", function (message: string) {
            // const error = new Error();
            // console.log("The listening method for the message must be respecified");
            // console.log(error.stack);
        });

        myEmitter.on('insert', function (key: string, value: string): void {
            redisClient1.set(key, value);
        });

        myEmitter.on('insertALl', function (all: { key: string; value: string; }[]): void {
            for (const onece of all) {
                redisClient1.set(onece.key, onece.value);
            }
        });

        myEmitter.on('PersonMessage', function (id: string | number, ...args: string[]) {
            redisClient1["xadd"](id.toString(), "*", ...args, function (err: any, reply: string) {
                if (err) {
                    return console.error(err);
                }
                client.Publish({ status: 1, type: RequestType.transmit, data: id.toString() + reply } as Request,
                    async function (_error: any, response: Register) { console.log(response); });
            });
        });

        myEmitter.on('GropMessage', function (id: string | number, users: Array<string | number>, ...args: { key: string; value: string; }[]) {
            redisClient1["xadd"](id.toString(), ...args, function (err: any, reply: string) {
                if (err) {
                    return console.error(err);
                }

                for (const user of users) {
                    redisClient1["xgroup"]('CREATE', id.toString(), user.toString(), '0-0', function (err: any, reply: string) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log(reply);
                    });
                }
            });
        });

        myEmitter.emit("Main");
    });

    export function insert(key: string, value: string): void {
        redisClient1.set(key, value);
    }

    export function insertAll(all: { key: string; value: string; }[]): void {
        for (const onece of all) {
            redisClient1.set(onece.key, onece.value);
        }
    }

    export function notic(id: string | number, messageType: MessageType, message: string) {
        myEmitter.emit(messageType, id.toString(), "message", message);
    }

    export async function start(): Promise<void> {
        const client = new Onlion['Listion']('localhost:50055', grpc.credentials.createInsecure());

        const request = { status: 1 } as Request;

        client.Register(request, function (_error: any, response: Register) {

            redisClient = redis.createClient(response.port, response.host, { password: response.certificate });
            redisClient1 = redis.createClient(response.port, response.host, { password: response.certificate });
            redisClient.on("error", function (error) {
                console.error(error);
            });

            redisClient.on("subscribe", function (channel, count) {
                logger.log('监听到订阅事件', channel, count);
                myEmitter.emit("Message", count);
            });
            //在pub的时候会触发 message事件，我们的所有业务处理基本就是靠监听它了
            redisClient.on("message", function (channel, message) {
                logger.log('监听到发布事件');
                logger.log("sub channel " + channel + ": " + message);
                myEmitter.emit("Message", message);
            });
            redisClient.on('ready', function () {
                redisClient.incr('did a thing');
                redisClient.subscribe(response.channel);
                client.Notic(request, function (error: any, cool: any) {
                    myEmitter.emit("Startup", response.channel, client);
                });
            });
        });
    }

    const _message: { "id": string, "messagetype": Client.MessageType, message: string, [name: string]: string; }[] = new Array();
    export const push = _message.push.bind(_message);

    export const on = myEmitter.on.bind(myEmitter);
    Client.on("Main", function () {
        let timer = times.setInterval(function () {
            try {
                const m = _message.pop();
                if (m !== undefined) {
                    Client.notic(m.id, m.messagetype, m.message);
                }
            } catch (e) {
                timer = timer.refresh();
            }
        }, 10);
    });
}