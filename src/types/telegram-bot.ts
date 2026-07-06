import { HttpStatus } from '@nestjs/common';

interface IInlineKeyboardButton {
  text: string;
  url?: string;
  callback_data?: string;
  web_app?: {
    url: string;
  };
  login_url?: {
    url: string;
    forward_text?: string;
    bot_username?: string;
    request_write_access?: boolean;
  };
  switch_inline_query?: string;
  switch_inline_query_current_chat?: string;
  pay?: boolean;
}

export interface ISendMessageOptions {
  chat_id: string | number;
  message_thread_id?: number;
  text: string;
  parse_mode?: 'html' | 'markdown';
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  reply_to_message_id?: number;
  allow_sending_without_reply?: boolean;
  reply_markup?: IInlineKeyboardButton[];
}

export interface ITelegramResponse {
  ok: boolean;
  error_code?: HttpStatus;
  description?: string;
  result?: {
    message_id: number;
    from?: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username: string;
    };
    chat?: {
      id: number;
      title: string;
      type: string;
    };
    date: number;
    text: string;
    entities?: {
      offset: number;
      length: number;
      type: string;
    }[];
  };
}
