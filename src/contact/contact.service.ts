import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type {
  ISendMessageOptions,
  ITelegramResponse,
} from '../types/telegram-bot';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  private readonly TG_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  private readonly TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  private readonly $telegramApi = `https://api.telegram.org/bot${this.TG_BOT_TOKEN}`;

  async $sendMessageBot(
    message: string,
    options?: Partial<Omit<ISendMessageOptions, 'text'>>,
  ) {
    try {
      const { data } = await axios.post<
        any,
        AxiosResponse<ITelegramResponse>,
        ISendMessageOptions
      >(this.$telegramApi + '/sendMessage', {
        text: message,
        chat_id: this.TG_CHAT_ID,
        ...options,
      });
      if (!data?.ok) {
        throw data;
      }
      return data;
    } catch (err) {
      const error = err?.response?.data;
      throw new HttpException(
        error?.description || 'Telegram error!',
        error?.error_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async contact(data: ContactDto) {
    const message = `📄 *Ariza* #contact

👤 *To'liq ism:* _${data.fullName}_
📞 *Telefon raqami:* _${data?.phone || '-'}_
✍️ *Xabar:* _${data.message}_`;
    await this.$sendMessageBot(message, {
      parse_mode: 'markdown',
    });
    return {
      ok: true,
    };
  }
}
