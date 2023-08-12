/* eslint-disable react/prop-types */
//import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@supabase/auth-helpers-react";

const Navbar = ({ signOut, isMenuOpen, setMenuOpen }) => {
  const user = useUser();

  return (
    <div className="navbar bg-white mx-auto w-full md:w-1/2 rounded-lg border-4 mb-10">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl text-black">{`${
          !user ? "user" : user.email.split("@")[0]
        }'s Art Gal`}</a>
      </div>

      <div className="block xl:hidden">
        <div className="dropdown dropdown-end">
          <label
            onClick={() => setMenuOpen(!isMenuOpen)}
            tabIndex={0}
            className="btn m-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className={`dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52 ${
              isMenuOpen ? "" : "hidden"
            }`}
          >
            <li>
              <Link className="text-black" to="gallery">
                My Gallery
              </Link>
            </li>
            <li>
              <Link className="text-black" to="artwork-input">
                New Artwork Form
              </Link>
            </li>

            <li>
              <a className="text-black" onClick={() => signOut()}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`xl:flex hidden`}>
        {user && (
          <div className="flex flex-col xl:flex-row">
            <Link to="gallery" className="mb-2 xl:mb-0 xl:mr-5">
              My Gallery
            </Link>
            <Link className="mb-2 xl:mb-0 xl:mr-5" to="artwork-input">
              New Artwork Form
            </Link>
          </div>
        )}

        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={`https://images.rawpixel.com/image_png_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png`}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52"
            >
              <li>
                <Link
                  to=""
                  onClick={() => {
                    signOut().then(
                      setInterval(() => window.location.reload(true), 500)
                    );
                  }}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
