import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

const Gallery = () => {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [countries, setCountries] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [sortedArtworks, setSortedArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [sortOrder, setSortOrder] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const sorted = handleSort(artworks, sortOrder);
    setSortedArtworks(sorted);
  }, [artworks, sortOrder]);

  function handleSort(artworks, sortOrder) {
    let sortedArtworks = artworks.slice();
    switch (sortOrder) {
      case "A-Z":
        sortedArtworks.sort((a, b) =>
          a.artwork_name.localeCompare(b.artwork_name)
        );
        break;
      case "Z-A":
        sortedArtworks.sort((a, b) =>
          b.artwork_name.localeCompare(a.artwork_name)
        );
        break;
      case "artist":
        sortedArtworks.sort((a, b) =>
          a.artist_name.localeCompare(b.artist_name)
        );
        break;
      case "date":
        sortedArtworks.sort((a, b) => a.date_of_artwork - b.date_of_artwork);
        break;
      default:
        break;
    }
    return sortedArtworks;
  }

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

      // Extract unique countries
      const uniqueCountries = [
        ...new Set(data.map((artwork) => artwork.country_of_origin)),
      ];
      setCountries(uniqueCountries);
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

  let displayedArtworks = sortedArtworks.slice();

  // Filter by country
  if (countryFilter) {
    displayedArtworks = displayedArtworks.filter(
      (artwork) => artwork.country_of_origin === countryFilter
    );
  }

  // Search by artist or artwork name
  if (searchQuery) {
    displayedArtworks = displayedArtworks.filter(
      (artwork) =>
        artwork.artist_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.artwork_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="pb-5">
      <div className="inline-flex mobile:text-[10px] xl:text-[20px] gap-3  bg-white ml-[8%] rounded-lg p-3 font-sans font-semibold">
        <div className="flex mobile:my-auto mobile:text-[13px] gap-1">
          <label>Sort: </label>
          <select
            className="mobile:text-[10px] mobile:w-1 mobile:h-1 xl:text-[20px] rounded-md mobile:my-auto"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option className="mobile:text-[13px]" value="">
              None
            </option>
            <option className="mobile:text-[13px]" value="A-Z">
              A-Z
            </option>
            <option value="Z-A" className="mobile:text-[13px]">
              Z-A
            </option>
            <option value="artist" className="mobile:text-[13px]">
              Artist Name
            </option>
            <option value="date" className="mobile:text-[13px]">
              Date of Artwork
            </option>
          </select>
        </div>

        <div className="flex mobile:my-auto mobile:text-[13px] gap-1 ">
          <label>Country: </label>
          <select
            className="mobile:text-[10px] mobile:w-1 mobile:h-1 xl:text-[20px] rounded-md mobile:my-auto"
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <option className="mobile:text-[13px]" value="">
              None
            </option>
            {countries.map((country, index) => (
              <option
                className="mobile:text-[13px]"
                value={country}
                key={index}
              >
                {country}
              </option>
            ))}

            {/* Add country options here. This could be dynamic based on the available countries in your data */}
          </select>
        </div>

        <div className="mobile:text-[13px]  flex mobile:my-auto gap-1">
          <label>Search: </label>
          <input
            className="mobile:h-[18px] mobile:w-[60px] md:w-[130px] rounded-md mobile:text-[13px]"
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="border-4 overflow-x-auto bg-[url(https://mdl.artvee.com/sftb/911652ab.jpg)]  bg-cover w-[85%] rounded-lg h-[650px] gap-6 mb-[50px] mx-auto bg-white flex items-center">
        {displayedArtworks.map((artwork) => {
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
                  <h2 className="text-sm">
                    {artwork.artist_name ? (
                      <>
                        <span className="font-bold">Author: </span>
                        {artwork.artist_name}
                      </>
                    ) : (
                      ""
                    )}
                  </h2>
                  <h2 className="text-sm">
                    {artwork.date_of_artwork ? (
                      <>
                        <span className="font-bold">Date: </span>
                        {artwork.date_of_artwork}
                      </>
                    ) : (
                      ""
                    )}
                  </h2>
                  <h2 className="text-sm">
                    {artwork.country_of_origin ? (
                      <>
                        <span className="font-bold">Country Of Origin: </span>
                        {artwork.country_of_origin}
                      </>
                    ) : (
                      ""
                    )}
                  </h2>
                  <h2 className="text-sm">
                    {artwork.artistic_movement ? (
                      <>
                        <span className="font-bold">Artistic Movement: </span>
                        {artwork.artistic_movement}
                      </>
                    ) : (
                      ""
                    )}
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
    </div>
  );
};

export default Gallery;
