import {Link, useParams, Redirect} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {useState} from 'react'
import Events from './index'

function EventDetail() {
 const {id} = useParams();

 const event = useSelector(state => state.event[id])


    return (
        <>
       
        <Link to='/events'> Back to Events</Link>
         <section> Name:
          {event.name}
         <br/> Organizer:
          {}
         <br/>
         What We Are About:
         <p>
         {}
         </p>
         <br/>
      </section>
     </>
    )
}

export default EventDetail;
