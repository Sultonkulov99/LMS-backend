import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}


  async createUser(payload: CreateUserDto,fileName?:string) {
    const exists = await this.prisma.user.findFirst({
      where: {
        OR:[
          {email:payload.email},
          {contact:payload.contact}
        ]
      },
    }); 

    if (exists) throw new ConflictException('User already exists');

    const hash =  await argon.hash(payload.password)
    
    await this.prisma.user.create({
      data:{
        ...payload,
        photo: fileName || null,
        password: hash,
      }
    })

    return {
      success: true,
      message: "User created successfully"
    };
  }

  
}

