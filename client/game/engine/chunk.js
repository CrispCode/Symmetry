'use strict'

import {
  Group,
  InstancedMesh,
  Matrix4,
  Vector3
} from 'three'

import * as BLOCKS from './blocks/index.js'

export class Chunk extends Group {
  #size = {
    width: 0,
    height: 0,
    depth: 0
  }

  #data = []
  #meshes = {}

  constructor ( width, height, depth ) {
    super()

    this.#size.width = width
    this.#size.height = height
    this.#size.depth = depth
  }

  #getMesh ( type ) {
    let mesh = this.#meshes[ type ]
    if ( !mesh ) {
      mesh = new InstancedMesh( BLOCKS[ type ].geometry, BLOCKS[ type ].material, this.#size.width * this.#size.height * this.#size.depth )
      mesh.name = type
      mesh.count = 0
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.#meshes[ type ] = mesh
      this.add( mesh )
    }
    return mesh
  }

  isPositionVisible ( x, y, z ) {
    const top = this.getBlockAt( x, y - 1, z )
    const bottom = this.getBlockAt( x, y + 1, z )
    const front = this.getBlockAt( x, y, z + 1 )
    const back = this.getBlockAt( x, y, z - 1 )
    const left = this.getBlockAt( x + 1, y, z )
    const right = this.getBlockAt( x - 1, y, z )
    if (
      top && !top.seeThrough &&
      bottom && !bottom.seeThrough &&
      front && !front.seeThrough &&
      back && !back.seeThrough &&
      left && !left.seeThrough &&
      right && !right.seeThrough
    ) {
      return false
    }

    return true
  }

  getPositionNeighbours ( x, y, z ) {
    return [
      { x: x, y: y - 1, z: z, block: this.getBlockAt( x, y - 1, z ) },
      { x: x, y: y + 1, z: z, block: this.getBlockAt( x, y + 1, z ) },
      { x: x, y: y, z: z + 1, block: this.getBlockAt( x, y, z + 1 ) },
      { x: x, y: y, z: z - 1, block: this.getBlockAt( x, y, z - 1 ) },
      { x: x + 1, y: y, z: z, block: this.getBlockAt( x + 1, y, z ) },
      { x: x - 1, y: y, z: z, block: this.getBlockAt( x - 1, y, z ) }
    ]
  }

  #addToMesh ( x, y, z ) {
    if ( !this.isPositionVisible( x, y, z ) ) {
      return false
    }
    const block = this.getBlockAt( x, y, z )
    const mesh = this.#getMesh( block.constructor.type )
    const index = mesh.count++
    block._instanceId = index // This is needed for instance removal
    const matrix = new Matrix4()
    matrix.setPosition( x, y, z )
    if ( block.rotation ) {
      const vector = new Vector3()
      vector.set( block.rotation.axis.x, block.rotation.axis.y, block.rotation.axis.z )
      matrix.makeRotationAxis( vector, block.rotation.angle )
    }
    mesh.setMatrixAt( index, matrix )
    mesh.instanceMatrix.needsUpdate = true
    return true
  }

  #removeFromMesh ( x, y, z ) {
    const block = this.getBlockAt( x, y, z )
    if ( !block ) {
      return false
    }
    const mesh = this.#getMesh( block.constructor.type )
    // Swap position with last block in instance
    const matrix = new Matrix4()
    mesh.getMatrixAt( mesh.count - 1, matrix )
    const vector = new Vector3()
    vector.setFromMatrixPosition( matrix )
    const lastBlock = this.getBlockAt( vector.x, vector.y, vector.z )
    mesh.setMatrixAt( block._instanceId, matrix )
    mesh.count--
    mesh.instanceMatrix.needsUpdate = true
    lastBlock._instanceId = block._instanceId
    block._instanceId = null
    return true
  }

  getBlockAt ( x, y, z ) {
    if ( this.#data[ x ] && this.#data[ x ][ y ] && this.#data[ x ][ y ][ z ] ) {
      return this.#data[ x ][ y ][ z ]
    }
  }

  setBlockAt ( x, y, z, block ) {
    if ( !this.#data[ x ] ) {
      this.#data[ x ] = []
    }
    if ( !this.#data[ x ][ y ] ) {
      this.#data[ x ][ y ] = []
    }
    this.#data[ x ][ y ][ z ] = block
  }

  addBlock ( x, y, z, block ) {
    // If there is a block here already leave
    if ( this.getBlockAt( x, y, z ) ) {
      return false
    }

    this.setBlockAt( x, y, z, block )
    if ( this.#addToMesh( x, y, z ) ) {
      // Change visibility state of neighbours
      const neighbours = this.getPositionNeighbours( x, y, z )
      for ( let i in neighbours ) {
        const neighbour = neighbours[ i ]
        // Do we need to hide it ?
        if ( neighbour.block && neighbour.block._instanceId && !this.isPositionVisible( neighbour.x, neighbour.y, neighbour.z ) ) {
          this.#removeFromMesh( neighbour.x, neighbour.y, neighbour.z )
        }
      }
    }
    return true
  }

  removeBlock ( x, y, z ) {
    // If there isn't a block here leave
    if ( !this.getBlockAt( x, y, z ) ) {
      return false
    }

    if ( this.#removeFromMesh( x, y, z ) ) {
      this.setBlockAt( x, y, z, undefined )
      // Change visibility state of neighbours
      const neighbours = this.getPositionNeighbours( x, y, z )
      for ( let i in neighbours ) {
        const neighbour = neighbours[ i ]
        // Do we need to show it ?
        if ( neighbour.block && !neighbour.block._instanceId && this.isPositionVisible( neighbour.x, neighbour.y, neighbour.z ) ) {
          this.#addToMesh( neighbour.x, neighbour.y, neighbour.z )
        }
      }
    }

    return true
  }
}
