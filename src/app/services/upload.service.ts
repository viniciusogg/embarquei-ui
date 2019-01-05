import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as firebase from 'firebase';
// import { FileUpload, COLECAO_ARQUIVO } from './../modulos/core/model';
import 'firebase/storage';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private colecao;

  constructor(private angularFireDatabase: AngularFireDatabase, private angularFireStorage: AngularFireStorage) { }

  /*
  pushFileToStorage(fileUpload: FileUpload, progress: { percentage: number }, colecao: string) {

    this.colecao = colecao;

    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.colecao}/${fileUpload.file.name}`).put(fileUpload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (error) => {
        // fail
        console.log(error);
      },
      () => {
        // success
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          // console.log('File available at', downloadURL);
          fileUpload.caminhoSistemaArquivos = downloadURL;
          this.saveFileData(fileUpload);
        });
      }
    );
  }*/

  simpleUpload(file: File, nomeColecao)
  {
    this.angularFireStorage.upload(`${nomeColecao}/${file.name}`, file);

    // return this.angularFireStorage.ref
    /**
    const firestoreRef = firebase.storage().ref();
    firestoreRef.child(`${filePath}/${file.name}`).put(file);
    */
  }

  getFile(path)
  {
    const ref = this.angularFireStorage.ref(path);
    return ref.getDownloadURL();
  }

  // private saveFileData(fileUpload: FileUpload) {
  //   this.angularFireDatabase.list(`${this.colecao}/`).push(fileUpload);
  // }

  // getFileUploads(numberItems): AngularFireList<FileUpload> {
  //   return this.angularFireDatabase.list(this.colecao, ref =>
  //     ref.limitToLast(numberItems));
  // }


  // deleteFileUpload(fileUpload: FileUpload) {
  //   this.deleteFileDatabase(fileUpload.key)
  //     .then(() => {
  //       this.deleteFileStorage(fileUpload.name);
  //     })
  //     .catch(error => console.log(error));
  // }

  // private deleteFileDatabase(key: string) {
  //   return this.db.list(`${this.basePath}/`).remove(key);
  // }

  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.colecao}/${name}`).delete();
  }
}
