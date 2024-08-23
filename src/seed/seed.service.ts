import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  create() {
    return 'This action adds a new seed';
  }

  async findAll() {
    const { data } = await axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=1000',
    );
    await this.pokemonModel.deleteMany({});
    const pokemons: CreatePokemonDto[] = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      return {
        no,
        name,
      };
    });
    await this.pokemonModel.insertMany(pokemons);
    return `Seed executed`;
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
