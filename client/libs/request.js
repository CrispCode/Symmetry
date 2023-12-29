'use strict'

export class Request {
  static get ( url ) {
    return fetch( url )
      .then( ( response ) => {
        return response.json()
      } )
      .catch( ( err ) => {
        console.error( err )
      } )
  }
}
