// import { Injectable, OnModuleInit } from "@nestjs/common";
// import Redis from "ioredis";

// @Injectable()
// export class RedisServise implements OnModuleInit {
//     private client : Redis

//     onModuleInit() {
//         this.client = new Redis({
//             host: process.env.HOST || "localhost"
//         })
//     }

//     async setRedis(key:string,value:string){
//         this.client.set(key,value,"EX",120)
//     }

//     async getRedis(key:string){
//         return this.client.get(key)
//     }

//     async deleteRedis(key:string){
//         return this.client.del(key)
//     }

// }