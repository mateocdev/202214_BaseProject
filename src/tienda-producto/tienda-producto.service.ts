import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TiendaProductoService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async addProductToStore(idTienda: string, idProducto: string): Promise<TiendaEntity> {
    const tienda = await this.tiendaRepository.findOne({where: {id: idTienda}, relations: ['productos']});
    if (!tienda) {
        throw new BusinessLogicException(`Tienda con id ${idTienda} no existe`, BusinessError.NOT_FOUND);
    }
    const producto = await this.productoRepository.findOne({where: {id: idProducto}});
    if (!producto) {
        throw new BusinessLogicException(`Producto con id ${idProducto} no existe`, BusinessError.NOT_FOUND);
    }
    tienda.productos.push(producto);
    return await this.tiendaRepository.save(tienda);
  }

  async findProductsByStoreIdProductId(idTienda: string, idProducto: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: idTienda}});
    if (!producto) {
        throw new BusinessLogicException(`Tienda con id ${idProducto} no existe`, BusinessError.NOT_FOUND);
    }
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: idTienda}, relations: ['productos']});
    if (!tienda) {
        throw new BusinessLogicException(`Tienda con id ${idTienda} no existe`, BusinessError.NOT_FOUND);
    }

    const tiendaProducto: ProductoEntity = tienda.productos.find((producto: ProductoEntity) => producto.id === idProducto);
    if (!tiendaProducto) {
        throw new BusinessLogicException(`Tienda con id ${idTienda} no tiene el producto con id ${idProducto}`, BusinessError.NOT_FOUND);
    }
    return tiendaProducto;
  }
}
