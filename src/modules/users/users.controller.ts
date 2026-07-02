import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from '@prisma/client';
import { RolesGuard } from 'src/common/decorators/roles';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }



  @ApiOperation({
    summary: `${Roles.ADMIN} ${Roles.SUPERADMIN}`
  })
  @UseGuards(AuthGuard, RoleGuard)
  @RolesGuard(Roles.ADMIN, Roles.SUPERADMIN)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        fullname: { type: "string", example: "Alisher" },
        contact: { type: "string" },
        email: { type: "string" },
        role: { type: "string", enum: Object.values(Roles) },
        password: { type: "string" },
        photo: { type: "string", format: "binary" }
      }
    } 
  })
  @Post()
  @UseInterceptors(FileInterceptor("photo", {
    storage: diskStorage({
      destination: "./src/uploads",
      filename: (req, file, cb) => {
        const filename = Date.now() + "." + file.mimetype.split("/")[1]
        cb(null, filename)
      }
    }),
    fileFilter: (req, file, cb) => {
      const existsFileType = ["jpg", "png", "jpeg", "svg"]

      if (!existsFileType.includes(file.mimetype.split("/")[1])) {
        cb(new UnsupportedMediaTypeException(), false)
      }

      cb(null, true)
    }
  }))
  @ApiOperation({ summary: 'Yangi user yaratish' })
  createUser(
    @Body() payload: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.usersService.createUser(payload, file?.filename);
  }

}

