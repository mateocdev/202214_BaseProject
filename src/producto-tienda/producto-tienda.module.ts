import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from 'src/producto/producto.entity';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { ProductoTiendaService } from './producto-tienda.service';

@Module({
  providers: [ProductoTiendaService],
  imports: [TypeOrmModule.forFeature([TiendaEntity, ProductoEntity])],
})
export class ProductoTiendaModule {}
