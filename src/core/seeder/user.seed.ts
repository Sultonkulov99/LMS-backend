import { Injectable, OnModuleInit } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { PrismaService } from "src/core/database/prisma.service";
import { hashPassword } from "src/utils/bcrypt";

@Injectable()
export class UserSeed implements OnModuleInit{
    constructor(private prisma : PrismaService){}
    async onModuleInit() { 
        const userExists = await this.prisma.user.findFirst({
            where:{phone:process.env.APP_SUPERUSER_PHONE!}
        })
        if(userExists) return 
        await this.prisma.user.create({
            data:{ 
                phone: process.env.APP_SUPERUSER_PHONE!,
                fullName: "SuperAdmin",
                password: await hashPassword(process.env.APP_SUPERUSER_PASSWORD!),
                role: UserRole.SUPER_ADMIN
            } 
        }) 
    } 
}