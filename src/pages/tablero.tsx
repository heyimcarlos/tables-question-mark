import AppLayout from "@/components/layouts/AppLayout";
import Spinner from "@/components/Spinner";
import Table from "@/components/Table";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { NextPageWithLayout } from "./_app";

const Tablero: NextPageWithLayout = () => {
  const { data, isLoading } = trpc.useQuery(["user.records"]);

  if (isLoading) return <Spinner />;

  if (!data) return null;

  return (
    <div className="relative mx-2 sm:px-6 lg:px-8">
      <Table patients={data} />
    </div>
  );
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
