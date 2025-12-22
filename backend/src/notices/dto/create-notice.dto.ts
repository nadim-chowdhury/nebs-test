import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticeDto {
  @ApiProperty({ example: 'Annual Performance Review' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'HR & Performance' })
  @IsOptional()
  type?: string;

  @ApiProperty({ example: 'All Department' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: 'Published', default: 'Draft' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '2025-06-20T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ example: 'Details about the review cycle...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: 'all' })
  @IsOptional()
  @IsString()
  targetType?: string;

  @ApiProperty({ example: 'EMP-001' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  employeeName?: string;

  @ApiProperty({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ example: '/uploads/policy.pdf' })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}
