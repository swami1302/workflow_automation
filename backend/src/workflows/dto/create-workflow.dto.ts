import { WorkflowStatus } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWorkflowDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsEnum(WorkflowStatus)
  @IsOptional()
  status?: WorkflowStatus;

  @IsObject()
  @IsOptional()
  definition?: { nodes: Record<string, unknown>[]; edges: Record<string, unknown>[] };
}
