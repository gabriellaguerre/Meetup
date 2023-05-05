import { useParams } from 'react-router-dom';
import GroupForm from './GroupForm';
import { useSelector } from 'react-redux';
import {useState} from 'react'

const EditGroupForm = () => {
  const { groupId } = useParams();
  const group = useSelector((state) => state.group[groupId])

  console.log(group, 'IN EDIT GROUP FORM')
  const oneLocation = [group.city, group.state]

  const group1 = {
    groupId: group.id,
    oneLocation,
    name: group.name,
    about: group.about,
    type: group.type,
    privatePublic: group.private,
    url: group.previewImage
  }

  return (
    <GroupForm group={group1} formType="Update Group" />
  );
}

export default EditGroupForm;
