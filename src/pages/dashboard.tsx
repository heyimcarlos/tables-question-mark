import { useSession } from "next-auth/react";
import React from "react";

type Props = {};

const Dashboard = (props: Props) => {
  const { data, status } = useSession();
  console.log("data", data, status);
  return <div>dashboard</div>;
};

export default Dashboard;
