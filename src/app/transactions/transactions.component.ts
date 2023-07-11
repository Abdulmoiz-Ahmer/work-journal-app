import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {map} from "rxjs";
export interface Request {
  id: string;
  Address: string;
  Driver: string;
  truckDirver: string;
  parts: any;
}
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TransactionsComponent implements OnInit {
  transactions: Request[] = [];
  id = '';
  displayedColumns: string[] = [ 'Address', 'Driver', 'truckDirver'];
  nestedColumns: string[] = [ 'partID', 'partDiscription', 'partQuantity'];
  expandedElement: Request[] = [];
  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions() {
    this.afs.collection('PartsRequests').snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          // @ts-ignore
          ({id: c.payload.doc.id, ...c.payload.doc.data()})
        )
      )
    ).subscribe(data => {
      this.transactions = data;
      this.transactions.forEach((a: any, b: any)=>{
        this.afs.collection(`PartsRequests/${a.id}/parts`, ref => ref.where('partQuantity', '>', 0)).snapshotChanges().pipe(
          map(changes =>
            changes.map(c =>
              // @ts-ignore
              ({id: c.payload.doc.id, ...c.payload.doc.data()})
            )
          )
        ).subscribe(data => {
          a.parts = data;
          console.log(this.transactions)
        });
      })
    });
  }

}
