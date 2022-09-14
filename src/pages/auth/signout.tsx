import { GetServerSidePropsContext } from "next";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const LogoutPage = () => {
  const { status } = useSession();
  if (status === "authenticated") signOut({ redirect: true, callbackUrl: "/" });

  return <div></div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  ctx.res.setHeader(
    "Set-Cookie",
    "next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
  );

  return {
    props: {},
  };
}

export default LogoutPage;
