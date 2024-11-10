import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { collection, collectionData, collectionGroup, Firestore } from '@angular/fire/firestore';
import converters from './services/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  fs = inject(Firestore)

  /*The following three collections serve to implement full text search client-side
  since there is no built-in support in Firestore and no free tier external offer.
  In a production-level app, this would be implemented by one of the providers
  recommended by Firebase (Algolia, Elastic, Typesense).*/

  readonly users = toSignal(
    collectionData(
      collection(this.fs, 'users')
        .withConverter(converters.user)
    )
  )

  readonly messages = toSignal(
    collectionData(
      collectionGroup(this.fs, 'messages')
        .withConverter(converters.message)
    )
  )

  readonly replies = toSignal(
    collectionData(
      collectionGroup(this.fs, 'replies')
        .withConverter(converters.reply)
    )
  )
}
