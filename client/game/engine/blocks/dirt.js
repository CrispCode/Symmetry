'use strict'

import { Block } from './../block.js'

import {
  MeshStandardMaterial
} from 'three'

export class BlockDirt extends Block {
  static get material () {
    return new MeshStandardMaterial( { color: 0x964B00 } )
  }
}
