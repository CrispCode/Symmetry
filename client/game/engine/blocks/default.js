'use strict'

import { Block } from './../block.js'

import {
  TextureLoader,
  MeshStandardMaterial
} from 'three'

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
