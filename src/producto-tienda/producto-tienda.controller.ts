import {
    Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ProductoTiendaService } from './producto-tienda.service';
import { TiendaDto } from '../tienda/tienda.dto';
import { TiendaEntity } from '../tienda/tienda.entity';
import { plainToInstance } from 'class-transformer';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
  constructor(private readonly productoTiendaService: ProductoTiendaService) {}

  @Post(':productoId/stores/:tiendaId')
  async addProductToStore(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.productoTiendaService.addStoreToProduct(
      productoId,
      tiendaId,
    );
  }

  @Get(':productoId/stores')
  async findStoresFromProduct(@Param('productoId') productoId: string) {
    return await this.productoTiendaService.findStoresFromProduct(productoId);
  }

  @Get(':productoId/stores/:tiendaId')
  async findStoreFromProduct(
    @Param('tiendaId') storeId: string,
    @Param('productoId') productId: string,
  ) {
    return await this.productoTiendaService.findStoreFromProduct(
      productId,
      storeId,
    );
  }

  @Put(':productoId/stores')
  async updateProductFromStore(
    @Body() tiendaDto: TiendaDto[],
    @Param('productoId') productId: string,
  ) {
    const tiendas = plainToInstance(TiendaEntity, tiendaDto);
    return await this.productoTiendaService.updateStoresFromProduct(
      productId,
      tiendas,
    );
  }

  @Delete(':productoId/stores/:tiendaId')
  @HttpCode(204)
  async deleteProductFromStore(
    @Param('tiendaId') storeId: string,
    @Param('productoId') productId: string,
  ) {
    return await this.productoTiendaService.deleteStoreFromProduct(
      productId,
      storeId,
    );
  }
}
