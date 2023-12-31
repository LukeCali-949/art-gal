import useSignupForm from "../../store/signupStore";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRef } from "react";
//import { uploadImage } from "../../supabase/supabaseFunctions";

// FOR NEXT TIME:
// MUST CREATE NEW SUPABASE STORAGE BUCKET FOR AVATARS FOR USER
// ALSO MUST FINISHED INSERTING USER INFO IN THE PROFILES TABLE

// eslint-disable-next-line react/prop-types
const SignupForm = () => {
  const supabase = useSupabaseClient();
  const user = useUser();

  const hiddenInputRef = useRef();

  const { form, setForm } = useSignupForm();

  //const { setUser } = useUserStore();

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function eraseForm() {
    setForm({
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      avatar_url: "",
      image: "",
      imagePreviewUrl: "",
    });
  }

  function handleImageChange(e) {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      // Update the form state with file data and preview URL
      setForm({
        ...form,
        image: file,
        imagePreviewUrl: reader.result,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setForm({
        ...form,
        image: null,
        imagePreviewUrl: null,
      });
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    console.log(user);
    // const imageLink = await uploadImage(
    //   user,
    //   form.image,
    //   supabase,
    //   "userAvatars"
    // );
    // consider form updates wiht image link here

    // eslint-disable-next-line react/prop-types
    console.log("this is user email" + user.email);

    const { data, error } = await supabase.from("profiles").upsert([
      {
        username: form.username,
        email: user.email,
        first_name: form.firstName,
        last_name: form.lastName,
        avatar_url: form.imagePreviewUrl,
      },
    ]);

    if (error) {
      console.error("Error inserting profile: ", error);
      eraseForm();
      return;
    }
    console.log(data);

    console.log("made it here");

    // Clear the form

    eraseForm();
  }

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <div className="space-y-12 bg-white mx-auto w-[50%] py-10 px-10 rounded-lg mb-10">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please complete all the information regarding your profile.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>

              <div className="mt-2">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleFormChange}
                  id="username"
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleFormChange}
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleFormChange}
                  id="last-name"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {form.imagePreviewUrl ? (
                  <img
                    className="rounded-full w-12 h-12 object-cover"
                    src={form.imagePreviewUrl}
                  />
                ) : (
                  <svg
                    className="h-12 w-12 text-gray-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  htmlFor="hiddenFileInput"
                  onClick={() => hiddenInputRef.current.click()}
                >
                  Change
                </button>
                <input
                  ref={hiddenInputRef}
                  id="hiddenFileInput"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={eraseForm}
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
};

export default SignupForm;
