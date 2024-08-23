import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto, UpdatePokemonDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error, 'create');
    }
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    pokemon = !isNaN(+term)
      ? // No
        await this.pokemonModel.findOne({ no: term })
      : isValidObjectId(term)
        ? // MongoID
          await this.pokemonModel.findOne({ _id: term })
        : // name
          await this.pokemonModel.findOne({
            name: term.toLocaleLowerCase().trim(),
          });

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`,
      );
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    try {
      if (updatePokemonDto.name) updatePokemonDto.name.toLocaleLowerCase();
      const updatePokemon = await pokemon.updateOne(updatePokemonDto, {
        new: true,
      });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleException(error, 'update');
    }
  }

  async remove(term: string) {
    const pokemon = await this.findOne(term);
    await pokemon.deleteOne();
    return { id: term };
  }

  async fillData(pokemons: CreatePokemonDto[]) {
    try {
      await this.pokemonModel.collection.drop();
      pokemons.forEach((pokemon) => this.create(pokemon));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private handleException(error: any, method: 'create' | 'update') {
    if ((error.code = 11000))
      throw new BadRequestException(
        `Pokemon exist in db ${JSON.stringify(error.keyValue)}`,
      );
    console.log(error);
    throw new InternalServerErrorException(
      `Can't ${method} Pokemon - Check server logs`,
    );
  }
}
