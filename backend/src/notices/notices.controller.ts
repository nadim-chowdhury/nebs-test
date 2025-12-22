import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@ApiTags('Notices')
@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notice' })
  @ApiResponse({
    status: 201,
    description: 'The notice has been successfully created.',
  })
  create(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticesService.create(createNoticeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notices' })
  findAll() {
    return this.noticesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notice by id' })
  findOne(@Param('id') id: string) {
    return this.noticesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notice' })
  update(@Param('id') id: string, @Body() updateNoticeDto: UpdateNoticeDto) {
    return this.noticesService.update(+id, updateNoticeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notice' })
  remove(@Param('id') id: string) {
    return this.noticesService.remove(+id);
  }
}
