import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoService } from 'src/producto/producto.service';
import { TiendaService } from 'src/tienda/tienda.service';
import { ProductoTiendaService } from './producto-tienda.service';

@Module({
  providers: [ProductoTiendaService],
  imports: [TypeOrmModule.forFeature([TiendaService, ProductoService])],
})
export class ProductoTiendaModule {}
