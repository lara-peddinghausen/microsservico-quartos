import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateComodidadeDto {
    @IsString()
    @IsNotEmpty({ message: 'nome e obrigatorio' })
    @MaxLength(100)
    nome!: string;
}