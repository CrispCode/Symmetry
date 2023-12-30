'use strict'

import {
  MeshStandardMaterial
} from 'three'

import { Block } from './../engine/block.js'

export class BlockDirt extends Block {
  static get material () {
    return new MeshStandardMaterial( { color: 0x964B00 } )
  }
}
