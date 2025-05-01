import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  // afAuth: any;
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router,
    private afAuth: AngularFireAuth
    
  ) {}

  uploadImage(selectedImage, postData, formStatus, id) {
    const filePath = `postIMG/${Date.now()}`;

    console.log('📤 Uploading image to:', filePath);

    this.storage.upload(filePath, selectedImage).then(() => {
      console.log(' post image uploaded successfully');
      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((URL) => {
          postData.postImgPath = URL;

          // console.log(postData);

          if (formStatus == 'Edit') {
            this.updateData(id, postData);
          } else {
            this.saveData(postData);
          }
        });
    });
  }

  saveData(postData) {
    // Check if user is authenticated before saving
    this.afAuth.currentUser.then(user => {
      console.log('Current User:', user);
      if (user) {
        // Add user ID to post data
        postData.uid = user.uid;
        postData.email = user.email;
        
        this.afs
          .collection('posts')
          .add(postData)
          .then((docRef) => {
            this.toastr.success('Data Insert Successfully');
            this.router.navigate(['/posts']);
          })
          .catch(error => {
            this.toastr.error('Error adding post: ' + error.message);
          });
      } else {
        console.error('❌ No authenticated user found!');
        this.toastr.error('You must be logged in to create posts');
      }
    }).catch(err => {
      console.error('❌ afAuth.currentUser failed:', err);
    });
  }

  loadData() {
    return this.afs
      .collection('posts')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  loadOneData(id) {
    return this.afs.doc(`posts/${id}`).valueChanges();

    // return this.afs.collection('posts').doc(id).valueChanges();
  }
  updateData(id, postData) {
    this.afs
      .doc(`posts/${id}`)
      .update(postData)
      .then(() => {
        this.toastr.success('Data Updated Successfully');
        this.router.navigate(['/posts']);
      });
  }

  deleteImage(postImgPath, id) {
    this.storage.storage
      .refFromURL(postImgPath)
      .delete()
      .then(() => {
        this.deleteData(id);
      });
  }

  deleteData(id) {
    this.afs
      .doc(`posts/${id}`)
      .delete()
      .then(() => {
        this.toastr.warning(' Data Deleted ...!');
      });
  }

  markFeatured(id, featuredData) {
    this.afs
      .doc(`posts/${id}`)
      .update(featuredData)
      .then(() => {
        this.toastr.info('Featured Status Updated');
      });
  }
}
