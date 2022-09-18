import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TiendaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsNumber()
  @IsNotEmpty()
  readonly ciudad: number;

  @IsString()
  @IsNotEmpty()
  readonly direccion: string;
}
