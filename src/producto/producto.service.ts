import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({ relations: ['tienda'] });
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['tienda'],
    });
    if (!producto) {
      throw new BusinessLogicException(
        `No existe el producto con id ${id}`,
        BusinessError.NOT_FOUND,
      );
    }
    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    const { tipo } = producto || {};
    if (tipo !== 'perecedero' && tipo !== 'no perecedero') {
      throw new BusinessLogicException(
        `No se puede crear un producto de ${tipo}`,
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.productoRepository.save(producto);
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const productoEncontrado: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id },
      });
    const { tipo } = productoEncontrado || {};
    if (tipo !== 'perecedero' && tipo !== 'no perecedero') {
      throw new BusinessLogicException(
        `No se puede crear un producto de ${tipo}`,
        BusinessError.BAD_REQUEST,
      );
    }
    if (!productoEncontrado) {
      throw new BusinessLogicException(
        `No existe el producto con id ${id}`,
        BusinessError.NOT_FOUND,
      );
    }
    return await this.productoRepository.save({
      ...productoEncontrado,
      ...producto,
    });
  }

  async delete(id: string): Promise<ProductoEntity> {
    const productoEncontrado: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id },
      });
    if (!productoEncontrado) {
      throw new BusinessLogicException(
        `No existe el producto con id ${id}`,
        BusinessError.NOT_FOUND,
      );
    }
    return await this.productoRepository.remove(productoEncontrado);
  }
}
