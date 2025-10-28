import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from './Title';
import BlurCircle from '../../components/BlurCircle'; // make sure this exists

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURENCY;

  const [DashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalUser: 0,
    activeShows: [],
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    { title: 'Total Bookings', value: DashboardData.totalBookings || "0", icon: ChartLineIcon },
    { title: 'Total Revenues', value: currency + DashboardData.totalRevenue || "0", icon: CircleDollarSignIcon },
    { title: 'Active Shows', value: DashboardData.activeShows.length || "0", icon: PlayCircleIcon },
    { title: 'Total Users', value: DashboardData.totalUser || "0", icon: UserIcon }
  ];

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="admin" text2="Century Cinema" />

      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0" />
        <div className="flex flex-wrap gap-4 w-full">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full"
              >
                <div>
                  <h1 className="text-sm">{card.title}</h1>
                  <p className="text-xl font-medium mt-1">{card.value}</p>
                </div>
                <Icon className="w-6 h-6" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
