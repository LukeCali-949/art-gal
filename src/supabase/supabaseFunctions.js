import { v4 as uuidv4 } from "uuid";

const CDNURL =
  "https://snmvdalbzhcxwrlcsaqv.supabase.co/storage/v1/object/public/images/";

export async function uploadImage(user, file, supabase) {
  const imageUrl = user.id + "/" + uuidv4();

  const { data, error } = await supabase.storage
    .from("images")
    .upload(imageUrl, file);

  if (data) {
    return `${CDNURL}${user.id}/${data.Key}`;
  } else {
    console.error(error);
    return null;
  }
}

export async function getImages(user, supabase) {
  const { data, error } = await supabase.storage
    .from("images")
    .list(user.id + "/", {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (data) {
    return data;
  } else {
    console.error(error);
    return null;
  }
}
// Cooper/
// data: [ image1, image2, image3 ]
// image1: { name: "subscribeToCooperCodes.png" }

// to load image1: CDNURL.com/subscribeToCooperCodes.png -> hosted image
