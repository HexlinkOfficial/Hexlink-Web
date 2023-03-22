import {storage} from "@/services/firebase";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

export function upload(file: File) {
    const storageRef = ref(storage, file.name);
    const task = uploadBytesResumable(storageRef, file, {contentType: file.type});
    task.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            console.log("Failed to upload file");
            console.log(error);
        }, 
        () => {
            getDownloadURL(task.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
            });
        }
    );
}