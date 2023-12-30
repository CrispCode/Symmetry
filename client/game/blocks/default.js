'use strict'

import {
  TextureLoader,
  MeshStandardMaterial
} from 'three'

import { Block } from './../engine/block.js'

export class BlockDefault extends Block {
  static get material () {
    const texture = new TextureLoader().load( '/textures/blocks/default.png' )

    return [
      new MeshStandardMaterial( { map: texture } ),
      new MeshStandardMaterial( { map: texture } ),
      new MeshStandardMaterial( { map: texture } ),
      new MeshStandardMaterial( { map: texture } ),
      new MeshStandardMaterial( { map: texture } ),
      new MeshStandardMaterial( { map: texture } )
    ]
  }
}
