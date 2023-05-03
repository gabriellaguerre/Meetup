import {Link, useParams, Redirect} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {useState} from 'react'
import Groups from './index'

function GroupDetail() {
 const {id} = useParams();

 const group = useSelector(state => state.group[id])

 
    return (
        <>
        <h2>IN GROUP DETAIL</h2>
        <Link to='/groups'> Groups</Link>
         <section> Name:
          {group.name}
         <br/> Organizer:
          {group.organizerId}
         <br/>
         What We Are About:
         <p>
         {group.about}
         </p>
         <br/>
      </section>
     </>
    )
}

export default GroupDetail;
