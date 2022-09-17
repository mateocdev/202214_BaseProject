import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoEntity } from './producto/producto.entity';
import { ProductoModule } from './producto/producto.module';
import { TiendaEntity } from './tienda/tienda.entity';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';

@Module({
  imports: [
    ProductoModule,
    TiendaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'betunala23',
      database: 'parcial',
      entities: [ProductoEntity, TiendaEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    ProductoTiendaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
