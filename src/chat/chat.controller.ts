import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from 'src/chat/chat-service';
import { ChatDTO } from 'src/chat/dtos/chat.dtos';
import { Chat } from 'src/chat/schema/chat.schema';
import { GuardsGuard } from 'src/guards/guards.guard';

@Controller('api/chat')
@UseGuards(GuardsGuard) // Uncomment if you want to protect routes
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:userId1/:userId2')
  async getMessages(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '50',
  ) {
    try {
      const messages = await this.chatService.getMessage(
        userId1,
        userId2,
        parseInt(page),
        parseInt(pageSize),
      );

      return {
        success: true,
        data: messages.reverse(), // Reverse to show oldest first
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Get('unread/:userId')
  async getUnreadMessages(@Param('userId') userId: string) {
    try {
      const messages = await this.chatService.getUnreadMessages(userId);

      return {
        success: true,
        data: messages,
        count: messages.length,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Post('mark-read')
  async markAsRead(@Body() body: { senderId: string; receiverId: string }) {
    try {
      await this.chatService.markMessagesAsRead(body.senderId, body.receiverId);

      return {
        success: true,
        message: 'Messages marked as read',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Post('send')
  async sendMessage(@Body() chatDto: ChatDTO) {
    try {
      const savedMessage = await this.chatService.saveMessage(chatDto);

      return {
        success: true,
        data: savedMessage,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Get('message/:messageId')
  async getMessage(@Param('messageId') messageId: string) {
    try {
      const message = await this.chatService.getMessageById(messageId);

      if (!message) {
        return {
          success: false,
          message: 'Message not found',
          status: HttpStatus.NOT_FOUND,
        };
      }

      return {
        success: true,
        data: message,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Get('conversations/:userId')
  async getConversations(@Param('userId') userId: string) {
    try {
      const conversations = await this.chatService.getConversations(userId);

      return {
        success: true,
        data: conversations,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Delete('message/:messageId')
  async deleteMessage(
    @Param('messageId') messageId: string,
    @Body() body: { userId: string },
  ) {
    try {
      const deleted = await this.chatService.deleteMessage(messageId, body.userId);

      if (!deleted) {
        return {
          success: false,
          message: 'Message not found or you do not have permission to delete',
          status: HttpStatus.NOT_FOUND,
        };
      }

      return {
        success: true,
        message: 'Message deleted successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}