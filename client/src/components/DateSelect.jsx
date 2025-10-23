import React, { useState } from 'react'

import { ChevronDownSquareIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import BlurCircle from './BlurCircle'


const DateSelect = ({dateTime, id}) => {
     const navigate = useNavigate()
    const [selected, setSelected] =useState(null)

    const onBookHandler =()=>{
                if(!selected){
            return toast('Please select the date')
        }
      navigate(`/movies/${id}/${selected}`)

        scrollTo(0,0)

    }

    return (
        <div id='dateSelect' className='mt-30 mb-10'>
          
          <BlurCircle top='-40px' right='-40px' />
          <BlurCircle bottom='-40px' left='-40px' />
        
            <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary-dull/20 rounded-lg'>
              
        
                <div>
                    <p className='text-lg font-semibold'>
                        choose date
                    </p>
                    <div className='flex items-center gap-6 text-sm mt-5'>
                        {/*<ChevronLeftIcon width={28}/>*/}
                        <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4'>
                            {
                                Object.keys(dateTime).map((date)=>(
                                    <button onClick={()=> setSelected(date)} key={date} className={`flex flex-col items-center 
                                    justify-center h-14 w-14 aspect-square rounded cursor-pointer ${selected === date ? "bg-primary text-amber-400 ": "border border-amber-500" }`}>
                                           <span> {new Date(date).getDate()}</span>
                                        <span> {new Date(date).toLocaleDateString("en-us", {month: "short"})}</span>
                                              </button>
                                           
                            ))}
                            </span>
                          {/*  <ChevronRightIcon width={28}/> */}       
                                   
                              
                        </div>
                    </div>
                 

                    <button onClick={onBookHandler} className='bg-primary-dull/95 text-black/95 px-8 py-2 mt-6 rounded hover:bg-primary/90
                     hover:text-amber-50 transition-all cursor-pointer '>
                        Book Now
                    </button>
                </div>
        </div>
    )
}

export default DateSelect
