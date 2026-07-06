import { Module } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { UserSeed } from "./user.seed";

@Module({
    providers: [PrismaService,UserSeed],
    exports:[UserSeed] 
})
export class SeederModule{}