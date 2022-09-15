import AppLayout from "@/components/layouts/AppLayout";
import { getServerAuthSession } from "@/server/common/get-server-auth-session";
import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import { NextPageWithLayout } from "./_app";

const Tablero: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const { data, isLoading } = trpc.useQuery(["user.records"]);

  if (isLoading) return <div>Cargando...</div>;

  if (!data) return null;

  return (
    <div>
      Tablero, {session?.user?.name}
      <div>
        {data.map((record) => (
          <div key={record.id} className="flex w-full items-center justify-around border">
            <p>{record.name}</p>
            <p>{record.email}</p>
            <p>{record.lastName}</p>
            <p>{record.phone}</p>
          </div>
        ))}
      </div>
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
