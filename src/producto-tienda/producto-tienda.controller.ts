import {
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

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
  constructor(private readonly productoTiendaService: ProductoTiendaService) {}

  @Post(':productoId/stores/:tiendaId')
  async addProductToStore(
    @Param('productoId') productoId: string,
    @Param('tiendaId') tiendaId: string,
  ) {
    return await this.productoTiendaService.addProductToStore(
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
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productoTiendaService.findStoreFromProduct(
      tiendaId,
      productoId,
    );
  }

  @Put(':productoId/stores/:tiendaId')
  async updateProductFromStore(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productoTiendaService.updateProductFromStore(
      tiendaId,
      productoId,
    );
  }

  @Delete(':productoId/stores/:tienId')
  @HttpCode(204)
  async deleteProductFromStore(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.productoTiendaService.deleteStoreFromProduct(
      tiendaId,
      productoId,
    );
  }
}
