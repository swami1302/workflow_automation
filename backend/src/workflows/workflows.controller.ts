import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { WorkflowsService } from './workflows.service';

@Controller('workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateWorkflowDto) {
    return this.workflowsService.create(user.sub, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@CurrentUser() user: JwtUser) {
    return this.workflowsService.findAll(user.sub);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.workflowsService.findOne(user.sub, id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@CurrentUser() user: JwtUser, @Param('id') id: string, @Body() dto: UpdateWorkflowDto) {
    return this.workflowsService.update(user.sub, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.workflowsService.remove(user.sub, id);
  }
}
