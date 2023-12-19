/* globals document */
'use strict'

export let html = ( text ) => {
  let container = document.createElement( 'article' )
  container.innerHTML = ( text.default ) ? text.default : text.trim()
  return container.firstChild
}
