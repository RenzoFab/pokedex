import { Injectable } from '@nestjs/common';
import { POKEMON_SEED } from './data/pokemon.seed';
import { PokemonService } from '../pokemon/pokemon.service';

@Injectable()
export class SeedService {
  constructor(private pokemonService: PokemonService) {}

  create() {
    return 'This action adds a new seed';
  }

  async findAll() {
    await this.pokemonService.fillData(POKEMON_SEED);
    return 'pokemon seed loaded';
  }

  findOne(id: number) {
    return `This action returns a #${id} seed`;
  }

  update(id: number) {
    return `This action updates a #${id} seed`;
  }

  remove(id: number) {
    return `This action removes a #${id} seed`;
  }
}
