import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {where} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseStoreService {

  constructor(private db: AngularFirestore) {
  }

  post(collectionName: string, data: any) {
    let id = this.db.createId();
    data.id = id;
    return this.db.collection(collectionName).doc(id).set(data);
  }

  get(collectionName: string, id: string) {
    return this.db.collection(collectionName,
      ref => ref.where('uid', '==', id))
      .snapshotChanges();
  }

  delete(id:string) {
    return this.db.collection('journals').doc(id).delete();
  }

}
