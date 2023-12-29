'use strict'

import {
  Group
} from 'three'

import { Chunk } from './chunk.js'

export class World extends Group {
  #grid = new Map()

  static getCellName = ( x, y, z ) => {
    return x + ',' + y + ',' + z
  }

  #chunkSize = null

  constructor ( chunkSize = 1 ) {
    super()

    this.#chunkSize = chunkSize
  }

  #convertBlockToChunkCoordonate ( value ) {
    // Negative positions need to be treated with a special case because of how chunks are built. Basically -1 is 0 in a chunk.
    if ( value < 0 ) {
      return ( ( value + 1 ) % this.#chunkSize ) + this.#chunkSize - 1
    } else {
      return value % this.#chunkSize
    }
  }

  getChunk ( x, y, z ) {
    const chunkX = Math.floor( x / this.#chunkSize )
    const chunkY = Math.floor( y / this.#chunkSize )
    const chunkZ = Math.floor( z / this.#chunkSize )

    let chunk = this.#grid.get( this.constructor.getCellName( chunkX, chunkY, chunkZ ) )
    if ( !chunk ) {
      chunk = new Chunk( this.#chunkSize, this.#chunkSize, this.#chunkSize )
      chunk.position.set( chunkX * this.#chunkSize, chunkY * this.#chunkSize, chunkZ * this.#chunkSize )
      this.#grid.set( this.constructor.getCellName( chunkX, chunkY, chunkZ ), chunk )
    }
    return chunk
  }

  addBlock ( block ) {
    const chunk = this.getChunk( block.x, block.y, block.z )
    chunk.addBlock( this.#convertBlockToChunkCoordonate( block.x ), this.#convertBlockToChunkCoordonate( block.y ), this.#convertBlockToChunkCoordonate( block.z ), block )
  }

  removeBlock ( block ) {
    const chunk = this.getChunk( block.x, block.y, block.z )
    chunk.removeBlock( this.#convertBlockToChunkCoordonate( block.x ), this.#convertBlockToChunkCoordonate( block.y ), this.#convertBlockToChunkCoordonate( block.z ), block )
  }

  #loadedChunks = []

  loadChunks ( x, y, z, radius ) {
    const chunksRequested = []
    for ( let iMin = x - radius * this.#chunkSize, iMax = x + radius * this.#chunkSize, i = iMin; i <= iMax; i = i + this.#chunkSize ) {
      for ( let jMin = y - radius * this.#chunkSize, jMax = y + radius * this.#chunkSize, j = jMin; j <= jMax; j = j + this.#chunkSize ) {
        for ( let kMin = z - radius * this.#chunkSize, kMax = z + radius * this.#chunkSize, k = kMin; k <= kMax; k = k + this.#chunkSize ) {
          const chunk = this.getChunk( i, j, k )
          chunksRequested.push( chunk )
          // Chunks to load
          if ( !this.#loadedChunks.includes( chunk ) ) {
            this.add( chunk )
          }
        }
      }
    }

    // Chunks to unload
    this.#loadedChunks.map( ( chunk ) => {
      if ( !chunksRequested.includes( chunk ) ) {
        this.remove( chunk )
      }
    } )

    this.#loadedChunks = chunksRequested
  }
}
