import React from "react";

import UsersList from '../components/UsersList';

const Users = () => {
    const USERS = [{
        id: 'u1',
        name: 'juan C',
        image: 'https://upload.wikimedia.org/wikipedia/commons/1/12/ApartheidSignEnglishAfrikaans.jpg',
        places: 3
    }]


    return <UsersList  items={USERS} />
};

export default Users;