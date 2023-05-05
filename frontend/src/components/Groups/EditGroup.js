import { useParams } from 'react-router-dom';
import GroupForm from './GroupForm';
import { useSelector } from 'react-redux';

const EditGroupForm = () => {
  const { groupId } = useParams();
  const group = useSelector((state) => state.group[groupId])

  console.log(group, 'IN EDIT GROUP FORM')

  return (
    <GroupForm group={group} formType="Update Group" />
  );
}

export default EditGroupForm;
