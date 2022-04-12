import React, { ReactElement, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Link from "next/link";
import Image from "next/image";
import Passlink from "passlink";
import * as jose from "jose";
import { userSlice } from "../app/user";
import DarkModeButton from "./DarkModeButton";

const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;

export default function Header({ children }): ReactElement {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.user.token);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  let passlink;
  let loginHandler;

  if (window !== undefined) {
    passlink = new Passlink(window);
    loginHandler = passlink.generateloginHandler(
      `${BASE_URL}/signingrequest`,
      () => {
        setLoading(true);
      },
      () => {
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
      (data) => {
        setLoading(false);
        dispatch(userSlice.actions.setToken(data));
      }
    );
  }

  useEffect(() => {
    try {
      const userDecode = jose.decodeJwt(token);
      setUser(userDecode);
      dispatch(userSlice.actions.logIn());
    } catch {
      setUser(null);
      dispatch(userSlice.actions.logOut());
    }
  }, [token]);

  const darkMode = useAppSelector((state) => state.user.darkMode);
  useEffect(() => {
    if (darkMode) document.querySelector("html").classList.add("dark");
    else document.querySelector("html").classList.remove("dark");
  }, [darkMode]);

  let logInButton;

  if (user) {
    logInButton = (
      <>
        <div
          onClick={() => {
            setUser(null);
            dispatch(userSlice.actions.logOut());
          }}
        >
          Log Out
        </div>
      </>
    );
  } else {
    logInButton = (
      <>
        {loading && <p>Loading...</p>}
        {!loading && passlink && loginHandler && (
          <div onClick={loginHandler}>Log In</div>
        )}
      </>
    );
  }

  const loggedIn = useAppSelector((state) => state.user.loggedIn);

  return (
    <div className="relative">
      <header className="fixed inset-x-0 top-0 z-50 h-28 bg-grey-50 drop-shadow dark:bg-grey-800 dark:text-white md:h-16">
        <div className="flex h-full flex-col justify-between p-6 md:flex-row md:items-center">
          <div className="flex-initial font-semibold text-grey-800 hover:cursor-pointer dark:text-white">
            <Link href="/">
              <span className="flex items-center">
                <Image
                  src="/favicon.ico"
                  className="rounded-md"
                  width={30}
                  height={30}
                />
                <span className="ml-2">ScottyLabs Course Tool Beta</span>
              </span>
            </Link>
          </div>
          <div className="flex flex-row space-x-10 text-grey-600 dark:text-grey-100">
            <div>
              <Link href="/bookmarked">Bookmarked</Link>
            </div>
            <div>
              <a href="https://forms.gle/6vPTN6Eyqd1w7pqJA" target="_blank">
                Feedback
              </a>
            </div>
            <div>
              <DarkModeButton />
            </div>
            <div className="hover:cursor-pointer">{logInButton}</div>
          </div>
        </div>
      </header>
      <main className="relative">{children}</main>
    </div>
  );
}
