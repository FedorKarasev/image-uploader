import upload from './upload';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import { firebaseConfig } from './firebase_setup';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app, 'gs://image-uploading-b2fd4.appspot.com');

upload('#file', {
  multiple: true,
  accept: ['.jpg', '.jpeg', '.bmp', '.png', '.gif'],
  onUpload(files, elements) {
    files.forEach((file, index) => {
      const imageRef = ref(storage, `/images/${file.name}`);
      const uploadTask = uploadBytesResumable(imageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          elements[index].style.width = progress + '%';
        },
        (error) => {
          console.warn(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log('File available at', url);
          });
        }
      );
    });
  },
});
