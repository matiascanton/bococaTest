import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../configs/fbServices";

 
export const getDay = ()=>{
    const date = new Date();
    const year = date.getFullYear();
    // 👇️ getMonth returns integer from 0(January) to 11(December)
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateStr = [day, month,year].join('_');
    return dateStr
  }
/**
 * cupones - sube imagen y guarda la url en el objeto data(datos del formulario)
 * fortato del objeto:
 * {
    "img_brief": "https://firebasestorage.googleapis.com/v0/b/femsa-arg.appspot.com/o/coupons%2F1a.webp?alt=media&token=632f9f00-838b-4699-ba84-08a975c538b2",
    "img_description": "https://firebasestorage.googleapis.com/v0/b/femsa-arg.appspot.com/o/coupons%2F1b.webp?alt=media&token=ef6297d7-e0c3-48d9-a87e-a811579100e7",
    "enabled": true
}
 * 
 */
 export const upLoadImg = async (data) => {
    const result = await Promise.all(
      Object.entries(data).map(async (img_item) => {
        if (
          (img_item[0] === "img_brief" || img_item[0] === "img_description") &&
          img_item[1].name
        ) {
          const today = getDay()
          const imageRef = ref(
            storage,
            `coupons/${img_item[1].name + "_" + today}`
          );
          await uploadBytes(imageRef, img_item[1]);
          data[img_item[0]] = await getDownloadURL(imageRef);
        }
      })
    );
  };

/**
 * formato del objeto para crear el slider
 * 
{
    "image": "https://firebasestorage.googleapis.com/v0/b/femsa-arg.appspot.com/o/coupons%2F1a.webp?alt=media&token=632f9f00-838b-4699-ba84-08a975c538b2",
    "type": "clients"
}
 */

  export const upLoadSingleImg = async (data, images) => {
    if (images.name) {
      const today = getDay();
      const imageRef = ref(storage, `sliders/${images.name + "_" + today}`);
      await uploadBytes(imageRef, images);
      data.image = await getDownloadURL(imageRef);
    }
  };

  export const formatFileSize = (bytes,decimalPoint) =>{
    if(bytes == 0) return '0 Bytes';
    var k = 1000,
        dm = decimalPoint || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
 }