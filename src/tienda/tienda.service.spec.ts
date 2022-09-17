import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';
import { faker } from '@faker-js/faker';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiendaService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        direccion: faker.address.street(),
        ciudad: 'BOG',
      });
      tiendasList.push(tienda);
    }
  };

  it('should find all', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas.length).toBe(5);
  });

  it('should find one', async () => {
    const tienda: TiendaEntity = await service.findOne(tiendasList[0].id);
    expect(tienda).not.toBeNull();
    expect(tienda.id).toBe(tiendasList[0].id);
    expect(tienda.nombre).toBe(tiendasList[0].nombre);
    expect(tienda.direccion).toBe(tiendasList[0].direccion);
    expect(tienda.ciudad).toBe(tiendasList[0].ciudad);
  });

  it('findOne should throw an exception for an invalid tienda', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'Tienda with id 0 not found',
    );
  });

  it('should create a tienda', async () => {
    const tienda: TiendaEntity = await service.create({
      nombre: faker.company.name(),
      direccion: faker.address.street(),
      ciudad: 'BOG',
      id: '',
      productos: [],
    });
    expect(tienda).not.toBeNull();
    expect(tienda.id).not.toBeNull();
    expect(tienda.nombre).not.toBeNull();
    expect(tienda.direccion).not.toBeNull();
    expect(tienda.ciudad).not.toBeNull();
  });
  

  it('update should modify a store', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.nombre = 'Tienda 1';
    tienda.direccion = 'Calle 1';
    tienda.ciudad = 'BOG';
    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
    const storedTienda: TiendaEntity = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(storedTienda.nombre);
    expect(storedTienda.direccion).toEqual(storedTienda.direccion);
  });

  it('delete should remove a store', async () => {
    const tienda: TiendaEntity = await service.delete(tiendasList[0].id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'Tienda with id 0 not found',
    );
  });
});
