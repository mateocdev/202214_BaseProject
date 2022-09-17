import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductoTiendaService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async addStoreToProduct(productId: string, storeId: string) {
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });

    if (!producto) {
      throw new BusinessLogicException(
        `No existe un producto con el id ${productId}`,
        BusinessError.NOT_FOUND,
      );
    }
    const tienda = await this.tiendaRepository.findOne({
      where: { id: storeId },
    });

    if (!tienda) {
      throw new BusinessLogicException(
        `No existe una tienda con el id ${storeId}`,
        BusinessError.NOT_FOUND,
      );
    }


    producto.tiendas = [...producto.tiendas, tienda];
    await this.productoRepository.save(producto);
  }

  async findStoresFromProduct(productId: string) {
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });

    if (!producto) {
      throw new BusinessLogicException(
        `No existe un producto con el id ${productId}`,
        BusinessError.NOT_FOUND,
      );
    }

    return producto.tiendas;
  }

  async findStoreFromProduct(productId: string, storeId: string) {
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });

    if (!producto) {
      throw new BusinessLogicException(
        `No existe un producto con el id ${productId}`,
        BusinessError.NOT_FOUND,
      );
    }

    const tienda = producto.tiendas.find((tienda) => tienda.id === storeId);

    if (!tienda) {
      throw new BusinessLogicException(
        `No existe una tienda con el id ${storeId} para el producto con id ${productId}`,
        BusinessError.NOT_FOUND,
      );
    }

    return tienda;
  }

  async updateStoresFromProduct(productId: string, tiendas: TiendaEntity[]) {
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });

    if (!producto) {
      throw new BusinessLogicException(
        `No existe un producto con el id ${productId}`,
        BusinessError.NOT_FOUND,
      );
    }

    for (let i = 0; i < tiendas.length; i++) {
      const tienda: TiendaEntity = await this.tiendaRepository.findOne({
        where: { id: tiendas[i].id },
      });

      if (!tienda) {
        throw new BusinessLogicException(
          `No existe una tienda con el id ${tiendas[i]}`,
          BusinessError.NOT_FOUND,
        );
      }
    }

    producto.tiendas = tiendas;
    return await this.productoRepository.save(producto);
  }

  async deleteStoreFromProduct(productId: string, storeId: string) {
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });

    if (!producto) {
      throw new BusinessLogicException(
        `No existe un producto con el id ${productId}`,
        BusinessError.NOT_FOUND,
      );
    }

    const tienda = producto.tiendas.find((tienda) => tienda.id === storeId);

    if (!tienda) {
      throw new BusinessLogicException(
        `No existe una tienda con el id ${storeId} para el producto con id ${productId}`,
        BusinessError.NOT_FOUND,
      );
    }

    producto.tiendas = producto.tiendas.filter(
      (tienda) => tienda.id !== storeId,
    );
    return await this.productoRepository.save(producto);
  }
}
