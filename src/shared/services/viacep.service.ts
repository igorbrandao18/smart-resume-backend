import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Injectable()
export class ViaCEPService {
  private readonly baseUrl = 'https://viacep.com.br/ws';

  async getAddressByCEP(cep: string): Promise<Partial<ViaCEPResponse>> {
    try {
      const formattedCEP = cep.replace(/\D/g, '');
      const response = await axios.get<ViaCEPResponse>(`${this.baseUrl}/${formattedCEP}/json`);
      
      if (response.data.erro) {
        throw new HttpException('CEP not found', HttpStatus.NOT_FOUND);
      }

      return {
        cep: response.data.cep,
        logradouro: response.data.logradouro,
        bairro: response.data.bairro,
        localidade: response.data.localidade,
        uf: response.data.uf,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error fetching address', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 