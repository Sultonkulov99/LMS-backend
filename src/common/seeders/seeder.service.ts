import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import * as argon from "argon2"

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(
        private prisma: PrismaService,
    ) { }
    async onModuleInit() {

        // const existsUser = await this.prisma.user.findFirst({
        //     where: {
        //         contact: "+998975661099"
        //     }
        // })

        // if (existsUser) {
        //     Logger.log("✅ Superadmin already exists")
        // }
        // else {
        //     await this.prisma.user.create({
        //         data: {
        //             fullname: "Abduxoshim",
        //             contact: "+998975661099",
        //             email: "abdukhoshim99@gmail.com",
        //             address: "Sirdaryo",
        //             photo: "null",
        //             password: await argon.hash(process.env.PASSWORD as string),
        //         }
        //     })

        //     Logger.log("✅ Superadmin created")
        // }
    }
}