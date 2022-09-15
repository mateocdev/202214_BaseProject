import { TiendaEntity } from 'src/tienda/tienda.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    precio: string;

    @Column()
    tipo: string;
    
    @ManyToOne(() => TiendaEntity, tienda => tienda.productos)
    tiendas: TiendaEntity;
}
