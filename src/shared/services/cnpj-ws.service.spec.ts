import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CNPJWSService, CNPJWSResponse } from './cnpj-ws.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@nestjs/config', () => ({
  ConfigService: vi.fn().mockImplementation(() => ({
    get: vi.fn().mockReturnValue('test-token')
  }))
}));

describe('CNPJWSService', () => {
  let service: CNPJWSService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CNPJWSService,
        ConfigService
      ],
    }).compile();

    service = module.get<CNPJWSService>(CNPJWSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCNPJData', () => {
    const mockResponse = {
      cnpj: '00000000000191',
      razao_social: 'BANCO DO BRASIL SA',
      nome_fantasia: 'BANCO DO BRASIL',
      natureza_juridica: 'Sociedade de Economia Mista',
      logradouro: 'Q SAUN QUADRA 5 LOTE B TORRE I',
      numero: 'S/N',
      complemento: 'ANDAR 1 A 16',
      cep: '70040912',
      bairro: 'ASA NORTE',
      municipio: 'BRASILIA',
      uf: 'DF',
      email: 'secex@bb.com.br',
      telefone: '6134939000',
      situacao: 'ATIVA',
      data_situacao: '2005-11-03',
      capital_social: '90000000000.00',
      porte: 'DEMAIS',
      data_abertura: '1966-08-22'
    };

    it('should return CNPJ data for valid CNPJ', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const result = await service.getCNPJData('00000000000191');
      
      expect(result).toBeDefined();
      expect(result.cnpj).toBe('00000000000191');
      expect(result.razao_social).toBe('BANCO DO BRASIL SA');
      expect(global.fetch).toHaveBeenCalledWith('https://publica.cnpj.ws/cnpj/00000000000191');
    });

    it('should throw BadRequest for invalid CNPJ format', async () => {
      await expect(service.getCNPJData('123')).rejects.toThrow(
        new HttpException('CNPJ inválido', HttpStatus.BAD_REQUEST)
      );
    });

    it('should format CNPJ removing special characters', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const result = await service.getCNPJData('00.000.000/0001-91');
      
      expect(result).toBeDefined();
      expect(result.cnpj).toBe('00000000000191');
      expect(global.fetch).toHaveBeenCalledWith('https://publica.cnpj.ws/cnpj/00000000000191');
    });

    it('should throw NotFound for non-existent CNPJ', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404
      } as Response);

      await expect(service.getCNPJData('00000000000000')).rejects.toThrow(
        new HttpException('CNPJ não encontrado', HttpStatus.NOT_FOUND)
      );
    });

    it('should throw TooManyRequests when rate limit is exceeded', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 429
      } as Response);

      await expect(service.getCNPJData('00000000000191')).rejects.toThrow(
        new HttpException('Limite de requisições excedido', HttpStatus.TOO_MANY_REQUESTS)
      );
    });

    it('should throw InternalServerError for network errors', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

      await expect(service.getCNPJData('00000000000191')).rejects.toThrow(
        new HttpException('Erro ao consultar CNPJ', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });
}); 