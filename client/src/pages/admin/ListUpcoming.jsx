import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../admin/Title';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import TimeFormat from '../../lib/TimeForamt';

const ListUpcoming = () => {
  const { axios, getToken, user } = useAppContext();

  const [upcomings, setUpcomings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllUpcomings = async () => {
    try {
      const { data } = await axios.get('/api/upcoming/get-upcomings', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setUpcomings(data.upcoming);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch upcoming movies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/upcoming/delete/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        toast.success(data.message);
        setUpcomings(upcomings.filter((movie) => movie._id !== id));
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete movie');
    }
  };

  useEffect(() => {
    if (user) getAllUpcomings();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1="List" text2="Upcoming Movies" />

      <div className="max-w-6xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">Poster</th>
              <th className="p-2 font-medium">Title</th>
              <th className="p-2 font-medium">Runtime</th>
              <th className="p-2 font-medium">Genres</th>
              <th className="p-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {Array.isArray(upcomings) && upcomings.length > 0 ? (
              upcomings.map((movie, index) => (
                <tr
                  key={index}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10"
                >
                  {/* Poster */}
                  <td className="p-2">
                    {movie.backdrop_path?.url ? (
                      <img
                        src={movie.backdrop_path.url}
                        alt={movie.title}
                        className="w-20 h-22 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-12 bg-gray-700 flex items-center justify-center text-gray-400 rounded">
                        No Image
                      </div>
                    )}
                  </td>

                  {/* Title */}
                  <td className="p-2">{movie.title}</td>

                  {/* Runtime */}
                  <td className="p-2">{TimeFormat(movie.runtime)}</td>

                  {/* Genres */}
                  <td className="p-2">{movie.genres?.join(', ')}</td>


                  {/* Actions */}
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(movie._id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-400">
                  No upcoming movies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListUpcoming;
