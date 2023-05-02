import {Link, useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'

function GroupDetail() {
 const {groupId} = useParams();
 console.log(groupId)
 const group = useSelector(state => state.group[groupId])



    return (
        <h2>IN GROUP DETAIL</h2>

    //     <section>
    //      {group.name}
    //     <br/>
    //      {group.organizerId}
    //     <br/>
    //     what we are about
    //     {group.about}
    //     <br/>
    //     <Link to="/groups">Back to Groups</Link>
     //  </section>
    )
}

export default GroupDetail;
