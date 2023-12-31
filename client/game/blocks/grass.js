'use strict'

import {
  MeshStandardMaterial
} from 'three'

import { Block } from './../engine/block.js'

export class BlockGrass extends Block {
  static get material () {
    return new MeshStandardMaterial( { color: 0x00CC00 } )
  }
}
