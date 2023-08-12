import useSignupForm from "../../store/signupStore";

// eslint-disable-next-line react/prop-types
const InitialSignup = ({ magicLinkLogin }) => {
  const { form, setForm } = useSignupForm();

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function eraseForm() {
    setForm({
      email: "",
    });
  }

  return (
    <form onSubmit={magicLinkLogin}>
      <div className="space-y-12  bg-white mx-auto sm:w-[50%] w-[80%] py-10 px-10 rounded-lg mb-10">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Confirm Email
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please provide your email so you can begin using ArtGal!
          </p>

          <div className="sm:col-span-4 mt-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                type="email"
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
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

export default InitialSignup;
