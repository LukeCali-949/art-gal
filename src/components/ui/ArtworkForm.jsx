//import {useState} from 'react'
import useArtworkStore from "../../store/artworkStore";
//import { v4 as uuidv4 } from "uuid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { uploadImage } from "../../supabase/supabaseFunctions";
// eslint-disable-next-line react/prop-types
const ArtworkForm = ({ user }) => {
  const supabase = useSupabaseClient();

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

  function handleSubmit() {
    const imageLink = uploadImage(user, form.image, supabase);
    updateImageUrl(imageLink);

    addArtwork(form);

    // Clear the form
    setForm({
      artistName: "",
      artworkName: "",
      dateOfArtwork: "",
      artisticMovement: "",
      image: null,
    });
  }

  function handleImageChange(e) {
    setForm({
      ...form,
      image: e.target.files[0],
    });
  }

  // SUPABASE

  return (
    <div className="form-control w-full max-w-xs">
      <input
        type="text"
        placeholder="Artist Name"
        name="artistName"
        value={form.artistName}
        onChange={handleInputChange}
      />
      <input
        type="text"
        placeholder="Artwork Name"
        name="artworkName"
        value={form.artworkName}
        onChange={handleInputChange}
      />
      <input
        type="number"
        placeholder="Date of Artwork"
        name="dateOfArtwork"
        value={form.dateOfArtwork}
        onChange={handleInputChange}
      />
      <input
        type="text"
        placeholder="Artistic Movement (Optional)"
        name="artisticMovement"
        value={form.artisticMovement}
        onChange={handleInputChange}
      />
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ArtworkForm;
