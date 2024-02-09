import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class FirebaseServiceService {
    
}