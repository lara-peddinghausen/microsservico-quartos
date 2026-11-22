import { plainToInstance } from 'class-transformer';
import {
    IsInt, IsNotEmpty, IsString, Matches, Max, Min, MinLength, validateSync,
} from 'class-validator';
class EnvironmentVariables {
    @IsString()
    @IsNotEmpty({ message: 'DATABASE_URL e obrigatoria' })
    @Matches(/^mysql:\/\//, { message: 'DATABASE_URL deve comecar com mysql://', })
    DATABASE_URL!: string;

    @IsInt({ message: 'PORT deve ser um numero inteiro' })
    @Min(1)
    @Max(65535)
    PORT!: number;

    @IsString()
    @IsNotEmpty({ message: 'INTERNAL_API_KEY é obrigatória' })
    @MinLength(32, {
        message: 'INTERNAL_API_KEY deve ter no mínimo 32 caracteres',
    })
    INTERNAL_API_KEY!: string;
}


export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {

    const validado = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const erros = validateSync(validado, { skipMissingProperties: false });
    if (erros.length > 0) {
        const detalhes = erros
            .map((erro) => Object.values(erro.constraints ?? {}).join('; '))
            .join('\n - ');
        throw new Error(`Configuracao invalida. Revise o seu .env:\n - ${detalhes}\n`);
    }
    return validado;
}