import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Get('mentor/:id')
  getMentor(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getMentor(id);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Get()
  getUsers(@Query() query: FetchUsersDto) {
    return this.usersService.getUsers(query);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('single/:id')
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUser(id);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Get('by-phone/:phone')
  getUserByPhone(@Param() params: FetchUserByPhoneParamsDto) {
    return this.usersService.getUserByPhone(params.phone);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN} ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Post('create/admin')
  createAdmin(@Body() payload: CreateUserDto) {
    return this.usersService.createAdmin(payload);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN} ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Post('create/mentor')
  createMentor(@Body() payload: CreateMentorDto) {
    return this.usersService.createMentor(payload);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR},  ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Post('create/assistant')
  createAssistant(@Body() payload: CreateAssistantDto, @Req() req) {
    return this.usersService.createAssistant(payload, req.user as TAuthUser);
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR},  ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN])
  @Patch('mentor/:id')
  updateMentor(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateMentorDto) {
    return this.usersService.updateMentor(payload, id);
    
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MENTOR])
  @Patch('student/:id')
  updateStudent(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateUserDto) {
    return this.usersService.updateStudent(payload, id);
    
  }

  @ApiOperation({
    summary: `${UserRole.ADMIN}, ${UserRole.MENTOR}, ${UserRole.ASSISTANT}, ${UserRole.SUPER_ADMIN}`,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.MENTOR, UserRole.SUPER_ADMIN, UserRole.ASSISTANT])
  @Patch('assistant/:id')
  updateAssistant(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateUserDto) {
    return this.usersService.updateAsistent(payload, id);
    
  }

  @ApiOperation({
    summary:`${UserRole.ADMIN},  ${UserRole.SUPER_ADMIN}`
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
