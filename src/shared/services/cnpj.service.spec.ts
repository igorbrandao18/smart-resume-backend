import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CNPJService } from './cnpj.service';
import axios from 'axios';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('axios');

describe('CNPJService', () => {
  let service: CNPJService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CNPJService],
    }).compile();

    service = module.get<CNPJService>(CNPJService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCNPJData', () => {
    const mockCNPJResponse = {
      data: {
        cnpj_raiz: "81074353",
        razao_social: "775 LOJA DE ROUPAS LTDA",
        capital_social: "30000.00",
        responsavel_federativo: "",
        atualizado_em: "2025-01-11T03:00:00.000Z",
        porte: {
          id: "01",
          descricao: "Micro Empresa"
        },
        natureza_juridica: {
          id: "2062",
          descricao: "Sociedade Empresária Limitada"
        },
        qualificacao_do_responsavel: {
          id: 49,
          descricao: "Sócio-Administrador"
        },
        socios: [
          {
            cpf_cnpj_socio: "***093359**",
            nome: "PAULA ALEXANDRA DA SILVA",
            tipo: "Pessoa Física",
            data_entrada: "2020-09-29",
            cpf_representante_legal: "***000000**",
            nome_representante: null,
            faixa_etaria: "41 a 50 anos",
            atualizado_em: "2025-01-11T03:00:00.000Z",
            pais_id: "1058",
            qualificacao_socio: {
              id: 49,
              descricao: "Sócio-Administrador"
            },
            qualificacao_representante: null,
            pais: {
              id: "1058",
              iso2: "BR",
              iso3: "BRA",
              nome: "Brasil",
              comex_id: "105"
            }
          }
        ],
        simples: {
          simples: "Sim",
          data_opcao_simples: "2017-01-01",
          data_exclusao_simples: null,
          mei: "Não",
          data_opcao_mei: null,
          data_exclusao_mei: null,
          atualizado_em: "2025-01-11T03:00:00.000Z"
        },
        estabelecimento: {
          cnpj: "81074353000138",
          cnpj_raiz: "81074353",
          cnpj_ordem: "0001",
          cnpj_digito_verificador: "38",
          tipo: "Matriz",
          nome_fantasia: "LOJA 775",
          situacao_cadastral: "Ativa",
          data_situacao_cadastral: "1988-11-23",
          data_inicio_atividade: "1988-11-23",
          nome_cidade_exterior: null,
          tipo_logradouro: "RUA",
          logradouro: "DOUTOR JORGE XAVIER DA SILVA",
          numero: "90",
          complemento: null,
          bairro: "CENTRO",
          cep: "84165000",
          ddd1: "42",
          telefone1: "32324165",
          ddd2: null,
          telefone2: null,
          ddd_fax: null,
          fax: null,
          email: "loja775_castro@hotmail.com",
          situacao_especial: null,
          data_situacao_especial: null,
          atualizado_em: "2025-01-11T03:00:00.000Z",
          atividade_principal: {
            id: "4781400",
            secao: "G",
            divisao: "47",
            grupo: "47.8",
            classe: "47.81-4",
            subclasse: "4781-4/00",
            descricao: "Comércio varejista de artigos do vestuário e acessórios"
          },
          atividades_secundarias: [
            {
              id: "4755502",
              secao: "G",
              divisao: "47",
              grupo: "47.5",
              classe: "47.55-5",
              subclasse: "4755-5/02",
              descricao: "Comercio varejista de artigos de armarinho"
            }
          ],
          pais: {
            id: "1058",
            iso2: "BR",
            iso3: "BRA",
            nome: "Brasil",
            comex_id: "105"
          },
          estado: {
            id: 18,
            nome: "Paraná",
            sigla: "PR",
            ibge_id: 41
          },
          cidade: {
            id: 3983,
            nome: "Castro",
            ibge_id: 4104907,
            siafi_id: "7495"
          },
          motivo_situacao_cadastral: null,
          inscricoes_estaduais: [
            {
              inscricao_estadual: "9053540942",
              ativo: true,
              atualizado_em: "2025-01-19T00:00:00.000Z",
              estado: {
                id: 18,
                nome: "Paraná",
                sigla: "PR",
                ibge_id: 41
              }
            }
          ]
        }
      }
    };

    it('should get CNPJ data successfully', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue(mockCNPJResponse);

      const result = await service.getCNPJData('81.074.353/0001-38');

      expect(result).toEqual(mockCNPJResponse.data);
      expect(axios.get).toHaveBeenCalledWith(
        'https://publica.cnpj.ws/cnpj/81074353000138'
      );
    });

    it('should format CNPJ removing special characters', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue(mockCNPJResponse);

      await service.getCNPJData('81.074.353/0001-38');

      expect(axios.get).toHaveBeenCalledWith(
        'https://publica.cnpj.ws/cnpj/81074353000138'
      );
    });

    it('should throw NotFound when CNPJ is not found', async () => {
      vi.spyOn(axios, 'get').mockRejectedValue({
        response: { status: 404 }
      });

      await expect(service.getCNPJData('81074353000138')).rejects.toThrow(
        new HttpException('CNPJ não encontrado', HttpStatus.NOT_FOUND)
      );
    });

    it('should throw BadRequest when CNPJ is invalid', async () => {
      vi.spyOn(axios, 'get').mockRejectedValue({
        response: { status: 400 }
      });

      await expect(service.getCNPJData('invalid')).rejects.toThrow(
        new HttpException('CNPJ inválido', HttpStatus.BAD_REQUEST)
      );
    });

    it('should handle network errors', async () => {
      vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network error'));

      await expect(service.getCNPJData('81074353000138')).rejects.toThrow(
        new HttpException('Erro ao consultar CNPJ', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });
}); 