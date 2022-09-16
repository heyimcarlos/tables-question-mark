import AppLayout from "@/components/layouts/AppLayout";
import MedicalRecord from "@/components/MedicalRecord";
import Spinner from "@/components/Spinner";
import { prisma } from "@/server/db/client";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { NextPageWithLayout } from "../_app";

const Patient: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  record,
}) => {
  if (!record) return <Spinner />;

  return (
    <div className="relative mx-2 sm:px-6 lg:px-8">
      <MedicalRecord record={record} />
    </div>
  );
};

Patient.layout = AppLayout;

export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const { id } = query;

  const record = await prisma.patientRecord.findUnique({
    where: {
      id: Number(id),
    },
  });

  return {
    props: {
      record,
    },
  };
};

export default Patient;
