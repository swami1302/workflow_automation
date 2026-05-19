import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkflowDto) {
    const workflow = await this.prisma.workflow.create({
      data: {
        userId,
        title: dto.title,
        status: dto.status,
        definition: (dto.definition ?? { nodes: [], edges: [] }) as Prisma.InputJsonValue,
      },
    });

    return { message: 'Workflow saved successfully', workflow_uuid: workflow.id };
  }

  async findAll(userId: string) {
    return this.prisma.workflow.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        status: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const workflow = await this.prisma.workflow.findUnique({ where: { id } });

    if (!workflow) throw new NotFoundException('Workflow not found');
    if (workflow.userId !== userId) throw new ForbiddenException('Access denied');

    return workflow;
  }

  async update(userId: string, id: string, dto: UpdateWorkflowDto) {
    await this.findOne(userId, id);

    const workflow = await this.prisma.workflow.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.definition !== undefined && { definition: dto.definition as Prisma.InputJsonValue }),
        version: { increment: 1 },
      },
    });

    return { message: 'Workflow updated successfully', workflow_uuid: workflow.id, version: workflow.version };
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.workflow.delete({ where: { id } });
    return { message: 'Workflow deleted successfully' };
  }
}
