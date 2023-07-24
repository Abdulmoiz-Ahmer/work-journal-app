import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize} from "rxjs";
import {FirebaseStoreService} from "../../services/firebase-store.service";


@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss']
})
export class AddNewComponent implements OnInit {

  journalForm: FormGroup;
  files: File[] = [];
  images: any = [];
  filesAfter: File[] = [];
  afterImages:any =[];
  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private afStorage: AngularFireStorage,
    private afStoreService: FirebaseStoreService

  ) {

    this.journalForm = this.formBuilder.group(
      {
        address: ['', Validators.required],
        taskDetail: ['', Validators.required],
        finalSummary: ['', Validators.required],
        customerName: ['', Validators.required],
        customerPhone: ['', [Validators.required, Validators.pattern("^([0-9\\(\\)\\/\\+ \\-]*)$")]]
      }
    );
  }

  ngOnInit(): void {
  }

  save(){
    const data = {
      uid: this.authService.userData.uid,
      address: this.journalForm.value.address,
      taskDetail: this.journalForm.value.taskDetail,
      finalSummary: this.journalForm.value.finalSummary,
      customerName: this.journalForm.value.customerName,
      customerPhone: this.journalForm.value.customerPhone,
      beforeImages: this.images,
      afterImages: this.afterImages,
      createdAt: new Date(),
    };

    this.afStoreService.post('journals', data)
      .then( (res) => {
        this._snackBar.open('Task added successfully!', 'close');
        this.authService.router.navigate(['/']);
      })
      .catch( (error) => {
        this._snackBar.open(error, 'close');
      })

  }

  async onSelect(e: any) {
    const filesPath = [];
    if(this.images.length < 4){
      this.files.push(...e.addedFiles);
      this.images = await this.uploadImages(this.files, 'taskBefore');
    }else{
      this._snackBar.open('You can only upload 4 picture.', 'Close');
    }
  }

  onRemove(index: number, name: string) {
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i]
      if (name === file.name){
        this.files.splice(i,1);
      }
    }
    this.images.splice(index, 1);
  }

  async after(e: any) {
    const filesPath = [];
    if(this.afterImages.length < 4){
      this.filesAfter.push(...e.addedFiles);
      this.afterImages = await this.uploadImages(this.filesAfter, 'taskAfter');
    }else{
      this._snackBar.open('You can only upload 4 picture.', 'Close');
    }
  }

  onAfterRemove(index: number, name: string) {
    for (let i = 0; i < this.filesAfter.length; i++) {
      const file = this.filesAfter[i]
      if (name === file.name){
        this.filesAfter.splice(i,1);
      }
    }
    this.afterImages.splice(index, 1);
  }

  uploadImages(images: File[], title: string) {
    return new Promise((resolve, reject) => {
      const urls: any = [];
      for (const file of images) {
        const path = `${title}/${Date.now()}_${file.name}`;
        const ref = this.afStorage.ref(path);
        const task = this.afStorage.upload(path, file);
        task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              urls.push({path: url, id: path, name: file.name});
              if (images.length === urls.length) {
                resolve(urls);
              }
            });
          })
        ).subscribe();
      }
    });
  }

}
