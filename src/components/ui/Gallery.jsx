import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

const Gallery = () => {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  async function fetchArtworkList() {
    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .eq("email", user.email);

    if (error) {
      console.error(error);
    } else {
      console.log(data);
      setArtworks(data);
    }
  }

  useEffect(() => {
    fetchArtworkList();
  }, [user]);

  const deleteArtwork = async (artworkId) => {
    const { data, error } = await supabase
      .from("artworks")
      .delete()
      .eq("id", artworkId);

    if (error) {
      console.error("Error deleting artwork: ", error);
    } else {
      console.log("Artwork deleted: ", data);
      // Refresh artworks array after deletion
      fetchArtworkList();
    }
  };

  const handleOpenModal = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <div className="overflow-x-autbg-[url(https://mdl.artvee.com/sftb/911652ab.jpg)]  bg-cover w-[85%] rounded-lg h-[650px] gap-6 mb-[50px] mx-auto bg-white flex items-center">
      {artworks.map((artwork) => {
        return (
          <>
            <div
              className="card min-w-[350px] max-w-[350px] h-[27rem] bg-base-100 shadow-xl ml-10"
              key={artwork.id}
            >
              <figure>
                <img
                  src={artwork.image_url}
                  alt="Shoes"
                  onClick={() => handleOpenModal(artwork)}
                  className="cursor-pointer"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{artwork.artwork_name}</h2>
                <h2 className="text-sm">Author: {artwork.artist_name}</h2>
                <h2 className="text-sm">Date: {artwork.date_of_artwork}</h2>
                <h2 className="text-sm">
                  Country Of Origin: {artwork.country_of_origin}
                </h2>

                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => deleteArtwork(artwork.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      })}

      {selectedArtwork && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-95 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <img
            src={selectedArtwork.image_url}
            alt={selectedArtwork.artwork_name}
            className="max-h-[90%] max-w-[90%]"
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
