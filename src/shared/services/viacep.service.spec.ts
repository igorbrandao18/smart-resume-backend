import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ViaCEPService } from './viacep.service';
import axios from 'axios';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('axios');

describe('ViaCEPService', () => {
  let service: ViaCEPService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViaCEPService],
    }).compile();

    service = module.get<ViaCEPService>(ViaCEPService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAddressByCEP', () => {
    it('should return formatted address when CEP is valid', async () => {
      const mockViaCepResponse = {
        data: {
          cep: '12345-678',
          logradouro: 'Rua Teste',
          complemento: '',
          bairro: 'Bairro Teste',
          localidade: 'Cidade Teste',
          uf: 'ST',
        },
      };

      vi.spyOn(axios, 'get').mockResolvedValue(mockViaCepResponse);

      const result = await service.getAddressByCEP('12345-678');

      expect(result).toEqual({
        cep: '12345-678',
        logradouro: 'Rua Teste',
        bairro: 'Bairro Teste',
        localidade: 'Cidade Teste',
        uf: 'ST',
      });

      expect(axios.get).toHaveBeenCalledWith(
        'https://viacep.com.br/ws/12345678/json',
      );
    });

    it('should throw error when CEP is invalid', async () => {
      vi.spyOn(axios, 'get').mockRejectedValue(new Error('Invalid CEP'));

      await expect(service.getAddressByCEP('00000-000')).rejects.toThrow(
        new HttpException('Error fetching address', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });

    it('should throw error when ViaCEP returns error', async () => {
      const mockErrorResponse = {
        data: {
          erro: true,
        },
      };

      vi.spyOn(axios, 'get').mockResolvedValue(mockErrorResponse);

      await expect(service.getAddressByCEP('12345-678')).rejects.toThrow(
        new HttpException('CEP not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should format CEP removing non-numeric characters', async () => {
      const mockViaCEPResponse = {
        data: {
          cep: '12345-678',
          logradouro: 'Rua Exemplo',
          complemento: '',
          bairro: 'Centro',
          localidade: 'São Paulo',
          uf: 'SP',
          erro: false,
        },
      };

      vi.spyOn(axios, 'get').mockResolvedValue(mockViaCEPResponse);

      await service.getAddressByCEP('12.345-678');

      expect(axios.get).toHaveBeenCalledWith(
        'https://viacep.com.br/ws/12345678/json',
      );
    });

    it('should handle network errors', async () => {
      vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network error'));

      await expect(service.getAddressByCEP('12345-678')).rejects.toThrow(
        new HttpException('Error fetching address', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });

    it('should handle malformed response', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({ data: { erro: true } });

      await expect(service.getAddressByCEP('12345-678')).rejects.toThrow(
        new HttpException('CEP not found', HttpStatus.NOT_FOUND),
      );
    });
  });
}); 