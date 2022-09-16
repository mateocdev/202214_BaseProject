import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { faker } from '@faker-js/faker';
import { TiendaEntity } from '../tienda/tienda.entity';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList;

  const seedData = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 10; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.commerce.productName(),
        precio: faker.commerce.price(),
        tipo: faker.commerce.productMaterial(),
      });
      productosList.push(producto);
    }
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    await seedData();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos.length).toBe(10);
  });

  it('should find one', async () => {
    const producto: ProductoEntity = await service.findOne(productosList[0].id);
    expect(producto).not.toBeNull();
    expect(producto.id).toBe(productosList[0].id);
  });

  it('should create', async () => {
    const producto: ProductoEntity = await service.create({
      nombre: faker.commerce.productName(),
      precio: faker.commerce.price(),
      tipo: faker.commerce.productMaterial(),
      id: '',
      tienda: new TiendaEntity
    });
    expect(producto).not.toBeNull();
  });

  it('should update', async () => {
    const producto: ProductoEntity = await service.update(productosList[0].id, {
      nombre: faker.commerce.productName(),
      precio: faker.commerce.price(),
      tipo: faker.commerce.productMaterial(),
      id: '',
      tienda: new TiendaEntity
    });
    expect(producto).not.toBeNull();
  });

  it('should delete', async () => {
    const producto: ProductoEntity = await service.delete(productosList[0].id);
    expect(producto).not.toBeNull();
  });
});
