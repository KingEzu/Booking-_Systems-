import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from './Title';
import BlurCircle from '../../components/BlurCircle'; // make sure this exists
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURENCY

  const [DashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalUser: 0,
    activeShows: [],
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    { title: 'Total Bookings', value: DashboardData.totalBookings || "0", icon: ChartLineIcon },
    { title: 'Total Revenues', value: currency + " " + DashboardData.totalRevenue || "0", icon: CircleDollarSignIcon },
    { title: 'Active Shows', value: DashboardData.activeShows.length || "0", icon: PlayCircleIcon },
    { title: 'Total Users', value: DashboardData.totalUser || "0", icon: UserIcon }
  ];

const fetchDashboardData = async () => {
    try {
        const { data } = await axios.get("/api/admin/dashboard", {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        if (data.success) {
            setDashboardData(data.dashboardData); // lowercase
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error("Error fetching dashboard data");
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    if(user){
      fetchDashboardData();

    }
    },[user]);

  
  return !loading ? (
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

      <p className='mt-10 text-lg font-medium'> Active Shows</p>
      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
  <BlurCircle top="100px" left="-10%" />
  {dummyDashboardData.activeShows.map((show) => (
    <div
      key={show._id}
      className="w-56 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20
                 hover:-translate-y-1 transition duration-300"
    >
      <img
        src={show.movie.poster_path}
        alt={show.movie.title}
        className="h-60 w-full object-cover"
      />
      <p className="font-medium p-2 truncate">{show.movie.title}</p>
      <div className="flex items-center justify-between px-2">
        <p className="text-lg font-medium">
          {currency} {show.showPrice}
        </p>
        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {show.movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  ))}
</div>


    </>
  ) : <Loading />
};

export default Dashboard;
