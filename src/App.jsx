import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import useArtworkStore from "./store/artworkStore";

import Navbar from "./components/ui/Navbar";
import InputForm from "./components/ui/InputForm";
import SignupForm from "./components/ui/SignupForm";

// Things to think about later: only alloiwng certain file types.
// Only allowing a certain amount of image bytes per user

// CHECK OUT: https://ui.shadcn.com/docs/components/form

function App() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const artworks = useArtworkStore((state) => state.artworks);

  // eslint-disable-next-line no-unused-vars
  const [images, setImages] = useState([]);

  // CDNURL + user.id + "/" + image.name

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
    }
  }

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("images")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data !== null) {
      setImages(data);
    } else {
      alert("Error loading images");
      console.log(error);
    }
  }

  return (
    <div className="bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] min-h-screen">
      <Navbar signOut={() => signOut()} />
      {user === null ? (
        <>
          <SignupForm />
        </>
      ) : (
        <>
          <h1>You are signed in!</h1>
          <p>Current user: {user.email}</p>

          <InputForm user={user} />
          <div className="form-control w-full max-w-xs">
            {artworks.map((artwork) => {
              return (
                <div key={artwork.image}>
                  <img src={artwork.image}></img>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
