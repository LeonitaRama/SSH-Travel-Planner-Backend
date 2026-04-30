// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../prisma/prisma.service';

// @Injectable()
// export abstract class BaseService<T> {
//   // Pass the specific prisma model delegate (e.g., this.prisma.user)
//   constructor(
//     protected readonly prisma: PrismaService,
//     protected readonly model: any, 
//   ) {}

//   async findAll(): Promise<T[]> {
//     return this.model.findMany();
//   }

//   async findOne(id: string | number): Promise<T> {
//     const item = await this.model.findUnique({ where: { id } });
//     if (!item) throw new NotFoundException(`Record with ID ${id} not found`);
//     return item;
//   }

//   async create(data: any): Promise<T> {
//     return this.model.create({ data });
//   }

//   async update(id: string | number, data: any): Promise<T> {
//     return this.model.update({
//       where: { id },
//       data,
//     });
//   }

//   async remove(id: string | number): Promise<T> {
//     return this.model.delete({ where: { id } });
//   }
// }
