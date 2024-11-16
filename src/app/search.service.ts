import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { collection, collectionData, collectionGroup, Firestore } from '@angular/fire/firestore';
import converters from './services/firestore-converters';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  fs = inject(Firestore)
  as = inject(FirebaseAuthService)

  /*The following three collections serve to implement full text search client-side
  since there is no built-in support in Firestore and no free tier external offer.
  In a production-level app, this would be implemented by one of the providers
  recommended by Firebase (Algolia, Elastic, Typesense).*/

  readonly users = toSignal(
    this.as.user$.pipe(
      switchMap(
        authUser => {
          if (authUser) {
            return collectionData(
              collection(this.fs, 'users')
                .withConverter(converters.user)
            )
          } else {
            return of([])
          }
        }
      )
    )
  )

  readonly messages = toSignal(
    this.as.user$.pipe(
      switchMap(
        authUser => {
          if (authUser) {
            return collectionData(
              collectionGroup(this.fs, 'messages')
                .withConverter(converters.message)
            )
          } else {
            return of([])
          }
        }
      )
    )
  )

  readonly replies = toSignal(
    this.as.user$.pipe(
      switchMap(
        authUser => {
          if (authUser) {
            return collectionData(
              collectionGroup(this.fs, 'replies')
                .withConverter(converters.reply)
            )
          } else {
            return of([])
          }
        }
      )
    )
  )

}
