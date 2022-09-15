import { TiendaEntity } from 'src/tienda/tienda.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
    
    @OneToMany(() => TiendaEntity, tienda => tienda.productos)
    tiendas: TiendaEntity[];
}
