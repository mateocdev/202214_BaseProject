import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';

@Injectable()
export class TiendaService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>,
    ) {}

    async findAll(): Promise<TiendaEntity[]> {
        return await this.tiendaRepository.find({ relations: ['productos'] });
    }

    async findOne(id: string): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}, relations: ['productos']});
        if (!tienda) {
            throw new BusinessLogicException(`Tienda with id ${id} not found`, BusinessError.NOT_FOUND);
        }
        return tienda;
    }

    async create(tienda: TiendaEntity): Promise<TiendaEntity> {
        return await this.tiendaRepository.save(tienda);
    }

    async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
        const tiendaFound: TiendaEntity = await this.tiendaRepository.findOne({where: {id}});
        if (!tiendaFound) {
            throw new BusinessLogicException(`Tienda with id ${id} not found`, BusinessError.NOT_FOUND);
        }
        return await this.tiendaRepository.save(tienda);
    }

    async delete(id: string): Promise<TiendaEntity> {
        const tiendaFound: TiendaEntity = await this.tiendaRepository.findOne({where: {id}});
        if (!tiendaFound) {
            throw new BusinessLogicException(`Tienda with id ${id} not found`, BusinessError.NOT_FOUND);
        }
        return await this.tiendaRepository.remove(tiendaFound);
    }
}
