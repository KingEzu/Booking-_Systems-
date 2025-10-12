import React from 'react'

const BlurCircle = ({top = "auto", left = "auto", right ="auto" , bottom="auto"}) => {

    return (

    <div
      className="absolute z-50 h-[152px] w-[232px] aspect-square rounded-full bg-primary/30 blur-3xl"
      style={{ top, left, right, bottom }}
    />
 

    )
}

export default BlurCircle
