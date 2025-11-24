import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { dummyShowsData } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
const ListShows = () => {

       const { axios, getToken, user} = useAppContext();

     const currency = import.meta.env.VITE_CURENCY

     const [show, setShows] = useState([]);
     const [loading, setLoading] = useState(true);
     const getAllShows = async () => {
    try {
          const {data} = await axios.get('/api/admin/all-shows', {
            headers: { Authorization: `Bearer ${await getToken()}` }
          });
          setShows(data.shows)
      setLoading(false);
        } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if(user){
      getAllShows();

    }
    
  }, [user]);


       

    return !loading ? (
        <>
        <Title text1="List" text2="Shows" />
        <div className="max-w-4xl mt-6 overflow-x-auto">
          <table className='w-full border-collapse rounded-md overflow-hidden text-nowarp'>
              <thead>
                <tr className='bg-primary/20 text-left text-white'>
                  <th className='p-2 font-medium pl-5'>Movie Name</th>
                  <th className='p-2 font-medium'>Show Time</th>
                  <th className='p-2 font-medium'>Hall & Type</th>
                  <th className='p-2 font-medium'>Toatal Booking</th>
                  <th className='p-2 font-medium'>Earnings</th>
                </tr>
              </thead>
                <tbody className='text-sm font-light'>
  {Array.isArray(show) && show.length > 0 ? (
    show.map((showItem, index) => {
      const regularSeats = showItem.occupiedSeats?.regular
        ? Object.keys(showItem.occupiedSeats.regular).length
        : 0;
      const vipSeats = showItem.occupiedSeats?.vip
        ? Object.keys(showItem.occupiedSeats.vip).length
        : 0;

      const regularEarnings = regularSeats * (showItem.showPrice?.regular || 0);
      const vipEarnings = vipSeats * (showItem.showPrice?.vip || 0);

      return (
        <tr key={index} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
          <td className='p-2 min-w-45 pl-5'>{showItem.movie?.title || "N/A"}</td>
          <td className='p-2'>{showItem.showDateTime ? dateFormat(showItem.showDateTime) : "N/A"}</td>

          {/* Hall and Type */}
          <td className='p-2'>
            Hall: {showItem.hall || "N/A"} <br />
            Type: {showItem.type || "N/A"}
          </td>

          {/* Bookings */}
          <td className='p-2'>
            Regular: {regularSeats} <br />
            VIP: {vipSeats}
          </td>

          {/* Earnings */}
          <td className='p-2'>
            Regular: {currency} {regularEarnings} <br />
            VIP: {currency} {vipEarnings} <br />
            <span className="font-semibold">
              Total: {currency} {regularEarnings + vipEarnings}
            </span>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={5} className="text-center p-4 text-gray-400">
        No shows available
      </td>
    </tr>
  )}
</tbody>



          
          
          </table>
        </div>
            
        </>
    ) : <Loading />
}

export default ListShows
