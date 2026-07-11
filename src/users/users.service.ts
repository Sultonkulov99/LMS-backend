import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '../utils/bcrypt';
import { TAuthUser, UserRole } from '../types/user';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { FetchUsersDto } from './dto/fetch-users.dto';
import { PromiseManyData } from '../types/common/data-response';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { PrismaService } from 'src/core/database/prisma.service';
import { Status } from '@prisma/client';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  private selectUser = {
    id: true,
    fullName: true,
    phone: true,
    role: true,
    status: true,
    image: true,
    courses: true,
    assignedCourses: true,
    createdAt: true,
  };

  private async checkUserPhoneNotExists(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (user) {
      throw new BadRequestException(
        'User with given phone number is already exists',
      );
    }
    return phone;
  }

  private async checkUserPhoneForUpdate(phone: string, id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        phone,
        NOT: { id }
      },
    });
    if (user) {
      throw new BadRequestException(
        'User with given phone number is already exists',
      );
    }
    return phone;
  }

  async getUsers(query: FetchUsersDto): PromiseManyData<TAuthUser> {
    const pquery = {
      where: {
        status: Status.ACTIVE,
        role: query?.role || undefined,
        OR: query?.search
          ? [
            {
              fullName: {
                search: query?.search.replace(/\s/g, ' | '),
              },
            },
            {
              phone: {
                search: query?.search.replace(/\s/g, ' | '),
              },
            },
          ]
          : undefined,
      },
    };
    const [total, data] = await this.prisma.$transaction([
      this.prisma.user.count(pquery),
      this.prisma.user.findMany({
        ...pquery,
        skip: +query?.offset || 0,
        take: +query?.limit || 8,
        select: this.selectUser,
      }),
    ]);
    return { total, data };
  }

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id, status: Status.ACTIVE },
      select: {
        ...this.selectUser,
        _count: {
          select: {
            courses: true,
            purchasedCourses: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getMentors() {
    const mentors = await this.prisma.user.findMany({
      where: { role: UserRole.MENTOR, status: Status.ACTIVE },
      select: {
        id: true,
        image: true,
        fullName: true,
        mentorProfile: true,
      },
    });

    return mentors
  }

  async getMentor(id: number) {
    const mentor = await this.prisma.user.findUnique({
      where: { id, role: UserRole.MENTOR, status: Status.ACTIVE },
      select: {
        ...this.selectUser,
        mentorProfile: true,
        courses: true,
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });
    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }
    return mentor;
  }

  async getUserByPhone(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        phone,
        status: Status.ACTIVE
      },
      select: this.selectUser,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createAdmin(payload: CreateUserDto) {
    await this.checkUserPhoneNotExists(payload.phone);
    const hashedPassword = await hashPassword(payload.password);
    return this.prisma.user.create({
      data: {
        phone: payload.phone,
        role: UserRole.ADMIN,
        password: hashedPassword,
        fullName: payload.fullName,
      },
      select: this.selectUser,
    });
  }

  async createMentor(payload: CreateMentorDto) {
    await this.checkUserPhoneNotExists(payload.phone);
    const { phone, fullName, password } = payload;
    delete payload.phone;
    delete payload.fullName;
    delete payload.password;
    const hashedPassword = await hashPassword(password);
    return this.prisma.user.create({
      data: {
        phone: phone,
        fullName: fullName,
        password: hashedPassword,
        role: UserRole.MENTOR,
        mentorProfile: {
          create: payload,
        },
      },
      select: { ...this.selectUser, mentorProfile: true },
    });
  }

  async createAssistant(payload: CreateAssistantDto, authUser: TAuthUser) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: payload.courseId,
        mentorId: authUser.role === UserRole.MENTOR ? authUser.id : undefined,
      },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    await this.checkUserPhoneNotExists(payload.phone);
    const hashedPassword = await hashPassword(payload.password);
    return this.prisma.user.create({
      data: {
        phone: payload.phone,
        role: UserRole.ASSISTANT,
        password: hashedPassword,
        fullName: payload.fullName,
        assignedCourses: {
          create: {
            courseId: payload.courseId,
          },
        },
      },
      select: this.selectUser,
    });
  }

  async updateMentor(payload: UpdateMentorDto, id: number) {
    const mentor = await this.prisma.user.findUnique({
      where: { id, role: UserRole.MENTOR, status: Status.ACTIVE },
      select: {
        ...this.selectUser,
        password: true,
        mentorProfile: true,
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }

    if(payload?.phone) {
      await this.checkUserPhoneForUpdate(payload.phone, id);
    }

    const { phone, fullName, password } = payload;
    let hashedPassword = mentor.password
    delete payload.phone;
    delete payload.fullName;
    delete payload.password;

    if(payload?.password) {
      hashedPassword = await hashPassword(password);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        phone: phone,
        fullName: fullName,
        password: hashedPassword,
        role: UserRole.MENTOR,
        mentorProfile: {
          update: payload,
        },
      },
      select: { ...this.selectUser, mentorProfile: true },
    });
  }

  async updateAsistent(payload: UpdateUserDto, id: number) {
    const assistant = await this.prisma.user.findUnique({
      where: { id, role: UserRole.ASSISTANT, status: Status.ACTIVE },
      select: {
        ...this.selectUser,
        password: true,
        mentorProfile: true,
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    if (!assistant) {
      throw new NotFoundException('Mentor not found');
    }

    if(payload?.phone) {
      await this.checkUserPhoneForUpdate(payload.phone, id);
    }

    const { phone, fullName, password } = payload;
    let hashedPassword = assistant.password
    delete payload.phone;
    delete payload.fullName;
    delete payload.password;

    if(payload?.password) {
      hashedPassword = await hashPassword(password);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        phone: phone,
        fullName: fullName,
        password: hashedPassword,
        role: UserRole.ASSISTANT,
      },
      select: { ...this.selectUser, assignedCourses: true },
    });
  }

  async updateStudent(payload: UpdateUserDto, id: number) {
    const student = await this.prisma.user.findUnique({
      where: { id, role: UserRole.STUDENT, status: Status.ACTIVE },
      select: {
        ...this.selectUser,
        password: true,
        _count: {
          select: {
            courses: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Mentor not found');
    }

     if(payload?.phone) {
      await this.checkUserPhoneForUpdate(payload.phone, id);
    }

    const { phone, fullName, password } = payload;
    let hashedPassword = student.password
    delete payload.phone;
    delete payload.fullName;
    delete payload.password;

    if(payload?.password) {
      hashedPassword = await hashPassword(password);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        phone: phone,
        fullName: fullName,
        password: hashedPassword,
        role: UserRole.STUDENT,
      },
      select: { ...this.selectUser },
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            courses: {
              where: {
                published: true,
              },
            },
            purchasedCourses: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user._count.courses) {
      throw new BadRequestException(
        `User has ${user._count.courses} published courses. Please change these courses' author first to delete`,
      );
    }
    if (user._count.purchasedCourses) {
      throw new BadRequestException(
        'User has purchased courses! You cannot delete user',
      );
    }
    await this.prisma.user.update({ where: { id }, data: { status: Status.INACTIVE } });
    return {
      success: true,
      message: 'User deleted',
    };
  }
}
