import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Routes, Route } from "react-router-dom";

import useArtworkStore from "./store/artworkStore";
import useSignupForm from "./store/signupStore";

import Navbar from "./components/ui/Navbar";
import InputForm from "./components/ui/InputForm";
import SignupForm from "./components/ui/SignupForm";
import InitialSignup from "./components/ui/InitialSignup";
import Gallery from "./components/ui/Gallery";
import NoMatch from "./components/ui/NoMatch";

// Things to think about later: only alloiwng certain file types.
// Only allowing a certain amount of image bytes per user

// CHECK OUT: https://ui.shadcn.com/docs/components/form

function App() {
  const user = useUser();
  const supabase = useSupabaseClient();

  //const artworks = useArtworkStore((state) => state.artworks);

  // eslint-disable-next-line no-unused-vars
  const [images, setImages] = useState([]);

  const { form } = useSignupForm();

  async function magicLinkLogin(event) {
    event.preventDefault();
    const { data, error } = await supabase.auth.signInWithOtp({
      email: form.email,
    });

    if (error) {
      alert(
        "Error communicating with supabase, make sure to use a real email address!"
      );
      console.log(data);
      console.log(error);
      return;
    } else {
      console.log(data);
      alert("Check your email for a Supabase Magic Link to log in!");
    }
  }

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
          {/* <SignupForm /> */}
          <InitialSignup magicLinkLogin={magicLinkLogin} />
          {/* <input
            type="text"
            placeholder="Type here"
            autoComplete="email"
            className="input input-bordered input-primary w-full max-w-xs"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-outline" onClick={() => magicLinkLogin()}>
            Sign Up
          </button> */}
        </>
      ) : (
        <>
          <Routes>
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/artwork-input" element={<InputForm />} />
            <Route path="/*" element={<NoMatch />} />
          </Routes>

          {/* <div className="form-control w-full max-w-xs">
            {artworks.map((artwork) => {
              return (
                <div key={artwork.image}>
                  <img src={artwork.image}></img>
                </div>
              );
            })}
          </div> */}
        </>
      )}
    </div>
  );
}

export default App;
