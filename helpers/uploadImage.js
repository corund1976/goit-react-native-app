import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase/config';

async function UploadImageToStorage(image, folder) {
  console.log('!!!! Start uploading Image to Storage !!!!');

  const response = await fetch(image);
  const file = await response.blob();
  const fileName = Date.now().toString();

  const avatarsRef = ref(storage, folder + fileName);
  // const imagesRef = ref(storage, 'images/' + `${fileName}`);
  // const imagesRef = ref(storage, 'avatars/' + `${fileName}`);
  // const imagesRef = ref(storage, `images/${fileName}`);
  await uploadBytes(avatarsRef, file);

  const imageURL = await getDownloadURL(ref(storage, avatarsRef));

  console.log('!!!! Image uploaded to Storage !!!!');

  return imageURL;
}

export default UploadImageToStorage;
