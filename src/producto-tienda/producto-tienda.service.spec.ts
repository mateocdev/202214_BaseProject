import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { ProductoTiendaService } from './producto-tienda.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let producto: ProductoEntity;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductoTiendaService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );

    await seedDataBase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDataBase = async () => {
    productoRepository.clear();
    tiendaRepository.clear();

    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        direccion: faker.address.streetAddress(),
        ciudad: 'BOG',
      });
      tiendasList.push(tienda);
    }
    producto = await productoRepository.save({
      nombre: faker.commerce.productName(),
      tipo: 'perecedero',
      precio: faker.commerce.price(),
      tiendas: tiendasList,
    });
  };

  it('addStoreToProduct', async () => {
    const tienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.streetAddress(),
      ciudad: 'BOG',
    });
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      tipo: 'perecedero',
      precio: faker.commerce.price(),
    });

    const result: ProductoEntity = await service.addStoreToProduct(
      newProducto.id,
      tienda.id,
    );
    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].id).toBe(tienda.id);
    expect(result.tiendas[0].nombre).toBe(tienda.nombre);
    expect(result.tiendas[0].direccion).toBe(tienda.direccion);
    expect(result.tiendas[0].ciudad).toBe(tienda.ciudad);
  });

  it('findStoresFromProduct', async () => {
    const storedTienda: TiendaEntity[] = await service.findStoresFromProduct(
      producto.id,
    );
    expect(storedTienda.length).toBe(5);
  });

  it('findStoreFromProduct', async () => {
    const storedTienda: TiendaEntity = await service.findStoreFromProduct(
      producto.id,
      tiendasList[0].id,
    );
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.id).toBe(tiendasList[0].id);
    expect(storedTienda.nombre).toBe(tiendasList[0].nombre);
    expect(storedTienda.direccion).toBe(tiendasList[0].direccion);
    expect(storedTienda.ciudad).toBe(tiendasList[0].ciudad);
  });

  it('updateStoresFromProduct', async () => {
    const tienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.streetAddress(),
      ciudad: 'BOG',
    });
    const updateProducto: ProductoEntity =
      await service.updateStoresFromProduct(producto.id, [tienda]);
    expect(updateProducto.tiendas.length).toBe(1);
    expect(updateProducto.tiendas[0]).not.toBeNull();
    expect(updateProducto.tiendas[0].id).toBe(tienda.id);
    expect(updateProducto.tiendas[0].nombre).toBe(tienda.nombre);
    expect(updateProducto.tiendas[0].direccion).toBe(tienda.direccion);
    expect(updateProducto.tiendas[0].ciudad).toBe(tienda.ciudad);
  });

  it('deleteStoreFromProduct', async () => {
    const tienda: TiendaEntity = tiendasList[0];

    await service.deleteStoreFromProduct(producto.id, tienda.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({
      where: { id: producto.id },
      relations: ['tiendas'],
    });

    const deleteTienda: TiendaEntity = storedProducto.tiendas.find(
      (e) => e.id === tienda.id,
    );

    expect(deleteTienda).toBeUndefined();
  });
});
