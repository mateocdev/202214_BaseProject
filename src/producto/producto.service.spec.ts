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
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductoEntity = await repository.save({
        nombre: faker.commerce.productName(),
        precio: faker.commerce.price(),
        tipo: 'perecedero',
      });
      productosList.push(product);
    }
  };

  it('should find all', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos.length).toBe(5);
  });

  it('should find one', async () => {
    const producto: ProductoEntity = await service.findOne(productosList[0].id);
    expect(producto).not.toBeNull();
    expect(producto.id).toBe(productosList[0].id);
  });

  it('findone should throw an exception for and invalid product', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'No existe el producto con id 0',
    );
  });

  it('should create', async () => {
    const producto: ProductoEntity = await service.create({
      nombre: faker.commerce.productName(),
      precio: faker.commerce.price(),
      tipo: 'no perecedero',
      id: '',
      tiendas: [],
    });
    expect(producto).not.toBeNull();
  });

  it('should update', async () => {
    const producto: ProductoEntity = await service.update(productosList[0].id, {
      nombre: faker.commerce.productName(),
      precio: faker.commerce.price(),
      tipo: 'perecedero',
      id: '',
      tiendas: [],
    });
    expect(producto).not.toBeNull();
  });

  it('update should throw an exception for and invalid product', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto,
      nombre: faker.commerce.productName(),
      precio: faker.commerce.price(),
      tipo: 'perecedero',
      id: '',
      tiendas: [],
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty(
      'message',
      'No se puede crear un producto de undefined',
    );
  });

  it('should delete', async () => {
    const producto: ProductoEntity = await service.delete(productosList[0].id);
    expect(producto).not.toBeNull();
  });

  it('delete should throw an exception for and invalid product', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'No existe el producto con id 0',
    );
  });
});
