import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {map} from 'rxjs';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";

export interface Parts {
  id: string;
  partID: string;
  PartUOM: string;
  partName: string;
  partDiscription: string;
  totalRequests: number;
}

export interface Request {
  id: string;
  Address: string;
  Driver: string;
  truckDriver: string;
}

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss']
})
export class PointsComponent implements OnInit {
  points: Parts[] = [];
  pointsAll: Parts[] = [];
  requests: Request[] = [];
  id = '';
  displayedColumns: string[] = ['position', 'partID', 'PartUOM', 'partName', 'partDiscription', 'totalRequests'];

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPoints();
  }

  getPoints() {
    this.afs.collection('PartsList', ref=> ref.orderBy('partID')).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          // @ts-ignore
          ({id: c.payload.doc.id, totalRequests: 0, ...c.payload.doc.data()})
        )
      )
    ).subscribe(data => {
      this.points = data;
      this.pointsAll = data;
    });

    this.afs.collection('PartsRequests').snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          // @ts-ignore
          ({id: c.payload.doc.id, totalRequests: 0, ...c.payload.doc.data()})
        )
      )
    ).subscribe(data => {
      this.requests = data;

      this.pointsAll.forEach((a, b) => {

        this.requests.forEach((c, d) => {
          this.afs.collection(`PartsRequests/${c.id}/parts`, ref => ref.where('partID', '==', a.partID)).snapshotChanges().pipe(
            map(changes =>
              changes.map(c =>
                // @ts-ignore
                ({id: c.payload.doc.id, ...c.payload.doc.data()})
              )
            )
          ).subscribe(data => {
            data.forEach((x, y) => {
              if ((a.partID === x.partID) && x.partQuantity) {
                a.totalRequests = a.totalRequests + x.partQuantity;
              }
            })
          });
        });
      });
    });


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.points = this.pointsAll.filter(s => s.partID.toLowerCase().includes(filterValue.toLowerCase()));
  }

}
