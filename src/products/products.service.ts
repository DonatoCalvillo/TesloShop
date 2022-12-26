import { Injectable, Logger } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}

  async create(createProductDto: CreateProductDto) {
    try {
    
      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save( product )
      return product

    } catch ( error ) {
      this.handleDBExceptions( error )
    }
  }

  async findAll() {
    try {
      
      const products = await this.productRepository.find()
      return products;

    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  async findOne(id: string) {
    try {
      
      const product = await this.productRepository.findOneBy({ id })

      if( !product )
        throw new NotFoundException(`The product ${id} doesn't exist`)

      return product

    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  update(id: string, updateProductDto: UpdateProductDto) {

  }

  async remove(id: string) {
    try {
      const product = await this.findOne( id )
      await this.productRepository.delete({ id })

      return product
    } catch (error) {
      this.handleDBExceptions( error )
    }
  }

  // ----------------------------------------------------------------------------

  private handleDBExceptions (error :any) {
    this.logger.error( error )
      
    if( error.code === 'EREQUEST' )
      throw new BadRequestException( error.originalError.info.message )
  
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
