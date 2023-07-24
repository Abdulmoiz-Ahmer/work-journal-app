import {Component, OnInit} from '@angular/core';
import {FirebaseStoreService} from "../services/firebase-store.service";
import {AuthService} from "../services/auth.service";
import {map} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  journals:any = [];

  constructor(
    private afAuth: AuthService,
    private afStoreService: FirebaseStoreService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    const uid = this.afAuth.userDetails()?.uid;
    this.afStoreService.get('journals', uid).pipe(
      map(res =>
        res.map(c =>
          // @ts-ignore
          ({id: c.payload.doc.id, ...c.payload.doc.data()})
        )
      )
    ).subscribe(data => {
      this.journals = data;
    });
  }

  deleteTask(id: string){
    this.afStoreService.delete(id).then(res=> this._snackBar.open('Task deleted successfully', 'close'));
  }

}
