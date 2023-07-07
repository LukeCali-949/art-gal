import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import useArtworkStore from "./store/artworkStore";
import "./App.css";
import ArtworkForm from "./components/ui/ArtworkForm";

// Things to think about later: only alloiwng certain file types.
// Only allowing a certain amount of image size per user

function App() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const artworks = useArtworkStore((state) => state.artworks);

  const [email, setEmail] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [images, setImages] = useState([]);

  // CDNURL + user.id + "/" + image.name

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  async function magicLinkLogin() {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      alert(
        "Error communicating with supabase, make sure to use a real email address!"
      );
      console.log(error);
    } else {
      alert("Check your email for a Supabase Magic Link to log in!");
      console.log(data);
    }
  }

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
    <div>
      {user === null ? (
        <>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-primary w-full max-w-xs"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-outline" onClick={() => magicLinkLogin()}>
            Sign Up
          </button>
        </>
      ) : (
        <>
          <h1>You are signed in!</h1>
          <p>Current user: {user.email}</p>
          <button className="btn btn-outline" onClick={() => signOut()}>
            Sign Out
          </button>

          <ArtworkForm user={user} />
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
