import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiTags } from '@nestjs/swagger';
import { ContactDto } from './dto/contact.dto';

@ApiTags('Contact')
@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  contact(@Body() data: ContactDto) {
    return this.contactService.contact(data);
  }
}
