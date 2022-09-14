import AppLayout from "@/components/layouts/AppLayout";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import { NextPageWithLayout } from "./_app";

const Tablero: NextPageWithLayout = () => {
  const { data } = useSession();
  return <div>Tablero, {data?.user?.name}</div>;
};

Tablero.layout = AppLayout;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Tablero;
