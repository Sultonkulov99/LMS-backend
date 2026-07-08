import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TAuthUser, UserRole } from '../types/user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../global/guards/roles.guard';
import { Roles } from '../global/decorators/roles';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { FetchUsersDto } from './dto/fetch-users.dto';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { FetchUserByPhoneParamsDto } from './dto/fetch-user-by-phone.dto';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('mentor/:id')
  getMentor(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getMentor(id);
  }

  @ApiOperation({
    summary: UserRole.ADMIN,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  @Get()
  getUsers(@Query() query: FetchUsersDto) {
    return this.usersService.getUsers(query);
  }

  @ApiOperation({
    summary: UserRole.ADMIN,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('single/:id')
  @Roles([UserRole.ADMIN])
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(+id);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR])
  @Get('by-phone/:phone')
  getUserByPhone(@Param() params: FetchUserByPhoneParamsDto) {
    return this.usersService.getUserByPhone(params.phone);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN} ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN,UserRole.SUPER_ADMIN])
  @Post('create/admin')
  createAdmin(@Body() payload: CreateUserDto) {
    return this.usersService.createAdmin(payload);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN} ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN,UserRole.SUPER_ADMIN])
  @Post('create/mentor')
  createMentor(@Body() payload: CreateMentorDto) {
    return this.usersService.createMentor(payload);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR])
  @Post('create/assistant')
  createAssistant(@Body() payload: CreateAssistantDto, @Req() req) {
    return this.usersService.createAssistant(payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: UserRole.ADMIN,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
