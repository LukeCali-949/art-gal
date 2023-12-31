// import { PhotoIcon } from "@heroicons/react/24/solid";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { uploadImage } from "../../supabase/supabaseFunctions";
import useArtworkStore from "../../store/artworkStore";
import { useState } from "react";

// FOR NEXT TIME:

// CURRENT PROBELMS/BUGS:
// FOR SOME REASON EVEN AFTER UPLOADING TO THE DATABASE AND SETTING THE IMAGE
// PROPERTY ON THE FROM STATE TO NULL, THE IMAGE WON'T UPDATE. NICHE ISSUE SINCE
// ITS IMPROBABLE THAT A USER WILL UPLOAD THE SAME IMAGE TWICE, BUT AN ERROR NONETHELESS

// eslint-disable-next-line react/prop-types
export default function InputForm() {
  const user = useUser();
  const supabase = useSupabaseClient();

  // FOR THE DROP FILE INPUT
  const [isDragActive, setIsDragActive] = useState(false);

  const { form, setForm, addArtwork, updateImageUrl } = useArtworkStore(
    (state) => ({
      form: state.form,
      setForm: state.setForm,
      addArtwork: state.addArtwork,
      updateImageUrl: state.updateImageUrlInForm,
    })
  );

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleCancel() {
    setForm({
      artistName: "",
      artworkName: "",
      dateOfArtwork: "",
      artisticMovement: "",
      countryOfOrigin: "",
      image: null,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(user);
    const imageLink = await uploadImage(user, form.image, supabase, "images");
    updateImageUrl(imageLink);

    const { data, error } = await supabase.from("artworks").insert([
      {
        artist_name: form.artistName,
        artwork_name: form.artworkName,
        date_of_artwork: form.dateOfArtwork,
        artistic_movement: form.artisticMovement,
        country_of_origin: toTitleCase(form.countryOfOrigin),
        email: user.email,
        image_url: imageLink,
      },
    ]);

    if (error) {
      console.error("Error inserting artwork: ", error);
      setForm({
        artistName: "",
        artworkName: "",
        dateOfArtwork: "",
        artisticMovement: "",
        countryOfOrigin: "",
        image: null,
      });
      return;
    }
    console.log(data);

    addArtwork(form);

    // Clear the form
    setForm({
      artistName: "",
      artworkName: "",
      dateOfArtwork: "",
      artisticMovement: "",
      countryOfOrigin: "",
      image: null,
    });
  }

  function handleImageChange(fileOrEvent) {
    let file;

    // Check if the argument is a File (from the drop event)
    // or an event (from the input change event)
    if (fileOrEvent instanceof File) {
      file = fileOrEvent;
    } else {
      file = fileOrEvent.target.files[0];
    }

    setForm({
      ...form,
      image: file,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="pb-10">
      <div className="space-y-12 bg-white mx-auto w-[90%] xl:w-[50%] sm py-10 px-10 rounded-lg">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Artwork Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please provide all the following information regarding the uploaded
            work.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="artwork-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Artwork Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="artworkName"
                  value={form.artworkName}
                  onChange={handleInputChange}
                  id="artwork-name"
                  //autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="artist-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Artist Name
              </label>
              <div className="mt-2">
                <input
                  id="artist-name"
                  value={form.artistName}
                  name="artistName"
                  onChange={handleInputChange}
                  type="text"
                  //autoComplete="artist-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-1 sm:col-start-1">
              <label
                htmlFor="Date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Date
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  value={form.dateOfArtwork}
                  name="dateOfArtwork"
                  onChange={handleInputChange}
                  id="Date"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="country-of-origin"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country of Origin
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={form.countryOfOrigin}
                  name="countryOfOrigin"
                  onChange={handleInputChange}
                  id="country-of-origin"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="artistic-movement"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Artistic Movement / Style
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={form.artisticMovement}
                  name="artisticMovement"
                  onChange={handleInputChange}
                  id="artistic-movement"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Image Upload
              </label>
              <p className="text-xs font-small leading-6 pb-1">{`Current Image: ${
                form.image ? form.image.name : "None"
              }`}</p>
              <div
                className="flex items-center justify-center w-full"
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleImageChange(e.dataTransfer.files[0]);
                }}
                onDragEnter={() => setIsDragActive(true)}
                onDragLeave={() => setIsDragActive(false)}
              >
                <label
                  htmlFor="dropzone-file"
                  className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${
                    isDragActive ? "bg-gray-100" : "bg-gray-50"
                  } dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(e);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
