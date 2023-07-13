import { v4 as uuidv4 } from "uuid";

const CDNURL =
  "https://pnsbwinoooogtverbjtd.supabase.co/storage/v1/object/public";

export async function uploadImage(user, file, supabase, bucket) {
  const uniqueID = uuidv4();
  const imageUrl = user.id + "/" + uniqueID;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(imageUrl, file);

  if (data) {
    return `${CDNURL}/${bucket}/${user.id}/${uniqueID}`;
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
