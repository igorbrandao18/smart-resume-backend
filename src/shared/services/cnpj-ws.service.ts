import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiProperty } from '@nestjs/swagger';

export class CNPJWSResponse {
  @ApiProperty({ example: '41305206000107' })
  cnpj: string;

  @ApiProperty({ example: 'MAIS COMERCIO DE ELETRONICOS LTDA' })
  razao_social: string;

  @ApiProperty({ example: null, nullable: true })
  nome_fantasia: string | null;

  @ApiProperty({ example: '93700.00' })
  capital_social: string;

  @ApiProperty({ example: '2025-01-11T03:00:00.000Z' })
  atualizado_em: string;

  @ApiProperty({
    example: {
      id: '2062',
      descricao: 'Sociedade Empresária Limitada'
    }
  })
  natureza_juridica: {
    id: string;
    descricao: string;
  };

  @ApiProperty({
    example: {
      id: '03',
      descricao: 'Empresa de Pequeno Porte'
    }
  })
  porte: {
    id: string;
    descricao: string;
  };

  @ApiProperty()
  estabelecimento: {
    tipo: string;
    situacao_cadastral: string;
    data_situacao_cadastral: string;
    data_inicio_atividade: string;
    nome_fantasia: string | null;
    cnpj: string;
    logradouro: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    cep: string;
    ddd1: string | null;
    telefone1: string | null;
    ddd2: string | null;
    telefone2: string | null;
    ddd_fax: string | null;
    fax: string | null;
    email: string | null;
    atividade_principal: {
      id: string;
      secao: string;
      divisao: string;
      grupo: string;
      classe: string;
      subclasse: string;
      descricao: string;
    };
    atividades_secundarias: Array<{
      id: string;
      secao: string;
      divisao: string;
      grupo: string;
      classe: string;
      subclasse: string;
      descricao: string;
    }>;
    estado: {
      id: number;
      nome: string;
      sigla: string;
      ibge_id: number;
    };
    cidade: {
      id: number;
      nome: string;
      ibge_id: number;
      siafi_id: string;
    };
  };

  @ApiProperty()
  simples: {
    simples: string;
    mei: string;
    data_opcao_simples: string | null;
    data_exclusao_simples: string | null;
    data_opcao_mei: string | null;
    data_exclusao_mei: string | null;
  };

  @ApiProperty({
    example: [{
      nome: 'SAULO CESAR TEIXEIRA REIS',
      tipo: 'Pessoa Física',
      data_entrada: '2021-03-22',
      cpf_cnpj_socio: '***133758**',
      qualificacao_socio: {
        id: 49,
        descricao: 'Sócio-Administrador'
      },
      pais: {
        id: '1058',
        nome: 'Brasil',
        iso2: 'BR',
        iso3: 'BRA',
        comex_id: '105'
      }
    }]
  })
  socios: Array<{
    nome: string;
    tipo: string;
    data_entrada: string;
    cpf_cnpj_socio: string;
    qualificacao_socio: {
      id: number;
      descricao: string;
    };
    pais: {
      id: string;
      nome: string;
      iso2: string;
      iso3: string;
      comex_id: string;
    };
  }>;
}

@Injectable()
export class CNPJWSService {
  private readonly baseUrl = 'https://publica.cnpj.ws/cnpj';

  async getCNPJData(cnpj: string): Promise<Partial<CNPJWSResponse>> {
    try {
      const formattedCNPJ = cnpj.replace(/\D/g, '');
      
      if (formattedCNPJ.length !== 14) {
        throw new HttpException('CNPJ inválido', HttpStatus.BAD_REQUEST);
      }

      const response = await fetch(`${this.baseUrl}/${formattedCNPJ}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new HttpException('CNPJ não encontrado', HttpStatus.NOT_FOUND);
        }
        if (response.status === 429) {
          throw new HttpException('Limite de requisições excedido', HttpStatus.TOO_MANY_REQUESTS);
        }
        throw new HttpException('Erro ao consultar CNPJ', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Erro ao consultar CNPJ',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 